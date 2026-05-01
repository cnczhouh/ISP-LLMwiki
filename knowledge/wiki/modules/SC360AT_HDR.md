# SC360AT_HDR

SC360AT HDR 模块整理 Tonemapping、HDR Combine、Comps 和 ISPC_HDR，用于控制四帧 HDR 合成后的亮度映射、高光修复、暗部提升、ghost、噪声和格栅现象。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：HDR / Tonemapping / HDR Combine / ISPC_HDR
- 场景：四帧 HDR、HCG / LCG / S / VS、爆闪灯、高光压缩、暗部抬升、ghost、格栅现象
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- Tonemapping 包含 Dynamic Range、Global Gamma、Local Tonemapping、Hist EQ，用于按动态范围分段插值亮度映射参数。
- HDR Combine 包含 Combine Weight 和 Comps，用于四帧合成、高光 / 爆闪灯区域修复和亮度压缩。
- ISPC_HDR 启用后会接管 HDR / AE / Saturation 等上层页面中的部分参数，被接管参数显示为 ISPC 插值结果。

## 关键参数
### Tonemapping
- `Current Dynamic Range`：当前动态范围值。
- `Dynamic Range0~3`：按动态范围划分参数段，插值 MaxGamma、MinGamma、GlobalGamma、LocalGammaAlpha、LocalGammaStep、CurveAlpha、HistPointStep。
- `LocalTMEnable`：Local Tonemapping 开关。
- `MaxGamma0~3`：local gamma 最小值。
- `MinGamma0~3`：local gamma 最大值。
- `Local Gamma Alpha0~3`：LTM 强度，数值越小强度越高。
- `LTMAlpha2`：降低 Local Gamma Alpha 的值，降低亮度。
- `Local Gamma Step0~3`：控制帧间过渡，越大过渡越快。
- `Global Gamma0~3`：全局抬亮强度，数值越小强度越高。
- `HistEQEnable`：直方图均衡开关。
- `HistPointStep0~3`：直方图统计帧间过渡步长，值越小过渡越慢。
- `CurveAlpha0~3`：整体直方图均衡强度。

### HDR Combine
- `BloomingMode`：HCG / LCG 判断曝光灯区域开关。
- `BloomingMode2`：LCG / S 判断曝光灯区域开关。
- `BloomingMode3`：S / VS 判断曝光灯区域开关。
- `HighMargin`：饱和状态转折点，原信号 + highmargin > 224 时开始用中曝光。
- `BloomingShift` / `BloomingSShift` / `BloomingVSShift`：越小爆闪灯区域修复越明显。
- `Hist1 0~2`：长中权重高频寄存器。
- `Hist2 0~2`：中短权重高频寄存器。
- `Comps Enable`：使能 COMPS。
- `CompSlope0~7`：8 段亮度线性压缩斜率，暗处斜率较大保留更多暗处信息，八段斜率必须递减。

### ISPC_HDR
- `Enable`：使能 ISPC_HDR。
- `HDR_Enable`：开启后可选择 Local Alpha、Curve Alpha、AE Target、AE Ratio、High Margin、Hist、Stable Range、Comps、GloGamma、Low Level、Ltm Blc、Sat 等子模块。
- `Int Gain Luma`：根据 IntL、GainL、LumaL 计算 DR 值，并按 Dy_Th 区间对 HDR 参数做插值。
- `Dy Th1~5`：动态范围插值阈值。
- `Extra Para`：大晴天以 LCG 帧亮度为阈值，单独生效一组参数。
- `HDR_Para`：五段参数插值，Out 为插值结果。

## 调试视角
SC360AT HDR 调试要先分清“曝光分支问题、合成权重问题、亮度映射问题、ISPC 控制权问题”。

- Local Gamma 会参考平均亮度压亮区、抬暗区，能减弱光晕并增加整体对比度；但强度过高会恶化 ghost、噪声和格栅现象。
- Global Gamma 是全局抬亮工具，能提升整体亮度，但会把暗部噪声和黑位一起抬起。
- Hist EQ 可提高对比度和调整亮度，`HistPointStep` 过快会让帧间变化突兀，过慢则响应迟钝。
- BloomingShift 系列越小，爆闪灯区域修复越明显，但过强可能使高光区域过渡不自然。
- `HighMargin` 决定何时切到中曝光，过早会引入中曝光噪声或接缝，过晚会保不住高光。
- Comps 暗处斜率较大可保暗部信息，但斜率关系不对或压缩过强时，太阳 / 天空周围容易出现断层和大光晕。
- ISPC_HDR 接管后，手动调上层 HDR 页面可能无效，必须先确认对应子模块是否勾选。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 暗部更亮 | 增强 Local TM 或 Global Gamma | 暗部细节提升 | 噪声、ghost、格栅可能变重 |
| 高光更稳 | 调 HighMargin、BloomingShift、Comps | 爆闪灯和太阳区域更可控 | 高光过渡可能发灰或断层 |
| 过渡更自然 | 降低 LTM 强度，减慢 HistPointStep | 减少突变和光晕 | 动态范围主观增强变弱 |
| 响应更快 | 提高 LocalGammaStep 或 HistPointStep | 明暗变化跟随快 | 帧间跳变和闪烁风险上升 |
| 自动分段更稳 | 调 ISPC_HDR Dy Th 和 Extra Para | 不同 DR 场景参数更连续 | 控制权复杂，排查成本增加 |

## 调试步骤
1. 用 AE 页面输出 Combine、HCG、LCG、S、VS，确认源分支亮度和噪声。
2. 确认 ISPC_HDR 是否启用，以及哪些子模块接管上层参数。
3. 调 Dynamic Range 分段，观察当前 DR 落在哪个区间。
4. 调 Local TM：先保守增强，若 ghost、噪声、格栅变重则降低强度。
5. 调 Global Gamma 和 Hist EQ，让整体亮度和对比度符合预期。
6. 调 Combine Weight：针对爆闪灯、高光区域调整 HighMargin 和 BloomingShift。
7. 调 Comps：对太阳 / 天空场景检查 8 段斜率递减和亮度断层。
8. 若大晴天特殊场景需要独立参数，再使用 ISPC_HDR Extra Para。

## 常见问题入口
- [[wiki/issues/高光过曝|高光过曝]]：重点检查 HighMargin、BloomingShift、Comps 和 AE 分支输出。
- [[wiki/issues/HDR接缝和运动伪影|HDR接缝和运动伪影]]：重点检查四帧分支、Combine Weight、LTM 强度和 ISPC 控制权。
- [[wiki/issues/暗部发灰|暗部发灰]]：重点检查 Global Gamma、Local TM 和 Hist EQ 是否过强。
- [[wiki/issues/噪声大|噪声大]]：重点检查暗部抬升和 LTM 是否放大噪声。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.6 HDR；1.13 ISPC_HDR。
