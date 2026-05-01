# GW5

GEO GW5 ISP 平台知识节点，用于汇总 GEO Semiconductor GW5 ISP 调试资料中的模块顺序、关键模块和跨场景调试入口。

## 平台属性
- 类型：平台
- 主类型：ISP
- 附加属性：GEO / GW5 / ISP 调试 / HDR / Local Tone Mapping / 自动控制链路 / 图像风格链路
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 场景：ISP bring-up 后图像质量调试、HDR 亮度映射、自动曝光白平衡、噪声与细节平衡
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]
- [[wiki/indexes/GW5_索引|GW5_索引]]

## 平台定位
- GW5 是 GEO Semiconductor 的 ISP 平台，资料以模块调试指南形式组织，覆盖自动控制、基础校正、颜色、亮度映射、噪声、细节和异常像素类模块。
- 当前资料包含英文原文与中英文合并资料，其中 `GW5_ISP Tunning中英文.pdf` 是多模块总调试文档，`GEO_GW5_ISP_Tuning-LTM.pdf` 是独立的 LTM 细化文档。
- 从知识库视角，GW5 应按“独立 ISP 平台 + 分阶段调试流程”整理，而不是按单一 sensor 归档。

## 资料覆盖模块
`GW5_ISP Tunning中英文.pdf` 覆盖以下模块：

- [[wiki/modules/GW5_AFD|Auto Flicker Detection / AFD]]
- [[wiki/modules/GW5_AE|Auto Exposure / AE]]
- [[wiki/modules/GW5_AWB|Auto White Balance / AWB]]
- [[wiki/modules/GW5_Black_Offset|Black Offset / Black Level Correction]]
- [[wiki/modules/GW5_CNR|Color Noise Reduction / CNR]]
- [[wiki/modules/GW5_Color|Color / CCM & Saturation]]
- [[wiki/modules/GW5_Demosaic|Demosaic & Sharpening]]
- [[wiki/modules/GW5_DPC|Defective Pixel Correction / DPC]]
- [[wiki/modules/GW5_Gamma|Gamma]]
- [[wiki/modules/GW5_GE|Green Equalization / GE]]
- [[wiki/modules/GW5_LSC|Lens Shading Correction / LSC]]
- [[wiki/modules/GW5_LTM|Local Tone Mapping / LTM]]
- [[wiki/modules/GW5_PFC|Purple Fringe Correction / PFC]]
- [[wiki/modules/GW5_SNR|Spatial Noise Reduction / SNR]]

## 调试视角下的主线
1. 先完成基础黑电平、镜头阴影、AWB、CCM、Gamma、AE target 等基础链路，避免后级模块掩盖前级问题。
2. Phase One 偏基础可视化与基础曲线，不建议对 LTM 等强自适应模块做过多主观调参。
3. Phase Two 在实验室条件下完成大多数模块调试，包括 AE、AWB、DPC、NR、CNR、Demosaic、LTM 等。
4. Phase Three 面向全场景做增益、EV、动态范围和场景切换下的 LUT / 参数细调。
5. HDR 或高动态场景中，重点联查 [[wiki/modules/GW5_AE|GW5_AE]]、[[wiki/modules/GW5_LTM|GW5_LTM]]、[[wiki/modules/GW5_Gamma|GW5_Gamma]]、[[wiki/modules/GW5_SNR|GW5_SNR]] 与 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]。

## 通用风险在 GW5 上的模块映射
- 通用风险总表见 [[wiki/workflows/跨平台_ISP_通用风险点检查表|跨平台 ISP 通用风险点检查表]]。GW5 的专项风险主要体现在 LTM、黑电平、SNR / CNR、Demosaic 和 AFD 的调试顺序。
- Tone Mapping / 动态范围压缩：优先看 [[wiki/modules/GW5_LTM|GW5_LTM]]、[[wiki/modules/GW5_Gamma|GW5_Gamma]] 和 [[wiki/modules/GW5_AE|GW5_AE]]。LTM 场景依赖强，参数不宜只按单张图优化，需要覆盖暗部、高光、中间调、高动态和低照噪声场景。
- 暗部增强与噪声：暗部增强会同步放大噪声，低照或高增益场景应降低 LTM strength 或限制 slope_max，并结合 [[wiki/modules/GW5_SNR|GW5_SNR]] / [[wiki/modules/GW5_CNR|GW5_CNR]] 检查。
- 黑电平 / 暗场基线：优先看 [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]，避免黑位偏差被后续 LSC、Gamma、LTM 或 NR 放大。
- 去马赛克与细节：优先看 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]、[[wiki/modules/GW5_DPC|GW5_DPC]] 和 [[wiki/modules/GW5_GE|GW5_GE]]，不要把所有假边、maze pattern 都归因于锐化。
- 频闪检测：[[wiki/modules/GW5_AFD|GW5_AFD]] 是最终调试模块之一，应在其他模块调定后再验证频闪检测和曝光时间切换。

## 相关页面
- [[wiki/indexes/GW5_索引|GW5_索引]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_Gamma|GW5_Gamma]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/噪声大|噪声大]]

## 待补充
- 根据实际项目补充 GW5 默认配置、常用 JSON 参数组合和典型场景案例。

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
- [[raw/GEO_GW5_ISP_Tuning-LTM.pdf]]

