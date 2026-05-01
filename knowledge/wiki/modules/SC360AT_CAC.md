# SC360AT_CAC

SC360AT CAC 模块用于消除蓝紫边影响，支持 L / M / S / VS 分帧 CAC 校正，并通过长曝光 CAC 区域界定影响其他帧的校正区域。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：CAC / Chromatic Aberration Correction
- 场景：蓝紫边、高光边缘、分帧 CAC、颜色条件、边缘条件、亮度条件
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- CAC 主要用于消除蓝紫边。
- SC360AT CAC 对 L / M / S / VS 三帧分别做 CAC 校正。
- M、S、VS 的 CAC 校正受长曝光 CAC 区域界定。
- `Exp_Type` 选择当前曝光模式，当前模块调试效果仅对当前选择曝光模式生效。

## 关键参数和功能
### Calibration_Area
#### Gain_Conditions
- `Gain_Thre`：范围 0~0x7f，当长曝光全局增益大于该阈值时，CAC 校正强度逐渐减弱。
- `Speed`：CAC 校正强度随增益增加而减弱的快慢，范围 0~0xf。
- 其余三帧均以长帧增益为准。

#### Color_Conditions
- 当蓝色通道与红色通道同时满足 CAC 条件的点才做 CAC 校正。
- `Blue`：蓝色通道阈值，值越大越容易判定为符合 CAC 条件。
- `Red`：红色通道阈值，值越大越容易判定为符合 CAC 条件。
- `Blue Speed / Red Speed`：蓝色 / 红色满足 CAC 条件的快慢，范围 0~3，值越小速度越快。

#### Edge_Conditions
- 当边缘值大于阈值时，认为满足蓝色边缘条件。
- `Enable`：将边缘值作为 CAC 区域必要条件。
- `ValueThre`：边缘阈值，范围 0~0xff。
- `ValueSpeed`：CAC 强度随边缘值降低而减弱的快慢。

#### Blue_Conditions
- 蓝色亮度低于一定值时，认为满足蓝色亮度条件。
- `Enable`：将蓝色通道亮度作为 CAC 区域必要条件。
- `BlueThre`：蓝色通道亮度阈值，8bit。
- `BlueSpeed`：CAC 强度随蓝色亮度升高而减弱的快慢。

### Calibration_Strenth
- 设置 CAC 校正基准强度，设置值越小，校正强度越大。

### Calibration_Edge
- `Horiz width`：CAC 校正水平边缘宽度。
- `Vertical width`：CAC 校正垂直边缘宽度。

## 调试视角
CAC 调试的关键是只处理“高反差边缘上的异常蓝紫边”，避免误伤真实蓝紫色物体或正常色彩边缘。

- Exp_Type 决定当前调哪一帧，如果只看 Combine 而不分帧，容易误判 CAC 没生效或过强。
- M / S / VS 受长曝光 CAC 区域界定，因此长帧区域条件过窄会导致其他帧漏校正，过宽会导致其他帧误伤。
- Color 条件越宽，紫边覆盖越完整，但真实蓝紫物体、霓虹灯和交通标识更容易被误伤。
- Edge 条件能限制 CAC 只在边缘附近生效，阈值过低会扩大处理区域，阈值过高会漏掉弱紫边。
- Blue_Conditions 可进一步限定蓝色亮度，防止普通亮色边缘被处理，但过窄会漏掉暗一些的紫边。
- Gain_Conditions 随高 gain 减弱 CAC，可减少低照误伤，但高 gain 下紫边可能残留。
- Calibration_Strenth 值越小强度越大，过强会让边缘去色、发灰或出现颜色断层。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 紫边去得更干净 | 放宽颜色 / 边缘条件，减小 strength 值 | 高光边缘紫边减少 | 真实蓝紫色误伤 |
| 减少误伤 | 收紧颜色、边缘和蓝亮度条件 | 正常颜色保留更好 | 细紫边残留 |
| 高 gain 更稳 | 用 Gain_Conditions 减弱 CAC | 低照误伤减少 | 高 gain 紫边处理变弱 |
| 分帧效果一致 | 分别按 L/M/S/VS 调 Exp_Type | Combine 紫边更均衡 | 调试工作量增加 |

## 调试步骤
1. 选择 `Exp_Type`，分 L / M / S / VS 分别看 CAC 效果。
2. 先配置 Color_Conditions，使蓝紫边区域被正确识别。
3. 开启 Edge_Conditions，把处理限制在高反差边缘。
4. 根据紫边亮度配置 Blue_Conditions。
5. 调 Calibration_Strenth 和水平 / 垂直边缘宽度。
6. 高 gain 场景下检查 Gain_Conditions 是否造成残留或误伤。
7. 回看真实蓝紫物体、霓虹灯、交通标识和高光边缘，确认无明显去色。

## 常见问题入口
- [[wiki/issues/假边|假边]]：重点检查 CAC 区域条件、Sharpness 和 HDR Combine。
- [[wiki/issues/颜色不自然|颜色不自然]]：CAC 过强可能误伤真实颜色。
- [[wiki/issues/饱和度异常|饱和度异常]]：联查 CAC、Saturation 和 CCM。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.11 CAC。
