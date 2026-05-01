# SC361AT

SmartSens / 思特威车载 CMOS 图像传感器平台；当前知识节点主要基于数据手册，聚焦于 HDR 技术路线、AEC / AGC、MWB、PWL、DPC 和后续平台资料入口。

## 平台属性
- 类型：平台
- 主类型：Sensor
- 附加属性：车载 / HDR / PixGain HDR / Lofic HDR / PWL / LTM
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC361AT|SC361AT]]
- 场景：平台资料入口、HDR 技术路线理解、后续 bring-up 与图像调试整理
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]
- [[wiki/indexes/SC361AT_索引|SC361AT_索引]]

## 平台定位
- SC361AT 是 SmartSens 平台资料中的一个车载 sensor 节点，当前知识库已从数据手册中抽取出 HDR、AEC / AGC、MWB、PWL 和 DPC 等关键功能入口。
- 当前整理重点不是完整 ISP 调参，而是先建立平台入口，避免 [[wiki/modules/SC361AT_HDR|SC361AT_HDR]] 及寄存器功能页成为孤立页面。
- 后续若继续处理该平台资料，应优先补充规格、接口、输出格式、温度传感器、Embedded Data、OSD、Scale Down 和调试流程。

## 关键规格
- 应用领域：车载环视影像、车载后视影像、电子内后视镜
- 分辨率：3 MP
- 像素阵列：1948(H) x 1548(V)
- 最高图像传输率：1920(H) x 1536(V) @ 30fps，Lofic HDR + VS raw combine + PWL / LTM
- 像素尺寸：3.0 μm x 3.0 μm
- 光学尺寸：1/2.44"
- 输出接口：20 / 16 / 14 / 12 / 10-bit @ 1 / 2 / 4 Lane MIPI
- 输出格式：RAW RGB、YUV422
- CRA：19°
- 灵敏度：12213 mV/lux·s
- 动态范围：140 dB @ 四帧融合
- 信噪比：41.3 dB
- 工作温度：环境温度 -40°C ~ +105°C；结温 -40°C ~ +125°C
- 供电：AVDD 2.8±0.1V、DVDD 1.05V(0.95V~1.1V)、I/O 1.8±0.1V
- 封装尺寸：iBGA 8.500 x 7.400 mm 79-pin；COB 6.860 x 5.800 mm 111-pin；RW 6.910 x 5.850 mm 111-pin
- 车规与安全：AEC-Q100 Grade 2；ISO 26262 ASIL-B 等级
- ESD：HBM Class 3A；CDM Class C3

## 已有原始资料
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]

## 资料目录阅读重点
- 系统描述：芯片概述、系统框架、芯片初始化、配置接口、Sensor ID、MIPI 数据接口、锁相环、视频输出模式和测试模式。
- 功能介绍：Slave Mode、宽动态、AEC / AGC 控制寄存器、MWB、PWL、嵌入行信息、坏点校正、温度传感器和功能安全。
- 机械与电气：iBGA / COB / RW 封装、引脚信息、脚位坐标、电气特性、QE 曲线和 CRA 曲线。

## 平台调试入口
- Bring-up 先确认 MIPI lane / bit depth / RAW RGB 或 YUV422 输出格式，再检查 1920x1536@30fps 的 Lofic HDR + VS raw combine + PWL / LTM 路线是否与接收端匹配。
- HDR 调试应把 PixGain HDR、Lofic HDR、四帧融合、[[wiki/modules/SC361AT_PWL|PWL]] / LTM 和 [[wiki/modules/SC361AT_AEC_AGC|AEC / AGC]] 放在同一链路看。
- 车载场景要额外关注外部控制帧率、多传感器同步、水平 / 垂直窗口调整、OSD、Scale Down 和温度传感器。

## 已有知识页面
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]
- [[wiki/modules/SC361AT_MWB|SC361AT_MWB]]
- [[wiki/modules/SC361AT_PWL|SC361AT_PWL]]
- [[wiki/modules/SC361AT_DPC|SC361AT_DPC]]

## 后续整理方向
- 输出链路：MIPI 数据类型、lane 数、bit depth、RAW RGB / YUV422 格式、Embedded Data、接收端配置差异。
- HDR 链路：PixGain HDR、Lofic HDR、HCG / LCG / OF / SE、[[wiki/modules/SC361AT_PWL|PWL]] / LTM。
- 自动控制与增益：[[wiki/modules/SC361AT_AEC_AGC|AEC / AGC]]、HDR 分支曝光 / gain 约束、低照增益上限。
- 颜色与异常点入口：[[wiki/modules/SC361AT_MWB|MWB]]、[[wiki/modules/SC361AT_DPC|DPC]]、固定亮暗点和偏色排查。
- 平台辅助功能：Slave Mode、温度传感器、OSD、Scale Down、测试模式、镜像翻转和窗口调整。
- 问题入口：高光过曝、暗部噪声、HDR 合成边缘、亮度层次不自然。
- 流程入口：SC361AT bring-up 流程、SC361AT HDR 调试流程。

## 相关页面
- [[wiki/indexes/SC361AT_索引|SC361AT_索引]]
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]
- [[wiki/modules/SC361AT_MWB|SC361AT_MWB]]
- [[wiki/modules/SC361AT_PWL|SC361AT_PWL]]
- [[wiki/modules/SC361AT_DPC|SC361AT_DPC]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/暗部发灰|暗部发灰]]

## 来源
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
