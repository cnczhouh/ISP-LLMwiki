# FH833X_AE

FH833X 自动曝光模块，用于通过硬件亮度统计调整曝光时间、sensor gain 和 ISP digital gain，使图像亮度收敛到目标亮度。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：AE / 自动曝光
- 场景：亮度调优、曝光稳定性、抗闪、慢快门、车载曝光路线
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/FH833X_索引|FH833X_索引]]
- [[wiki/workflows/FH833X_图像质量调试流程|FH833X_图像质量调试流程]]

## 模块作用
- AE 根据硬件统计得到当前图像亮度，并与目标亮度比较。
- 当亮度偏离目标时，AE 调整曝光时间、模拟增益和数字增益，使画面回到参考亮度。
- FH833X AE 支持非节点模式和节点模式，车载场景可用节点模式控制曝光时间和运动模糊。

## 曝光路线
### 非节点模式
- 欠曝时：曝光时间 -> 模拟增益 -> 数字增益。
- 过曝时：数字增益 -> 模拟增益 -> 曝光时间。
- 慢快门可穿插在模拟增益阶段，用于低照降帧增亮。

### 节点模式
- 支持 16 个节点，每个节点可配置曝光时间、模拟增益和数字增益。
- 适合车载等高速运动场景：不要一次把曝光时间拉太长，而是在曝光时间和增益之间分段上升。
- 节点约束：相邻节点只能有 intt / aGain / dGain 中一个参数变化，且 `intt * aGain * dGain` 必须单调递增。

## 关键参数
### 控制开关
- `aecEn`：AE 策略总开关。
- `aeMode`：自动、半自动、手动模式选择。
- `ascEn` / `agcEn`：自动快门 / 自动增益使能。
- `mscEn` / `mgcEn`：半自动模式下曝光时间 / 增益手动控制。
- `inttFineEn`：精细快门使能，曝光时间可与 ISP gain 内插。
- `gainFineEn`：精细增益使能，sensor gain 可与 ISP gain 内插。
- `antiFlickerEn`：抗闪使能。
- `aRouteEn`：节点模式使能。
- `inttUnitSel`：曝光时间单位选择，影响 intt 相关参数单位。
- `refresh`：部分配置更新后需要置位刷新。

### 目标亮度与限制
- `lumaRef` / `lumaRefLow` / `lumaRefHigh`：参考亮度和自适应亮度插值目标。
- `evLow` / `evNormL` / `evNormH` / `evHigh`：环境光强分段。
- `intt_min` / `intt_max`：曝光时间上下限，最终还要受 sensor 库限制。
- `againMin` / `againMax`：sensor gain 上下限。
- `dgainMin` / `dgainMax`：ISP digital gain 上下限，一般最小为 1 倍。

### 稳定与速率
- `tolerance`：进入稳定状态的亮度误差区间。
- `lightChangeZone` / `greatChangeZone`：小变化和大变化速率判断区间。
- `underExpLDlyFrm` / `overExpLDlyFrm`：小幅欠曝 / 过曝延时调整帧数。
- `underExpGDlyFrm` / `overExpGDlyFrm`：大幅欠曝 / 过曝延时调整帧数。
- `runInterval`：AE 策略运行间隔，通常每帧运行。
- `speed`：曝光收敛速度，值越小越快。
- `UExpSpeedBias`：欠曝调整速度偏移，用于平衡欠曝和过曝的视觉收敛速度。

### 统计与测光
- `statSel`：3x3、16x16 或 hist 统计模式，常用 16x16。
- `lightMode`：正常、高光优先或低光优先测光。
- `blockMode`：全局或用户自定义分块权重。
- `lumaBoundary` / `roiWeight` / `sensitivity`：高光 / 低光优先模式参数。
- `weight`：16x16 统计窗口权重，可通过 CoolView 页面配置。

### 时序
- `intt0/1/2/3Delay`：各帧曝光时间配置延迟。
- `again0/1/2/3Delay`：各帧 sensor gain 配置延迟。
- `dgainDelay`：ISP gain 配置延迟。
- `sensUpDelay`：慢快门调整帧结构的延迟。

FH833X AE 闪烁重点看 intt、again、dgain 是否同帧生效；精细快门 / 精细增益打开后，必须通过手动测试或 AE log 校准延迟帧数。

## 慢快门
- 慢快门通过设置 sensor frame height 进入降帧模式，sensor 驱动必须支持 `SetSnsFrameH()`。
- 关键步骤：使能 `sensUpEn`，配置 `sensUpMode`，设置进入 / 退出慢快门的总增益阈值，配置降帧最大曝光行，最后刷新 `refresh`。
- `intt_max` 要小于 `FrameHeight - 5`。

## 抗闪
- 抗闪用于解决室内光源频率与图像帧率不成 1/2 整数倍引起的闪烁。
- `antiFlickerMode=1`：强抗闪，严格按频闪周期配置曝光时间，可能过曝。
- `antiFlickerMode=0`：弱抗闪，明显过曝时取消抗闪，可能仍有闪烁。
- `frequency` 配置 50Hz / 60Hz 等工频。
- `stabZone` 用于弱抗闪下防止过曝。

## 调试视角
AE 调试不能只看最终亮度，还要同时看曝光时间、sensor gain、ISP gain、收敛速度和应用场景的运动要求。

- `lumaRef` 提高会让画面整体更亮，但高光更容易压不住，低照下也会推动 gain 上升并放大噪声；降低则高光更稳，但暗部和人脸可能偏黑。
- 曝光时间优先增大会得到更干净的低照画面，但运动模糊和拖影风险上升；gain 优先增大会保住运动清晰度，但噪声、彩噪和后级 NR 压力变大。
- `tolerance` 太小或 `speed` 太快，亮度收敛灵敏但容易呼吸、闪烁；稳定区过宽或速度太慢，画面稳定但进出隧道、强背光切换时响应迟钝。
- 高光优先测光能保灯牌、天空和车灯层次，但主体可能偏暗；低光优先测光能抬人脸和暗部，但高光更容易过曝。
- 精细快门 / 精细增益能让亮度变化更平滑，但 intt、again、dgain 延迟没校准时会造成周期性闪烁。
- 车载场景的节点模式本质是把“低噪声”和“低运动模糊”的取舍显式写进曝光路线，不应只按静态暗场亮度调满曝光时间。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 低照更亮更干净 | 提高曝光时间上限，放宽慢快门 | 亮度上升，随机噪声下降 | 运动模糊、拖影、帧率下降 |
| 运动更清晰 | 限制曝光时间，用节点模式更早提升 gain | 边缘更利落，拖影减轻 | 噪声和彩噪增加，NR 压力变大 |
| 亮度更稳定 | 放宽 `tolerance`，降低收敛速度 | 减少呼吸和闪烁 | 明暗切换响应变慢 |
| 高光不过曝 | 降低目标亮度或使用高光优先测光 | 车灯、天空、灯牌层次更好 | 暗部主体变黑，需 DRC 配合 |

## 调试步骤
1. 确定使用非节点模式还是节点模式。
2. 配置参考亮度，初期可先关闭自适应亮度。
3. 选择统计模式和权重，初期建议正常测光。
4. 配置曝光时间、sensor gain、ISP gain 的上下限。
5. 配置稳定区间和调整速率。
6. 打开 `aecEn`、`ascEn`、`agcEn`，确认亮度可正常收敛。
7. 需要跨照度一致性时，再开启 `adaptiveEn`。
8. 开启 `inttFineEn` / `gainFineEn` 后，校准 intt / again / dgain 延迟，确认无闪烁。
9. 根据应用需求补充抗闪、慢快门、节点路线等高级配置。

## 常见问题入口
- [[wiki/issues/曝光不稳|曝光不稳]]：重点检查目标亮度、稳定区间、速率、统计权重和 AE 延迟。
- [[wiki/issues/闪烁|闪烁]]：重点检查 intt / sensor gain / ISP gain 生效时序、精细内插和抗闪配置。
- [[wiki/issues/拖影|拖影]]：低照或车载场景优先检查曝光时间是否过长，必要时使用节点模式。

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：5 AE；29.1.1、29.1.3、29.1.4。