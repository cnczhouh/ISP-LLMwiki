# SC360AT_AE

SC360AT AE 模块用于控制四帧 HDR 场景下的曝光、增益、目标亮度、ROI 和 flicker 抑制，是 HDR 动态范围、噪声和运动观感的基础。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：AE / Auto Exposure / FAD
- 场景：四帧 HDR 曝光、HCG / VS 曝光控制、AE target、ROI、抗闪烁、曝光稳定性
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- SC360AT 共四帧合成，Mean 区域可读出 HCG、LCG、S、VS 四帧统计亮度和 AE 使用帧统计亮度。
- HCG / LCG / S 三帧使用相同曝光，实际曝光调节主要调 HCG 和 VS 曝光。
- AE 模块包含 Normal、Extra、FAD 三类入口，分别用于曝光增益、8x8 ROI 权重和 flicker 抑制。

## 关键参数
### Mean 和输出分支
- `L_Exp.Mean`：HCG 帧统计亮度。
- `M_Exp.Mean`：LCG 帧统计亮度。
- `S_Exp.Mean`：S 帧统计亮度。
- `VS_Exp.Mean`：VS 帧统计亮度。
- `USE_Exp.Mean`：AE 使用帧统计亮度。
- `HDROutputFormat`：选择 Combine、Long_exp、Medium_exp、Short_exp、VS 输出，用于查看不同曝光分支。

### 曝光和增益
- `ExpTime Type`：自动曝光 / 手动曝光。
- HCG / VS 曝光：手动模式调具体曝光行数，自动模式调最大 / 最小曝光行数。
- `AnalogGain Type`：自动增益 / 手动增益。
- HCG / LCG / S / VS 模拟增益：`0x40` 表示 1 倍。
- `L/M`、`M/S`、`S/VS`：当前曝光比或增益比。

### AE 目标和稳定
- `AETarget1~4`：亮度目标值。
- `AETargetThre1~4`：目标亮度切换阈值区间。
- `Exp_Gain.C`：当前曝光增益值，用于 AE target 插值判断。
- `AESpeedFM`：Fast Mode 调节步宽，亮度与 target 差距大时使用。
- `AESpeedSM`：Slow Mode 调节步宽，亮度接近 target 时使用。
- `AETolerance1`：进入 AE 稳定区间阈值。
- `AETolerance2`：离开 AE 稳定区间阈值。

### ROI 和 FAD
- `ShowROI`：设置 AE 参考区域的 right、top、width、height。
- `Extra`：将 ROI 分成 8x8 小矩阵，权重 0~3，值越大权重越高。
- `HCG_Band_Enable`：HCG 帧 banding 抑制开关。
- `NonCDS_Band_Enable`：VS 帧 banding 抑制开关。
- `Band_0/Band_1`：对应 50 / 60Hz flicker 预设曝光。

## 调试视角
SC360AT AE 的关键不是只让 Combine 亮度到 target，而是同时保证四帧曝光关系、HDR 动态范围、噪声、抗闪和控制权一致。

- 曝光值会影响 line buffer、输出帧率、HDR 动态范围和信噪比，量产阶段不建议随意修改，只建议调试定位时临时使用。
- HCG / LCG / S 使用相同曝光，因此中短帧亮度问题不能简单理解为三段曝光都可独立调，应优先看增益比、HDR Combine 和 Tonemapping。
- HCG 曝光增加会提升暗部 SNR，但可能压缩高光空间并增加运动模糊；VS 曝光关系影响极高光和爆闪灯区域表现。
- `AESpeedFM/SM` 太大容易震荡或亮度跳变，太小则明暗切换响应慢。
- `AETolerance1/2` 的进出稳定区设计影响呼吸感：进区太窄容易来回调整，出区太宽则变化迟钝。
- ROI 权重会改变 AE 对局部主体和背景高光的取舍，车载场景不要只按全局平均亮度调。
- 启用 ISPC_HDR 的 AE_Target 后，本模块 AE_Target 会失效，显示为 ISPC 插值结果。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 暗部更亮更干净 | 提高曝光上限或 target | 暗部亮度和 SNR 改善 | 高光空间减少、运动模糊增加 |
| 高光更稳 | 降低 target 或保守 HCG 曝光 | 车灯、天空、爆闪灯更不易爆 | 暗部和主体偏暗 |
| AE 更稳定 | 放宽 tolerance，降低调节速度 | 减少呼吸和震荡 | 进出隧道响应变慢 |
| 主体曝光优先 | 调 ROI 和 8x8 权重 | 关键区域亮度更准 | 背景高光或暗部可能牺牲 |
| 抑制 flicker | 配置 HCG banding 和 50/60Hz 预设曝光 | 室内光源闪烁下降 | 曝光自由度降低，VS 不支持抑制 |

## 调试步骤
1. 先看 HCG、LCG、S、VS 和 AE 使用帧 Mean，确认 AE 使用的统计分支。
2. 用 `HDROutputFormat` 分别查看 Combine、Long、Medium、Short、VS，判断问题来自哪一帧。
3. 固定或限制曝光和增益范围，确认 HDR 动态范围、帧率和噪声符合要求。
4. 配置 AETarget、阈值区间、Fast / Slow speed 和 tolerance。
5. 配置 ShowROI 和 8x8 ROI 权重，使 AE 关注项目真实关键区域。
6. 根据光源环境打开 HCG banding 抑制，确认 50 / 60Hz flicker 是否改善。
7. 若启用 ISPC_HDR，确认 AE_Target 是否已由 ISPC 接管。

## 常见问题入口
- [[wiki/issues/曝光不稳|曝光不稳]]：重点检查 speed、tolerance、ROI、ISPC_HDR AE_Target 控制权。
- [[wiki/issues/闪烁|闪烁]]：重点检查 FAD、banding 预设曝光和 HCG / VS 支持差异。
- [[wiki/issues/高光过曝|高光过曝]]：重点检查 target、HCG / VS 曝光关系和 HDR Combine。
- [[wiki/issues/噪声大|噪声大]]：重点检查增益范围和低照 target 是否过高。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.2 自动曝光。
