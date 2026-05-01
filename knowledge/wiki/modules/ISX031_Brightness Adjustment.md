# Brightness Adjustment

Brightness Adjustment 是 usr_adj 中负责主观明暗风格的子模块，主要用于对比度和亮度基线微调。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：亮度调整 / usr_adj
- 场景：主观对比度调整、亮度风格微调、不同照度下的风格统一
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台主观亮度风格调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：亮度调整 / usr_adj
- 场景：主观对比度调整、亮度风格微调、不同照度下的风格统一

## 核心要点
- 应用说明书把亮度调整单独成章，不属于 `Color Adjustment` 的色调/饱和度部分
- `UICONTRAST` 是最直接的整体对比度旋钮，`0x80` 为标准值
- 亮度调整不仅是“更亮或更暗”，还涉及不同照度档位下的 Y gain 与 Y offset 联动
- 调得过猛时，容易把 [[wiki/modules/ISX031_ATR|ATR]]、[[wiki/modules/ISX031_Gamma|Gamma]] 已经压好的层次重新拉坏

## 调试方法
1. 先确认 [[wiki/modules/ISX031_AE|AE]]、[[wiki/modules/ISX031_ATR|ATR]]、[[wiki/modules/ISX031_Gamma|Gamma]] 已基本稳定，否则亮度问题容易被误判成 usr_adj 问题。
2. 先用 `UICONTRAST` 找整体风格方向：想更立体就上调，想更柔和就下调。
3. 若只是在某些照度档位表现不对，再看 `ADJ_YGAIN_*` 和 `ADJ_YOFFSET_*` 的分档联动，不要一开始就猛改全局对比度。
4. 每次调整后同时检查暗部层次、高光层次和中间调过渡，避免只看第一眼“更通透”就误判为变好。
5. 低照与高照都要回看，确认不会白天有冲击力、夜晚却发灰或丢层次。

## 关键寄存器与调整作用
- `UICONTRAST`
  - 控制对象：整体对比度调整值，说明书中 `0x80` 为标准值（约 1.0x）。
  - 调大/调高：黑白反差更强，主体更“立”，但暗部容易堵，高光更容易顶死。
  - 调小/调低：整体更平、更柔和，但也更容易发灰、缺少力量感。
  - 观察现象：黑位是否扎实，中间调是否自然，高光层次是否被压没。

- `ADJ_GAIN4_02_IL_TYPE_SEL`、`ADJ_YGAIN_GAIN4_02_VAL_A`、`ADJ_YGAIN_GAIN4_02_VAL_B`、`ADJ_YGAIN_GAIN4_02_VAL_C`、`ADJ_YGAIN_GAIN4_02_VAL_D`
  - 控制对象：不同照度档位下的 Y 增益与对比度联动强度。
  - 调大/调高：对应照度档位对比度更强，画面更有冲击力，但层次也更容易变硬。
  - 调小/调低：对应档位更柔和，层次更容易保住，但可能显得平。
  - 观察现象：白天、夜景、室内外切换时，风格是否一致，是否出现某一档位特别“炸”或特别“闷”。

- `ADJ_YOFFSET_GAIN4_02_VAL_A`、`ADJ_YOFFSET_GAIN4_02_VAL_B`、`ADJ_YOFFSET_GAIN4_02_VAL_C`、`ADJ_YOFFSET_GAIN4_02_VAL_D`
  - 控制对象：不同照度档位下的 Y 偏移量。
  - 调大/调高：整体亮度基线被抬高，暗部更容易显出来，但黑位会变松，画面可能发灰。
  - 调小/调低：黑位更稳、层次更扎实，但暗部可能显闷，细节不易显现。
  - 观察现象：暗部是否灰、高光是否还稳、对比度增强后是否同时把整体基线顶偏。

- `ADJ_COEF4_01_01_VAL_A`、`ADJ_COEF4_01_01_VAL_B`、`ADJ_COEF4_01_01_VAL_C`、`ADJ_COEF4_01_01_VAL_D`
  - 控制对象：对比度系数分组。
  - 调大/调高：局部或对应联动档位的明暗拉伸更明显。
  - 调小/调低：对应档位的对比度更弱，更偏向保层次。
  - 观察现象：是否只是某个照度档位对比度异常，而不是全局都不对。

- `ADJ_COEF4_02_01_VAL_A`、`ADJ_COEF4_02_01_VAL_B`、`ADJ_COEF4_02_01_VAL_C`、`ADJ_COEF4_02_01_VAL_D`
  - 控制对象：亮度系数分组。
  - 调大/调高：对应档位的亮度提升更明显，中间调更容易被提起。
  - 调小/调低：对应档位更保守，能压住发灰感，但亮度空间变小。
  - 观察现象：中间调是否更顺，暗部是否被抬灰，亮度微调是否比直接改对比度更合适。

## 可观察项
- `UICONTRAST`
- 不同照度档位的亮度风格一致性
- 黑位是否发灰
- 高光是否顶死
- 中间调是否自然

## 调试重点
- Brightness Adjustment 更像 usr_adj 里的亮度/对比度风格层，不是 AE 曝光控制本身
- 先小步动 `UICONTRAST`，再决定是否拆到分档 Y gain / Y offset
- 如果对比度一加就显脏，要回头联查 [[wiki/modules/ISX031_ATR|ATR]]、[[wiki/modules/ISX031_Gamma|Gamma]]、[[wiki/modules/ISX031_NR|NR]]
- 如果只是暗部显灰，不一定是亮度没拉够，也可能是黑位和 tone mapping 已经失衡

## 常见问题
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/亮度不自然|亮度不自然]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_usr_adj|usr_adj]]
- [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]
- [[wiki/modules/ISX031_ATR|ATR]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_AE|AE]]

## 来源
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]

