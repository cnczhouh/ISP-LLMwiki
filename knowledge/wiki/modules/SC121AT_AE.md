# SC121AT_AE

SC121AT 自动曝光模块整理，用于记录曝光/增益控制、HDR 分支查看、抗闪烁和 ROI 设置。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：AE / AEC / AGC
- 场景：自动曝光调试、HDR 曝光比例检查、亮度目标调整、闪烁排查
- 适用范围：指定平台

## 模块作用
- AE 模块负责控制曝光时间、模拟增益、数字增益、亮度目标、调节速度、稳定区间、抗闪烁和参考 ROI。
- SC121AT 的 AEC/AGC 策略是优先打开曝光时间；曝光时间达到最大值后再打开增益，直到增益达到最大值。
- 在 HDR 模式下，AE 页面可分别查看长、中、短三段曝光以及 Combine 输出。

## 关键调试项
### 曝光时间
- ExpTime 支持手动和自动模式。
- 手动模式分别调长、中、短三段曝光值，单位为行。
- 自动模式分别限制长、中、短三段曝光最大值和最小值。
- 曝光值会影响 line buffer、输出帧率、HDR 动态范围和信噪比，量产阶段不建议随意修改。

### 模拟增益
- AnalogGain 支持手动和自动模式，模式开关由曝光模式控制。
- 手动模式分别调长、中、短三段模拟增益，`0x10` 表示 1 倍增益。
- 自动模式限制长、中、短三段模拟增益范围。
- 增益会影响 HDR 动态范围和噪声，低照调试时要和 [[wiki/modules/SC121AT_NR|SC121AT_NR]] 联动看。

### 数字增益
- DigitalGain 只有手动模式。
- 分别调长、中、短三段数字增益，`0x10` 表示 1 倍增益。

### AE target 与速度
- AETarget1 ~ AETarget4：亮度目标值。
- AETargetThre1 ~ AETargetThre4：目标值对应的阈值区间。
- Exp_Gain.C：当前曝光增益值，用于 AE target 插值计算判断。
- AESpeedFM：Fast Mode 步宽，画面亮度离 target 较远时用于快速调节。
- AESpeedSM：Slow Mode 步宽，画面接近 target 时用于细调。
- AETolerance1：进入 AE 稳定区间的阈值。
- AETolerance2：退出 AE 稳定区间、重新调整的阈值。

## HDR 输出检查
- HDROutputFormat 可选择 Combine、Long_exp、Medium_exp、Short_exp。
- L/M、M/S 显示当前长中曝光增益乘积比、中短曝光增益乘积比。
- 抓图格式支持 Null、Single、HDR；HDR 会抓取 Combine、长、中、短四帧图像。
- 排查高光过曝、暗部噪声、拖影时，先比较分支图和 Combine 图，区分是单段曝光问题还是合成问题。

## ROI 与统计
- ShowROI 用于设置 AE 参考区域：left、top、width、height。
- Mean 表示长曝光中 AE 参考区域的平均亮度。
- 车载场景中 ROI 应避开车身固定遮挡、天空大面积高亮或仪表反光等会误导测光的区域。

## 常见问题入口
- AE 震荡：检查 AESpeedFM、AESpeedSM、AETolerance1/2 是否过激。
- 亮度调节慢：检查 Fast / Slow Mode 步宽是否太小，以及曝光/增益上下限是否卡住。
- 频闪：检查 AntiflickerControl 频率、曝光行数和光源频率。
- 高光保不住：检查长/中/短曝光比例、AE target、[[wiki/modules/SC121AT_HDR|SC121AT_HDR]] Combine 和 Tonemapping。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/workflows/SC121AT_图像质量调整流程|SC121AT_图像质量调试流程]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/闪烁|闪烁]]

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]

