# SC121AT_索引

SC121AT 平台知识的聚合入口，用于连接平台规格、ISP 模块、调试工具、流程、问题和原始资料。

## 页面属性
- 类型：索引
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：平台导航 / 资料聚合
- 场景：平台资料入口、模块跳转、流程与问题案例导航
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]

## 平台主页
- [[wiki/platforms/SC121AT|SC121AT]]

## 原始资料
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]

## 工具
- [[wiki/tools/SC121AT_ISP_Tuning_Tool|SC121AT ISP Tuning Tool]]

## 调试流程
- [[wiki/workflows/SC121AT_图像质量调整流程|SC121AT_图像质量调试流程]]

## 核心模块
### 自动控制与信号链路
- [[wiki/modules/SC121AT_Option|SC121AT_Option]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]]
- [[wiki/modules/SC121AT_ISPC_Controller|SC121AT_ISPC_Controller]]

### 细节、噪声与风格链路
- [[wiki/modules/SC121AT_CCM|SC121AT_CCM]]
- [[wiki/modules/SC121AT_Contrast|SC121AT_Contrast]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]
- [[wiki/modules/SC121AT_Saturation|SC121AT_Saturation]]

### 前级补偿与环境补偿
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]]
- [[wiki/modules/SC121AT_CAC|SC121AT_CAC]]
- [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]]

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：优先关联 [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]、[[wiki/modules/SC121AT_CCM|CCM]]、[[wiki/modules/SC121AT_Saturation|Saturation]]。
- [[wiki/issues/高光过曝|高光过曝]]：优先关联 [[wiki/modules/SC121AT_AE|SC121AT_AE]]、[[wiki/modules/SC121AT_HDR|SC121AT_HDR]]、ISPC_HDR。
- [[wiki/issues/暗部发灰|暗部发灰]]：优先关联 Tonemapping、[[wiki/modules/SC121AT_Gamma|Gamma]]、[[wiki/modules/SC121AT_Contrast|Contrast]]、[[wiki/modules/SC121AT_LSC|LSC]]。
- [[wiki/issues/噪声大|噪声大]]：优先关联 [[wiki/modules/SC121AT_NR|SC121AT_NR]]、AE gain、[[wiki/modules/SC121AT_HTEMP|HTEMP]]、LSC gain 衰减。
- [[wiki/issues/细节损失|细节损失]]：优先关联 [[wiki/modules/SC121AT_NR|NR]]、[[wiki/modules/SC121AT_Sharpness|Sharpness]]、Tonemapping。
- [[wiki/issues/假边|假边]]：优先关联 HDR Combine Edge Tuning、[[wiki/modules/SC121AT_CAC|CAC]]、[[wiki/modules/SC121AT_Sharpness|Sharpness]] 限制。
- [[wiki/issues/拖影|拖影]]：优先关联 Staggered HDR、曝光比例、HDR 合成。
- [[wiki/issues/闪烁|闪烁]]：优先关联 AE Antiflicker、曝光行数与光源频率。

## 待沉淀到问题页的调试记录
- 夜景噪声大：优先写入 [[wiki/issues/噪声大|噪声大]]
- HDR 高光光晕：优先写入 [[wiki/issues/高光过曝|高光过曝]] 或 [[wiki/issues/HDR接缝和运动伪影|HDR接缝和运动伪影]]
- 低色温偏红：优先写入 [[wiki/issues/偏色|偏色]] 或 [[wiki/issues/肤色不准|肤色不准]]
- 高温噪声上升：优先写入 [[wiki/issues/高温噪声|高温噪声]]

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]

