# SC121AT_图像质量调试流程

SC121AT 图像质量调试流程，用于把数据手册中的平台能力和 Tuning Tool 中的模块入口串成可执行调试顺序。

## 页面属性
- 类型：流程
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：图像质量调试总流程
- 场景：平台 bring-up 后调优、HDR 场景调试、车载图像质量系统化调整
- 适用范围：指定平台

## 使用前提
- 已确认 SC121AT 能稳定输出 RAW 或 YUV422。
- 已确认 DVP / MIPI / LVDS 接口、lane 数、位宽、VC、帧率与接收端匹配。
- 已确认 I2C 通信正常，工具可 Read / Write / Save。
- 若使用 Slave Mode 或多 sensor 同步，先确认触发信号、Active State、RB Rows 和帧率稳定。

## 流程总览
1. A：链路与同步确认
2. B：基础曝光与白平衡
3. C：HDR 与亮度映射
4. D：镜头补偿与噪声控制
5. E：主观风格与环境补偿
6. F：保存、回归与案例沉淀

## A. 链路与同步确认
- 确认输出接口：DVP、MIPI 或 LVDS。
- 确认输出格式：RAW 或 YUV422。
- HDR 输出时确认是否使用 MIPI virtual channel 区分长/中/短曝光。
- Slave Mode 下确认 EFSYNC / FSYNC / GPIO 触发是否只在 Active State 有效，Active State 尽量小。
- 必要时打开彩条或嵌入行信息，区分链路问题和 ISP 画质问题。

## B. 基础曝光与白平衡
- 先调 [[wiki/modules/SC121AT_AE|SC121AT_AE]]：曝光上下限、模拟增益上下限、AE target、AE speed、tolerance、antiflicker、ROI。
- HDR 场景中用 AE 页面切换 Combine / Long_exp / Medium_exp / Short_exp，确认三段曝光是否合理。
- 再调 [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]：先做镜头对应的 AWB calibration，再用白点标记和 graph 检查白点区域是否准确。
- 若白点正确但仍偏色，检查 B_Gain / R_Gain 是否被标定 Min / Max 限制，再考虑 Color_Bias_Setting。

## C. HDR 与亮度映射
- 调 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]] 时先分清三层：曝光分支、HDR Combine、Tonemapping。
- Dynamic Range 分段决定 MaxGamma、MinGamma、GlobalGamma、LocalGammaAlpha、LocalGammaStep、CurveAlpha、HistPointStep 等参数插值。
- Local Tonemapping 可压亮区、抬暗区、增强整体对比度，但强度过高可能恶化 ghost 和噪声。
- HDR Combine 重点看 BloomingMode、HighMargin、BloomingShift、Hist 权重、Comps、Dark Color、Edge Tuning。
- 若启用 [[wiki/modules/SC121AT_ISPC_Controller|ISPC_HDR]]，先确认哪些 HDR / AE 参数已由 ISPC 插值接管。

## D. 镜头补偿与噪声控制
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]] 标定要使用 raw-full size 配置，并控制中心亮度约为饱和值 70%。
- LSC 的 Q / GainMin / GainMax / QMax / QMin 用于随增益降低 LENC 效果，避免高增益下把噪声一起放大。
- [[wiki/modules/SC121AT_NR|SC121AT_NR]] 分长/中曝光 LPF1-5 和短曝光 Short 模块，调试时要先选择 Exp_Type。
- NR 自动模式要结合 Current Gain 设定不同增益下的强度，避免低照过度涂抹或高亮噪声残留。

## E. 主观风格与环境补偿
- [[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]] 用于整体亮度层次；GammaA 偏高亮场景，GammaB 偏低亮场景，中亮场景插值。
- Saturation 可做整体饱和度、暗处自适应降饱和、蓝色像素、红色场景饱和度处理。
- Sharpness 要结合正/负边缘增强和限制参数，避免假边、黑边和噪声增强。
- [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]] 用于高温时降低 Gain、LENC ratio、low level 和 Saturation，减少高温噪声。

## F. 保存、回归与案例沉淀
- 每轮调参保留原始配置、修改后配置、抓图和场景说明。
- 对 HDR 场景保留 Combine、长、中、短曝光分支图，方便判断问题出在曝光、合成还是 tonemapping。
- 形成稳定结论后，优先沉淀到对应模块页，或写入对应问题页的“调试案例 / 项目记录”小节。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/tools/SC121AT_ISP_Tuning_Tool|SC121AT ISP Tuning Tool]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]]

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
