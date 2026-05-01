# GW5_DPC

GW5 Dynamic Defective Pixel Correction（DPC）模块整理，用于记录 GEO GW5 ISP 动态坏点检测、hot pixel 修正和 EV LUT 调试。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Dynamic Defective Pixel Correction / DPC
- 场景：hot pixel、动态坏点、低照亮点、分辨率损失、demosaic artifact 排查
- 适用范围：指定平台

## 模块作用
- Dynamic DPC 用邻域插值识别并修正 sensor defective pixels。
- 资料将缺陷像素分为 hot pixel、dead pixel、weak pixel；GW5 DPC 主要关注最明显的 hot pixel。
- DPC 可处理同一色彩平面的单点、双点和三点 hot pixel；四个及以上 cluster 通常会留下残差，应反馈 sensor 供应侧。

## 调试阶段
- Phase One：不调。
- Phase Two：实验室条件下完成所有场景 DPC 主调。
- Phase Three：通常不调，除非前期调试或依赖模块导致表现不佳；也可补齐 EV LUT。

## 关键参数
- `defect_pixel_correction.enable`：启用 Dynamic DPC。
- `adaptive_enable`：启用 adaptive dynamic DPC。
- `threshold`：DPC 强度控制。
- `slope`：原始图与修正图的 alpha blend。
- `dev_thresh`：边缘 false color 强度。
- `line_thresh`：replacement algorithm 的方向性。
- `blend`：方向性与非方向 replacement 值之间的 alpha blend。
- `show_defect_pixels`：显示被移除的 defect pixels。
- `sigma_in`：手动覆盖噪声估计。
- `thresh_short` / `thresh_long`：短 / 长曝光数据的噪声阈值。
- `threshold_lut` / `slope_lut`：随 EV 调制的 threshold 和 slope。

## 调试流程
1. 前置条件：[[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定，gain 设为最小。
2. 初始建议：`threshold=4095`、`slope=170`、`dev_thresh=2048`、`line_thresh=0`、`sigma_in=0`、`blend=0`。
3. 对准 studio scene，等待 AE 收敛后切到手动曝光。
4. 设 `defect_pixel_correction.enable=1`，在 `threshold` 最大时 hot pixel 应可见。
5. 逐步降低 `threshold`，直到 hot pixel 被移除，同时确认没有 aliasing 或高频过度模糊。
6. 如果 `threshold` 无法去除 defect pixels 或效果不明显，将 `slope` 按 10% 增量提高，再把 `threshold` 重置为 4095 重复调试。
7. 当前 EV 达标后，写入 `threshold_lut` 和 `slope_lut`。
8. Phase Three 在其余 EV 下重复流程，补齐 LUT。

## 调试风险
- `slope` 过高会降低分辨率。
- DPC 可能引入 demosaic artifact；若 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 调试时出现 artifact，可临时关闭 DPC 判断来源。
- cluster hot pixels 不应只靠 ISP 硬压，严重时应回到 sensor 品质判断。

## 相关页面
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/假边|假边]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
