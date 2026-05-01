# GW5_AWB

GW5 Auto White Balance（AWB）模块整理，用于记录 GEO GW5 ISP 中白平衡参数、AWB Mesh 标定、光源表、HSV 验证、EV-to-lux LUT、Night Mode，以及它与 CCM、LSC、AE 的前后级关系。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Auto White Balance / AWB
- 场景：白平衡标定、色温切换、Night Mode、偏色排查、CCM 前置条件
- 适用范围：指定平台

## 模块作用
- AWB 用于让中性区域的 R / G / B 输出接近一致，从而正确还原场景中的 neutral tones。
- GW5 AWB 主要通过 GEO Calibration Tool 的 AWB Mesh 标定 Planckian 光源曲线、extra white point 和 probability distribution。
- AWB 是 [[wiki/modules/GW5_Color|GW5_Color]] / CCM、颜色风格和后级亮度映射的前置条件之一；白平衡未稳定时，不应急于定稿 CCM 或主观颜色。

## 调试阶段
- Phase One：在实验室中使用 GEO Calibration Tool 标定 AWB 参数，覆盖尽可能多的基础光源。
- Phase Two：通常不主动调 AWB，除非其他模块变化导致 AWB 表现变差。
- Phase Three：在 AE、CCM 等模块完成后，结合真实场景、低照、混合光源和 Night Mode 细调。
- LTM Phase Two 前置条件中要求 AWB 已调定，因此 [[wiki/modules/GW5_LTM|GW5_LTM]] 之前应先确认 AWB 基线。

## 关键参数

### Firmware 参数
| 参数 | 作用 |
|---|---|
| `enable` | 启用 AWB。 |
| `adaptive_enable` | 启用 adaptive AWB。 |
| `evtolux_probability_enable` | 启用 / 禁用 lux probability；初始标定时 `evtolux_ev` 尚未生成，应先关闭。 |
| `pause` | 冻结并保持当前 white balance。 |
| `gain_location` | WB gain 位置：0 ISP，1 sensor。 |
| `dead_band_adaptive_enable` | 启用 white balance gains 的 adaptive dead band。 |
| `dead_band` | 手动模式下 white balance gains 的 dead band。 |
| `dead_band_lut` | adaptive mode 下 white balance gains 的 dead band LUT。 |

### Static calibration 参数
| 参数 | 作用 |
|---|---|
| `evtolux_ev` | EV 与 lux 转换 LUT 中的 EV 值。 |
| `evtolux_lux` | EV 与 lux 转换 LUT 中的 lux 值。 |
| `cwf_min_lux` | CWF 检测最小 lux。 |
| `cwf_max_lux` | CWF 检测最大 lux。 |
| `light_src` | extra light sources 坐标。 |
| `rg_pos` | 所有 light sources 的 R/G 坐标。 |
| `bg_pos` | 所有 light sources 的 B/G 坐标。 |
| `sky_lux_th` | 通过 lux threshold 判断天空；默认常设为约 10000。 |
| `wb_strength` | 检测到天空后施加的额外权重，用于改善主观质量。 |
| `color_temp` | Mired 表示的色温节点。 |
| `ct_rg_pos_calc` | 给定色温对应的 R/G 值。 |
| `ct_bg_pos_calc` | 给定色温对应的 B/G 值。 |
| `ct_65_pos` | D65 在 `color_temp` 中的节点位置。 |
| `ct_40_pos` | D40 在 `color_temp` 中的节点位置。 |
| `ct_30_pos` | D30 在 `color_temp` 中的节点位置。 |
| `warming_ls_a` | A 光源下 AWB warming calibration values。 |
| `warming_ls_d40` | D40 光源下 AWB warming calibration values。 |
| `warming_ls_d50` | D50 光源下 AWB warming calibration values。 |
| `warming_ls_d75` | D75 光源下 AWB warming calibration values。 |
| `lux_high_lut_min/max/step/lut` | 高 lux LUT 范围和表值。 |
| `lux_low_lut_min/max/step/lut` | 低 lux LUT 范围和表值。 |
| `mesh_rgbg_weight` | Planckian sources 的 Mesh RGBG weight。 |
| `mesh_ls_weight` | extra light sources 的 Mesh RGBG weight。 |
| `mesh_color_temperature` | Mesh color temperature。 |
| `rg_high_lut_min/max/step/lut` | RG high LUT 范围和表值。 |
| `rg_low_lut_min/max/step/lut` | RG low LUT 范围和表值。 |
| `bg_max` | BG gain clip value。 |
| `avg_coeff` | 时间滤波系数。 |
| `color_preference` | AWB color preference。 |
| `static_wb` | Static WB gains。 |
| `zone_weight` | AWB 分区权重。 |
| `nodes_vertical` | AWB stats 垂直方向 active zones 数量。 |
| `nodes_horizontal` | AWB stats 水平方向 active zones 数量。 |
| `black_level` | AWB 有效数据下限。 |
| `white_level` | AWB 有效数据上限。 |
| `Max_rg` / `Min_rg` | white region 的 RG 上下限。 |
| `Max_bg` / `Min_bg` | white region 的 BG 上下限。 |

- `color_temp`、`ct_rg_pos_calc`、`ct_bg_pos_calc`、`ct_65_pos`、`ct_40_pos`、`ct_30_pos` 协同工作，用于通过色温节点识别各光源色温，通常不需要人工调。

### Dynamic calibration 参数
| 参数 | 作用 |
|---|---|
| `manual_red_gain` | AWB 关闭时手动 red gain，4.8 fixed-point format。 |
| `manual_blue_gain` | AWB 关闭时手动 blue gain，4.8 fixed-point format。 |
| `color_temperature_alpha` | 色温滤波 alpha，范围 0.0 inclusive 到 1.0 exclusive；值越高滤波越强。 |

## Phase One：AWB Mesh 初始标定

### 前置条件
| 前置项 | 要求 |
|---|---|
| [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] | 已调定 |
| [[wiki/modules/GW5_LSC|GW5_LSC]] | 已调定 |
| [[wiki/modules/GW5_Color|GW5_Color]] / CCM | 已调定 |
| Manual exposure | -0.25 < exposure < 0.25 f-stop，可用 Imatest 验证；避免 ColorChecker patch 24 clipping，同时 patch 19 只允许最小高光 clipping。 |

### 光源覆盖范围
| Light Source | Approx. color temperature |
|---|---:|
| D75 + LEE 82C | 11900 K |
| 10K bulb | 10000 K |
| D75 + LEE 82A | 9050 K |
| D75 | 7500 K |
| D65M | 6500 K |
| D50M | 5000 K |
| D65P | 6500 K |
| D50P | 5000 K |
| CWF | 4150 K |
| D40 | 4000 K |
| TL84 | 4000 K |
| D30 | 3000 K |
| TL83 | 2800 K |
| A | 2800 K |
| Horizon (A dimmed) | 2600 K |
| A + LEE 81A | 2300 K |

- 目标是采集 2000K 到 12000K 范围内的 ColorChecker 图像。
- LEE filters 可放在镜头前模拟极端色温。
- D65P、D50P、CWF 属于 non-Planckian light sources；P / M 用于区分同名 D 系列灯泡的不同光谱特性。
- D65P 和 D50P 非必需，但有助于校正非典型光源。
- 采集时若可用 colorimeter 实测色温，AWB 曲线会更准确。

### AWB Mesh 步骤
1. 在不同色温下拍摄 ColorChecker。
2. 打开 GEO Calibration Tool 的 AWB 模块，选择 AWB Mesh。
3. 对 Planckian 光源图像逐张选择 “ADD: Planckian white point from image”，输入 Illuminant Name 与实测 Kelvin。
4. 工具会把点加入 AWB curve，并记录 `rg_pos` 与 `bg_pos`。
5. 对 non-Planckian 光源使用 “Add: Extra white point from image”；extra point 会记录在 `light_src`，格式为 `{X, Y}`。
6. 查看 3D probability distribution；若点之间权重下凹，可在 AWB 模块的 Light Source Inputs 中调整 Weight，让侧面 profile 更平滑。
7. 调整 `sky_lux_th` 与 `wb_strength`：当 lux 高于 `sky_lux_th` 时认为场景可能有天空，并用 `wb_strength` 增加权重改善主观效果。
8. 使用 “Verify AWB Mesh” 重新跑用于标定的图像，检查 marker 是否落在对应光源附近。
9. 若偏差较大，可调整 Light Source Inputs 中的 RG、BG、Weight、-Sigma、+Sigma，或手动增加 white point。
10. 每次修改后都要重新验证所有已用图像。
11. 标定通过后保存 calibration file，将输出 JSON 中的 AWB 数据 port 到 ISP JSON；更新 FW 后重新抓图并重复验证。

## AWB 验证

### 快速验证
- 在 GEO Calibration Tool 的 Verify AWB 流程中，点击 ColorChecker patch 21 查看 `[R, G, B]`。
- 理想状态为 R = G = B；实际允许约 ±5 pixel value 的通道差。
- 该方法适合快速检查，完整分析建议使用 Imatest。

### Imatest HSV 验证
- 使用 Imatest Colorcheck 分析 ColorChecker 图像。
- 重点取 patches 20–22 的 HSV 并求平均，用下表判断 AWB 质量。

| AWB Quality | 6500 K HSV | 4000 K HSV | 2700 K HSV |
|---|---:|---:|---:|
| Great | <0.0025 | <0.0035 | <0.0030 |
| Good | 0.025–0.050 | 0.035–0.060 | 0.030–0.065 |
| Fair | 0.050–0.100 | 0.060–0.110 | 0.065–0.160 |
| Poor | >0.100 | >0.110 | >0.160 |

### AWB 失败时先排查的模块
| 模块 | 可能原因 |
|---|---|
| [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] | 温度或 gain 导致 shift / uniformity error。 |
| Static white point | 设置错误。 |
| Frame stitching | WDR modes only artifacts。 |
| [[wiki/modules/GW5_Color|GW5_Color]] / CCM | CCM calibration 差。 |
| [[wiki/modules/GW5_LSC|GW5_LSC]] | Chroma shading artifacts。 |

- 判断 neutral / grey 区域偏色时，还要考虑 chroma noise，不要把所有色斑都归因于 AWB。

## Phase Three：EV-to-lux LUT 与真实场景细调

### 前置条件
| 前置项 | 要求 |
|---|---|
| Phase One prerequisites | 已完成 |
| [[wiki/modules/GW5_AE|GW5_AE]] | 已针对 all gains 调定 |
| [[wiki/modules/GW5_Color|GW5_Color]] / CCM | 已 revisit 并完全调定 |

### EV-to-lux LUT
1. 使用 light tile 填满 sensor 画面，照度范围需覆盖 100 到 25000 lux，并保证均匀照明。
2. 关键 lux 点包括 100、900、1000、10000 lux。
3. 在 100 到 25000 lux 范围内拍摄至少 18 张图，每张用 lux meter 记录实际 lux。
4. 抓图时从 ISPTune live stats 读取 EV。
5. 在 GEO Calibration Tool 的 AWB 模块中录入 EV / lux，可手动使用 `+Ev2Lux`，也可加载 5 列 `.dat` 表。
6. 所有 ISP mode 都需要输入值；未使用的 mode 可填 0。
7. 保存 ISP JSON 并加载到相机后，将 `evtolux_probability_enable` 设为 1。

### 真实场景细调
- Field testing 要覆盖多类场景和多种色温，并建议用参考相机同步拍摄。
- 若某类真实光源明显失败，且该 illuminant 未进入 AWB 计算，可在场景中放置 18% grey card，添加 extra light source point。
- 若统计点没有落在已标定 Planckian curve 上，或 curve 包含了不应参与计算的统计点，需要继续调整 AWB curve 并反复验证。

## AWB Night Mode

### 参数
| 参数 | 作用 |
|---|---|
| `night_mode_enable` | 启用 AWB night mode。 |
| `night_mode_highlight_switch_ev` | 开始切入 AWB night mode 的 EV 阈值。 |
| `night_mode_lowlight_switch_ev` | 完全切入 AWB night mode 的 EV 阈值。 |
| `night_mode_max_rg` | night mode 下 AWB stats 的 max RG。 |
| `night_mode_min_bg` | night mode 下 AWB stats 的 min BG。 |
| `night_mode_alpha_ev` | EV 滤波 alpha，用于平滑 night mode 进出；值越高滤波越强、切换越慢。 |

### 使用场景
- 车载夜间场景中，AWB stats 常因混合光源、窄谱光源和大面积无照明区域而不可靠。
- 典型干扰包括路灯、车灯、交通灯、钠灯、LED 大灯、夜空和无照明路边。
- Night Mode 会把 AWB 限制到更窄范围，降低夜间错误白点估计概率。
- 原文叙述中示例提到 `night_mode_max_rg` 和 `night_mode_max_bg` 限制 AWB 区域，但参数表列出的是 `night_mode_max_rg` 与 `night_mode_min_bg`；现场使用前应以当前 ISP JSON 字段为准。
- 建议只在其他 AWB tuning 完成后，且真实夜间场景确实需要时再启用 Night Mode。

## 与其他模块的关系
- [[wiki/modules/GW5_AE|GW5_AE]] 改变曝光与 gain 状态，低照高 gain 下 AWB 统计可靠性会下降。
- [[wiki/modules/GW5_LSC|GW5_LSC]] 若存在 chroma shading，会让 AWB 误判局部偏色。
- [[wiki/modules/GW5_Color|GW5_Color]] / CCM 若标定不良，会造成 AWB 看似失败但实际是颜色矩阵问题。
- [[wiki/modules/GW5_LTM|GW5_LTM]] 会改变暗部、高光和局部亮度观感，可能让偏色更容易被看见，但不应把白点估计错误归因给 LTM。

## 常见问题入口
- 白点区域正确但仍偏色：检查 CCM、saturation、LSC chroma shading 和 chroma noise，而不是只调 AWB。
- 低照偏色或色温跳变：检查 AWB Night Mode、EV-to-lux LUT、低照 gain 段和 `color_temperature_alpha`。
- 蓝天发黄或暖色物体发蓝：可能是场景颜色被误判为某个 light source，需谨慎调整对应点；删除光源点可能会让更多场景变差。
- HDR / WDR 局部偏色：先排查 frame stitching、AE / LTM 局部亮度差异，再判断 AWB 白点估计。

## 相关页面
- [[wiki/platforms/GW5|GW5]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/肤色不准|肤色不准]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]

