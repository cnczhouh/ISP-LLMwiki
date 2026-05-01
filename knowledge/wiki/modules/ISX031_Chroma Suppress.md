# Chroma Suppress

Chroma Suppress 用于在特定亮度或照度条件下抑制色度分量，常用于压制低照脏色、暗部彩噪和过艳的局部颜色表现。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：色度抑制
- 场景：低照脏色、暗部彩噪、饱和度过高后的副作用控制
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台色度抑制调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：色度抑制
- 场景：低照脏色、暗部彩噪、饱和度过高后的副作用控制

## 核心要点
- Chroma Suppress 常和 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]、[[wiki/modules/ISX031_NR|NR]] 联动使用
- 当 `UISATURATION` 提高后，色度抑制往往也要同步复查，否则暗部彩噪和脏色会更明显
- 它的目标不是让颜色更准，而是让颜色在困难场景下更干净、更克制
- 调得过强会让画面发灰、肤色发白、彩色细节变淡

## 调试方法
1. 先确认问题是不是色度噪声/脏色，而不是 [[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_CCM|CCM]] 本身方向错了。
2. 低照场景先观察暗部纯色区、肤色阴影区和高饱和边缘，确认哪些区域最容易脏。
3. 若全局饱和度已经被 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]] 拉高，先微回退再决定要不要继续靠 Chroma Suppress 硬压。
4. 调整色度抑制时，始终同时回看肤色、彩色灯牌、草地和天空，避免“脏色没了，颜色也死了”。
5. 和 [[wiki/modules/ISX031_NR|NR]] 一起联调，避免一边压色度、一边又把颜色纹理全部抹掉。

## 关键寄存器与调整作用
- `ADJ_CRGAIN_GAIN4_01_VAL_A`、`ADJ_CRGAIN_GAIN4_01_VAL_B`、`ADJ_CRGAIN_GAIN4_01_VAL_C`、`ADJ_CRGAIN_GAIN4_01_VAL_D`
  - 控制对象：不同联动档位下的 Cr 色度抑制增益。
  - 调大/调高：Cr 方向的颜色更容易被压住，偏红/偏紫类脏色会减轻，但肤色和暖色物体也可能变淡。
  - 调小/调低：Cr 方向颜色保留更多，色彩更活，但低照脏色更容易暴露。
  - 观察现象：肤色阴影、红色物体和暗部暖色噪点是否更干净或更发白。

- `ADJ_GAIN4_01_IL_TYPE_SEL`
  - 控制对象：色度抑制增益的照度联动类型。
  - 调大/调高：不同照度下可使用更有区分度的色度抑制策略，夜景能压得更狠。
  - 调小/调低：不同照度下策略更统一，风格更一致，但夜景和白天可能难兼顾。
  - 观察现象：白天和夜晚的颜色干净程度是否更平衡，是否某一档位特别脏或特别灰。

- `ADJ_COEF4_03_01_VAL_A`、`ADJ_COEF4_03_01_VAL_B` 等同类系数寄存器
  - 控制对象：色度抑制的系数组。
  - 调大/调高：色度压制更强，脏色更容易被吃掉，但彩色纹理和细微肤色层次也会一起损失。
  - 调小/调低：色彩层次保留更多，但暗部杂色和局部爆色更容易显出来。
  - 观察现象：颜色是“干净但死”，还是“鲜活但脏”，找两者之间平衡点。

## 可观察项
- 暗部彩噪是否下降
- 肤色阴影是否发白
- 高饱和物体是否失真
- 白天 / 夜晚风格是否一致

## 调试重点
- Chroma Suppress 更偏向压副作用，不是主色彩校正模块
- 如果只是颜色方向错，不要先靠它压
- 若一调就发灰，优先退一点再回查 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]] 和 [[wiki/modules/ISX031_NR|NR]]

## 常见问题
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/肤色不准|肤色不准]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]
- [[wiki/modules/ISX031_NR|NR]]
- [[wiki/modules/ISX031_CCM|CCM]]

## 来源
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]

