# GW5_图像质量调试流程

GW5 图像质量调试流程，用于把 GEO GW5 ISP 总调试文档和 LTM 专项文档中的 Phase One / Two / Three 串成可执行调试顺序。

## 页面属性
- 类型：流程
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：图像质量调试总流程 / Black Offset / LSC / AE / AWB / Gamma / LTM / NR / Demosaic / DPC / AFD
- 场景：GW5 ISP bring-up 后图像质量调试、HDR 调试、低照噪声与高光层次平衡、全场景回归
- 适用范围：指定平台

## 使用前提
- 已确认 sensor 输入、ISP 输出链路和抓图链路稳定。
- 已能获取 RAW / ISP 输出图、直方图和当前 JSON 参数。
- 已明确当前调试目标是基础可视化、实验室主调，还是真实场景 fine tuning。

## 流程总览
1. A：基础链路、黑电平与镜头阴影
2. B：自动控制基线
3. C：颜色与基础亮度
4. D：坏点、噪声、GE、Demosaic 与细节
5. E：LTM 与高动态亮度映射
6. F：频闪、动态场景和全场景回归

## A. 基础链路、黑电平与镜头阴影
- 先确认输入输出链路稳定，避免把链路问题误判为 ISP 模块问题。
- 调 [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]，建立后续所有模块的暗部基准。
- 调 [[wiki/modules/GW5_LSC|GW5_LSC]]，先校正镜头阴影和 chroma shading，避免 AWB / CCM / AE stats 被画面位置性亮度或颜色偏差带偏。
- 黑电平不准会影响 [[wiki/modules/GW5_LTM|GW5_LTM]] 的 `black_level` 判断、暗部噪声和 AWB / CCM 的低亮表现。

## B. 自动控制基线
- Phase One 早期可先用手动曝光辅助黑电平、LSC、AWB 等模块标定。
- 进入 Phase Two 后调 [[wiki/modules/GW5_AE|GW5_AE]]，确定 AE target、曝光 / 增益范围、ROI、zone weight 和收敛行为。
- 再调 [[wiki/modules/GW5_AWB|GW5_AWB]]，建立色温、白点、AWB Mesh 和 Night Mode 前的基础白平衡基线。
- HDR 或高动态场景中，AE target 要给高光留余量，同时不要让暗部过度依赖后级 LTM 抬升。

## C. 颜色与基础亮度
- 调 [[wiki/modules/GW5_Color|GW5_Color]] / CCM & Saturation 前，先确认 AWB 基线可靠。
- 调 [[wiki/modules/GW5_Gamma|GW5_Gamma]] 时要结合 AE target，形成稳定的全局亮度和灰阶基线。
- 如果最终亮度观感异常，要区分 AE 落点、Gamma 全局曲线和 [[wiki/modules/GW5_LTM|GW5_LTM]] 局部映射三类问题。

## D. 坏点、噪声、GE、Demosaic 与细节
- 调 [[wiki/modules/GW5_DPC|GW5_DPC]]，处理动态坏点和残留异常点。
- 调 [[wiki/modules/GW5_SNR|GW5_SNR]] 和 [[wiki/modules/GW5_CNR|GW5_CNR]]，建立不同 gain / EV 下的噪声控制基线。
- 调 [[wiki/modules/GW5_GE|GW5_GE]]，先处理 Gr/Gb 不平衡，避免后续 Demosaic 把绿色通道差异放大成假边或颜色伪影。
- 调 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]，在 GE 基线稳定后平衡细节、假边、false color 和噪声增强。
- 如有紫边问题，再调 [[wiki/modules/GW5_PFC|GW5_PFC]]，结合 hue / saturation / luma / SAD / radial / final masks 控制去饱和范围。

## E. LTM 与高动态亮度映射
- [[wiki/modules/GW5_LTM|GW5_LTM]] 通常在黑电平、LSC、AWB、CCM、SNR、Gamma、AE target 基本完成后进入主调试。
- Phase One 只保留默认曲线和基础可视化，不建议大量调 LTM。
- Phase Two 先把 `strength_inroi` 设大观察效果，再调 `asymmetry_lut`，之后调 variance 与 slope 限制，最后回调 strength。
- Phase Three 按 gain / EV 调整 strength、lowlight / highlight LUT、slope_min / slope_max，避免低照噪声和高动态 halo。
- 调完 LTM 后回看 Gamma 和 AE target，因为 LTM 会改变暗部、中间调、高光的最终观感。

## F. 频闪、动态场景和全场景回归
- Auto Flicker Detection 是最终调试模块之一，应在其他模块完成后验证。
- 若默认 AFD 无法检测 50Hz 且画面仍有频闪，可降低 `afd.area_power_threshold`、`afd.peak_average_ratio_threshold` 和 `afd.detection_threshold_50Hz`，直到频闪不可见。
- AFD 从 50Hz 切回 60Hz 可能需要时间；可能需要让积分时间低于 8.33ms 的强光源帮助算法检测 60Hz。
- 对 LTM 动态 LUT 和 AE 收敛，要使用移动场景、快速亮度变化、高动态和低照场景做回归。

## 关键回归场景
- 低照高 gain：检查 LTM 暗部增强是否放大噪声，NR 是否过度涂抹。
- 强逆光 / HDR：检查高光是否 clip、暗部是否可见、halo 是否明显。
- 中间调人眼主观场景：检查亮度是否发闷、发灰或过硬。
- 快速亮度变化：检查 AE、dynamic asymmetry LUT 和 temporal alpha 是否切换自然。
- 频闪灯光：检查 AFD 是否识别正确电源频率，曝光时间是否消除滚动条纹。
- 颜色与灰阶场景：检查 AWB Mesh、CCM、LSC chroma shading 和 Gamma 是否互相一致。
- 细节边缘场景：检查 GE、Demosaic、SNR、CNR 是否在假边、false color、噪声和细节之间平衡。

## 相关页面
- [[wiki/platforms/GW5|GW5]]
- [[wiki/indexes/GW5_索引|GW5_索引]]
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_Gamma|GW5_Gamma]]
- [[wiki/modules/GW5_DPC|GW5_DPC]]
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/modules/GW5_CNR|GW5_CNR]]
- [[wiki/modules/GW5_GE|GW5_GE]]
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_PFC|GW5_PFC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/modules/GW5_AFD|GW5_AFD]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/细节损失|细节损失]]
- [[wiki/issues/涂抹感|涂抹感]]
- [[wiki/issues/闪烁|闪烁]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
- [[raw/GEO_GW5_ISP_Tuning-LTM.pdf]]
