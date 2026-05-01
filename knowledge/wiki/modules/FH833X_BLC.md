# FH833X_BLC

FH833X BLC（Black Level Correction）黑电平校正模块，用于减去图像数据中的黑电平 / DC 值，是颜色、对比度、噪声等后续调试的基础。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：BLC / 黑电平校正
- 场景：sensor 标定、暗部偏色、WDR 长中短帧黑电平、通透度基础校正
- 适用范围：指定平台

## 作用
- 减去 sensor 原始数据中的黑电平。
- 为后续 [[wiki/modules/FH833X_AWB|FH833X_AWB]]、[[wiki/modules/FH833X_CCM|FH833X_CCM]]、Gamma、DRC、噪声判断提供正确黑位基础。
- 支持 gainMapping，以适配黑电平随 sensor gain 漂移的情况。

## 关键参数
- `blc_en`：BLC 策略总开关。
- `mode`：manual / gainMapping。
- `blc_level`：四通道共同减去的 DC 值。
- `blc_delta_mode_en`：通过 RGB delta 实现分通道减 DC 值。
- `blc_delta_r/g/b`：基于 `blc_level` 的 R/G/B 通道 delta。
- `blc_mf_en`、`blc_mf_level`：中帧独立 BLC。
- `blc_sf_en`、`blc_sf_level`：短帧独立 BLC。
- `blc3En`、`blc3_level`：NR2D 后 BLC，主要配合 NR3D DC 模块改善画面偏蒙和通透度。

## 调试视角
BLC 是后续颜色、亮度和噪声判断的黑位基础，调试时要同时看黑场均值、RGB 通道平衡、gain 漂移和 WDR 多帧一致性。

- `blc_level` 过大时黑位被压低，暗部容易发绿、暗细节被吃掉，后级 Gamma / DRC 再拉暗部也拉不回真实信息。
- `blc_level` 过小时黑位偏高，暗部容易发紫、发灰，NR 会把黑位残留当噪声处理，通透性也会下降。
- RGB delta 能修通道黑位差异，但如果用它补 AWB / LSC / CCM 的问题，会让暗部颜色和中高亮颜色脱节。
- gainMapping 是为了处理 sensor 黑电平随 gain 漂移；只标一个 gain 点，低照或高 gain 下容易重新出现暗部偏色。
- WDR 下长 / 中 / 短帧黑位不一致时，问题常表现为 merge 区域暗部偏色、接缝、短帧噪声底色异常。
- `blc3_level` 与 NR3D DC / NR2D 后观感相关，可改善偏蒙和通透性，但过大也会压暗部层次。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 暗部颜色中性 | 按黑场均值校准 `blc_level` 和 RGB delta | 暗部偏绿 / 偏紫减少 | 配错会影响全亮度颜色判断 |
| 低照黑位稳定 | 按 gainMapping 标定多档 gain | 高 gain 暗部更稳 | 标定工作量增加 |
| WDR 接缝更少 | 分别校准中 / 短帧 BLC | merge 区域底色一致 | 单帧黑位错会放大接缝 |
| 画面更通透 | 小心调整 `blc3_level` | 偏蒙感下降 | 暗部细节被压缩 |

## 调试要点
1. 盖住镜头，确保无漏光。
2. 手动 AE 设置目标 `mAgain`、`mDgain` 档位。
3. 通过 CoolView 抓 Raw 图，计算平均黑电平。
4. 将黑电平写入 BLC 寄存器。
5. 因 BLC 会随 sensor gain 漂移，建议按 gain 做联动标定。
6. 如果 RGB 通道 DC 值不同，可开启 `blc_delta_mode_en` 做分通道校正。
7. WDR 模式下，如果长 / 中 / 短帧黑电平有差异，可分别开启中帧 / 短帧 BLC。

## 现象判断
- BLC 过大：暗部容易发绿。
- BLC 过小：暗部容易发紫。
- BLC 不准会连带影响偏色、暗部发灰、噪声判断和通透性。
- `blc3_level` 主要影响整体通透度，不宜过大。

## 关联页面
- [[wiki/modules/FH833X_AE|FH833X_AE]]
- [[wiki/modules/FH833X_WDR|FH833X_WDR]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：7 BLC。
