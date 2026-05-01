# GW5_LTM

GW5 Local Tone Mapping（LTM）模块整理，用于记录 GEO GW5 ISP 中局部动态范围压缩、暗部抬升、高光压缩和场景自适应曲线的调试方法。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Local Tone Mapping / LTM
- 场景：HDR、高动态范围压缩、暗部细节恢复、高光层次保留、局部对比度调整、低照噪声控制
- 适用范围：指定平台

## 模块作用
- LTM 用于对输入图像做动态范围压缩或 tone mapping，把 sensor 响应映射到更接近人眼观感的显示范围。
- 在 HDR 或高动态场景中，LTM 重点用于恢复暗部细节、保留高光对比，并维持局部颜色、锐度和对比度。
- GW5 的 LTM 是 space-variant / pixel-by-pixel 自适应处理，会根据每个像素周围区域内容生成不同的有效 tone curve。

## 调试阶段
- Phase One：不做深入调试，只使用默认曲线保证高动态输入可视化；参数应限制为尽量接近 asymmetry curve，减少局部自适应影响。
- Phase Two：在实验室和多数代表性场景下完成主调试，通常应在黑电平、LSC、AWB、CCM、SNR、Gamma、AE target 基本完成后进行。
- Phase Three：按 EV / gain / 动态范围做全场景细调，重点处理低照噪声、强高光、高动态和场景切换过渡。

## Phase Two 前置条件
- Black level 已调定。
- Lens shading 已调定。
- [[wiki/modules/GW5_AWB|GW5_AWB]] 已调定。
- CCM revisited 已调定。
- Spatial noise reduction 已调定。
- LTM 已启用。
- Gamma 已结合 [[wiki/modules/GW5_AE|GW5_AE]] target 调定。
- AE target 应尽量最大化动态范围，同时避免过曝和欠曝。

## 关键参数
### 开关与基础范围
- `enable`：LTM 开关。
- `adaptive_enable`：启用自适应 LUT。
- `black_level`：低于该 20-bit 值的像素不受 LTM 影响；过高可能导致暗部非线性异常。
- `white_level`：高于该 20-bit 值的像素不受 LTM 影响；过低可能导致高光过暗，无法利用完整 ISP 数据范围。

### 强度与 ROI
- `strength_inroi`：ROI 内 LTM 强度，是控制 LTM 效果量的主参数之一。
- `strength_outroi`：ROI 外 LTM 强度。
- `roi_[hor/ver]_[start/end]`：调试时可用 ROI 定位局部效果；调完后通常让 ROI 覆盖全画面，使 `strength_inroi` 作用于整幅图。

### Asymmetry LUT
- `asymmetry_lut`：LTM 初始响应曲线，65 个点，20-bit 范围 0~1048575。
- asymmetry curve 是 LTM 的基础曲线，其他参数更多是在该曲线基础上做局部修改、限制或加权。
- 可在 GEO ISPTune 中手动画曲线，也可用 Matlab / Python 生成后写入 JSON。

### Dynamic Asymmetry LUT
- `dynamic_asymmetry_enable`：启用动态 response curve，根据 EV 阈值在低照和高光 LUT 之间切换。
- `dynamic_asymmetry_highlight_switch_ev` / `dynamic_asymmetry_lowlight_switch_ev`：高光 LUT 与低照 LUT 插值切换的 EV 边界。
- `dynamic_asymmetry_alpha_ev`：EV 切换的时域平滑，值越大过渡越平滑。
- `dynamic_asymmetry_highlight_lut` / `dynamic_asymmetry_lowlight_lut`：动态模式下的高光与低照 asymmetry LUT。
- `dynamic_asymmetry_lut_blend_auto_alpha`：自动生成 LUT 与手动 LUT 的混合比例，0 表示禁用自动动态 LUT，1 表示完全使用动态曲线。
- `dynamic_asymmetry_lut_temporal_alpha`：动态 LUT 切换时域平滑，需在快速亮度变化和过渡平滑之间取平衡。
- `dynamic_asymmetry_lut_hist_source`：动态 LUT 使用的直方图源，资料不推荐使用 Post-LTM histogram。

### Variance 参数
- `variance_intensity`：亮度域局部敏感度；值越小越局部，暗部和高光亮度越容易被独立调整；值越大越全局。
- `variance_space`：空间域局部敏感度；值越小局部细节对比更强，但更容易不自然；值越大越全局。
- 直观理解：`variance_intensity` 更偏控制区域亮度独立性，`variance_space` 更偏控制区域对比度独立性。

### Slope 限制
- `slope_min`：限制局部 tone curve 的斜率下降。值越大，越限制强负增益或高光区域过度压缩。
- `slope_max`：限制局部 tone curve 的斜率上升。值越小，越限制暗部强增益，降低噪声和 halo 风险。
- 高动态场景中，不限制 slope 可能增强细节，但也可能暴露噪声、制造 halo 或让云层等高光区域显得发暗。

### 全局增益
- `global_gain_enable`：启用 pre-LTM 全局数字增益。
- `global_gain_manual_gain`：pre-LTM 全局数字增益，通常不建议使用，只在需要辅助 AE 且不想影响 ISP 自适应 LUT 时考虑。

## 推荐调试流程
1. 初始将 `strength_inroi` 设到最大值 1023，以便观察 LTM 对图像的完整影响。
2. 先调整 `asymmetry_lut`，让全局暗部、中间调、高光达到基本平衡。
3. 用多类场景 RAW 和直方图确认 sensor 数据主要分布区域，避免只凭单一场景画面观感调曲线。
4. 再调整 `variance_intensity`、`variance_space`、`slope_min`、`slope_max`，控制局部自适应、噪声暴露和 halo。
5. 所有参数基本确定后，再回调 `strength_inroi` 到合适的亮度与对比度水平。
6. 确认高光附近没有 clip；必要时降低 strength 或调整 `white_level`。
7. 调完 LTM 后回看 Gamma，因为 LTM 会改变暗部、中间调和高光的最终观感。

## Dynamic Asymmetry LUT 调试流程
1. 先把 `dynamic_asymmetry_lut_blend_auto_alpha` 设为 0，手动调出可覆盖多数场景的 lowlight / highlight LUT。
2. 使用初始动态调整范围：dark adjustment low/high 可先设 0/128，bright adjustment low/high 可先设 128/255。
3. 调 `hist_sum_*`、`hist_bin_*`、`hist_longexp_bins_*`，定义 1024-bin histogram 中哪些区域代表暗部 shadows 与亮部 highlights。
4. 对动态 LUT 表现不佳的场景，调 `dynamic_asymmetry_lut_dark_adj_*` 和 `dynamic_asymmetry_lut_bright_adj_*`，限制暗部抬升或亮部对比增强的幅度。
5. 调 `dynamic_asymmetry_lut_blend_auto_alpha`，平衡手动 LUT 的稳定性与动态 LUT 对 corner case 的适应性。
6. 调 `dynamic_asymmetry_lut_temporal_alpha`，用移动场景和快速亮度变化场景验证切换速度与平滑性。

## Sample 参数思路
### 观察全局 tone mapping
- `strength_inroi = 1023`
- `slope_max = 64`
- `slope_min = 0`
- `variance_space = 15`
- `variance_intensity = 15`
- 该组合让局部自适应最小，便于先调 asymmetry LUT 的全局平衡。

### 增加局部自适应
- `slope_min = 64`
- `slope_max = 72`
- 逐步降低 `variance_space` 与 `variance_intensity`，同时检查 halo、噪声、暗部、中间调和高光是否自然。
- 暗部需要更多增益时可提高 `slope_max`，但会增加噪声可见性。
- 高光需要更多对比增强时可提高 `slope_min`，但要注意高光不自然或局部发暗。

## Phase Three 细调重点
- 亮场景或低 gain 场景可使用较大 LTM strength，因为场景通常有更多对比可压缩。
- 暗场景或高 gain 场景应降低 LTM strength，避免把噪声一起抬起来。
- 对噪声敏感的 sensor 或极暗场景，可更多依赖 asymmetry LUT 的全局效果，降低 `slope_max`、提高 `slope_min` 来限制局部 LTM。
- 低照可使用 `dynamic_asymmetry_lowlight_lut` 和 gain 对应的 `slope_min_lut` / `slope_max_lut` 做专门控制。

## 常见问题入口
- 暗部细节不够：检查 `asymmetry_lut` 暗部斜率、`strength_inroi`、`slope_max`、`variance_intensity`。
- 暗部噪声变大：降低 `strength_inroi` 或 `slope_max`，提高局部限制，并联查 NR。
- 高光过暗或层次怪：检查 `white_level`、`slope_min`、高光 LUT 和 Gamma。
- Halo / 局部不自然：提高 variance 参数或收紧 slope 限制。
- 场景切换突变：提高 EV 或 dynamic LUT temporal alpha，但过大可能导致响应变慢。

## 相关页面
- [[wiki/platforms/GW5|GW5]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/GEO_GW5_ISP_Tuning-LTM.pdf]]
- [[raw/GW5_ISP Tunning中英文.pdf]]

