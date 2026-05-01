# ISP Knowledge Base

这是一个面向 ISP 图像调试工程师的 Markdown 知识库，用于沉淀 sensor、ISP 平台、调试工具、问题排查、流程方法和实战经验。

这个仓库建议只公开结构化知识和维护规则，不直接上传原始资料。`raw/` 中的 PDF、datasheet、厂商手册、客户项目记录等通常涉及版权、体积或保密风险，默认通过 `.gitignore` 排除。

## 公开内容

建议上传：

```text
wiki/       # 整理后的稳定知识
schema/     # 模板、命名规则、入库流程
logs/       # 摄取、重构和维护记录
README.md   # 仓库说明
.gitignore  # 上传排除规则
```

默认不上传：

```text
raw/        # 原始资料，仅保留 raw/README.md
.obsidian/  # 本地 Obsidian 配置
.claude/    # 本地助手配置
.trash/     # 临时或删除文件
CLAUDE.md   # 本地协作说明
*.base      # 本地 Obsidian Base 草稿
```

## 目录结构

```text
Own/
  raw/
    README.md
  wiki/
    modules/
    issues/
    workflows/
    tools/
    platforms/
    cases/
    indexes/
  schema/
  logs/
```

## 知识分层

- `raw/` 是来源层，保留原始资料。公开仓库中默认不上传真实资料。
- `wiki/` 是知识层，存放整理、抽象和关联后的稳定知识。
- `schema/` 是规则层，存放模板、命名规则和入库工作流。
- `logs/` 是过程层，记录资料摄取、页面更新、重构和审查过程。

## 页面类型

| 类型 | 目录 | 内容 |
| --- | --- | --- |
| 模块 | `wiki/modules/` | AE、AWB、Gamma、NR、HDR、Sharpness 等模块知识 |
| 问题 | `wiki/issues/` | 偏色、噪声大、拖影、闪烁、高光过曝等现象排查 |
| 流程 | `wiki/workflows/` | 图像质量调整流程、跨平台风险检查表 |
| 工具 | `wiki/tools/` | ISP tuning tool、寄存器访问、工具使用方法 |
| 平台 | `wiki/platforms/` | sensor / ISP / 方案 / 厂家主体知识 |
| 案例 | `wiki/cases/` 或问题页小节 | 真实项目经验和复盘 |
| 索引 | `wiki/indexes/` | 导航和聚合入口 |

## 页面属性

建议每个页面开头写清页面属性：

```markdown
## 页面属性
- 类型：通用模块 / 通用问题 / 通用流程 / 通用工具 / 平台 / 案例 / 索引
- 主类型：Sensor / ISP / Solution / Vendor
- 附加属性：集成 ISP / HDR / 前级补偿 / 车载 / 低照优化
- 厂家：
- 平台：
- 模块：
- 场景：
- 适用范围：跨平台 / 指定平台 / 指定方案
```

## 入库规则

1. 原始资料先放入 `raw/`，但公开仓库默认不提交真实 raw 文件。
2. 从资料中识别厂家、平台、模块、问题、工具、流程和可沉淀案例。
3. 先判断页面角色：通用模块、通用问题、通用流程、通用工具、平台页、案例页或索引页。
4. 优先更新已有页面，不重复创建同义页面。
5. 通用页先写跨平台主干，再补平台差异入口。
6. 平台特有实现、寄存器、工具入口和参数名优先写平台页。
7. 真实项目经验优先沉淀到对应问题页的“调试案例 / 项目记录”小节。
8. 重要结论必须能追溯到来源或案例。
9. 页面之间使用 Obsidian 风格双向链接，例如 `[[AWB]]`、`[[偏色]]`。
10. 批量摄取、页面重构或索引调整后，在 `logs/` 中记录维护过程。

## 详细规则

- [schema/information_architecture.md](schema/information_architecture.md)：知识架构说明
- [schema/workflow.md](schema/workflow.md)：入库工作流
- [schema/naming_rules.md](schema/naming_rules.md)：命名规范
- [schema/module_template.md](schema/module_template.md)：模块页模板
- [schema/issue_template.md](schema/issue_template.md)：问题页模板
- [schema/tool_template.md](schema/tool_template.md)：工具页模板
- [schema/wiki_template.md](schema/wiki_template.md)：通用 Wiki 模板

## 配合 Web 原型使用

Web 原型通过环境变量指向这个知识库：

```bash
KNOWLEDGE_ROOT=./knowledge
```

公开仓库中不要写死个人绝对路径。真实路径放在 Web 项目的 `.env.local` 中即可。

## GitHub 上传建议

首次上传前先检查：

```bash
git status --ignored
```

确认 `raw/` 中真实资料、`.obsidian/`、`.claude/`、`.trash/` 没有进入暂存区。

推荐命令：

```bash
git init
git add .
git status
git commit -m "Initial ISP knowledge base"
git branch -M main
git remote add origin https://github.com/<your-name>/<repo-name>.git
git push -u origin main
```
