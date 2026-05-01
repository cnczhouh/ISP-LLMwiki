# FH833X_CE_LC

FH833X CE 和 LC 是色彩增强 / 局部色调调整相关辅助模块：CE 主要做全局饱和度增强和抑制，LC 可对最多三种指定色调做局部饱和度调整。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：CE / Local Chroma
- 场景：饱和度增强、过饱和抑制、局部颜色微调、白色抑制、低照饱和度控制
- 适用范围：指定平台

## CE 作用
- CE 是色彩增强调整模块，用于色度调整、饱和度增强和过饱和抑制。
- 图像色彩主要由 [[wiki/modules/FH833X_CCM|FH833X_CCM]] 调整，CE 作为辅助模块让色彩更鲜艳或更受控。
- 过饱和抑制支持三类思路：基于亮度的饱和度增益抑制、阈值抑制、blue / red 抑制。

## CE 关键参数
- `ce_en`：CE 策略开关。
- `calibMode`：使用 CCM 标定工具时置 1；已有项目不更新工具标定可置 0。
- `sat_para_r1`：白色门限，饱和度小于该值的颜色置 0，默认 0。
- `sat_mode`：manual / gainMapping。
- `roll_angle`：色度旋转因子，通常 0。
- `sat_gain`：饱和度增强参数，U3.5，`0x20` 为 1 倍，建议不超过 1.5 倍。
- `blue_sup`、`red_sup`：蓝 / 红分量抑制，`0x40` 为 1 倍，通常不超过 `0x40`。
- `thresh_en`、`thresh_sup`：基于饱和度阈值的抑制。
- `glut_en`、`ce_gain_lut`、`ce_gain_weight`：基于亮度 LUT 的饱和度增益抑制。

## CE 调试步骤
1. 初始保持 `roll_angle=0`、`blue_sup/red_sup=64`、`sat_para_r1=0`、`sat_gain=32`，关闭 `glut_en/thresh_en`。
2. `sat_mode=0`，调 `sat_gain` 到整体饱和度符合预期。
3. 饱和度偏高时，可使能 `thresh_en`，调 `thresh_sup` 抑制色彩。
4. 不同照度下调 `sat_gain` 和 `thresh_sup`，写入 gainMapping。
5. 若希望同一画面按亮暗部调整饱和度，可用自定义 `CE_GAIN_LUT`，暗处抑制强、亮处抑制弱。
6. 如果白色不够白，可调 `sat_para_r1`，但会误伤很淡的颜色，需谨慎。
7. CE 需与 AWB、CCM 配合调试。

## LC 作用
- LC（Local Chroma）用于对固定色调的饱和度单独调整。
- 与 CE / saturation 的区别：CE 更偏全局，LC 可只调红、绿、蓝等某一色调。
- FH833X LC 支持最多三种颜色饱和度校正，每种颜色可按 gain 做两套配置并线性内插。

## LC 关键参数
- `lc_en`：LC 策略开关。
- `lc_ctrl`：manual / gain 自适应。
- `gainL/gainH`：gain 自适应切换阈值。
- `lc0_en`：第一路色调调整使能。
- `theta`：目标颜色在 CbCr 坐标系中的角度，0°~359°。
- `alpha`：中心角左右作用范围，15°~89°。
- `gain`：中心色度处饱和度增益，`0x40` 为 1 倍。

## LC 调试步骤
1. 确认需要单独调整的色度相位 `theta`。
2. 确认作用范围 `alpha` 和增益 `gain`。
3. 使能对应色调调整开关。
4. 不同照度需要不同调整时，开启 gain 自适应。

## 调试权衡
CE / LC 的调试重点是“增强颜色吸引力”和“避免假色、色噪、局部断层”之间的平衡。

- `sat_gain` 提高会让整体颜色更鲜艳，但低照彩噪、肤色发红、红蓝物体溢色也会同步变明显；降低则画面更稳但容易灰淡。
- `thresh_en/thresh_sup` 和 `blue_sup/red_sup` 用于压过饱和颜色，能控制红蓝溢出，但过强会让特定颜色发脏、层次变少。
- `CE_GAIN_LUT` 按亮度调饱和度时，暗部抑制强可以减少暗处色噪，亮部保留强可以维持白天通透；曲线断点过猛会造成亮暗区域颜色不连续。
- `sat_para_r1` 能让低饱和区域更接近白，但会把淡彩物体、浅色衣服和肤色边缘一起去色。
- LC 适合小范围修某一类颜色，例如绿植、天空或红色物体；`alpha` 太宽会影响相邻色相，`gain` 太大容易出现局部颜色突变。
- CE / LC 应在 AWB、CCM 基本正确后做风格微调，不能用来补偿白平衡或矩阵错误。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 画面更鲜艳 | 提高 `sat_gain` | 主观色彩更浓 | 色噪、溢色、肤色发红增加 |
| 低照颜色更干净 | 暗部 LUT 降饱和、增强阈值抑制 | 暗部彩噪下降 | 夜景颜色变淡 |
| 控制红蓝过饱和 | 调 `red_sup/blue_sup` 或阈值抑制 | 红蓝溢出减少 | 目标颜色层次变少 |
| 单独优化某色 | 用 LC 小范围调 `theta/alpha/gain` | 不影响全局色彩 | 范围过宽会误伤相邻颜色 |

## 关联页面
- [[wiki/modules/FH833X_AWB|FH833X_AWB]]
- [[wiki/modules/FH833X_CCM|FH833X_CCM]]
- [[wiki/modules/FH833X_CNR|FH833X_CNR]]
- [[wiki/issues/饱和度异常|饱和度异常]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/偏色|偏色]]

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：25 CE；26 LC。
