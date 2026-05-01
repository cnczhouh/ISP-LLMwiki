# GitHub 上传清单

## 上传前检查

- 确认 `.env`、`.env.local` 不在提交范围内。
- 确认 API Key、Token、代理地址、个人绝对路径没有写进代码或文档。
- 确认 `node_modules/`、`dist/`、`.astro/` 不上传。
- 确认 `raw/` 中的 PDF、datasheet、客户项目资料、厂商文档是否允许公开。
- 若只想公开原型，建议使用少量脱敏 Markdown 示例代替完整知识库。

## 推荐公开内容

```text
Own-web/
  src/
  public/
  docs/
  knowledge/
    wiki/
    schema/
    logs/
    raw/README.md
  .env.example
  .gitignore
  astro.config.mjs
  package.json
  package-lock.json
  README.md
  tsconfig.json
```

## 可选公开内容

如果你希望展示知识库结构，可以放一个脱敏示例知识库，或使用当前仓库的 `knowledge/` 目录：

```text
knowledge/
  raw/
    README.md
  wiki/
    modules/AE.md
    issues/偏色.md
    workflows/图像质量调整流程.md
    platforms/示例平台.md
    indexes/知识库导航.md
  schema/
    README.md
  logs/
    README.md
```

然后在 `.env.local` 中可以指向真实私有知识库，也可以直接使用仓库内置 `knowledge/`：

```bash
KNOWLEDGE_ROOT=E:\your\private\knowledge
```

公开仓库中的 `.env.example` 只保留示例：

```bash
KNOWLEDGE_ROOT=./knowledge
```

## 首次上传命令参考

```bash
git init
git add .
git commit -m "Initial ISP knowledge web prototype"
git branch -M main
git remote add origin https://github.com/<your-name>/<repo-name>.git
git push -u origin main
```

## 推荐仓库说明

可以把 GitHub 仓库简介写成：

```text
An Astro-based ISP tuning knowledge base prototype with Markdown wiki, RAG search, LLM Q&A, and voice interaction.
```

中文简介：

```text
面向 ISP 图像调试的 Markdown 知识库 Web 原型，支持分类浏览、RAG 问答、AllInAI 对话和语音交互。
```
