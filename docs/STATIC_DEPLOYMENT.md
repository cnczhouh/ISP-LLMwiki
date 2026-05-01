# GitHub Pages 与静态部署

本项目默认是本地 / 服务端模式，适合使用 AI 问答、TTS 语音接口和私有环境变量。GitHub Pages 属于静态部署，适合公开展示知识库结构和可浏览页面。

## 静态模式能做什么

- 浏览 `wiki/` 生成的知识页面
- 使用页面内导航和全局搜索
- 查看页面属性、来源引用和双向链接
- 发布一个不带密钥、不带真实 raw PDF 的公开演示站点

## 静态模式不包含什么

- `/api/ask` 服务端问答接口
- `/api/tts` 云端语音合成接口
- `.env.local` 中的私有密钥
- 默认被 `.gitignore` 排除的真实 `knowledge/raw/` 文件

静态站点里，“问知识库”页面仍会先做浏览器本地检索；如果没有服务端接口，会显示本地检索结果，而不会调用外部模型。

## 本地构建静态站点

使用仓库内的公开知识库：

```bash
npm run build:static
```

使用最小示例知识库：

```bash
npm run build:static:example
```

示例知识库位于：

```text
examples/static-knowledge/
```

它包含平台、模块、问题、流程、工具和索引页，用来验证 GitHub Pages 静态构建，不包含真实原始资料。

## GitHub Pages

仓库已包含 GitHub Actions 工作流：

```text
.github/workflows/pages.yml
```

推送到 `main` 后，工作流会执行：

1. 安装依赖
2. 运行 Astro 检查
3. 以静态模式构建站点
4. 上传 `dist/`
5. 部署到 GitHub Pages

在 GitHub 仓库页面中，需要到 `Settings -> Pages`，把 Source 选择为 `GitHub Actions`。

## 地址与路径

静态构建默认按仓库名生成 GitHub Pages 子路径：

```text
https://cnczhouh.github.io/ISP-LLMwiki/
```

如果仓库名或站点地址不同，可以用环境变量覆盖：

```bash
SITE=https://your-name.github.io BASE_PATH=/your-repo npm run build:static
```

如果部署到自定义域名根路径，可以设置：

```bash
BASE_PATH=/ npm run build:static
```

## 发布前建议

```bash
npm run lint:knowledge
npm run check
npm run build:static
```

确认真实 PDF、客户资料、密钥和个人绝对路径没有进入仓库。

