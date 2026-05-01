# useradj / usr_adj

useradj（`usr_adj`）是 ISX031 中面向用户主观画质调整的模块入口，用于在基础 AE、AWB、CCM、Gamma、NR、Sharpen 等链路稳定后，对颜色、亮度、对比度和饱和度等观感做最终修饰。

## 页面属性
- 类型：平台模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：useradj / usr_adj / 用户主观调整
- 场景：调风格、调观感、颜色与亮度微调、最终主观画质修饰
- 适用范围：指定平台

## 模块定位
- `usr_adj` 应按 ISX031 的 useradj 模块理解，不只是一个泛泛的“风格调整”概念。
- useradj 不是基础成像正确性的来源，而是基础校正完成后的主观调整层。
- useradj 不等于单独的 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]；Color Adjustment 是 useradj 中负责色调 / 饱和度的一类子功能。
- useradj 还包括 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]] 这类亮度 / 对比度调整能力。

## 子功能入口
| 子功能 | 主要作用 | 典型参数 / 观察项 |
|---|---|---|
| [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]] | 色调、饱和度、Cb-Cr 区域颜色风格 | `UISATURATION`、`HUE_MODE_WS0/1`、`HUE_CBH_*`、`HUE_CRH_*`、`HUE_CBG_*`、`HUE_CRG_*` |
| [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]] | 亮度基线、对比度、Y gain / Y offset 分档 | `UICONTRAST`、`ADJ_YGAIN_*`、`ADJ_YOFFSET_*`、`ADJ_COEF*` |
| [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]] | 低照或高增益下压制色度噪声和脏色 | 暗部彩噪、纯色区脏色、低照饱和度 |

## 调试前提
- [[wiki/modules/ISX031_AE|AE]] 已经稳定，否则亮度问题会被误判为 useradj 问题。
- [[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_Pre White Balance|Pre White Balance]] 和 [[wiki/modules/ISX031_CCM|CCM]] 已经基本正确，否则色彩风格调整会掩盖白点或矩阵问题。
- [[wiki/modules/ISX031_Gamma|Gamma]]、[[wiki/modules/ISX031_ATR|ATR]] 已形成基本亮度层次，否则对比度和亮度微调容易破坏高光 / 暗部层次。
- [[wiki/modules/ISX031_NR|NR]]、[[wiki/modules/ISX031_Sharpen|Sharpen]] 已基本平衡，否则提升饱和度或对比度会同步暴露噪声、假边和涂抹。

## 推荐调试顺序
1. 先判断目标是颜色问题、亮度 / 对比度问题，还是低照脏色问题。
2. 如果是颜色太艳、太淡、肤色味道不对或局部颜色不自然，进入 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]。
3. 如果是整体太平、太硬、暗部发灰、高光层次不顺或中间调不舒服，进入 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]。
4. 如果低照下颜色发脏、彩噪明显或饱和度一拉就出脏色，联查 [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]] 与 [[wiki/modules/ISX031_NR|NR]]。
5. 每次调整后跨场景回归：室内外、高低照、肤色、天空、草地、红色物体、暗部纯色区、高对比边缘。
6. 若 useradj 一调就暴露偏色、噪声、假边或层次异常，应回退并先修前级根因。

## 调试重点
- useradj 调整幅度宜小步推进，避免为了单场景讨好破坏全场景一致性。
- 颜色与亮度 / 对比度要分开判断，不要用饱和度掩盖 CCM 问题，也不要用对比度掩盖 Gamma / ATR 问题。
- useradj 更适合做最终观感收敛，不适合替代 AE、AWB、CCM、Gamma、NR、Sharpen 的基础调试。
- 若要整理问题定位，建议把“现象 → 子功能 → 前级根因”串起来，而不是只记录某个寄存器增减。

## 常见问题入口
| 问题 | useradj 排查重点 |
|---|---|
| [[wiki/issues/颜色不自然|颜色不自然]] | 先区分 AWB / CCM 根因和 Color Adjustment 风格问题。 |
| [[wiki/issues/肤色不准|肤色不准]] | 灰卡已中性但肤色不讨好时，再进入 Color Adjustment。 |
| [[wiki/issues/亮度不自然|亮度不自然]] | 先确认 AE / Gamma / ATR，再看 Brightness Adjustment。 |
| [[wiki/issues/暗部发灰|暗部发灰]] | 避免只抬 Y offset；需联查黑位、Gamma、ATR 和 NR。 |
| [[wiki/issues/高光过曝|高光过曝]] | useradj 只能做观感修饰，不能替代 AE / ATR 的高光保护。 |
| [[wiki/issues/噪声大|噪声大]] | 饱和度和对比度提升会让噪声更明显，需联查 NR。 |
| [[wiki/issues/假边|假边]] | 对比度和锐化观感叠加时，边缘可能变硬。 |

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/indexes/ISX031_索引|ISX031_索引]]
- [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]
- [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]
- [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]]
- [[wiki/modules/ISX031_AE|AE]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_CCM|CCM]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_ATR|ATR]]
- [[wiki/modules/ISX031_NR|NR]]
- [[wiki/modules/ISX031_Sharpen|Sharpen]]

## 来源
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
