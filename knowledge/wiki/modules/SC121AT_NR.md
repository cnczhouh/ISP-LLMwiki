# SC121AT_NR

SC121AT 降噪模块整理，用于记录长 / 中 / 短曝光 NR、LPF1-3、LPF4、LPF5、Short NR、自动增益曲线和细节保留关系。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：NR / Noise Reduction
- 场景：低照噪声、HDR 分支噪声、细节与涂抹平衡、锐化前降噪基线
- 适用范围：指定平台

## 模块作用
- NR 模块包含 LPF1-3、LPF4、LPF5 五种低通滤波，应用于长曝光和中曝光。
- 工具可选择长曝光、中曝光和短曝光分别调试。
- 选择短曝光时，不使用 LPF1-5，而是进入 Short 模块调试。
- NR 是 [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]] 的前置基础；降噪没调好时，锐化会放大残余噪声或假细节。

## 全局入口
- `Enable`：当前曝光类型对应的降噪功能开关。
- `Exp_Type`：选择长曝光、中曝光或短曝光。
- `Current Gain`：当前增益倍数，点击 Update 更新；自动模式下按当前增益配置对应降噪强度。
- `NR mode`：NR(old) 为 LPF1-3 分别调试；NR(new) 为 LPF1-3 统一调试，不可切换 LPF1-3。

## LPF1-3
- LPF1-3 包含 NR、Detail 和 Final Strength 三个小模块。
- NR 模块通过 Type 选择手动或自动，通过 Lpf_Number 选择 LPF1、LPF2、LPF3。

### NR
- 手动模式：直接设置 `Manual_Strength`，范围 0~1023，数值越大，去噪强度越大。
- 手动模式默认打开 Detail 手动设置，并将 Detail 的 `Manual_Strength` 设到最大，使手动 NR 不受基准最小强度限制。
- 自动模式：按不同 gain 配置去噪强度。
  - 1x / 2x / 4x：范围 0~255，步长 1。
  - 8x / 16x：范围 0~510，步长 2。
  - 32x / 64x：范围 0~1020，步长 4。
- 自动模式下若 Detail 是手动模式，NR 自动强度会受到 Detail 基准最小强度限制。

### Detail
- Detail 的 Type 可选手动或自动，Lpf_Number 受 NR 模块中的 Lpf_Number 控制。
- 手动模式通过 `Manual_Strength` 设置基准最小强度，范围 0~255。
- Detail `Manual_Strength` 数值越小，暗处保留细节越多。
- 自动模式会根据当前 pixel 噪声表现和亮度决定最小强度：噪声越大、亮度越亮，最小去噪强度越大；噪声越小、亮度越暗，最小去噪强度越小，以保留暗处细节。

### Final Strength
- Final Strength 通过 Type 选择手动或自动。
- 手动模式通过 `Manual_Strength` 调最终整体降噪强度，数值越大，降噪强度越高。
- 自动模式按不同 gain 配置最终去噪强度，可结合 Current Gain 调对应增益节点。

## LPF4
- LPF4 手动模式会强制开启；自动模式根据场景 gain 和当前 pixel 亮度自适应开启。
- 自动模式开启受 Gain 模块 `Slop1` 和 Light 模块 `Slop2` 控制；当 `Slop1` 和 `Slop2` 都为 0 时，不会开启 LPF4 调试。
- `NR_Type`：手动 / 自动模式选择。
- `Enable`：LPF4 调试是否开启的标志。
- `Thre1`：gain 阈值，范围 0~31；值越大，场景越暗时 LPF4 才会开启。
- `Slop1`：随 gain 开启速度，范围 0~3；值越大开启越快，0 表示不随 gain 开启。
- `Thre2`：pixel 亮度阈值，范围 0~15；值越小，pixel 亮度越低时 LPF4 才会开启。
- `Slop2`：随 pixel 亮度开启速度，范围 0~3；值越大开启越快，0 表示不随亮度开启。

## LPF5
- LPF5 需要在边缘增强开启后才有效。
- LPF5 分为 Base_Strength 和 Strength_Adjustment_Value 两部分。
- 调 LPF5 时应同步观察 Sharpness，避免边缘增强与降噪互相抵消或产生假边。

## Short NR
- Short 模块需要上方 `Exp_Type` 选择 ShortExp 后进入。
- `Type`：手动或自动模式。
- `Manual_Strength`：短曝光去噪强度，值越大去噪强度越小。
- `Auto_Thre_Base`：细节判断阈值基准，边缘特征值大于该阈值后去噪强度开始减弱。
- `Auto_Thre_Ratio`：阈值 ratio，值越大，阈值越小，去噪强度越小。
- `Auto_Strength_Max`：最大去噪强度，0 最强，0x40 最小。

## 调试建议
1. 先按曝光分支定位噪声：长曝光暗部噪声、中曝光过渡噪声、短曝光高光或 HDR 分支噪声要分开看。
2. 自动模式必须结合 Current Gain 调不同增益节点，不能只在单一光照下调一个强度。
3. 低照涂抹时检查 LPF1-3 强度、Detail 基准最小强度、Final Strength 和 Short NR 方向是否调反。
4. NR 增强后要回看 Sharpness，避免锐化把残余噪声重新拉出来。
5. 高温噪声场景还要联查 [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]] 和 [[wiki/modules/SC121AT_LSC|SC121AT_LSC]] 的高 gain 衰减。

## 常见问题入口
- [[wiki/issues/噪声大|噪声大]]：检查 AE gain、NR 增益曲线、LSC 高增益衰减、HTEMP。
- [[wiki/issues/涂抹感|涂抹感]]：检查 LPF 强度是否过大，以及 Detail / Final Strength 是否压细节。
- [[wiki/issues/细节损失|细节损失]]：检查 NR 与 Sharpness 的平衡。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]]
- [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]
- [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/涂抹感|涂抹感]]
- [[wiki/issues/细节损失|细节损失]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
