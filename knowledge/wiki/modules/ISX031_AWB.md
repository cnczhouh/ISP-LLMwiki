# AWB

自动白平衡用于在光源色温变化时补偿输入图像 R/B 通道增益，以还原无彩色目标的中性色。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：白平衡控制
- 场景：偏色调试、光源切换、色温适配
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台 AWB 调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：白平衡控制
- 场景：偏色调试、光源切换、色温适配

## 核心要点
- AWB 属于图像质量调试流程中的自动控制系统调整
- 可调整检测窗口的大小与位置
- [[wiki/modules/ISX031_Pre White Balance|Pre White Balance]] 是 AWB 正常工作的前置补偿环节
- 手册明确建议使用 3200K 与 5800K 两个色温完成预白平衡
- AWB 控制过程包含 `Ratio`、`Aim`、`Cont` 三组坐标数据

## 调试方法
1. 先设置 AWB 测光窗口，确认窗口不要覆盖严重暗角或无效区域。
2. 先做 [[wiki/modules/ISX031_Pre White Balance|Pre White Balance]]，使用 3200K 和 5800K 两个标准光源校正光学系统差异。
3. 选择白平衡场景模式：`WS0`、`WS1` 或自动切换。
4. 观察 `Ratio`、`Aim`、`Cont` 的 R/G、B/G 关系，确认当前点、目标点与输出点是否合理。
5. 根据场景亮度与色温，调整 WS0/WS1 的切换阈值与 pull-in 范围。
6. 调整 pull-in 延迟与速度，避免场景变化时白平衡抖动或追得太慢。
7. 在暗场下检查 `ILMLEVEL` 与 `AWBSTS`，必要时利用 OPD error 机制暂停不可靠的白平衡控制。

## 关键寄存器与调整作用
- `AWB_WND_MODE`、`AWB_WND_SIZE_H`、`AWB_WND_SIZE_V`、`AWB_WND_OFFSET_H`、`AWB_WND_OFFSET_V`
  - 控制对象：AWB 统计窗口的划分方式、大小与位置。
  - 调大/调高：窗口覆盖范围更大，色彩统计更容易被背景、暗角或局部高饱和区域牵引。
  - 调小/调低：窗口更集中于主体，白平衡更贴近主体颜色，但也更容易被小面积异常色块带偏。
  - 观察现象：白纸、灰卡、肤色是否更稳定，边缘色偏或局部彩色物体是否还会把整幅图拉偏。

- `WS_MODE`、`WS0_JUDGPOS`、`WS1_JUDGPOS`、`WBSCENE_NUM`
  - 控制对象：白平衡场景模式以及不同白平衡场景间的切换判断位置。
  - 调大/调高：切换门槛更偏向某一类场景时，AWB 会更晚或更早切到对应模式，颜色风格会更稳定但可能更钝。
  - 调小/调低：场景切换更积极，更容易快速贴合当前光源，但在混光或临界场景下更容易来回跳。
  - 观察现象：室内外切换时颜色是否忽冷忽暖，混光场景中是否频繁变色，模式切换是否稳定。

- `ATW_DELAY`、`ATW_CNT_EQ_AIM`、`ATW_CNT_EQ_AIM_EN`
  - 控制对象：AWB 输出向目标点拉入前的等待时间，以及认为“已经到达目标”的判定方式。
  - 调大/调高：白平衡动作更稳，更不容易在瞬时色偏下抖动，但切换光源后追得更慢。
  - 调小/调低：白平衡响应更快，但容易在场景轻微变化时出现颜色摆动。
  - 观察现象：开灯/关灯、转镜头、经过彩色物体时颜色是否平顺，是否有一闪一闪的偏色感。

- `WB_IIR_EN`、`WB_IIR_COEF_HIGH`、`WB_IIR_COEF_LOW`、`WB_IIR_TH_HIGH`、`WB_IIR_TH_LOW`、`WB_IIR_SHIFT_TH`
  - 控制对象：AWB 输出滤波强度，以及在不同误差区间下的平滑方式。
  - 调大/调高：滤波更强时，AWB 更平稳，短时颜色波动会被压住，但追光源变化更慢。
  - 调小/调低：滤波更弱时，AWB 能快速响应当前光源，但噪声场景或复杂画面下更容易抖动。
  - 观察现象：低照度或混光下的颜色稳定性，白墙和灰卡是否来回偏黄偏蓝，肤色是否忽冷忽暖。

- `AWB_OPDERR_TH_R`、`AWB_OPDERR_TH_G`、`AWB_OPDERR_TH_B`、`AWB_Y_DARK`、`AWB_Y_PEAK`、`AWB_R_PEAK`、`AWB_G_PEAK`、`AWB_B_PEAK`
  - 控制对象：AWB 统计有效性判断、暗场门限和异常像素/异常统计的抑制条件。
  - 调大/调高：更宽松时，AWB 在困难场景下仍会继续动作，但也更容易被噪声、暗角或异常彩点带偏。
  - 调小/调低：更严格时，可减少错误收敛，但暗场或低纹理场景下更容易停在原地不动。
  - 观察现象：夜景是否突然严重偏色，暗场白平衡是否冻结，彩噪是否会把 AWB 拉偏。

- `RATIO_R`、`RATIO_B`、`AIM_R`、`AIM_B`、`CONT_R`、`CONT_B`
  - 控制对象：AWB 当前统计点、目标点和当前控制输出点。
  - 调大/调高：这些更适合作为状态观察量，不建议直接当成“固定写死”的调节参数；数值偏移说明当前场景颜色与目标白点存在差距，或控制器正在向某方向收敛。
  - 调小/调低：表示当前场景统计点或控制输出向另一侧移动。
  - 观察现象：当前点是否能稳定靠近目标点，输出点是否在抖动，以及偏色究竟来自统计错误还是收敛策略错误。

## 可观察项
- `AWB_WND_MODE`
- `AWB_WND_OFFSET_H/V`
- `AWB_WND_SIZE_H/V`
- `WS_MODE`
- `WS0_JUDGPOS` / `WS1_JUDGPOS`
- `WBSCENE_NUM`
- `RATIO_R/B`
- `AIM_R/B`
- `CONT_R/B`
- `AWBSTS`
- `ILMLEVEL`

## 调试重点
- 先确认预白平衡是否合理，再看 AWB 收敛结果
- 关注不同光源下白物体、灰卡和肤色是否中性
- 观察窗口位置、窗口覆盖内容与收敛稳定性
- 夜景或低照度场景要注意 AWB 被异常噪声牵引

## 常见问题
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/偏色|偏黄]]
- [[wiki/issues/偏色|偏绿]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/workflows/ISX031_图像质量调整流程|ISX031_图像质量调试流程]]
- [[wiki/modules/ISX031_AE|AE]]
- [[wiki/modules/ISX031_CCM|CCM]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_Pre White Balance|Pre White Balance]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]

