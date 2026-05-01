# SC360AT_NR

SC360AT NR 模块包含 DNS13 和 DNS23 两级 raw / 前级降噪逻辑，用于按四帧曝光分支、增益节点、边缘判断、亮度噪声模型和 add back 控制噪声与细节。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：NR / DNS13 / DNS23
- 场景：四帧降噪、低照噪声、边缘保护、add back、边角噪声、绿边紫边
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- DNS13 分别对 L / M / S / VS 四帧做降噪；默认 HCG 不开 DNS13，使用 DNS23。
- DNS23 只用于 L 帧，包含 gain node、noise level、edge judgement、denoise strength 和 add back。
- SC360AT NR 的核心是按帧、按增益、按亮度、按边缘 / 平坦区域分别控制降噪强度和细节回加。

## DNS13
### gain node
- 去噪参数分四组，按对应帧实际增益调用，4 个增益节点之间线性插值。
- `0x10` 对应 1 倍，最大 255 倍。
- M 与 VS 初始为 LCG，增益大于 dcg ratio 后切换到 HCG。
- S 无 HCG，常见节点为 1x、4x、16x、32x。

### Edge strength
- 边缘阈值公式：`(luma * EdgeCoe + EdgeInt) >> EdgeRat`。
- 阈值越大，越容易判断为平坦区域。
- 调优第一步是确保边缘被正确识别，可通过调整最大 flat / edge 去噪强度来判断。

### Denoise strength
- `Noiselevel = luma * Coe + Int`，数值越大去噪越强。
- `Int` 主要影响暗处强度，`Coe` 主要影响亮处强度。
- 平坦和边缘区域去噪强度分别控制。
- G 通道和 RB 通道分别控制；由于 WB gain，RB 通道去噪通常需要更高。
- `Texture area`：沿边缘垂直方向额外增强去噪，值越大边缘越模糊。
- `DnsBack`：原值回加以保留清晰度，0 不回加，对应最强去噪。
- G / BR 通道强度需要接近，资料给出 BR 约为 1.5x G，否则可能出现绿边、紫边异常。

## DNS23
### gain node 和 noise level
- DNS23 只用于 L 帧，去噪参数按 L 帧转换增益调用。
- 4 个增益节点，`0x01` 对应 1 倍，最大 255 倍，节点间线性插值。
- gain node 与标定参数 noise level 联动，资料建议不动。
- noise level 是 5 个增益节点下的噪声模型，只与 pixel 噪声水平相关，增益节点不动时通常无需修改。

### Edge judgement
- `edge th lo`：边缘判断低阈值，越小越易判成边缘。
- `edge th high`：边缘判断高阈值，越小越易判成边缘。
- `Edge judge`：增益大于该阈值时，边缘降噪强度单独控制。

### Denoise strength
- `Denoising`：去噪强度。
- `Highlight Extra`：高亮区域额外去噪强度。
- `Judge`：判断高亮区域的阈值。
- `Radius`：考虑 LENC 数字增益，边缘区域增大去噪强度。
- `Center strength`：1/4 半径区域内去噪强度。
- `Mid increase`：1/4 ~ 1/2 半径区域降噪强度增大速度。
- `Edge increase`：1/2 ~ 1 半径区域降噪强度增大速度。
- `Thrh`：nSumWei < ThrH 时中心点权重额外增加，值越大越多区域清晰度和噪声增加。

### Add back
- 目标是保留清晰度，优化高增益强去噪带来的规律纹理，并让噪声形态更细碎。
- 可选择回加高频 / 中频 / 原值，每组高频程度和回加强度可单独控制。
- `Freq mode`：0-2-1-3 高频程度依次增加。
- `Add back`：回加程度，0 不回加，对应最强去噪。
- `ThrLow`：低阈值，SumWei < ThrLow 时不回加高频 / 中高频。
- `GapBit`：过渡区大小。
- `Freq Strength`：不同亮度下的回加程度。

## 调试视角
SC360AT NR 的实际效果不是单一强度决定，而是“帧分支 → gain node → 边缘判断 → 平坦 / 边缘强度 → 通道强度 → add back”的组合。

- 边缘判断过严会把真实边缘当平坦区，噪声更干净但细节被抹；边缘判断过松会把噪声当边缘，平坦区颗粒残留并被后级锐化放大。
- `Int` 加强暗部去噪，`Coe` 加强亮部去噪；低照暗部噪声优先看 Int，高亮区域颗粒优先看 Coe 或 Highlight Extra。
- 平坦区降噪可调干净背景，边缘区降噪决定细节保留；两者差异过大时容易出现边缘周围噪声形态突变。
- `DnsBack` / Add back 越多，清晰度和细碎质感越好，但噪声也会回来；越少画面更干净但涂抹感明显。
- G 与 BR 强度不匹配会造成绿边 / 紫边，尤其在 WB gain 较大或高对比边缘处更明显。
- DNS23 中与 noise level 联动的 gain node 不建议随意改，否则后续强度判断基准会变。
- LSC 会提升边缘数字增益，DNS23 的半径相关强度用于处理边缘噪声，需和 LSC 一起看。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 暗部更干净 | 提高暗处 Int 或低亮度降噪 | 黑场颗粒下降 | 暗部纹理损失、涂抹感增加 |
| 保留边缘细节 | 降低边缘区降噪或增加 add back | 纹理和边界更清楚 | 边缘噪声、假细节增加 |
| 平坦区更干净 | 调准边缘阈值，加强 flat 去噪 | 墙面 / 天空更干净 | 阈值错会误伤弱纹理 |
| 减少绿边紫边 | 保持 G / BR 强度接近，BR 约 1.5xG | 边缘色异常减少 | RB 色噪可能残留或颜色变淡 |
| 高 gain 不涂抹 | 增加 add back，降低过强去噪 | 细节和噪声形态自然 | 噪声回升 |

## 调试步骤
1. 分清当前调 DNS13 还是 DNS23，以及作用于 L / M / S / VS 哪一帧。
2. 先确认 gain node，不随意修改与 noise level 联动的节点。
3. 调边缘判断：用 flat / edge 最大强度差异观察边缘是否被正确识别。
4. 调平坦和边缘去噪强度，分别观察背景和边缘细节。
5. 调 G / BR 通道强度，避免绿边紫边。
6. 调 add back，让噪声形态、清晰度和涂抹感达到平衡。
7. 联查 [[wiki/modules/SC360AT_LSC|LSC]]、[[wiki/modules/SC360AT_Sharpness|Sharpness]] 和 [[wiki/modules/SC360AT_HDR|HDR]] 暗部抬升。

## 常见问题入口
- [[wiki/issues/噪声大|噪声大]]：重点检查 gain node、flat / edge 强度、暗部 Int 和 LSC 边缘增益。
- [[wiki/issues/涂抹感|涂抹感]]：重点检查降噪是否过强、add back 是否不足。
- [[wiki/issues/细节损失|细节损失]]：重点检查边缘判断和边缘区降噪。
- [[wiki/issues/假边|假边]]：重点检查 G / BR 强度不匹配和后级锐化。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.9 降噪。
