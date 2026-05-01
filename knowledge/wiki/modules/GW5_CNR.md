# GW5_CNR

GW5 Color Noise Reduction（CNR）模块整理，用于记录 GEO GW5 ISP 色噪抑制、YUV chroma mask 调试和 gain 相关强度调制。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Color Noise Reduction / CNR
- 场景：低照色噪、色块、chroma blotches、色彩边缘保护、gain 分段降色噪
- 适用范围：指定平台

## 模块作用
- CNR 用于抑制 YUV 空间中的 chroma noise，典型表现是错误颜色斑块或彩色噪声团。
- 处理方式是将每个像素 chromaticity 与估计出的局部 chroma mean 做 alpha blending。
- CNR 主要在 Phase Two 调主参数，在 Phase Three 根据 gain 补 `uv_delta12_slope_lut`。

## 前置条件
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
- [[wiki/modules/GW5_Color|GW5_Color]] / CCM 已调定。
- [[wiki/modules/GW5_DPC|GW5_DPC]] 已调定。
- [[wiki/modules/GW5_SNR|GW5_SNR]] 已调定。
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 已调定。
- [[wiki/modules/GW5_GE|GW5_GE]] 已调定。
- 调试开始时 `color_noise_reduction.enable = 0`。

## 关键参数
### 全局参数
- `color_noise_reduction.enable`：CNR 开关。
- `color_noise_reduction.[u/v]_center`：U / V 平面中心点。
- `color_noise_reduction.effective_kernel`：水平 Gaussian filter 长度。
- `color_noise_reduction.global_offset`：`uv_seg1` mask 最大值。
- `color_noise_reduction.global_slope`：`uv_seg1` mask 最小值。
- `color_noise_reduction.debug`：选择可视化 mask。

### Mask 参数
- `uv_seg1_offset` / `uv_seg1_slope`：区分高饱和与低饱和区域。
- `[u/v]mean[1/2]_offset` / `[u/v]mean[1/2]_slope`：局部 chroma mean 的边缘保护。
- `uv_var[1/2]_offset` / `uv_var[1/2]_slope` / `uv_var[1/2]_scale`：像素 chroma 与局部 mean 差异。
- `uv_delta[1/2]_offset` / `uv_delta[1/2]_slope`：决定哪些像素被修正以及修正强度。
- `delta_factor`：color bleeding 修正。

## Debug mask
- `debug = 2`：`uv_seg1`，像素饱和度 mask。
- `debug = 4/5/6/7`：`umean1/vmean1/umean2/vmean2`，局部 chromaticity mean。
- `debug = 8/9`：`uv_var1/uv_var2`，像素 chroma 与 local mean 差异。
- `debug = 12/13`：`uv_delta1/uv_delta2`，chroma blending alpha。

## 调试流程
1. 使用含 ColorChecker 和多种纹理的测试场景，在低 D65 照度下调试，例如 10 lux，使色噪容易被观察。
2. 先调 `uv_seg1`，让 ColorChecker 部分彩色块变暗，同时中性区域的色噪不在 mask 中明显可见。
3. 调 `[u/v]mean[1/2]` mask，目标是去掉色噪斑块，同时保留 ColorChecker 色块边缘。
4. `uv_var` 通常按推荐初值设置，主要确认 mask 表现是否合理。
5. 调 `uv_delta1/2_offset`，让 ColorChecker 仅部分边缘显示在 mask 中。
6. 回到正常图像输出，若出现邻近区域染色或去饱和，增加 `delta_factor` 抑制 color bleeding。
7. 将 `uv_delta1/2_slope` 从 0 开始增加，直到色噪开始消失；过高会在色块边缘引入 false color。
8. 将当前 gain 下调好的 slope 写入 `color_noise_reduction.uv_delta12_slope_lut`。
9. Phase Three 在不同 gain / lux 下重复第 7 步，补齐全 gain 范围 LUT。

## 调试风险
- CNR 过强会造成 color bleeding、局部去饱和或边缘假色。
- 不能只看色噪是否消失，还要看 ColorChecker 边缘、纹理和彩色细节是否被污染。
- CNR 应在 SNR、Demosaic、GE 等模块稳定后调，否则 mask 依据会变化。

## 相关页面
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/颜色不自然|颜色不自然]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
