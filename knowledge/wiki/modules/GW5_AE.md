# GW5_AE

GW5 Auto Exposure（AE）模块整理，用于记录 GEO GW5 ISP 中自动曝光目标、统计模式、手动曝光、HDR 曝光比例、PID 收敛和 Phase 分阶段调试方法。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Auto Exposure / AE
- 场景：曝光收敛、HDR 曝光、AE target、ROI、抗频闪联动、亮度映射前置条件
- 适用范围：指定平台

## 模块作用
- AE 用于调整曝光时间与 gain，使相机系统动态范围尽量匹配场景动态范围，并让画面亮度接近设定目标。
- GW5 中 AE 在 Phase One 通常关闭，使用手动曝光辅助其他模块标定；Phase Two 在实验室静态场景中定核心参数；Phase Three 面向真实静态 / 动态场景细调。
- AE target 会影响 [[wiki/modules/GW5_Gamma|GW5_Gamma]] 与 [[wiki/modules/GW5_LTM|GW5_LTM]] 的调试基准；HDR 场景中还会影响高光余量、暗部噪声和后级 tone mapping 可调空间。

## 关键参数

### Firmware 参数
| 参数 | 作用 |
|---|---|
| `target` | AE 平均亮度目标，归一化到 0–100%；例如 128 表示把 18% 灰目标曝光到长曝光 50% 左右。 |
| `hist_source` | AE target 统计模式：0 multi-cam，1 linear，2 HDR（sensor gain only），3 general HDR，4 reserved。 |
| `manual_exposure_control` | 关闭 AE 并启用手动曝光控制。 |
| `manual_sensor_gain` | AE 关闭时使用的 sensor analog / digital gain。 |
| `manual_sensor_integration_lines` | 手动曝光时使用的 sensor integration lines。 |
| `manual_isp_gain_enable` | 是否启用手动 ISP digital gain。 |
| `manual_isp_gain` | AE 关闭时使用的 ISP digital gain。 |

### Static calibration 参数
| 参数 | 作用 |
|---|---|
| `max_sensor_gain` | AE 允许的最大 sensor gain。 |
| `max_isp_gain` | AE 允许的最大 ISP digital gain。 |
| `min_sensor_gain` | AE 允许的最小 sensor gain；某些 sensor mode 可设为非 1.0，但必须小于最大 sensor gain。 |
| `init_sensor_gain` | 启动时 sensor gain 初值。 |
| `min_sensor_integration_lines` | AE 允许的最小 integration lines。 |
| `max_sensor_integration_lines` | AE 允许的最大 integration lines。 |
| `init_sensor_integration_lines` | 启动时 integration lines 初值。 |
| `power_line_frequency` | 抗频闪用电源频率，通常为 50Hz / 60Hz。 |
| `fstep_divider` | integration lines 的 frequency step divider。 |
| `zone_weight` | AE 分区权重。 |
| `nodes_vertical` | AE stats 垂直方向 active zones 数量。 |
| `nodes_horizontal` | AE stats 水平方向 active zones 数量。 |
| `long_medium_exposure_ratio` | HDR 中 long / medium 曝光比例手动控制。 |
| `medium_short_exposure_ratio` | HDR 中 medium / short 曝光比例手动控制。 |
| `short_very_short_exposure_ratio` | HDR 中 short / very short 曝光比例手动控制。 |

### Dynamic calibration 参数
| 参数 | 作用 |
|---|---|
| `proportional_gain` | PID 中比例项，主要影响 AE 收敛速度。 |
| `integral_gain` | PID 中积分项，通常不优先调整。 |
| `derivative_gain` | PID 中微分项，用于改善收敛振荡。 |
| `dead_band` | AE 收敛误差 dead band 半宽。 |
| `dead_band_hyst` | 触发 AE 调整用 dead band hysteresis。 |
| `quick_converge_threshold` | 误差超过该阈值时加快 AE 收敛。 |
| `frame_rate_switch_enable` | 启用低照 frame rate switching。 |
| `frame_rate_switch_thresh_ev` | 触发 frame rate switching 的 EV 阈值。 |
| `frame_rate_switch_thresh_hysteresis` | EV 阈值滞回，避免阈值附近反复切换。 |

## Phase One：手动曝光辅助早期模块
- Phase One 中 AE 通常关闭，使用手动曝光让黑电平、AWB 等早期模块在合理亮度下标定。
- 手动曝光常用参数：
  - `manual_exposure_control = 1`
  - `manual_sensor_gain`
  - `manual_sensor_integration_lines`
  - `manual_isp_gain`
- 手动曝光不是最终亮度策略，只用于在 sensor / ISP 早期链路尚未稳定时给各模块提供可观察、可标定的输入。

## Phase Two：实验室 AE 主调

### 前置条件
| 前置项 | 要求 |
|---|---|
| [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] | 已调定 |
| [[wiki/modules/GW5_LSC|GW5_LSC]] | 已调定 |
| [[wiki/modules/GW5_LTM|GW5_LTM]] | 关闭 |
| Initial Gamma | 已设置初值 |
| Initial target | 已按客观 / 主观目标选择初值 |

### ColorChecker 验证
1. 使用 1500 lux 以上照明拍摄 ColorChecker，使图卡约占画面 1/3 到 1/2。
2. 用 Imatest ColorChecker 或 Photoshop / ImageJ / GIMP 分析灰阶 patch。
3. 若使用 Imatest，曝光误差在 -0.25 到 +0.25 f-stop 可接受，资料建议略欠曝，约 -0.1 到 0 f-stop。
4. 若使用图像软件，逐个选取灰阶 patch ROI，用 luminance / intensity histogram 读取均值。
5. 调整 `target` 后必须重新抓图并复测；降低 `target` 会降低曝光，提高 `target` 会提高曝光。

### ColorChecker 灰阶目标值
| Patch | Ideal pixel value | Min | Max |
|---:|---:|---:|---:|
| 19 | 236 | 226 | 246 |
| 20 | 195 | 185 | 205 |
| 21 | 157 | 147 | 167 |
| 22 | 119 | 109 | 99 |
| 23 | 83 | 73 | 93 |
| 24 | 52 | 42 | 62 |

- 原文表格对 patch 22 给出 `119 / 109 / 99`，与“ideal ±10”的文字说明不一致；使用时应回到原 PDF 或实际标定规范复核。
- 总体要求是测得均值落在 ideal 附近 ±10，且资料倾向轻微欠曝，但不低于 ideal -5 太多。

### HDR AE target
- HDR 系统中 ColorChecker 灰阶值可能受 LTM 影响，单独 ColorChecker 不一定足以决定 AE target。
- 建议搭建 backlit black tunnel 或 bright background + black trap box 这类实验室 HDR 场景。
- AE target 应让场景各部分尽量同时满足最小过曝和最小欠曝，而不是只追求平均亮度好看。

## Phase Three：全场景 fine tuning

### 实验室场景
- 在高照度 3000+ lux、中照度 100–3000 lux、低照度 0–100 lux 下拍摄多组图像。
- 场景应覆盖 charts、objects、textures、colors，并继续使用 Phase Two 的 Imatest / ROI 均值方法评估。
- 每个 lux 点如果 AE 已满足规格，不需要强行做 modulation；只对超出目标范围的场景调整。

### 低照 detail / noise 平衡
- 若应用要求低照下保留更多客观细节，可额外做低 lux tuning。
- 原文建议先把照度降到 0 lux，并限制最大 gain 得到最暗图；再升到 5 lux，调整 max gain 模拟人眼观感；重复直到 detail 与 noise 平衡满足客户偏好。
- 某些应用可接受比人眼更亮的低照曝光以保留细节，但完成后必须回到 1500 lux 验证 AE 未受影响。

### 真实场景
- 实验室调完后，需要在真实使用场景中验证，包括不同天气、光照、颜色和纹理。
- 建议每个场景同时用参考相机拍摄，参考设备可作为最低可接受质量基线。
- 若真实场景出现曝光差、噪声过大或主观亮度不佳，再回调前述 AE 参数。

## 收敛、分区与帧率

### Dynamic Range vs Noise
- 如果图像仍然偏噪，可适当提高 AE target，让动态范围向 clipping 方向移动，以换取更好的暗部信噪比。
- 如果动态范围优先，应保留高光余量，并通过 [[wiki/modules/GW5_LTM|GW5_LTM]] 补偿阴影亮度。

### AE convergence speed
- GW5 AE 使用 PID feedback control loop 控制收敛速度和稳定性。
- 测试方法：对准可快速改变亮度的 lightbox，在亮 / 暗之间快速切换并记录 AE settling time 与振荡。
- 调参顺序：
  1. 先调 `proportional_gain` 到目标收敛速度；增大通常加快收敛，减小会放慢。
  2. 若有振荡，再调 `derivative_gain` 改善；若仍无法改善，降低 `proportional_gain` 后重复。
  3. 不建议优先调 `integral_gain`；若前两步找不到稳定值，可能是 AE 控制环之外的问题。

### Frame rate switching
- 支持的配置可在低照时将帧率降半，以换取更长曝光或更好低照表现。
- 设置 `ae.frame_rate_switch_enable = 1` 启用，用 `ae.frame_rate_switch_thresh_ev` 设置切换 EV 阈值。
- 用 `ae.frame_rate_switch_thresh_hysteresis` 设置滞回，避免 EV 阈值附近来回切换。
- 设置 `ae.frame_rate_switch_enable = 0` 可关闭该功能。

### Zone weights
- AE 使用 per-zone stats 判断当前场景亮度。
- `ae.nodes_vertical` 和 `ae.nodes_horizontal` 决定统计分区数量，zone 大小由 ISP 输入分辨率决定且等间隔分布。
- `ae.zone_weight` 决定每个 zone 的统计权重，范围 0–15：0 表示忽略该 zone，15 表示最高权重。
- 所有 zone weight 都设为 0 会禁用统计收集，从而禁用 AE。

## 与其他模块的关系
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 和 [[wiki/modules/GW5_LSC|GW5_LSC]] 应在 Phase Two AE 主调前完成，否则 AE 统计会受暗场和镜头阴影影响。
- AE target 应先与 [[wiki/modules/GW5_Gamma|GW5_Gamma]] 调成一致的亮度基线，再进入 [[wiki/modules/GW5_LTM|GW5_LTM]] 主调试。
- 如果 RAW 或线性输入本身曝光落点不对，优先处理 AE，而不是直接用 LTM 或 Gamma 补救。
- [[wiki/modules/GW5_AFD|GW5_AFD]] 通常在其他模块定稿后调试，但最终会通过电源频率判断影响曝光时间约束。

## 常见问题入口
- 整体过亮 / 过暗：先检查 `target`、曝光上下限、gain 上下限和 `zone_weight`。
- 高光过曝：先确认 AE 是否已经给高光留出余量，再查 LTM 的 `white_level`、strength 和高光 LUT。
- 暗部噪声大：检查 AE 是否进入高 gain，再评估 LTM 暗部增强和 NR。
- 收敛慢或振荡：检查 PID 参数、`dead_band`、`quick_converge_threshold` 和场景亮度切换条件。
- 频闪条纹：最后阶段联查 AFD 与曝光时间是否覆盖照明电源周期。

## 相关页面
- [[wiki/platforms/GW5|GW5]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/modules/GW5_AFD|GW5_AFD]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]
- [[wiki/modules/GW5_Gamma|GW5_Gamma]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/闪烁|闪烁]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]

