# SC360AT_图像质量调试流程

SC360AT 图像质量调试流程，用于把 ISP Tuning Tool 中的 AE、AWB、HDR、LSC、NR、颜色和锐化模块串成可执行调试顺序。

## 页面属性
- 类型：流程
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：图像质量调试总流程
- 场景：平台 bring-up 后调优、四帧 HDR 调试、夜景噪声、车载高光和红绿灯识别
- 适用范围：指定平台

## 使用前提
- 已确认 SC360AT 能稳定输出图像，工具可连接并读写参数。
- 已确认当前输出是 Combine、Long / HCG、Medium / LCG、Short / S、VS 或 HDR 抓图模式。
- 若启用 ISPC_HDR，先确认 HDR / AE / Saturation 等页面中哪些参数已被 ISPC 接管。
- 每轮调参前保存原始参数，关键场景保留 Combine 与 HCG / LCG / S / VS 分支图。

## 流程总览
1. A：工具连接与控制权确认
2. B：AE 曝光、增益和抗闪
3. C：AWB 标定与白点权重
4. D：HDR Tonemapping 与 Combine
5. E：LSC、NR、CAC 基础画质
6. F：Gamma、Contrast、Saturation、CCM 主观风格
7. G：Sharpness / YUVDNS 细节和色噪
8. H：保存、回归与案例沉淀

## A. 工具连接与控制权确认
- 打开 ISP 节点，确认 AE、AWB、HDR、Gamma、LSC、NR、Saturation、Sharpness 等模块可读写。
- 先确认当前是否启用 [[wiki/modules/SC360AT_HDR|ISPC_HDR]]：启用后，上方对应模块部分功能会失效并显示 ISPC 插值结果。
- HDR 问题排查时，不只看 Combine，必须抓 HCG、LCG、S、VS 分支图。

## B. AE 曝光、增益和抗闪
- 调 [[wiki/modules/SC360AT_AE|SC360AT_AE]]，先看四帧 Mean：HCG、LCG、S、VS 和 AE 使用帧亮度。
- HCG / LCG / S 使用相同曝光，实际调 HCG 和 VS 曝光；曝光范围涉及 line buffer、帧率、HDR 动态范围和 SNR，量产阶段谨慎修改。
- 再限制 HCG、LCG、S、VS 模拟增益范围，避免为了亮度把噪声推高。
- 配置 AE target、Fast / Slow speed、进出稳定区 tolerance 和 ROI 权重。
- FAD 抗闪中，HCG / LCG / S 使用相同曝光，VS 不支持 flicker 抑制，通常只需打开 HCG 抑制。

## C. AWB 标定与白点权重
- 新镜头先做 [[wiki/modules/SC360AT_AWB|AWB Calibration]]，标定前确认遮光正确，避免漏光。
- Step1 读取多色温白平衡值，计算 B / R gain 范围和参考增益。
- Step2 读取 RGB，计算 B/G、R/G、(B+R)/G，并按高 / 中 / 低色温分类生成标定区间。
- 调 AWB 时打开 Debug 和 Check_White_Pixel，看白点是否落在预期区域。
- 大面积绿色误识别为白点时，评估 Abandon White Point 和 ROI 统计区域。
- AWB_WP_WEIGHT 可按 HCG 曝光时间 * gain 调整高中低色温权重，改善不同曝光状态下白平衡准确性。

## D. HDR Tonemapping 与 Combine
- Tonemapping 先看 Dynamic Range 分段，再看 MaxGamma、MinGamma、GlobalGamma、LocalGammaAlpha、LocalGammaStep、CurveAlpha、HistPointStep 插值。
- Local Gamma 可压亮区、抬暗区、增强整体对比度，但强度过高会恶化 ghost、噪声和格栅现象。
- Global Gamma 用于整体抬亮，Hist EQ 用于对比度和亮度调整，过渡步长太快会造成画面变化突兀。
- HDR Combine 中 BloomingMode / HighMargin / BloomingShift 影响爆闪灯和高光区域修复。
- Comps 按 8 段亮度线性压缩，斜率必须递减；对太阳调试时重点看天空 / 太阳周围是否出现亮度断层和大光晕。

## E. LSC、NR、CAC 基础画质
- [[wiki/modules/SC360AT_LSC|LSC]] 标定前关闭所有 mirror / flip，使用 raw-full size 配置，中心亮度约为饱和值 70%。
- 高 gain 下可用 Ratio Down 降低 LSC 强度，避免边角噪声被一起拉起。
- [[wiki/modules/SC360AT_NR|NR]] 先分清 DNS13 和 DNS23：DNS13 分 L/M/S/VS，DNS23 只用于 L 帧。
- NR 调试顺序建议先确认 gain node，再调边缘判断，再调平坦 / 边缘降噪强度和 add back。
- [[wiki/modules/SC360AT_CAC|CAC]] 按 L/M/S/VS 分帧调试，触发区域受长曝光 CAC 区域界定。

## F. Gamma、Contrast、Saturation、CCM 主观风格
- [[wiki/modules/SC360AT_Gamma|Gamma]] 包含 GammaA/B/C 和 GammaGain，按 gain 阈值插值；先定亮度层次，再定细节风格。
- [[wiki/modules/SC360AT_Contrast|Contrast]] 的 Low Level 和 Stretch 会直接影响通透性、整体亮度和暗部层次。
- [[wiki/modules/SC360AT_Saturation|Saturation]] 先定整体饱和度，再处理 gain 降饱和、暗处降饱和、蓝色像素和红绿灯识别。
- [[wiki/modules/SC360AT_CCM|CCM]] 通常在饱和度后微调，高 / 中 / 低色温三组矩阵需保持每行和为 1。

## G. Sharpness / YUVDNS 细节和色噪
- [[wiki/modules/SC360AT_Sharpness|Sharpness]] 包含 Threshold、YDNS、Sharpness、UVDNS 四段。
- Step1：关闭 YDNS，打开 Sharpness 并调强，调边缘判断阈值，使平坦区域不被锐化。
- Step2：关闭锐化，打开 YDNS，调平坦区域亮度降噪。
- Step3：调 Sharpness 的强度、限制、白边 / 黑边增益和 cut 参数。
- Step4：调 UVDNS，先调边缘判断，再调平坦区色噪，最后调边缘降彩噪。

## H. 保存、回归与案例沉淀
- 每轮保存参数文件、抓图、场景说明和修改原因。
- HDR、夜景、爆闪灯、红绿灯、阴影蓝色像素等场景应分别保存回归图。
- 形成稳定经验后，优先补到对应模块页，或写入对应问题页的“调试案例 / 项目记录”小节。

## 相关页面
- [[wiki/platforms/SC360AT|SC360AT]]
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/tools/SC360AT_ISP_Tuning_Tool|SC360AT ISP Tuning Tool]]
- [[wiki/modules/SC360AT_AE|SC360AT_AE]]
- [[wiki/modules/SC360AT_AWB|SC360AT_AWB]]
- [[wiki/modules/SC360AT_HDR|SC360AT_HDR]]
- [[wiki/modules/SC360AT_NR|SC360AT_NR]]

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]
