# SC121AT_HTEMP

SC121AT 高温控制模块整理，用于记录高温下 Gain、LENC ratio、low level 和 Saturation 的联动降噪策略。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：HTEMP / 高温控制
- 场景：高温噪声、车载环境温升、增益限制、饱和度和 LENC 高温联动
- 适用范围：指定平台

## 模块作用
- HTEMP 模块在温度升高时降低 Gain、LENC ratio、low level 和 Saturation，以减少噪声。
- SC121AT 数据手册还提供片上温度传感器读数，可用于理解工具中的高温特征值。

## 温度传感器
- 芯片完成上电后，可通过 `{16'h4c10, 16'h4c11[2:0]}` 读出当前芯片温度。
- 默认读数单位为 K，精度为 1/4 K。
- 摄氏度换算：`T = (16'h4c10 * 8 + 16'h4c11[2:0]) / 4 - 273.15`。

## HTEMP 参数
- TempEigenValue：高温特征值计算。
- LENS_En：在 LENC 模块考虑高温转化后的附加增益。
- CIP&SAT_CON enable：考虑高温转化后的附加增益，生成合并增益并应用到 CIP、AWB、SAT_CON。
- Cur_Htemp：当前高温值。
- Type：手动模式或自动模式。
- Manual：手动输入附加增益。
- Thre：高温特征值阈值，大于该阈值后开始转化为附加增益。
- Ratio：控制高温特征值转换 ratio，越大转换出的附加增益越大。
- Cur Extra Gain：当前附加增益值。

## 高温自动降增益
- Enable：高温自动降增益开关。
- Max_Gain 可选择手动输入或自动计算。
- Htemp_Manual：手动输入 Max_Gain。
- Htemp_Auto：自动计算 Max_Gain。
- Threshold1/2：进出高温值阈值。
- Start / End threshold：根据 Threshold 计算出的进出高温阈值。
- Speed：Max_Gain 随高温变化速度。
- Max / Min Speed：Max_Gain 变化速度的最大/最小限制。

## 调试建议
- 高温噪声上升时，先确认当前温度和 Cur_Htemp，再看 Gain 是否被有效限制。
- 高温下画面变灰或颜色变淡时，检查 low level、Saturation、LENC ratio 是否被压得过重。
- HTEMP 会影响多个风格模块，调试后要回归常温和高温两组场景。

## 相关页面
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]]
- [[wiki/modules/SC121AT_Saturation|SC121AT_Saturation]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
