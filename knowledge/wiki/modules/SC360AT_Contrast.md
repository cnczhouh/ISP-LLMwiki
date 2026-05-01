# SC360AT_Contrast

SC360AT Contrast 模块包含 Low Level 和 Stretch，用于根据增益自适应调整相对亮点 / 暗点对比度、整体亮度、通透性和低高增益场景的对比度风格。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：Contrast / Low Level / Stretch
- 场景：对比度、通透性、低照对比、gain 自适应、整体抬亮
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- Low Level 分相对较亮点和相对较暗点进行对比度调整。
- Stretch 的 Auto 部分直接影响整体亮度、通透性和对比度。
- 支持按 Current Gain 在高增益 A 和低增益 B 两组参数之间插值。

## 关键参数
### Low Level
- `Enable`：使能开关。
- `Distinction Manual`：手动设置亮暗点区分阈值。
- `Current Gain`：当前增益值，点击 update 更新。
- `Low Level`：相对较亮点 / 相对较暗点对比度调整。
- `Auto/Manual`：手动或自动模式；自动模式下对比度随 1~128x gain 自适应。
- `Cur_Contrast`：读出当前较亮 / 较暗区域对比度。

### Stretch
- `A / B 两端`：高增益 A 和低增益 B 两组对比度调试值，中间插值。
- `Thre1 / Thre2`：处于阈值之间时使用插值。
- `LowLevel`：手动设置低阶对比度值。
- `StretchGain`：全局抬亮增益。

## 调试视角
Contrast 调试要把“通透性、暗部层次、亮部压缩、噪声放大”一起看，不能只追求更强反差。

- Low Level 调亮暗点对比会改变局部层次，增强后画面更有立体感，但暗部噪声和边缘硬感也会上升。
- StretchGain 抬亮能改善主体亮度和通透性，但会抬黑位、增加发灰感，并放大 NR 残留噪声。
- 高增益 A / 低增益 B 的插值决定昼夜风格连续性；两组差异过大时，增益变化会造成对比度跳变。
- Distinction 阈值会影响哪些区域被当成亮点或暗点，阈值错会导致局部过增强或层次被压平。
- Contrast 与 HDR Tonemapping、Gamma、LCE 类功能作用相近，应避免多个模块同时强拉导致噪声和 halo。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 画面更通透 | 提高 StretchGain 或增强 Low Level | 主观层次增强 | 黑位发灰、噪声上升 |
| 暗部更稳 | 低照 A 端降低对比增强 | 暗部噪声下降 | 画面偏平、不够透 |
| 昼夜过渡平滑 | 调 A/B 两端和阈值插值 | gain 变化时风格连续 | 参数联调成本增加 |
| 保留自然过渡 | 保守 Distinction 和 Low Level | 局部过渡自然 | 对比度提升有限 |

## 调试步骤
1. 先确认 AE、HDR、Gamma 主亮度链路稳定。
2. 打开 Low Level，读 Current Gain 和 Cur_Contrast，确认当前增益段。
3. 调亮 / 暗点对比度，分别观察主体、暗部、天空和高光过渡。
4. 调 Stretch 的 A / B 两端，让低增益和高增益场景风格一致。
5. 在夜景、高动态范围和低对比灰阶场景回归噪声、发灰和层次。

## 常见问题入口
- [[wiki/issues/暗部发灰|暗部发灰]]：重点检查 StretchGain 和暗部对比是否过强。
- [[wiki/issues/亮度不自然|亮度不自然]]：联查 HDR Tonemapping、Gamma 和 Contrast。
- [[wiki/issues/噪声大|噪声大]]：对比度增强会放大暗部噪声。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.5 对比度调整。
