# SC360AT_AWB

SC360AT AWB 模块包含 AWB Calibration、AWB 调试和 AWB_WP_WEIGHT，用于完成白点标定、白点识别、色温权重、偏色微调和曝光状态下的白点权重自适应。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：AWB / AWB Calibration / AWB_WP_WEIGHT
- 场景：白平衡标定、白点识别、白点权重、低照偏色、绿色误识别、曝光联动白点权重
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- AWB Calibration 用于新镜头 / 新模组的白平衡标定，生成 B / R gain 范围、参考增益和高 / 中 / 低色温白点区间。
- AWB 调试用于预览白平衡效果、读取当前 B/R Gain、标记白点、设置 AWB 速度、白点权重和偏色补偿。
- AWB_WP_WEIGHT 根据 HCG 曝光时间 * gain 自动调整白点权重，提升不同曝光状态下的白平衡准确性。

## 关键参数和功能
### AWB Calibration Step1
- `Calibration`：打开标定功能。
- `Calibration_Step1 Enable`：使能 Step1。
- 色温勾选：选择参与标定的光源。
- `Read`：读取当前色温白平衡值。
- `Calculate`：根据选中色温计算蓝色 / 红色增益范围和参考增益。
- `Write`：写入对应寄存器。

### AWB Calibration Step2
- `Calibration_Step2 Enable`：使能 Step2。
- `Read`：读取当前色温 RGB 值，并计算 B/G、R/G、(B+R)/G。
- `Flag`：按高 / 中 / 低色温分类；常见 D65 为高色温，TL84 / CWF 为中色温，A / U30 / HZ 为低色温。
- `Calculate`：生成高 / 中 / 低 / 超高色温标定区间。
- `Single Side`：单独修改 B/G、R/G、(B+R)/G 某条边界。
- `Abandon White Point`：剔除大面积绿色误识别为白点。
- `Extra`：将 ROI 分成 8x8 区域，勾选纳入白点统计区域。

### AWB 调试
- `Debug`：预览白平衡效果。
- `Read`：读出当前 B/R Gain。
- `Check_White_Pixel`：标记各色温下识别到的白点。
- `Speed/Max Speed`：设置 AWB 速度和最大速度。
- `Auto BGain Max`：限制蓝色增益最大值。
- `Auto White Pixel Ratio`：设置各色温白点权重，值越大权重越低。
- `Color_Bias_Setting`：设置各色温下白平衡偏色。
- `ROI`：设置白平衡目标区域。

### AWB_WP_WEIGHT
- `Enable`：开启曝光联动白点权重。
- `CurExpo`：当前 HCG 曝光。
- `CurWeightH/M/L`：当前高 / 中 / 低色温权重。
- `ExpoNode`：曝光节点。
- `BaseH_1/2`、`BaseM_1/2`、`BaseL_1/2`：两个曝光节点对应高 / 中 / 低色温权重基准。

## 调试视角
SC360AT AWB 的效果来自标定区间、白点识别、白点权重、速度、ROI 和曝光联动权重共同作用。

- Step1 决定 B / R gain 的基本范围，如果范围过窄，极端色温下容易无法收敛；范围过宽，则误白点更容易把画面拉偏。
- Step2 的 B/G、R/G、(B+R)/G 区间需要有合理 margin 和交汇，高色温要考虑室外高色温，低色温要考虑路灯。
- `Check_White_Pixel` 是判断 AWB 是否可信的关键：如果白点标记已经错了，不应直接用 Color_Bias_Setting 强行补色。
- `Auto White Pixel Ratio` 值越大权重越低，可用来降低某些色温白点对混合光判断的影响。
- `Abandon White Point` 适合处理大面积绿色被误识别为白点，但过强可能误伤真实偏绿光源或场景。
- AWB_WP_WEIGHT 用曝光状态切换白点权重，可改善不同亮度 / HDR 状态下白平衡漂移，但节点切换不平滑会导致跳色。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 白平衡更准 | 重新做 Step1 / Step2 标定，检查白点标记 | 中性色更可靠 | 标定耗时，需稳定灯箱 |
| 减少绿色误判 | 开启 Abandon White Point，调整 ROI | 绿植 / 草地误判减少 | 真实绿光源适应性下降 |
| 混合光更稳 | 调各色温 White Pixel Ratio 和权重 | 减少来回跳色 | 色温适应速度或准确性下降 |
| 低照 / 长曝光更稳 | 配 AWB_WP_WEIGHT 曝光节点权重 | 曝光变化时色温更稳定 | 节点不平滑会跳色 |
| 主观偏好色 | 少量调 Color_Bias_Setting | 风格更符合需求 | 掩盖标定问题会导致跨场景偏色 |

## 调试步骤
1. 新镜头先确认遮光正确，防止漏光。
2. Step1：选择参与标定色温，逐个调灯箱亮度，避免过曝，读取白平衡值并计算 B / R gain 范围。
3. Step2：读取 RGB，按高 / 中 / 低色温分类，计算 B/G、R/G、(B+R)/G 区间并加合理 margin。
4. 打开 AWB Debug 和 Check_White_Pixel，确认白点识别是否落在真实中性区域。
5. 根据混合光、室外、低照等场景调整白点权重和 ROI。
6. 如需随曝光状态调整白点权重，开启 AWB_WP_WEIGHT 并调曝光节点和 H/M/L 权重。

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：重点检查 AWB 标定区间、白点标记、ROI、Color_Bias_Setting。
- [[wiki/issues/肤色不准|肤色不准]]：重点检查色温分类、白点权重和 CCM。
- [[wiki/issues/颜色不自然|颜色不自然]]：联查 CCM、Saturation、CAC 和 HDR Tonemapping。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.3 自动白平衡；1.14 AWB_WP_WEIGHT。
