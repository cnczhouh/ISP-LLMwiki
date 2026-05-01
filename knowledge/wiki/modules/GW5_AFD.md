# GW5_AFD

GW5 Auto Flicker Detection（AFD）模块整理，用于记录 GEO GW5 ISP 自动频闪检测、50/60Hz 阈值和区域配置方法。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Auto Flicker Detection / AFD
- 场景：交流电频闪、rolling bands、50Hz / 60Hz 电源频率检测、曝光时间约束
- 适用范围：指定平台

## 模块作用
- AFD 用于检测交流电照明引起的 rolling bands 频闪，并通过设置足够长的曝光时间覆盖照明电源周期来缓解该现象。
- AFD 是 GW5 调试流程中的最终模块之一，应在其他模块调定后再调。

## 关键参数
- `afd.enable`：AFD 开关。
- `afd.xpos1/ypos1/width1`、`afd.xpos2/ypos2/width2`：两个检测区域在 32x32 zone 坐标中的位置和宽度。
- `afd.area_power_threshold`：频率峰值附近功率占频谱总功率比例，主要用于 50Hz 检测。
- `afd.peak_average_ratio_threshold`：频率峰值功率幅度与频谱平均功率幅度比值，主要用于 50Hz 检测。
- `afd.area_power_threshold_different_peak` / `peak_average_ratio_threshold_different_peak`：主要用于 60Hz 检测。
- `afd.area_power_threshold_inverse_detection` / `peak_average_ratio_threshold_inverse_detection`：用于 50Hz 与 60Hz 反向检测。
- `afd.detection_threshold_50Hz` / `afd.detection_threshold_60Hz`：50Hz / 60Hz 检测阈值。
- `afd.sets_min_exposure`：允许 AFD 设置最小曝光时间。

## 关键参数默认值
| 参数 | 默认值 | 调试含义 |
|---|---:|---|
| `afd.enable` | 0 | AFD 开关，默认关闭 |
| `afd.xpos1` / `afd.ypos1` / `afd.width1` | 0 / 8 / 32 | 区域 1 的起点与宽度 |
| `afd.xpos2` / `afd.ypos2` / `afd.width2` | 0 / 16 / 32 | 区域 2 的起点与宽度 |
| `afd.area_power_threshold` | 0.8 | 50Hz 检测用，频率峰值附近功率占频谱总功率比例 |
| `afd.peak_average_ratio_threshold` | 8 | 50Hz 检测用，峰值功率幅度与平均功率幅度比值 |
| `afd.area_power_threshold_different_peak` | 0.4 | 60Hz 检测用，不同频率峰值附近功率比例 |
| `afd.peak_average_ratio_threshold_different_peak` | 4 | 60Hz 检测用，不同频率峰值功率幅度比值 |
| `afd.area_power_threshold_inverse_detection` | 0.3 | 50Hz / 60Hz 反向检测用功率比例 |
| `afd.peak_average_ratio_threshold_inverse_detection` | 3 | 50Hz / 60Hz 反向检测用峰值比 |
| `afd.detection_threshold_50Hz` | 0.8 | 50Hz 检测阈值 |
| `afd.detection_threshold_60Hz` | 0.97 | 60Hz 检测阈值，低于 0.8 可能振荡 |
| `afd.sets_min_exposure` | 1 | 允许 AFD 设置最小曝光时间 |

## 区域配置
- 检测区域默认覆盖两条水平行：区域 1 为 y=8、宽度 32；区域 2 为 y=16、宽度 32。
- 图像被划分为 32x32 grid。
- 检测区域应选择运动最小的水平行，资料建议选择包含 vanishing point 的水平 row。
- 区域选择不当会让运动影响频谱判断，导致频闪检测不稳定。

## 调试方法
1. 确认其他 ISP 模块已调定。
2. 若默认值无法检测 50Hz，画面仍有可见频闪，逐步降低：
   - `afd.area_power_threshold`
   - `afd.peak_average_ratio_threshold`
   - `afd.detection_threshold_50Hz`
3. 直到画面频闪不可见。
4. AFD 检测到 50Hz 并调整 integration time 后，切回 60Hz 可能需要时间。
5. 若要帮助算法检测 60Hz，可使用强光源让 sensor integration time 低于 8.33ms。

## 调试风险
- `detection_threshold_60Hz` 过低，例如低于 0.8，可能造成 oscillation。
- AFD 不应过早调，否则曝光策略还没稳定，频闪判断和最小曝光设置会反复变化。
- AFD 影响的是曝光约束，频闪问题也需要联查 [[wiki/modules/GW5_AE|GW5_AE]]。

## 相关页面
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/issues/闪烁|闪烁]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]：AFD 章节，包含自动频闪检测概述、关键 ISP JSON 参数、默认值、区域配置和调试建议

