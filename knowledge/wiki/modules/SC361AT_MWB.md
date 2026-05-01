# SC361AT_MWB

SC361AT Manual White Balance（MWB）功能整理，用于记录 datasheet 中 sensor 端手动白平衡回写寄存器和增益精度。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC361AT|SC361AT]]
- 模块：MWB / Manual White Balance
- 场景：手动白平衡、平台回写 RGB gain、白点调试、偏色排查
- 适用范围：指定平台

## 模块作用
- SC361AT 的 MWB 功能要求平台在 sensor 点亮时回写 Red Gain、Blue Gain 和 Green Gain 到 sensor 对应寄存器，并使其在 sensor 端生效。
- MWB 更偏 sensor 端白平衡控制入口，不是完整 AWB 标定流程。
- 若平台侧 ISP 或上游系统另有 AWB，需要明确最终 WB gain 是由平台 ISP 还是 SC361AT sensor 端 MWB 生效。

## 控制寄存器
| 功能 | 寄存器 | 说明 |
|---|---|---|
| MWB 开关 | `16'h5007[5]` | 白平衡开关：`1'h0` 关，`1'h1` 开 |
| Bgain | `{16'h5ac8[7:0], 16'h5acb[2:0]}` | 蓝色增益，精度 1/256 |
| Rgain | `{16'h5ac9[7:0], 16'h5acb[5:3]}` | 红色增益，精度 1/256 |
| Ggain | `{16'h5aca[7:0], 16'h5acb[7:6]}` | 绿色增益，精度 1/256 |

## 调试建议
- 点亮阶段若画面明显偏色，先确认 MWB 开关和 R / G / B gain 是否按平台预期回写。
- 若外部 ISP 也在做 AWB，需要避免 sensor 端 MWB 与 ISP 端 AWB 重复补偿。
- MWB gain 修改后应观察灰卡、白墙和多色温场景，避免只在单一光源下校正。
- HDR 场景下要确认各曝光 / gain 分支经过合成后颜色是否一致，必要时联查 [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]。

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：先确认 MWB 是否开启、gain 是否回写正确。
- [[wiki/issues/颜色不自然|颜色不自然]]：MWB 只解决白点，不替代后级 CCM / 饱和度风格。

## 相关页面
- [[wiki/platforms/SC361AT|SC361AT]]
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]

## 来源
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
