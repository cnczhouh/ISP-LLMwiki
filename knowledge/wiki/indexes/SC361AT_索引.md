# SC361AT_索引

SC361AT 平台知识的聚合入口，用于连接平台资料、HDR 模块、问题入口和后续待整理内容。

## 页面属性
- 类型：索引
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC361AT|SC361AT]]
- 模块：平台导航 / 资料聚合
- 场景：平台资料入口、HDR 技术路线、后续模块与问题案例导航
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]

## 平台主页
- [[wiki/platforms/SC361AT|SC361AT]]

## 规格与硬件入口
- [[wiki/platforms/SC361AT|SC361AT]] 平台页已整理 3MP 规格、1920x1536@30fps Lofic HDR + VS raw combine + PWL / LTM 路线、MIPI 输出、RAW RGB / YUV422、温度、供电、封装、AEC-Q100 / ASIL-B 与 ESD 信息。

## 原始资料
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]

## 已整理模块
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]：PixGain HDR、Lofic HDR、HCG / LCG / OF / SE 与 PWL / LTM 路线理解。
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]：自动曝光、自动增益、HDR 分支曝光 / gain 寄存器和约束关系。
- [[wiki/modules/SC361AT_MWB|SC361AT_MWB]]：sensor 端手动白平衡开关、R / G / B gain 回写和偏色排查入口。
- [[wiki/modules/SC361AT_PWL|SC361AT_PWL]]：四帧融合后 20bit 到 12bit 的分段线性压缩、节点、斜率和寄存器入口。
- [[wiki/modules/SC361AT_DPC|SC361AT_DPC]]：亮坏点 / 暗坏点判断逻辑和 DPC 开关寄存器。

## 常见问题入口
- [[wiki/issues/高光过曝|高光过曝]]：优先关联 [[wiki/modules/SC361AT_AEC_AGC|AEC / AGC]] 的 SE / OF 分支、[[wiki/modules/SC361AT_HDR|HDR Combine]] 和 [[wiki/modules/SC361AT_PWL|PWL]] 高亮压缩。
- [[wiki/issues/暗部发灰|暗部发灰]]：优先关联 [[wiki/modules/SC361AT_PWL|PWL]]、亮度压缩映射、黑位和 AEC / AGC 增益策略。
- [[wiki/issues/噪声大|噪声大]]：优先关联 LE-HCG、低照增益、[[wiki/modules/SC361AT_AEC_AGC|AEC / AGC]] 约束和 HDR 合成噪声表现。
- [[wiki/issues/偏色|偏色]]：优先关联 [[wiki/modules/SC361AT_MWB|MWB]] gain 回写、外部 ISP AWB 和 HDR 分支颜色一致性。
- [[wiki/issues/细节损失|细节损失]]：优先关联 [[wiki/modules/SC361AT_DPC|DPC]] 误伤小纹理和 PWL 过硬压缩。
- [[wiki/issues/假边|假边]]：优先关联 HDR 合成边缘和高反差区域。

## 后续待补
- SC361AT 平台规格页完善
- SC361AT 温度传感器、Embedded Data、OSD、Scale Down 功能整理
- SC361AT HDR 调试流程
- 高光保护调试记录：优先写入 [[wiki/issues/高光过曝|高光过曝]]
- 暗部噪声调试记录：优先写入 [[wiki/issues/噪声大|噪声大]] 或 [[wiki/issues/暗部发灰|暗部发灰]]

## 来源
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
