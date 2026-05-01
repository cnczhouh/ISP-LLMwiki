# HDR接缝和运动伪影

HDR 接缝和运动伪影是指多曝光或多路 HDR 合成时，在亮暗过渡、运动物体或高反差边缘出现接缝、错位、鬼影、颜色断层或边缘异常。

## 页面属性
- 类型：通用问题
- 厂家：跨厂家 / Sony / SmartSens / GEO / Fullhan
- 平台：跨平台 / [[wiki/platforms/SC360AT|SC360AT]]
- 模块：HDR / AE / PWL / LTM / Demosaic / WDR / [[wiki/modules/SC360AT_HDR|SC360AT_HDR]] / [[wiki/modules/SC360AT_AE|SC360AT_AE]]
- 场景：大光比、运动物体、车灯、隧道口、树影和天空边界
- 适用范围：跨平台

## 现象表现
- 运动物体边缘出现重影或亮暗错位。
- HDR 合成区域有明显接缝或亮度断层。
- 高反差边缘出现假边、彩边或 halo。
- 亮暗分支切换时颜色或噪声不一致。

## 优先排查顺序
1. 先判断异常是否只在 HDR 模式出现。
2. 检查长 / 中 / 短曝光比例是否过大，运动时是否容易错位。
3. 检查 HDR combine 阈值、权重和边缘保护策略。
4. 检查 AE 是否让某一路曝光过曝或欠曝，导致合成缺少可用数据。
5. 合成后若亮度断层明显，联查 PWL / LTM / Gamma。

## 常见处理方向
- 降低过大的曝光比，减少运动错位风险。
- 调整合成阈值和边缘保护，避免高反差区域硬切换。
- 确认短曝光分支能保住高光，长曝光分支能保住暗部信噪比。
- 合成后通过平滑的 PWL / LTM 曲线减少灰阶断层。

## 平台差异入口
- SC121AT：优先关联 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]] 和 [[wiki/modules/SC121AT_AE|SC121AT_AE]]，重点看 Staggered HDR、Combine 和 ISPC_HDR 控制权。
- SC360AT：优先关联 [[wiki/modules/SC360AT_HDR|SC360AT_HDR]] 和 [[wiki/modules/SC360AT_AE|SC360AT_AE]]。先分 HCG / LCG / S / VS 检查曝光和亮度连续性，再看 HDR Combine 的 BloomingMode、HighMargin、BloomingShift、Hist weights 和 Comps；运动伪影明显时，重点确认曝光比是否过大、VS 高光分支是否有效、Tonemapping 是否把合成接缝进一步放大，以及 ISPC_HDR 是否接管相关参数。
- SC361AT：优先关联 [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]、[[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]] 和 [[wiki/modules/SC361AT_PWL|SC361AT_PWL]]，重点看 HCG / LCG / OF / SE 四路合成。
- ISX031：优先关联 [[wiki/modules/ISX031_HDR|HDR]] 和 [[wiki/modules/ISX031_ATR|ATR]]。
- FH833X：优先关联 [[wiki/modules/FH833X_WDR|FH833X_WDR]]、[[wiki/modules/FH833X_AE|FH833X_AE]] 和 [[wiki/modules/FH833X_NR|FH833X_NR]]。先用 `wdr_merge_cfg` 单出长 / 中 / 短帧定位异常来自哪一帧，再检查曝光比、merge 曲线、短帧亮度矫正时序和中短帧降噪强度。

## 相关页面
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/拖影|拖影]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]
- [[wiki/modules/SC360AT_AE|SC360AT_AE]]
- [[wiki/platforms/SC360AT|SC360AT]]
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/modules/SC361AT_PWL|SC361AT_PWL]]
- [[wiki/modules/ISX031_HDR|HDR]]
- [[wiki/modules/FH833X_WDR|FH833X_WDR]]
- [[wiki/modules/FH833X_AE|FH833X_AE]]
- [[wiki/modules/FH833X_NR|FH833X_NR]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]
