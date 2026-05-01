# FH833X_LSC

FH833X LSC（Lens Shading Correction）镜头阴影校正模块，用于补偿镜头光学折射不均匀导致的边角暗影和色彩 shading。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：LSC / 镜头阴影校正
- 场景：暗角、色彩 shading、镜头标定、不同色温表融合、裁剪幅面适配
- 适用范围：指定平台

## 作用
- 校正 luma shading：画面四周亮度变暗。
- 校正 color shading：画面不同位置出现颜色偏差。
- 支持两张 LSC 表融合，可按手动权重或色温自动插值。

## 关键参数
- `lsc_en`：LSC 策略总开关。
- `mode`：manual / gainMapping。
- `lsc_hw_en`：LSC 硬件模块开关。
- `thL`、`thH`：校正强度上下阈值，通常 `thL=0`、`thH=0x3fff`。
- `mergeMode`：是否开启两张表融合。
- `tabMergeMode`：手动权重 / 按色温自动插值。
- `mergeWight`：两表手动融合权重，0 使用表 0，255 使用表 1。
- `LeftLightIdx`、`rightLightIdx`：自动融合时对应低 / 高色温索引，与 CCM 色温状态对应。
- `lscStr`：LSC 校正强度，通常 `0xff` 使用标定强度；暗态为了噪声控制可降低。
- `lscGainEn`、`lscRgain/Ggain/Bgain`：LSC 后增益补偿，用于标定后整体偏色时修正，通常不建议使用。

## 调试视角
LSC 的目标不是把四角无条件拉到和中心一样亮，而是在亮度均匀、色彩均匀、边角噪声和 AWB / CCM 稳定性之间取舍。

- `lscStr` 越高，暗角和 color shading 越容易被补平，但边角 gain 也更高，低照边缘噪声、彩噪和坏点会被同步拉起。
- 双色温表融合能改善不同光源下的色彩 shading，但 `LeftLightIdx/rightLightIdx` 或融合权重不匹配时，画面会出现中心和边角色温不一致，进而干扰 AWB 白点统计。
- 裁剪输出时如果仍使用原始窗口表，校正中心会偏移，表现为一边偏暗 / 偏色，另一边过补。
- `lscGainEn` 只能做整体 RGB 增益补偿，不能替代重新标定；用它修局部 shading 会把全画面颜色一起带偏。
- 暗态可适当降低 LSC 强度，让边角保留一点自然暗角，以换取更低噪声和更稳定的低照观感。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 四角亮度更均匀 | 提高 `lscStr` 或重标定表 | 暗角改善 | 边角噪声、彩噪上升 |
| 低照边角更干净 | 暗态降低 `lscStr` | 边角噪声下降 | 暗角残留增加 |
| 多色温边角不偏色 | 启用双色温表并校准融合权重 | 不同光源下 shading 更稳 | 权重错会造成局部偏色 |
| 裁剪画面均匀 | 正确配置 crop 窗口和偏移 | 校正中心匹配输出画面 | 配错会出现单边过补 |

## 标定和配置流程
1. 按 CoolViewPro2 的 LSC 标定工具流程完成标定，支持两个色温标定。
2. 单表使用时：`mode=0`、`lscStr=0xff`、`mergeMode=0`、`lscGainEn=0`，将结果放入表 0。
3. 在 `lsc_table.c` 中配置：
   - `lscWinTableMode = 1` 使用标定模式。
   - `lscWinCropEn = 0` 先不开启裁剪。
   - 将窗口信息配置到 `lscWinTableNewTool[64]`。
   - 将 LSC 表配置到 `lscTable0[LSC_ADDR0_SIZE]`。
4. 双色温标定时，可开启表加权模式，权重 0 使用表 0，权重 255 使用表 1。
5. 如果用大幅面标定、小幅面输出，可在 `lsc_table.c` 中开启裁剪：`lscWinCropEn=1`，并配置原图尺寸、裁剪尺寸和偏移。
6. 标定后整体偏色时，可开启 `lscGainEn` 做增益补偿，但通常不建议。

## 调试注意
- 暗态降低 `lscStr` 可减少边角噪声被拉起。
- LSC 会影响 AWB、CCM 和暗部噪声判断，应在基础标定阶段先处理。
- 更换镜头、sensor、IR filter 或有效幅面后，应重新确认 LSC 标定和裁剪参数。

## 关联页面
- [[wiki/modules/FH833X_AWB|FH833X_AWB]]
- [[wiki/modules/FH833X_CCM|FH833X_CCM]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：11 LSC。
