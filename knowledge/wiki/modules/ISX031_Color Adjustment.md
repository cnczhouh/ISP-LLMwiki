# Color Adjustment

Color Adjustment 是 usr_adj 中负责颜色风格的子模块，主要用于色调和饱和度调整。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：颜色调整 / usr_adj
- 场景：主观颜色风格调优、饱和度调整、局部色调微调
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台主观颜色风格调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：颜色调整 / usr_adj
- 场景：主观颜色风格调优、饱和度调整、局部色调微调

## 核心要点
- 应用说明书将颜色调整定义为通过调整图像色调和/或饱和度来改变颜色表现的功能
- 这里的 `Color Adjustment` 主要对应色调与饱和度，不单独承担对比度和亮度调整
- usr_adj 不是基础校正模块，更适合放在 [[wiki/modules/ISX031_AE|AE]]、[[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_CCM|CCM]]、[[wiki/modules/ISX031_Gamma|Gamma]] 基本正确之后再调
- 颜色调整功能工作在 Cb-Cr 坐标空间，既能做整体饱和度调整，也能按区域做色调偏移

## 调试方法
1. 先确认 [[wiki/modules/ISX031_AE|AE]]、[[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_CCM|CCM]]、[[wiki/modules/ISX031_Gamma|Gamma]] 已基本正确，否则色彩风格调节容易掩盖根因。
2. 调饱和度时先用 `UISATURATION` 做整体加减，确认是全局饱和度问题，还是某些颜色区域单独失真。
3. 若只是某一类颜色偏怪，不要继续拉全局饱和度，优先看 `HUE_CBH_*`、`HUE_CRH_*`、`HUE_CBG_*`、`HUE_CRG_*` 这类区域色调系数。
4. 每次调整后同时回看肤色、天空、草地、红色物体和暗部纯色区，避免“某一处变好，别处变假”。
5. 低照场景下同步观察 [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]] 与 [[wiki/modules/ISX031_NR|NR]]，因为饱和度提升后色噪和脏色也会更显眼。
6. 如果你真正想调的是整体反差或亮度基线，应转去看 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]，不要继续在颜色页里硬调。

## 关键寄存器与调整作用
- `UISATURATION`
  - 控制对象：整体颜色饱和度调整值，应用说明书给出 `0x80` 为标准值；`0x81`~`0xFF` 为增强，`0x00`~`0x7F` 为减弱。
  - 调大/调高：颜色更浓、更艳，主观讨好度可能更高，但肤色、草地、天空和红色物体更容易过饱和，色噪也会更明显。
  - 调小/调低：颜色更淡、更克制，脏色和色噪较容易压住，但画面可能发白、没精神。
  - 观察现象：肤色是否过红，蓝天和绿植是否假艳，暗部彩噪是否被一起拉出来。

- `HUE_MODE_WS0`、`HUE_MODE_WS1`
  - 控制对象：颜色调整功能在不同白平衡场景下的色温联锁方式。
  - 调大/调高：不同光源下可采用更有区分度的色调策略，暖光和日光可分别修风格，但切换不当会造成色彩风格跳变。
  - 调小/调低：不同色温下更偏向统一风格，画面一致性更高，但某些光源下可能修不到位。
  - 观察现象：室内暖光、室外日光、混光场景之间，颜色风格是否连贯。

- `HUE_CBH_COLOR_x_POSy`、`HUE_CRH_COLOR_x_POSy`
  - 控制对象：16 个区域内的 Cb / Cr 色调系数，用于改变某类颜色的色相方向。
  - 调大/调高：对应颜色区域会朝目标方向更明显地偏移，能修正局部颜色味道，但调过头会让单一颜色区域显得不自然。
  - 调小/调低：对应颜色区域的色相修正减弱，原始颜色方向保留更多。
  - 观察现象：某一类颜色是否单独被修正，例如肤色是否更正、草是否更自然，同时看是否引入新的局部偏色。

- `HUE_CBG_COLOR_x_POSy`、`HUE_CRG_COLOR_x_POSy`
  - 控制对象：区域色彩增益相关系数，用于调整不同颜色区域的饱和度分布。
  - 调大/调高：对应颜色区域饱和度更高或更显眼，局部色彩存在感更强。
  - 调小/调低：对应区域颜色更克制，能压住脏色或爆色，但也可能让该颜色显得发灰。
  - 观察现象：是否只是某一类颜色太艳/太淡，而不是全局饱和度都有问题。

## 可观察项
- `UISATURATION`
- 不同照度下的颜色风格一致性
- 肤色是否自然
- 天空 / 草地 / 红色物体是否过饱和
- 暗部是否有脏色或彩噪被放大

## 调试重点
- Color Adjustment 只负责 usr_adj 里的颜色风格部分，不要拿它替代亮度/对比度调整
- 全局饱和度先小步调，再判断是否需要进入区域色调调整
- 一旦出现局部颜色假、肤色怪、暗部脏，优先回头检查是不是调过头
- 调完颜色风格后要回看 [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]]、[[wiki/modules/ISX031_NR|NR]] 和 [[wiki/modules/ISX031_Gamma|Gamma]] 的联动副作用

## 常见问题
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/肤色不准|肤色不准]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_usr_adj|usr_adj]]
- [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]
- [[wiki/modules/ISX031_CCM|CCM]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_Chroma Suppress|Chroma Suppress]]
- [[wiki/modules/ISX031_NR|NR]]

## 来源
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]

