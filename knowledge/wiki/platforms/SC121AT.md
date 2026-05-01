# SC121AT

SmartSens / 思特威车载 CMOS 图像传感器平台；当前知识节点聚焦于内置 ISP、行交叠 HDR、车载同步、在线调参工具和图像质量调整。

## 平台属性
- 类型：平台
- 主类型：Sensor
- 附加属性：集成 ISP / 车载 / AEC-Q100 Grade 2 / 行交叠 HDR / 多传感器同步 / RAW 与 YUV 输出
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 场景：车载后视、盲点检测、360 环视、平台 bring-up、图像质量调试
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]
- [[wiki/indexes/SC121AT_索引|SC121AT_索引]]

## 平台定位
- SC121AT 是面向车载相关应用的 1.3MP CMOS 图像传感器，资料中明确应用于车辆后视影像、车辆盲点检测和车辆 360 度环视。
- 该平台不是单纯 RAW sensor：芯片内置 ISP，支持 [[wiki/modules/SC121AT_AE|AE/AEC/AGC]]、[[wiki/modules/SC121AT_AWB|AWB]]、镜头校正、坏点校正、[[wiki/modules/SC121AT_HDR|宽动态合成]]、色调映射、自动黑电平校正、[[wiki/modules/SC121AT_NR|NR]] 等功能。
- 从知识库视角，应把 SC121AT 归为“带内置 ISP 的车载 sensor 平台”，同时保留 sensor 接口、同步、输出格式和 ISP 调参两条线索。

## 关键规格
- 分辨率：1.3 MP
- 有效像素窗口：1304H x 984V
- 常用输出：1280H x 960V @ 30fps @ 三重曝光行交叠 HDR
- 像素尺寸：3.0 μm x 3.0 μm
- 光学尺寸：1/3.75"
- 输出接口：8-bit DVP；20/16/14/12/10/8-bit MIPI 1/2/4-lane；16/12/10/8-bit LVDS 1/2/4-lane
- 输出格式：YUV422、RAW
- HDR 动态范围：100 dB @ 两重曝光行交叠宽动态；120 dB @ 三重曝光行交叠宽动态
- 增益能力：134.7x 模拟增益，16x 数字增益
- 工作环境温度：-40°C ~ +105°C
- 供电：AVDD 2.8 V、DVDD 1.2 V、DOVDD 1.8 V
- 封装：47-pin CSP，5.740 mm x 4.820 mm

## 资料结构
- 数据手册偏硬件与 sensor 功能：系统框架、I2C、EEPROM、DVP/MIPI/LVDS、PLL、Slave Mode、HDR、AEC/AGC、Group Hold、输出窗口、嵌入行、温度传感器、测试模式。
- Tuning Tool 手册偏 ISP 调参：[[wiki/modules/SC121AT_Option|Option]]、[[wiki/modules/SC121AT_AE|AE]]、[[wiki/modules/SC121AT_AWB|AWB]]、[[wiki/modules/SC121AT_CAC|CAC]]、[[wiki/modules/SC121AT_CCM|CCM]]、[[wiki/modules/SC121AT_Contrast|Contrast]]、[[wiki/modules/SC121AT_HDR|HDR]]、[[wiki/modules/SC121AT_Gamma|Gamma/GammaGain]]、[[wiki/modules/SC121AT_LSC|LSC]]、[[wiki/modules/SC121AT_NR|NR]]、[[wiki/modules/SC121AT_Saturation|Saturation]]、[[wiki/modules/SC121AT_Sharpness|Sharpness]]、[[wiki/modules/SC121AT_HTEMP|HTEMP]]、ISPC Controller。

## 调试视角下的主线
1. 先确认输出链路：DVP / MIPI / LVDS、RAW / YUV422、HDR VC 是否按接收端要求配置。
2. 再确认同步链路：Master / Slave Mode、EFSYNC / FSYNC / GPIO 触发、帧率和曝光是否稳定。
3. 然后确认自动控制：[[wiki/modules/SC121AT_AE|AE]] 的曝光/增益范围、AE target、抗闪烁和 ROI；[[wiki/modules/SC121AT_AWB|AWB]] 的标定区间、白点识别和偏色设置。
4. HDR 场景下重点看 [[wiki/modules/SC121AT_HDR|HDR]] 输出分支、长/中/短曝光比例、Tonemapping、Combine、ISPC_HDR 插值关系。
5. 最后做主观画质：[[wiki/modules/SC121AT_NR|NR]]、[[wiki/modules/SC121AT_LSC|LSC]]、[[wiki/modules/SC121AT_Gamma|Gamma]]、[[wiki/modules/SC121AT_Contrast|Contrast]]、[[wiki/modules/SC121AT_Saturation|Saturation]]、[[wiki/modules/SC121AT_Sharpness|Sharpness]]、[[wiki/modules/SC121AT_HTEMP|HTEMP]]。

## 通用风险在 SC121AT 上的模块映射
- 通用风险总表见 [[wiki/workflows/跨平台_ISP_通用风险点检查表|跨平台 ISP 通用风险点检查表]]。SC121AT 的专项风险主要体现在三段 HDR、ISPC_HDR 控制权、同步触发和 LSC 标定流程。
- HDR / WDR 合成：优先看 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]，三段曝光、line buffer、输出帧率、动态范围和信噪比互相关联，量产阶段不建议随意改曝光时间范围。
- 控制权归属：Tuning Tool 中启用 ISPC_HDR 后，上层 HDR / AE 里被 ISPC 管控的参数会失效并显示为 ISPC 插值结果，排查时要先确认控制权归属。
- 多摄同步：Slave Mode 中 Active State 过长可能造成同一帧不同行曝光时间不一致，多传感器同步时要重点检查触发间隔和 RB Rows 设置。
- 镜头阴影校正：[[wiki/modules/SC121AT_LSC|SC121AT_LSC]] 标定要求 raw-full size 配置，且需要注意 EEPROM 中旧配置、中心亮度、抓图格式和圆心半径设置。

## 相关页面
- [[wiki/indexes/SC121AT_索引|SC121AT_索引]]
- [[wiki/tools/SC121AT_ISP_Tuning_Tool|SC121AT ISP Tuning Tool]]
- [[wiki/workflows/SC121AT_图像质量调整流程|SC121AT_图像质量调试流程]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]

## 待补充
- 根据项目实测补充默认配置、常用寄存器 dump 和接收端配置差异。
- 从工具实际界面补充 CAC、CCM、Contrast 的详细参数和案例。
- 增加车载夜景、LED 闪烁、隧道出入口、逆光等场景案例。

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]

