# GW5_PFC

GW5 Purple Fringe Correction（PFC）模块整理，用于记录 GEO GW5 ISP 紫边检测 mask、径向约束和去饱和修正流程。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Purple Fringe Correction / PFC
- 场景：高反差边缘紫边、蓝紫色边缘、镜头色差、ColorChecker 保护、边缘去饱和
- 适用范围：指定平台

## 模块作用
- PFC 用于修正高反差边缘周围的 purple / blue hue，即常见紫边。
- 模块通过 hue、saturation、luma、SAD edge detection、radial position 等 mask 定位紫边区域，再对这些区域去饱和。
- 调试目标是让紫边区域 mask 尽量亮，非紫边区域尽量暗，避免影响正常颜色块。

## 调试阶段
- Phase One：不调。
- Phase Two：在实验室主调多数场景。
- Phase Three：通常不调，除非依赖模块变化或实际场景表现不佳。

## 前置条件
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
- 调 PFC 时禁用 [[wiki/modules/GW5_LTM|GW5_LTM]]。
- [[wiki/modules/GW5_DPC|GW5_DPC]] 已调定。
- [[wiki/modules/GW5_GE|GW5_GE]] 已调定。
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 已调定。

## 关键参数
- `pfc.enable`：PFC 开关。
- `pfc.debug_sel`：mask debug 输出选择。
- `pfc.use_color_corrected_rgb`：是否用内部 CCM 后数据生成 mask；推荐 1。
- `pfc.off_center_mult`：radial distance multiplier。
- `pfc.shading_lut`：radial mask LUT。
- `pfc.purple_strength`：final mask multiplier。
- `pfc.saturation_strength`：修正后紫边饱和度，0 为完全去饱和，255 为不影响。
- `pfc.hue_strength` / `sat_strength` / `luma_strength`：各 mask 强度。
- `pfc.*_slope` / `*_thresh` / `*_offset`：各线性阈值函数的斜率、阈值和 offset。

## Debug mask
- `debug_sel = 1`：radial mask。
- `debug_sel = 2`：SAD / edge detection mask。
- `debug_sel = 3`：hue mask。
- `debug_sel = 4`：saturation mask。
- `debug_sel = 5`：luma mask。
- `debug_sel = 6`：final combined PF mask。

## 调试流程
1. 使用含高反差边缘和 ColorChecker 的场景，最好模拟白天室外物体剪影对天空的紫边条件。
2. 调 hue mask：`debug_sel=3`，调整 hue low/high thresh 和 slope，使 purple / blue fringe 被包含，其他区域尽量排除。
3. 设置 `pfc.use_color_corrected_rgb=1` 通常更推荐；该设置只影响 mask 生成，mask 应用对象仍是未校正图像。
4. 调 saturation mask：`debug_sel=4`，选择中高饱和区域，必要时用 high limiter 排除高饱和非紫边像素。
5. 调 luma mask：`debug_sel=5`，分别覆盖边缘暗侧和亮侧的紫边亮度范围。
6. 调 SAD mask：`debug_sel=2`，让紫边边缘为白，同时 ColorChecker 等正常边缘尽量变细。
7. 调 radial mask：`debug_sel=1`，用 `off_center_mult` 和 `shading_lut` 限制远离中心的区域更强修正，因为紫边通常在边缘更明显。
8. 调 final mask：`debug_sel=6`，用 `hsl_thresh` 和 `purple_strength` 做最终紫边区域控制。
9. 调 desaturation：设置 `pfc.saturation_strength`，0 表示完全去饱和紫边，255 表示无效果。

## 调试风险
- mask 过宽会误伤 ColorChecker、天空、蓝色物体或正常高饱和边缘。
- 去饱和过强会在边缘产生灰边或颜色不连续。
- 调 PFC 时要求 LTM disabled，否则局部亮度和边缘状态变化会影响 mask 判断。
- 如果 Demosaic / CCM 后续变化，PFC mask 可能需要重新验证。

## 相关页面
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/颜色不自然|颜色不自然]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
