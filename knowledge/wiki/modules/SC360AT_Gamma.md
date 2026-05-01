# SC360AT_Gamma

SC360AT Gamma 模块包含 GammaA / GammaB / GammaC 三条曲线和 GammaGainA / GammaGainB 高频增强曲线，用于按增益阈值插值调整亮度层次、对比度和细节观感。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：Gamma / GammaGain
- 场景：亮度映射、曲线编辑、gain 插值、GammaGain 高频增强、昼夜风格过渡
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- Gamma 提供 GammaA、GammaB、GammaC 三条曲线，通过 gain 阈值做插值。
- 每条 Gamma 曲线有 33 个点，可单独上下调节。
- GammaGain 用于增加高频信号，包含 GammaGainA 和 GammaGainB 两条曲线。

## 关键参数和功能
### Gamma
- `Gain Inter Enable`：增益插值使能。
- `Gain Thre1/2/3`：增益插值阈值。
- `Gain L`：当前增益。
- `Read`：读取当前 gamma 值。
- `Reset`：恢复默认 gamma 值并写入寄存器。
- `Curve`：选择曲线上取点个数，支持 3、5、8、12、16、20、33。
- `Cubic Spline`：三次样条插值，经过每个点，但整条曲线平滑性不一定最好。
- `Bezier`：贝塞尔曲线，整条曲线更平滑，但不一定经过所有点。
- `Reference Set`：提供 5 组 gamma 数据暂存。
- `Save Data / Load Data`：保存 / 导入 gamma 数据。

### GammaGain
- 高亮场景小于 Gain Thre1 时，GammaGainA 生效。
- 低亮场景大于 Gain Thre2 时，GammaGainB 生效。
- 中等亮度场景使用 GammaGainA 和 GammaGainB 插值。

## 调试视角
Gamma 是亮度层次和风格曲线，不应替代 AE、HDR Tonemapping 或 Contrast 的主要职责。

- 暗部曲线拉高会让暗部细节更容易看见，但会抬黑位、发灰并放大噪声。
- 中间调斜率影响主体对比和通透性，过高会让肤色、车身、墙面过渡变硬。
- 高亮段压缩可以保高光层次，但过强会让天空、灯牌和白色物体发灰。
- Gain 插值决定昼夜曲线过渡，三条曲线差异过大或阈值不合理会造成亮度风格跳变。
- GammaGain 增加高频信号会提升细节感，但也容易放大噪声、假边和锐化痕迹，应与 Sharpness / NR 联调。
- Bezier 更适合追求平滑风格，Cubic Spline 更适合精确经过指定点，但可能局部不够平滑。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 暗部更亮 | 抬暗部 gamma 点 | 暗部细节提升 | 发灰、噪声增加 |
| 主体更通透 | 提高中间调斜率 | 对比和立体感增强 | 过渡变硬 |
| 高光更柔和 | 压高亮段曲线 | 高光层次保留 | 高光发灰、亮感下降 |
| 昼夜切换自然 | 调 Gain Thre 和曲线差异 | gain 变化更平滑 | 曲线设计复杂 |
| 细节更强 | 增强 GammaGain | 高频细节提升 | 噪声和假边增加 |

## 调试步骤
1. 先确认 AE、HDR 和 Contrast 基本稳定。
2. 选择曲线点数，先用少量点建立大形状，再用更多点微调。
3. 分别在高亮、中亮、低亮场景调整 GammaA/B/C。
4. 开启 Gain Inter，检查阈值附近亮度风格是否平滑。
5. 如需高频增强，再调 GammaGainA/B，并回看噪声和锐化伪影。
6. 保存 Reference Set 和本地数据，便于不同风格对比。

## 常见问题入口
- [[wiki/issues/亮度不自然|亮度不自然]]：重点检查曲线斜率和 gain 插值阈值。
- [[wiki/issues/暗部发灰|暗部发灰]]：重点检查暗部曲线是否拉太高。
- [[wiki/issues/高光过曝|高光过曝]]：联查高亮段曲线、HDR 和 AE。
- [[wiki/issues/噪声大|噪声大]]：暗部拉升和 GammaGain 会放大噪声。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.7 Gamma；1.7.2 Gamma Gain。
