# SC360AT

SmartSens / 思特威车载 CMOS 图像传感器平台；当前知识节点基于 ISP 调试工具指南，聚焦四帧 HDR、在线调参工具、自动控制、颜色、亮度映射、降噪、锐化和车载场景图像质量调整。

## 平台属性
- 类型：平台
- 主类型：Sensor
- 附加属性：集成 ISP / 车载 / 四帧 HDR / HCG-LCG-S-VS 合成 / 在线调参工具
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 场景：车载 HDR、爆闪灯、高动态范围、夜景噪声、红绿灯识别、图像质量调试
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]

## 平台定位
- SC360AT 是 SmartSens 带内置 ISP 的车载 sensor 平台，本资料重点不是硬件 datasheet，而是 ISP Tuning Tool 的图像调试入口。
- 调试工具包含 Option、AE、AWB Calibration、AWB、CAC、CCM、Contrast、HDR、Gamma、GammaGain、LSC、NR、Saturation、Sharpness、ISP Control 等模块。
- 平台 HDR 链路按 HCG、LCG、S、VS 四帧组织，AE、HDR Combine、NR、CAC、Saturation 等模块都需要按曝光分支理解。

## 调试主线
1. 先确认工具连接和输出模式，确保可实时读写、保存、加载参数。
2. 调 [[wiki/modules/SC360AT_AE|SC360AT_AE]]：确认 HCG / VS 曝光范围、四帧统计亮度、AE target、速度、tolerance、ROI 和 flicker 抑制。
3. 调 [[wiki/modules/SC360AT_AWB|SC360AT_AWB]]：先做 AWB Calibration，再看白点识别、白点权重、偏色设置和 AWB_WP_WEIGHT。
4. 调 [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]：先分清 Tonemapping、HDR Combine、Comps、ISPC_HDR 控制权，再看高光、暗部、ghost、噪声和格栅现象。
5. 调镜头和基础画质：[[wiki/modules/SC360AT_LSC|SC360AT_LSC]]、[[wiki/modules/SC360AT_NR|SC360AT_NR]]、[[wiki/modules/SC360AT_CAC|SC360AT_CAC]]。
6. 调主观风格：[[wiki/modules/SC360AT_Gamma|SC360AT_Gamma]]、[[wiki/modules/SC360AT_Contrast|SC360AT_Contrast]]、[[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]]、[[wiki/modules/SC360AT_CCM|SC360AT_CCM]]、[[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]]。

## 通用风险在 SC360AT 上的模块映射
- 通用风险总表见 [[wiki/workflows/跨平台_ISP_通用风险点检查表|跨平台 ISP 通用风险点检查表]]。SC360AT 的专项风险主要体现在四帧 HDR、ISPC_HDR 控制权、LSC 标定、分级 NR 和车载饱和度逻辑。
- HDR / WDR 合成：优先看 [[wiki/modules/SC360AT_HDR|SC360AT_HDR]] 和 [[wiki/modules/SC360AT_AE|SC360AT_AE]]。HCG / LCG / S 三帧使用相同曝光，实际曝光调节主要调 HCG 和 VS；曝光设定会影响 line buffer、输出帧率、HDR 动态范围和信噪比。
- 控制权归属：启用 ISPC_HDR 后，HDR、AE 等页面中部分功能会失效，显示值变为 ISPC 插值结果，排查时要先确认控制权归属。
- 镜头阴影校正：[[wiki/modules/SC360AT_LSC|SC360AT_LSC]] 标定前需关闭 mirror / flip，包括车载项目默认 mirror，且需要使用 raw-full size 配置。
- 降噪链路：[[wiki/modules/SC360AT_NR|SC360AT_NR]] 分 DNS13、DNS23 和 YUVDNS / UVDNS 多级处理，不能只按一个“降噪强度”理解。
- 色彩专项逻辑：[[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]] 包含普通饱和度、局部亮度降饱和、蓝色像素、红绿灯识别等车载专项逻辑。

## 相关页面
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/tools/SC360AT_ISP_Tuning_Tool|SC360AT ISP Tuning Tool]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]
