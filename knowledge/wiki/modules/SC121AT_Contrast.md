# SC121AT_Contrast

SC121AT Contrast 模块整理，用于记录 SmartSens Tuning Tool 中 High Level / Low Level、A/B 两端插值和随增益自适应对比度调整方法。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：Contrast / 对比度
- 场景：整体亮度通透性、暗部发灰、亮部层次、随增益对比度自适应
- 适用范围：指定平台

## 模块作用
- Contrast 直接影响图像整体亮度、通透性和明暗反差。
- SC121AT Contrast 分 High Level 和 Low Level：分别针对相对较亮点和相对较暗点做对比度调整。
- Contrast 可选择手动模式或自动模式；自动模式下可实现对比度随 1x–128x gain 自适应调整。

## High Level / Low Level
- `Enable`：使能开关。
- `Current Gain`：当前增益值，点击 Update 可实时更新。
- `High Level` / `Low Level`：分别调整较亮区域和较暗区域的对比度。
- `Auto` / `Manual`：选择自动或手动模式。
- `Cur_Contrast`：读出当前较亮 / 较暗区域对比度。
- 自动模式下，根据 Current Gain 调试对应增益下的强度值。

## Low Level 与 A/B 两端
- Contrast 部分分 A、B 两端，可通过调节值来调整当前 A / B 两组对比度的应用范围。
- 高增益 A 和低增益 B 两组对比度调试值之间做插值。
- 用户可根据实际情况调节最大 / 最小 level 值。

## 调试建议
1. 先确认 [[wiki/modules/SC121AT_AE|SC121AT_AE]]、[[wiki/modules/SC121AT_HDR|SC121AT_HDR]]、[[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]] 已建立基本亮度层次，再调 Contrast。
2. 画面发灰但曝光正常时，可先看 Low Level；画面高光层次发硬或发闷时，再看 High Level。
3. 自动模式要结合 Current Gain 分段调整，不要只在单一增益点定稿。
4. 高增益下对比度过强会放大噪声和涂抹感，应联查 [[wiki/modules/SC121AT_NR|SC121AT_NR]]。
5. HDR 场景中，Contrast 与 Tonemapping、Global Gamma、Hist EQ 叠加影响亮度观感，不能孤立调。

## 常见问题入口
- [[wiki/issues/暗部发灰|暗部发灰]]：检查 Low Level、Gamma、Local Tonemapping 和黑位。
- [[wiki/issues/亮度不自然|亮度不自然]]：检查 High / Low Level 与 Gamma / HDR 映射是否冲突。
- [[wiki/issues/噪声大|噪声大]]：高 gain 对比度过强会让噪声更明显。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/亮度不自然|亮度不自然]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
