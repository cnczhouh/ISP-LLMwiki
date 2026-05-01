import type { APIRoute } from 'astro';
import { generateLlmAnswer, getLlmConfig, isLlmConfigured, isUnsupportedLlmModel } from '../../lib/llm';
import { buildModelContext, searchRagChunks } from '../../lib/ragSearch';

const requestWindowMs = 60_000;
const maxRequestsPerWindow = 12;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

export const GET: APIRoute = () => json({
  ok: false,
  mode: 'static',
  configured: false,
  error: '静态部署不包含服务端问答接口。请使用页面内本地检索，或切换到 server 模式启用 AI 问答。',
});

export const POST: APIRoute = async ({ request }) => {
  let modelId: string | undefined;
  try {
    const rateLimit = checkRateLimit(getClientKey(request));
    if (!rateLimit.allowed) {
      return json({
        ok: false,
        mode: 'rate-limited',
        error: `请求太频繁了，请 ${rateLimit.retryAfter} 秒后再试。`,
      }, 429);
    }

    const body = (await request.json().catch(() => ({}))) as { question?: string; model?: string; mode?: string };
    const question = body.question?.trim() || '';
    modelId = body.model?.trim();
    const mode = body.mode === 'diagnose' ? 'diagnose' : 'ask';

    if (!question) {
      return json({ ok: false, error: '请输入问题。' }, 400);
    }

    if (isUnsupportedLlmModel(modelId)) {
      return json({
        ok: false,
        mode: 'error',
        configured: true,
        model: modelId,
        provider: 'MiMo',
        error: `${modelId} 当前不在 MiMo /v1/models 返回列表里，暂时不能调用。`,
      }, 400);
    }

    const searchQuery = mode === 'diagnose'
      ? `${question} 现象 问题 排查 原因 平台差异`
      : question;
    const results = searchRagChunks(searchQuery, 8, undefined, mode === 'diagnose'
      ? { preferredKinds: ['issues', 'workflows'], kindBoost: 26 }
      : {});
    const citations = results.map(({ chunk, score }, index) => ({
      index: index + 1,
      score: Math.round(score),
      pageTitle: chunk.pageTitle,
      pageUrl: chunk.pageUrl,
      pageKind: chunk.pageKind,
      kindLabel: chunk.kindLabel,
      platform: chunk.platform,
      module: chunk.module,
      section: chunk.section,
      sourcePath: chunk.sourcePath,
      text: chunk.text,
    }));

    if (!results.length) {
      return json({
        ok: true,
        mode: 'search-only',
        configured: isLlmConfigured(modelId),
        answer: '当前知识库没有找到高相关片段。建议换成“平台 + 现象 + 模块”的问法继续检索。',
        citations,
        context: '',
      });
    }

    if (!isLlmConfigured(modelId)) {
      const config = getLlmConfig(modelId);
      return json({
        ok: true,
        mode: 'search-only',
        configured: false,
        model: config.model,
        provider: config.provider,
        answer: '还没有配置外部大模型密钥。下面先给出本地检索命中的知识库引用。',
        citations,
        context: buildModelContext(results),
      });
    }

    try {
      const llmAnswer = await generateLlmAnswer(question, results, modelId, mode);

      return json({
        ok: true,
        mode: 'llm',
        askMode: mode,
        configured: true,
        answer: llmAnswer.answer,
        model: llmAnswer.model,
        provider: llmAnswer.provider,
        citations,
        context: buildModelContext(results),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误';
      const config = getLlmConfig(modelId);

      return json({
        ok: true,
        mode: 'search-only',
        askMode: mode,
        configured: true,
        model: config.model,
        provider: config.provider,
        answer: `模型接口暂时不可用：${message}\n\n下面先给出本地知识库命中的引用。`,
        citations,
        context: buildModelContext(results),
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    const config = getLlmConfig(modelId);
    return json({
      ok: false,
      mode: 'error',
      configured: isLlmConfigured(modelId),
      model: config.model,
      provider: config.provider,
      error: message,
    }, 500);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function getClientKey(request: Request): string {
  return request.headers.get('cf-connecting-ip')
    || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
}

function checkRateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + requestWindowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= maxRequestsPerWindow) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}
