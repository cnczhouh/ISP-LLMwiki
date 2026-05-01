# 跨平台 ISP 通用风险点检查表

这是一张跨 sensor / ISP 平台共用的风险检查表。不同平台的模块命名、工具页面和参数名会不同，但调试风险类型大体相同：黑位、曝光、HDR/WDR、降噪、锐化、色彩、镜头校正、输出链路和同步控制之间会互相影响。

## 页面属性
- 类型：调试流程
- 厂家：通用
- 平台：跨平台
- 模块：通用风险检查 / ISP 调试方法
- 场景：平台 bring-up、图像质量调试、问题排查、跨平台迁移
- 适用范围：跨平台

## 使用方式
1. 先按问题现象进入具体问题页，例如 [[wiki/issues/暗部发灰|暗部发灰]]、[[wiki/issues/噪声大|噪声大]]、[[wiki/issues/拖影|拖影]]、[[wiki/issues/闪烁|闪烁]]。
2. 再回到本页确认该现象属于哪类通用风险。
3. 最后在具体平台页或模块页中找到平台对应模块名，例如 FH833X 叫 BLC / WDR / NR3D / APC，SC121AT 可能叫 ABLC / HDR / NR / Sharpness，GW5 可能叫 Black Offset / LTM / SNR / Demosaic。

## 通用风险类型
| 风险类型 | 通用判断 | 常见影响 | 平台对应模块示例 |
| --- | --- | --- | --- |
| 黑电平 / 暗场基线 | 黑位不准会污染后续所有模块 | 偏色、暗部发灰、对比度异常、低照噪声判断失真 | BLC、Black Offset、Clamp、ABLC |
| 曝光时间 / 增益路线 | 快门、sensor gain、ISP gain 的优先级决定亮度、噪声和运动清晰度 | 过曝、欠曝、拖影、噪声、亮度跳变 | AE、AEC / AGC、Exposure、Gain Table |
| 曝光生效时序 | 曝光时间、增益和统计窗口若跨帧不一致，容易引起闪烁或呼吸 | 亮度抖动、AE flicker、WDR 高光闪烁 | AE delay、Group Hold、Frame Sync、WDR exposure timing |
| HDR / WDR 合成 | 多曝光分支亮度、噪声和颜色不连续，会在合成区暴露 | HDR 接缝、运动伪影、高光发灰、暗部脏噪 | HDR、WDR、Combine、Merge、PWL、LTM |
| Tone Mapping / 动态范围压缩 | 暗部和高光被重新映射后，会改变对比度、饱和度和噪声可见度 | 暗部发灰、高光不自然、局部光晕、亮度不自然 | DRC、LCE、LTM、ATR、Contrast、Gamma |
| 降噪强度 | 空域 / 时域降噪过强会保噪声但伤细节，过弱则颗粒明显 | 涂抹感、细节损失、拖影、塑料感、色噪残留 | NR、NR2D、NR3D、YNR、CNR、SNR、DNS |
| 锐化与边缘增强 | 锐化会提高主观清晰度，也会放大噪声、假边和压缩痕迹 | 锐化过强、白边黑边、噪声变粗、假边 | Sharpen、APC、Demosaic Sharpness、Edge Enhancement |
| 色彩链路 | AWB、CCM、Saturation、Gamma 和 LSC 会互相改变颜色判断 | 偏色、肤色不准、颜色不自然、低照掉色 | AWB、CCM、Color、Saturation、HTEMP、CIE |
| 镜头阴影 / 光学补偿 | LSC、CAC、Purple Fringe 等校正依赖镜头、中心点、色温和裁剪 | 边角偏色、暗角、紫边、边缘彩边、局部噪声变重 | LSC、CAC、PFC、Purple、Lens Shading |
| 坏点 / 绿平衡 / 去马赛克 | 前级异常点和 Bayer 域处理会影响后续边缘与颜色 | 固定亮点暗点、假色、格子纹、maze pattern | DPC、SPC、GB、GE、Demosaic、CFA |
| 频闪与光源周期 | 曝光时间、工频光源、LED PWM 和 rolling shutter 不匹配会引起条纹或跳亮 | 闪烁、横条纹、LED 闪烁、曝光不稳 | Flicker、AFD、Anti-flicker、LED Flicker Mitigation |
| 输出链路 / 接收端配置 | MIPI / DVP / LVDS、bit depth、Bayer order、YUV 格式不匹配会让画面异常 | 无图、花屏、偏色、格式错误、裁剪异常 | MIPI、DVP、LVDS、Output Format、Crop、Scaler |
| 多摄同步 | 多 sensor 触发、曝光和帧率不同步会造成拼接或时间错位 | 多摄不同步、拼接错位、亮度不一致 | Slave Mode、FSYNC、EFSYNC、Group Hold、Embedded Data |

## 调试顺序建议
1. 先确认输出链路和基础配置：分辨率、帧率、接口、bit depth、Bayer / YUV 格式。
2. 再确认黑电平、坏点、镜头阴影等前级基础模块。
3. 确认 AE / AWB 是否稳定，再进入 HDR / WDR、Gamma、LTM / DRC 等风格模块。
4. 最后调 NR、锐化、颜色微调和平台专项模块。
5. 出现问题时优先回退到上游模块判断，不要只在最后一个主观模块上硬修。

## 平台映射入口
- [[wiki/platforms/ISX031|ISX031]]：重点看 AE、AWB、HDR、ATR、Gamma、NR、Sharpen、Clamp / BLC、前级补偿模块。
- [[wiki/platforms/SC121AT|SC121AT]]：重点看 AE、AWB、HDR、NR、LSC、Gamma、Contrast、Saturation、Sharpness、HTEMP 和同步 / 输出链路。
- [[wiki/platforms/SC360AT|SC360AT]]：重点看 AE、HDR、NR、LSC、CAC、Gamma、Contrast、Saturation、Sharpness 和 ISPC_HDR 控制权。
- [[wiki/platforms/SC361AT|SC361AT]]：重点看 AEC / AGC、HDR、PWL、MWB、DPC、MIPI 输出和 Lofic HDR 链路。
- [[wiki/platforms/GW5|GW5]]：重点看 Black Offset、AE、AWB、LTM、Gamma、SNR、CNR、Demosaic、DPC、LSC、AFD。
- [[wiki/platforms/FH833X|FH833X]]：重点看 BLC、AE、WDR、DRC、LCE、NR3D / NR2D / YNR / CNR、APC、DPC、LSC、AWB、CCM。

## 相关问题页
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/曝光不稳|曝光不稳]]
- [[wiki/issues/闪烁|闪烁]]
- [[wiki/issues/HDR接缝和运动伪影|HDR接缝和运动伪影]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/涂抹感|涂抹感]]
- [[wiki/issues/拖影|拖影]]
- [[wiki/issues/锐化过强|锐化过强]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/无图花屏|无图花屏]]
- [[wiki/issues/多摄同步异常|多摄同步异常]]

