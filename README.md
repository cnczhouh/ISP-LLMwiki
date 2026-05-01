# ISP Knowledge Web Prototype

这是一个面向 ISP 图像调试工程师的个人知识库 Web 原型。它把 Obsidian 风格的 Markdown 知识库整理成可浏览、可检索、可对话的本地网站，并提供 RAG 问答、AllInAI 对话入口和语音交互能力。

## 原型目标

- 把分散的 sensor、ISP、工具、问题和调试流程沉淀成结构化知识库。
- 保留 `[[双向链接]]`、页面属性、来源追溯和索引导航，方便后续持续维护。
- 用 RAG 检索把本地知识片段提供给大模型，回答时尽量基于已有资料。
- 提供传统阅读、知识库问答、AllInAI 对话、语音输入和语音播报几种入口。

## 功能入口

- `/traditional/`：传统知识库门户，适合按平台、模块、问题分类浏览。
- `/ask/`：面向知识库的问答页面，先检索本地知识，再调用大模型回答。
- `/allinai/`：命令行风格的统一入口，支持现象排查、学习路线、资料查询和语音对话。
- `/knowledge/...`：从 `wiki/` Markdown 自动生成的知识页面。
- `/knowledge-files/...`：原始资料文件访问入口，主要用于引用追溯。

## 项目结构

```text
Own-web/
  src/
    pages/
      allinai.astro          # AllInAI 对话原型
      ask.astro              # RAG 问答页面
      traditional.astro      # 传统导航页
      api/ask.ts             # 问答接口
      api/tts.ts             # 语音合成接口
      knowledge/[...slug].astro
      knowledge-files/[...path].ts
    lib/
      content.ts             # 读取知识库内容
      ragSearch.ts           # 本地检索与上下文构建
      rag.ts                 # RAG 分片入口
      llm.ts                 # 大模型与 TTS 配置
      markdown.ts            # Markdown 渲染
      taxonomy.ts            # 分类与页面属性
    layouts/
    styles/
  public/
  docs/
    PROTOTYPE.md
    KNOWLEDGE_BASE_RULES.md
```

知识库内容默认放在另一个目录，通过 `KNOWLEDGE_ROOT` 指向：

```text
Own/
  raw/                       # 原始资料
  wiki/
    modules/
    issues/
    workflows/
    tools/
    platforms/
    cases/
    indexes/
  schema/                    # 模板、命名规则、工作流
  logs/                      # 入库、重构、审查记录
```

详细规则见 [docs/KNOWLEDGE_BASE_RULES.md](docs/KNOWLEDGE_BASE_RULES.md)。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://127.0.0.1:4321/
```

## 环境变量

复制 `.env.example` 为 `.env.local`，按需填写：

```bash
KNOWLEDGE_ROOT=E:\mylife\libiary\Own
```

### 大模型问答

优先使用通用 OpenAI-compatible 配置：

```bash
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your-api-key
LLM_MODEL=gpt-4o-mini
LLM_PROVIDER=OpenAI-compatible
```

也可以使用 MiMo：

```bash
MIMO_API_KEY=your-mimo-api-key
```

### 语音输出

云端 TTS 可配置：

```bash
TTS_BASE_URL=https://api.openai.com/v1
TTS_API_KEY=your-api-key
TTS_MODEL=gpt-4o-mini-tts
TTS_VOICE=alloy
```

MiMo TTS 使用单独密钥，避免把聊天密钥误用于语音：

```bash
MIMO_TTS_API_KEY=your-mimo-tts-api-key
MIMO_TTS_BASE_URL=https://api.xiaomimimo.com/v1
MIMO_TTS_MODEL=mimo-v2.5-tts
```

如果云端语音未配置或失败，AllInAI 会回退到浏览器本地朗读。

## 构建与检查

```bash
npm run check
npm run build
npm run preview
```

## GitHub 上传前建议

- 不上传 `.env`、`.env.local`、`node_modules/`、`dist/`、`.astro/`。
- 原始 PDF、公司资料、项目记录可能包含版权或保密信息，上传前先确认是否可以公开。
- 如果公开仓库只展示原型，可保留少量脱敏示例 Markdown，不直接上传完整 `raw/`。
- `KNOWLEDGE_ROOT` 使用本地路径配置，不要把个人绝对路径写死在代码里。

## 文档

- [docs/PROTOTYPE.md](docs/PROTOTYPE.md)：产品原型、功能模块和页面流程。
- [docs/KNOWLEDGE_BASE_RULES.md](docs/KNOWLEDGE_BASE_RULES.md)：知识库目录、页面角色、入库规则和命名原则。
