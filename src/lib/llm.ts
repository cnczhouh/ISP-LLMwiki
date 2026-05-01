import fs from 'node:fs';
import path from 'node:path';
import type { RagSearchResult } from './ragSearch';
import { buildModelContext } from './ragSearch';

export interface LlmAnswer {
  answer: string;
  model: string;
  provider: string;
}

export interface LlmModelOption {
  id: string;
  label: string;
  model: string;
  baseUrl: string;
  provider: string;
  apiKeyEnv: string;
}

export interface TtsModelOption {
  id: string;
  label: string;
  model: string;
  baseUrl: string;
  provider: string;
  apiKeyEnv: string;
}

export interface TtsAudio {
  bytes: Uint8Array;
  mimeType: string;
  model: string;
  provider: string;
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
      audio?: {
        data?: string;
      };
    };
  }>;
  error?: {
    message?: string;
  };
}

const defaultBaseUrl = 'https://api.openai.com/v1';
const defaultModel = 'gpt-4o-mini';
const defaultTtsModel = 'gpt-4o-mini-tts';
const mimoBaseUrl = 'https://token-plan-cn.xiaomimimo.com/v1';
const mimoTtsBaseUrl = 'https://api.xiaomimimo.com/v1';
const mimoModel = 'mimo-v2.5';
export const llmModelOptions: LlmModelOption[] = [
  {
    id: 'mimo-v2.5-pro',
    label: 'MiMo v2.5 Pro',
    model: 'mimo-v2.5-pro',
    baseUrl: mimoBaseUrl,
    provider: 'MiMo v2.5 Pro',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2.5',
    label: 'MiMo v2.5',
    model: 'mimo-v2.5',
    baseUrl: mimoBaseUrl,
    provider: 'MiMo v2.5',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2-omni',
    label: 'MiMo v2 Omni',
    model: 'mimo-v2-omni',
    baseUrl: mimoBaseUrl,
    provider: 'MiMo v2 Omni',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2-pro',
    label: 'MiMo v2 Pro',
    model: 'mimo-v2-pro',
    baseUrl: mimoBaseUrl,
    provider: 'MiMo v2 Pro',
    apiKeyEnv: 'MIMO_API_KEY',
  },
];
export const ttsModelOptions: TtsModelOption[] = [
  {
    id: 'auto',
    label: '自动语音',
    model: '',
    baseUrl: '',
    provider: '自动选择',
    apiKeyEnv: 'TTS_API_KEY',
  },
  {
    id: 'mimo-v2.5-tts',
    label: 'MiMo v2.5 TTS',
    model: 'mimo-v2.5-tts',
    baseUrl: mimoTtsBaseUrl,
    provider: 'MiMo v2.5 TTS',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2.5-tts-voicedesign',
    label: 'MiMo v2.5 TTS VoiceDesign',
    model: 'mimo-v2.5-tts-voicedesign',
    baseUrl: mimoTtsBaseUrl,
    provider: 'MiMo v2.5 TTS VoiceDesign',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2.5-tts-voiceclone',
    label: 'MiMo v2.5 TTS VoiceClone',
    model: 'mimo-v2.5-tts-voiceclone',
    baseUrl: mimoTtsBaseUrl,
    provider: 'MiMo v2.5 TTS VoiceClone',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'mimo-v2-tts',
    label: 'MiMo v2 TTS',
    model: 'mimo-v2-tts',
    baseUrl: mimoTtsBaseUrl,
    provider: 'MiMo v2 TTS',
    apiKeyEnv: 'MIMO_API_KEY',
  },
  {
    id: 'openai-gpt-4o-mini-tts',
    label: 'OpenAI gpt-4o-mini-tts',
    model: 'gpt-4o-mini-tts',
    baseUrl: defaultBaseUrl,
    provider: 'OpenAI TTS',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  {
    id: 'openai-tts-1',
    label: 'OpenAI tts-1',
    model: 'tts-1',
    baseUrl: defaultBaseUrl,
    provider: 'OpenAI TTS',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
];
export const unsupportedLlmModelOptions = [
  {
    id: 'mimo-v2-flash',
    label: 'MiMo v2 Flash（当前接口不支持）',
  },
];
let localEnvCache: Record<string, string> | undefined;

export function isLlmConfigured(modelId?: string): boolean {
  return Boolean(getLlmConfig(modelId).apiKey);
}

export function isUnsupportedLlmModel(modelId?: string): boolean {
  const normalized = modelId?.trim();
  if (!normalized) return false;
  return unsupportedLlmModelOptions.some((option) => option.id === normalized);
}

export function getLlmConfig(modelId?: string) {
  const selectedOption = getModelOption(modelId);
  if (selectedOption) {
    return {
      apiKey: getApiKey(selectedOption.apiKeyEnv),
      baseUrl: trimTrailingSlash(selectedOption.baseUrl),
      model: selectedOption.model,
      provider: selectedOption.provider,
    };
  }

  const genericApiKey = getApiKey('LLM_API_KEY') || getApiKey('OPENAI_API_KEY');
  if (genericApiKey) {
    return {
      apiKey: genericApiKey,
      baseUrl: trimTrailingSlash(getEnv('LLM_BASE_URL') || getEnv('OPENAI_BASE_URL') || defaultBaseUrl),
      model: getEnv('LLM_MODEL') || getEnv('OPENAI_MODEL') || defaultModel,
      provider: getEnv('LLM_PROVIDER') || 'OpenAI-compatible',
    };
  }

  const mimoApiKey = getApiKey('MIMO_API_KEY');
  if (mimoApiKey) {
    return {
      apiKey: mimoApiKey,
      baseUrl: mimoBaseUrl,
      model: mimoModel,
      provider: 'MiMo v2.5',
    };
  }

  return {
    apiKey: '',
    baseUrl: trimTrailingSlash(getEnv('LLM_BASE_URL') || getEnv('OPENAI_BASE_URL') || defaultBaseUrl),
    model: getEnv('LLM_MODEL') || getEnv('OPENAI_MODEL') || defaultModel,
    provider: getEnv('LLM_PROVIDER') || 'OpenAI-compatible',
  };
}

export function isTtsConfigured(modelId?: string): boolean {
  return Boolean(getTtsConfig(modelId).apiKey);
}

export function getTtsConfig(modelId?: string) {
  const selectedOption = getTtsModelOption(modelId);
  const explicitTtsApiKey = getApiKey('TTS_API_KEY');
  if (!selectedOption || selectedOption.id === 'auto') {
    if (explicitTtsApiKey) {
      return {
        apiKey: explicitTtsApiKey,
        baseUrl: trimTrailingSlash(getEnv('TTS_BASE_URL') || getEnv('OPENAI_BASE_URL') || defaultBaseUrl),
        model: getEnv('TTS_MODEL') || defaultTtsModel,
        provider: getEnv('TTS_PROVIDER') || 'TTS',
      };
    }

    const openAiApiKey = getApiKey('OPENAI_API_KEY') || getApiKey('LLM_API_KEY');
    const baseUrl = trimTrailingSlash(getEnv('TTS_BASE_URL') || getEnv('LLM_BASE_URL') || getEnv('OPENAI_BASE_URL') || defaultBaseUrl);
    if (openAiApiKey && isOpenAiLikeBaseUrl(baseUrl)) {
      return {
        apiKey: openAiApiKey,
        baseUrl,
        model: getEnv('TTS_MODEL') || defaultTtsModel,
        provider: getEnv('TTS_PROVIDER') || getEnv('LLM_PROVIDER') || 'OpenAI-compatible TTS',
      };
    }

    const mimoApiKey = getApiKey('MIMO_TTS_API_KEY');
    if (mimoApiKey) {
      return {
        apiKey: mimoApiKey,
        baseUrl: trimTrailingSlash(getEnv('MIMO_TTS_BASE_URL') || mimoTtsBaseUrl),
        model: getEnv('MIMO_TTS_MODEL') || 'mimo-v2.5-tts',
        provider: getEnv('MIMO_TTS_PROVIDER') || 'MiMo TTS',
      };
    }

    return {
      apiKey: '',
      baseUrl,
      model: getEnv('TTS_MODEL') || defaultTtsModel,
      provider: getEnv('TTS_PROVIDER') || 'TTS',
    };
  }

  const selectedApiKey = isMimoTtsModel(selectedOption.model)
    ? getApiKey('MIMO_TTS_API_KEY')
    : getApiKey(selectedOption.apiKeyEnv) || getApiKey('LLM_API_KEY');
  return {
    apiKey: explicitTtsApiKey || selectedApiKey,
    baseUrl: trimTrailingSlash(explicitTtsApiKey && getEnv('TTS_BASE_URL') ? getEnv('TTS_BASE_URL') : selectedOption.baseUrl),
    model: explicitTtsApiKey && getEnv('TTS_MODEL') ? getEnv('TTS_MODEL') : selectedOption.model,
    provider: explicitTtsApiKey && getEnv('TTS_PROVIDER') ? getEnv('TTS_PROVIDER') : selectedOption.provider,
  };
}

export async function generateLlmAnswer(
  question: string,
  results: RagSearchResult[],
  modelId?: string,
  mode: 'ask' | 'diagnose' = 'ask',
): Promise<LlmAnswer> {
  const config = getLlmConfig(modelId);
  if (!config.apiKey) {
    throw new Error('未配置 MIMO_API_KEY、LLM_API_KEY 或 OPENAI_API_KEY。');
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: [
        '你是一个 ISP 图像调试知识库助手。',
        '回答必须只基于用户提供的知识库引用上下文，不要编造未出现在引用里的参数、寄存器、结论或来源。',
        '如果引用不足，直接说明“当前知识库没有足够证据”，然后给出下一步应该查哪个平台、模块或原始资料。',
        mode === 'diagnose'
          ? '用户的描述可能很模糊。请先把现象归类到最可能的问题页/模块，再给排查顺序、需要确认的现象和引用。'
          : '用中文回答。回答结构要适合工程调试：先给结论，再给排查顺序，最后列出引用。',
        mode === 'diagnose'
          ? '回答结构：可能问题、优先排查、需要补充观察、引用。不要要求用户先自己判断分类。'
          : '',
        '引用格式使用 [1]、[2] 这样的编号。',
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        `问题：${question}`,
        '',
        '知识库引用上下文：',
        buildModelContext(results),
      ].join('\n'),
    },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  let response: Response;

  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.2,
        max_tokens: 1200,
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('模型接口 45 秒内没有返回，已停止等待。');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || `模型接口请求失败：HTTP ${response.status}`);
  }

  const answer = payload.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    throw new Error('模型没有返回可用回答。');
  }

  return {
    answer,
    model: config.model,
    provider: config.provider,
  };
}

export async function generateTtsAudio(text: string, modelId?: string, voice?: string): Promise<TtsAudio> {
  const config = getTtsConfig(modelId);
  if (!config.apiKey) {
    throw new Error('未配置 TTS_API_KEY、OPENAI_API_KEY、LLM_API_KEY 或 MIMO_TTS_API_KEY。');
  }

  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('没有可朗读的文本。');
  }

  if (isMimoTtsModel(config.model)) {
    return generateMimoTtsAudio(cleanText, config, voice);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  let response: Response;

  try {
    response = await fetch(`${config.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        input: cleanText,
        voice: voice?.trim() || getEnv('TTS_VOICE') || getEnv('MIMO_TTS_VOICE') || 'alloy',
        response_format: getEnv('TTS_RESPONSE_FORMAT') || 'mp3',
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('语音合成接口 45 秒内没有返回，已停止等待。');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || 'audio/mpeg';
  if (!response.ok) {
    const errorText = contentType.includes('application/json')
      ? await response.json().then((payload) => payload?.error?.message || JSON.stringify(payload)).catch(() => '')
      : await response.text().catch(() => '');
    throw new Error(errorText || `语音合成请求失败：HTTP ${response.status}`);
  }

  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => undefined);
    const message = payload?.error?.message || payload?.message;
    if (message) {
      throw new Error(message);
    }
    throw new Error('语音合成接口返回了 JSON，而不是可播放音频。请检查 TTS 模型、Base URL 和接口兼容性。');
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.byteLength) {
    throw new Error('语音合成没有返回音频。');
  }

  return {
    bytes,
    mimeType: normalizeAudioMimeType(contentType),
    model: config.model,
    provider: config.provider,
  };
}

async function generateMimoTtsAudio(
  cleanText: string,
  config: ReturnType<typeof getTtsConfig>,
  voice?: string,
): Promise<TtsAudio> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  let response: Response;
  const audioFormat = getEnv('MIMO_TTS_RESPONSE_FORMAT') || 'wav';
  const selectedVoice = voice?.trim() || getEnv('MIMO_TTS_VOICE') || 'Chloe';
  const styleInstruction = getEnv('MIMO_TTS_STYLE') || '用自然清晰的中文助理语气朗读，语速适中，适合工程知识问答。';

  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'user',
            content: styleInstruction,
          },
          {
            role: 'assistant',
            content: cleanText,
          },
        ],
        audio: {
          format: audioFormat,
          voice: selectedVoice,
        },
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('语音合成接口 45 秒内没有返回，已停止等待。');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json().catch(() => ({}))) as ChatCompletionResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || `MiMo 语音合成请求失败：HTTP ${response.status}`);
  }

  const audioData = payload.choices?.[0]?.message?.audio?.data;
  if (!audioData) {
    throw new Error('MiMo 语音合成没有返回音频数据。');
  }

  const bytes = new Uint8Array(Buffer.from(audioData, 'base64'));
  if (!bytes.byteLength) {
    throw new Error('MiMo 语音合成返回了空音频。');
  }

  return {
    bytes,
    mimeType: audioFormatToMimeType(audioFormat),
    model: config.model,
    provider: config.provider,
  };
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function isMimoTtsModel(model: string): boolean {
  return model.startsWith('mimo-') && model.includes('tts');
}

function audioFormatToMimeType(format: string): string {
  const normalized = format.toLowerCase();
  if (normalized === 'wav') return 'audio/wav';
  if (normalized === 'pcm16') return 'audio/wav';
  if (normalized === 'mp3') return 'audio/mpeg';
  if (normalized === 'opus') return 'audio/ogg';
  if (normalized === 'aac') return 'audio/aac';
  if (normalized === 'flac') return 'audio/flac';
  return 'audio/wav';
}

function isOpenAiLikeBaseUrl(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes('openai.com') || Boolean(getEnv('TTS_MODEL'));
}

function normalizeAudioMimeType(contentType: string): string {
  if (contentType.includes('audio/')) return contentType;
  if (contentType.includes('octet-stream')) {
    const format = (getEnv('TTS_RESPONSE_FORMAT') || 'mp3').toLowerCase();
    if (format === 'wav') return 'audio/wav';
    if (format === 'opus') return 'audio/ogg';
    if (format === 'aac') return 'audio/aac';
    if (format === 'flac') return 'audio/flac';
    return 'audio/mpeg';
  }
  return 'audio/mpeg';
}

function getModelOption(modelId?: string): LlmModelOption | undefined {
  const normalized = modelId?.trim();
  if (!normalized) return undefined;
  return llmModelOptions.find((option) => option.id === normalized || option.model === normalized);
}

function getTtsModelOption(modelId?: string): TtsModelOption | undefined {
  const normalized = modelId?.trim();
  if (!normalized) return undefined;
  return ttsModelOptions.find((option) => option.id === normalized || option.model === normalized);
}

function getEnv(name: string): string {
  return process.env[name] || getLocalEnv()[name] || '';
}

function getApiKey(name: string): string {
  const value = getEnv(name).trim();
  if (
    !value ||
    value === 'replace-with-your-api-key' ||
    value === 'replace-with-your-mimo-api-key' ||
    value === '你的密钥' ||
    value === '你的 MiMo 密钥'
  ) {
    return '';
  }
  return value;
}

function getLocalEnv(): Record<string, string> {
  if (localEnvCache) return localEnvCache;

  const env: Record<string, string> = {};
  for (const filename of ['.env', '.env.local']) {
    const filePath = path.join(process.cwd(), filename);
    if (!fs.existsSync(filePath)) continue;
    Object.assign(env, parseEnvFile(fs.readFileSync(filePath, 'utf8')));
  }

  localEnvCache = env;
  return localEnvCache;
}

function parseEnvFile(text: string): Record<string, string> {
  const env: Record<string, string> = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }

  return env;
}
