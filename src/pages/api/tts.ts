import type { APIRoute } from 'astro';
import { generateTtsAudio, getTtsConfig, isTtsConfigured, ttsModelOptions } from '../../lib/llm';

const maxTextLength = 1800;

export const GET: APIRoute = () => json({
  ok: false,
  mode: 'static',
  configured: false,
  error: '静态部署不包含云端语音合成接口。浏览器会尝试使用本地朗读。',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json().catch(() => ({}))) as { text?: string; model?: string; voice?: string };
    const text = body.text?.trim() || '';
    const modelId = body.model?.trim();
    const voice = body.voice?.trim();

    if (!text) {
      return json({ ok: false, error: '没有可朗读的文本。' }, 400);
    }

    if (text.length > maxTextLength) {
      return json({ ok: false, error: `朗读文本太长，请控制在 ${maxTextLength} 字以内。` }, 400);
    }

    const knownModel = !modelId || ttsModelOptions.some((option) => option.id === modelId || option.model === modelId);
    if (!knownModel) {
      return json({ ok: false, error: `未知语音模型：${modelId}` }, 400);
    }

    if (!isTtsConfigured(modelId)) {
      return json({
        ok: false,
        configured: false,
        error: '还没有配置 TTS_API_KEY、OPENAI_API_KEY、LLM_API_KEY 或 MIMO_TTS_API_KEY，不能生成云端语音。',
      }, 400);
    }

    const audio = await generateTtsAudio(text, modelId, voice);

    return new Response(audio.bytes.slice().buffer as ArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': audio.mimeType,
        'X-TTS-Model': encodeURIComponent(audio.model),
        'X-TTS-Provider': encodeURIComponent(audio.provider),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    const config = getTtsConfig();
    return json({
      ok: false,
      configured: Boolean(config.apiKey),
      error: message,
    }, 500);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
