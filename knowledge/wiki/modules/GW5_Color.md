# GW5_Color

GW5 Color / CCM & Saturation 模块整理，用于记录 GEO GW5 ISP 色彩校正矩阵、色温插值、饱和度调制和 ColorChecker 标定流程。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Color / CCM / Saturation
- 场景：ColorChecker 标定、色准、肤色、记忆色、低照降饱和、色温动态插值
- 适用范围：指定平台

## 模块作用
- CCM 用于把当前 RGB chroma 映射到目标标准色彩空间，核心目标是修正 ColorChecker 色块误差。
- GEO 工具允许在 CCM 标定时调整整体 hue 和 saturation；实际项目中常需根据应用目标偏离纯标准色。
- FW 会根据 AWB 估计的色温，在 low / medium / high / extended CCM 之间动态选择或插值。

## 关键参数
- `color.enable`：启用 CCM 与 Saturation。
- `color.adaptive_ccm_enable`：启用 adaptive CCM。
- `color.ccm_manual_select`：选择手动 CCM。
- `color.adaptive_saturation_enable`：启用 adaptive saturation。
- `color.saturation_strength_strength`：关闭 adaptive saturation 时的固定饱和度强度。
- `color.ccm_low/medium/high/extended`：不同色温下的 CCM。
- `color.ccm_*_color_temp`：各 CCM 对应色温。
- `color.saturation_strength_lut`：adaptive saturation 下随 EV 变化的饱和度 LUT。

## Phase One 初始 CCM
- 前置条件：Black level、Lens shading、Initial Gamma 已调定。
- 手动曝光误差要求：`-0.25 < exposure < 0.25 f-stops`；ColorChecker patch 24 避免 clipping，patch 19 只允许最小高光 clipping。
- 分别在 D65、D50、A 光源下均匀照亮 ColorChecker 并抓 RAW。
- GEO Calibration Tool 中设置 ISP Gamma 与目标色彩空间，推荐 target colorspace 使用 sRGB。
- D65 / D50 / A 分别作为 high / medium / low color temperature 输入。
- 常用 Target Saturation 可参考 high / medium / low 分别 110 / 105 / 100，通常 100~120 可接受。

## Phase Two 精调 CCM
- 前置条件：Phase One 条件完成，[[wiki/modules/GW5_AWB|GW5_AWB]] 已调定，AE 曝光误差在 `-0.25~0.25 f-stops`。
- 先用 Imatest Colorcheck 验证每组 ColorChecker 图的 exposure error，优先控制在 `-0.25~0`。
- 曝光不满足时应调整 [[wiki/modules/GW5_AE|GW5_AE]] target 后重新抓图。
- Phase Two 使用 RGB 图输入 Calibration Tool，而不是 Phase One 的 RAW 图。
- 若 Gamma 已从默认 Rec.709 修改，需要把对应 Gamma 文件加载进 ISP Gamma 选项。

## Phase Three 饱和度调制
- `color.adaptive_saturation_enable = 1` 后，通过 `color.saturation_strength_lut` 按 EV 控制饱和度。
- 亮场低 EV、噪声少时，可把饱和度提高到约 120%，增强蓝天、草地等主观观感。
- 中间 EV 可接近 100%。
- 高 EV / 低照高 gain 时，为避免 chroma noise，可降低到约 90%。
- 调整饱和度后需用 Imatest 同时检查 Exposure error 和 Mean chroma，因为饱和度变化可能影响曝光统计。

## 调试风险
- ΔE 或 ΔC 数值更小不一定代表主观色彩更好，可能牺牲少数关键色块。
- 若 Target Saturation 怎么调都不达标，优先怀疑图像采集曝光或光源条件。
- 低照饱和度过高会放大色噪；过低会造成画面发灰、颜色不自然。
- Gamma 或 AWB 后续变化后，需要重新评估 CCM。

## 相关页面
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_Gamma|GW5_Gamma]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/肤色不准|肤色不准]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
