# SC360AT_索引

SC360AT 平台知识的聚合入口，用于连接平台页、调试工具、核心模块、流程、问题和原始资料。

## 页面属性
- 类型：索引
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：平台导航 / 资料聚合
- 场景：SC360AT 调试资料入口、模块跳转、流程与问题导航
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/ISP调试知识库导航|ISP调试知识库导航]]

## 平台主页
- [[wiki/platforms/SC360AT|SC360AT]]

## 原始资料
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]

## 工具
- [[wiki/tools/SC360AT_ISP_Tuning_Tool|SC360AT ISP Tuning Tool]]

## 调试流程
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 核心模块
### 自动控制与 HDR 链路
- [[wiki/modules/SC360AT_AE|SC360AT_AE]]：四帧亮度统计、HCG / VS 曝光、增益、AE target、ROI、FAD 抗闪。
- [[wiki/modules/SC360AT_AWB|SC360AT_AWB]]：AWB Calibration、白点区间、白点权重、偏色设置、AWB_WP_WEIGHT。
- [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]：Tonemapping、HDR Combine、Comps、ISPC_HDR、四帧 HDR 控制权。

### 颜色与亮度风格
- [[wiki/modules/SC360AT_CCM|SC360AT_CCM]]：高 / 中 / 低色温三组 CCM、CT 阈值、插值、行归一化。
- [[wiki/modules/SC360AT_Contrast|SC360AT_Contrast]]：Low Level、Stretch、随 gain 自适应对比度和通透性。
- [[wiki/modules/SC360AT_Gamma|SC360AT_Gamma]]：GammaA/B/C、GammaGain、gain 阈值插值和曲线编辑。
- [[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]]：普通饱和度、gain 降饱和、蓝色像素、红绿灯识别。

### 噪声、细节与镜头补偿
- [[wiki/modules/SC360AT_LSC|SC360AT_LSC]]：raw-full size 标定、mirror/flip 注意、Ratio Down、Edge Ratio。
- [[wiki/modules/SC360AT_NR|SC360AT_NR]]：DNS13、DNS23、gain node、edge 判断、add back、边缘区域降噪。
- [[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]]：Threshold、YDNS、Sharpness、UVDNS 四段联调。
- [[wiki/modules/SC360AT_CAC|SC360AT_CAC]]：L/M/S/VS 分帧 CAC、颜色 / 边缘 / 亮度触发条件和强度。

## 常见问题入口
- [[wiki/issues/曝光不稳|曝光不稳]]：优先关联 [[wiki/modules/SC360AT_AE|SC360AT_AE]]、四帧 Mean、AE speed / tolerance 和 ISPC_HDR AE Target。
- [[wiki/issues/闪烁|闪烁]]：优先关联 [[wiki/modules/SC360AT_AE|SC360AT_AE]] 的 FAD、HCG banding 抑制和 `Band_0/Band_1` 频率档位。
- [[wiki/issues/高光过曝|高光过曝]]：优先关联 [[wiki/modules/SC360AT_AE|SC360AT_AE]]、[[wiki/modules/SC360AT_HDR|SC360AT_HDR]]、VS 短曝光和 HDR Combine / Tonemapping。
- [[wiki/issues/亮度不自然|亮度不自然]]：优先关联 [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]、[[wiki/modules/SC360AT_Gamma|SC360AT_Gamma]] 和 [[wiki/modules/SC360AT_Contrast|SC360AT_Contrast]]。
- [[wiki/issues/暗部发灰|暗部发灰]]：优先关联 Tonemapping、Gamma 暗部曲线、Contrast Low Level / Stretch 和 [[wiki/modules/SC360AT_LSC|SC360AT_LSC]]。
- [[wiki/issues/偏色|偏色]]：优先关联 [[wiki/modules/SC360AT_AWB|SC360AT_AWB]]、[[wiki/modules/SC360AT_CCM|SC360AT_CCM]]、[[wiki/modules/SC360AT_LSC|SC360AT_LSC]] 和 [[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]]。
- [[wiki/issues/饱和度异常|饱和度异常]]：优先关联 [[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]]、Blue Pixel、Traffic Light、gain 降饱和和局部亮度降饱和。
- [[wiki/issues/噪声大|噪声大]]：优先关联 [[wiki/modules/SC360AT_NR|SC360AT_NR]]、[[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]]、AE gain 和 HDR 分支噪声来源。
- [[wiki/issues/色噪|色噪]]：优先关联 [[wiki/modules/SC360AT_NR|SC360AT_NR]] 的 BR / G 通道强度、[[wiki/modules/SC360AT_Saturation|SC360AT_Saturation]] 和 AWB。
- [[wiki/issues/细节损失|细节损失]]：优先关联 [[wiki/modules/SC360AT_NR|SC360AT_NR]] 的 edge 判断、denoise strength、DnsBack / add back 和 [[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]]。
- [[wiki/issues/涂抹感|涂抹感]]：优先关联 DNS13 / DNS23 分支强度、边缘保护、YDNS、DnsBack 和细节 add back。
- [[wiki/issues/锐化过强|锐化过强]]：优先关联 [[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]]、YDNS / UVDNS、白 / 黑边控制和 [[wiki/modules/SC360AT_CAC|SC360AT_CAC]]。
- [[wiki/issues/假边|假边]]：优先关联 [[wiki/modules/SC360AT_CAC|SC360AT_CAC]]、[[wiki/modules/SC360AT_Sharpness|SC360AT_Sharpness]] 和 HDR Combine 的 Blooming / Hist / Comps。
- [[wiki/issues/HDR接缝和运动伪影|HDR接缝和运动伪影]]：优先关联 [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]、[[wiki/modules/SC360AT_AE|SC360AT_AE]]、四帧输出、BloomingMode、Hist weights、Comps 和 ISPC_HDR 控制权。

## 待沉淀到问题页的调试记录
- 爆闪灯高光恢复：优先写入 [[wiki/issues/高光过曝|高光过曝]]
- 夜景蓝色像素饱和度：优先写入 [[wiki/issues/饱和度异常|饱和度异常]] 或 [[wiki/issues/色噪|色噪]]
- HDR 格栅和 ghost：优先写入 [[wiki/issues/HDR接缝和运动伪影|HDR接缝和运动伪影]]
- 红绿灯识别饱和度：优先写入 [[wiki/issues/饱和度异常|饱和度异常]]

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]
