# GW5_索引

GW5 平台索引，用于聚合 GEO GW5 ISP 调试资料、模块页、流程页和常见问题入口。

## 页面属性
- 类型：索引
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：平台导航 / 模块导航 / 流程导航 / 问题导航
- 场景：GW5 ISP 调试资料检索、模块知识定位、问题排查入口
- 适用范围：指定平台

## 平台入口
- [[wiki/platforms/GW5|GW5]]

## 已整理模块
- [[wiki/modules/GW5_AFD|GW5_AFD]]：已补充关键 ISP JSON 参数默认值、50Hz / 60Hz 检测阈值、区域配置和调试风险。
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]
- [[wiki/modules/GW5_CNR|GW5_CNR]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_DPC|GW5_DPC]]
- [[wiki/modules/GW5_Gamma|GW5_Gamma]]
- [[wiki/modules/GW5_GE|GW5_GE]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/modules/GW5_PFC|GW5_PFC]]
- [[wiki/modules/GW5_SNR|GW5_SNR]]

## 后续可补充方向
- 根据实际项目补充 GW5 默认 JSON 配置、各模块典型参数组合和场景案例。
- 若后续拿到工具截图或实测图，可继续补充每个 mask 的“调前 / 调后”判断样例。

## 流程入口
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]

## 问题入口
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/闪烁|闪烁]]

## 原始资料
- [[raw/GW5_ISP Tunning中英文.pdf]]：GW5 ISP 多模块中英文调试文档，覆盖 AFD、AE、AWB、Black Offset、CNR、Color、Demosaic、DPC、Gamma、GE、LSC、LTM、PFC、SNR。
- [[raw/GEO_GW5_ISP_Tuning-LTM.pdf]]：GW5 Local Tone Mapping 专项调试文档，包含 LTM 原理、JSON 参数、Phase Two / Three 调试方法和 dynamic asymmetry LUT。

