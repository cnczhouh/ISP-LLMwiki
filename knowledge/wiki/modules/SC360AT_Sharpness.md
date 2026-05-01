# SC360AT_Sharpness

SC360AT Sharpness / YUVDNS 模块包含 Threshold、YDNS、Sharpness、UVDNS 四个功能，用于在 YUV 域进行边缘判断、亮度降噪、锐化和色度降噪联调。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：Sharpness / YUVDNS / YDNS / UVDNS
- 场景：边缘判断、亮度降噪、锐化、白边黑边、色噪、低照细节
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- Threshold：根据 gain node 和 luma node 做边缘判断。
- YDNS：按增益和亮度节点进行亮度降噪。
- Sharpness：控制锐化强度、锐化限制、白边 / 黑边强度和削弱条件。
- UVDNS：进行色度降噪和大间距缓存去噪融合。

## Threshold 边缘判断
- 4 个 `GainNode`，每个 gain node 细分 11 个 `LumaNode`。
- 亮度节点：16、24、32、48、64、80、96、128、160、192、224。
- 边缘判断阈值越小，越容易被识别为边缘。
- `GainManual`：打开后仅使用第一个增益节点；关闭后按实际增益插值。
- `LumaManual`：打开后仅使用第一个亮度节点；关闭后按实际亮度插值。
- 调试 step1：关闭 YDNS，打开 Sharpness 并调至最强，调整各增益 / 亮度节点边缘判断阈值，使大部分平坦区域未被锐化。

## YDNS
- `YDNS Enable`：亮度降噪开关。
- `DnsBackG1~4`：四个增益节点的 addback 程度，越小降噪越强。
- `DnsBackL1~11`：十一个亮度节点的 addback 程度，越小降噪越强。
- 调试 step2：关闭锐化，打开 YDNS，四个增益节点共用一套亮度节点参数，调到平坦区域降噪符合预期。

## Sharpness
- `Sharpness Enable`：锐化开关。
- `ShpOffsG`：四个增益节点下锐化抑制 offset，小于阈值不锐化。
- `ShpKG`：四个增益节点锐化强度，值越大锐化越强。
- `ShpKL`：十一个亮度节点锐化强度系数，值越大锐化越强。
- `ShpLimG`：四个增益节点锐化最大值限制，值越大锐化程度越强。
- `ShpLimL`：十一个亮度节点锐化最大值限制系数，值越大锐化程度越强。
- `ShpKWhtG` / `ShpKBlkG`：白边 / 黑边锐化强度增益系数。
- `ShpLimWhtG` / `ShpLimBlkG`：白边 / 黑边锐化最大值限制增益系数。
- `Cut_WhtCutBeg` / `Cut_BlkCutBeg`：开始削弱白 / 黑边的起始亮度。
- `Cut_WhtCutSlope` / `Cut_BlkCutSlope`：削弱白 / 黑边的亮度过渡区间，越大区间越大。
- `Cut_WhtCutKMin` / `Cut_BlkCutKMin`：白 / 黑边最弱比例系数，越小削弱越强。

换算关系：
- `BaseShpK = ShpKG * ShpKL`
- `BaseShpLim = ShpLimG * ShpLimL`
- `FinalShpK = BaseShpK * (ShpKWhtG 或 ShpKBlkG)`
- `FinalShpLim = BaseShpLim * (ShpLimWhtG 或 ShpLimBlkG)`

## UVDNS
- `UVDNSEnable`：降彩噪开关。
- `UVBuffEnable`：大间距缓存去噪开关；打开后平坦区使用 5x18 高斯降噪和大间距缓存去噪融合结果。
- `UVNoise`：边缘判断参数。
- `NoiseMode`：切换 UNoiseKG、UNoiseBG、VNoiseKG、VNoiseBG、UVNoiseRangeG。
- `U(V)noise = U(V)NoiseKG * Ynoise + U(V)NoiseBG` 用于边缘判断。
- `UNoiseKG/UNoiseBG/VNoiseKG/VNoiseBG` 越小，越容易判定为边缘。
- `UVNoiseRangeG`：不同增益下边缘权重过渡区间，越大越缓，越少区域判成纯边缘。
- `IntDiffRange_G`：大间距降噪融合权重过渡区间，越大越缓，越倾向大间距降噪结果。
- `UVDnsBackEdge_G`：UV 边缘处去噪后 addback 强度，越小边缘处降噪越强。

## 调试视角
SC360AT Sharpness 实际是“先判边缘，再降噪，再锐化，再降彩噪”的联调链路。

- Threshold 是后面 YDNS / Sharpness / UVDNS 的基础。边缘阈值过小会把噪声当边缘，导致平坦区被锐化；阈值过大又会把真实细节当平坦区抹掉。
- YDNS 的 DnsBack 越小，亮度噪声越少，但平坦区和弱纹理更容易发糊。
- Sharpness 提高会增强清晰度，但也会放大 YDNS / NR 残留噪声，并带来白边、黑边、假边。
- 白边和黑边有独立增益和限制，应分别观察高反差边缘两侧，不要只看整体锐度。
- Cut 参数能按亮度削弱白 / 黑边，过强会让边缘发软，过弱会留下明显 halo。
- UVDNS 降彩噪如果边缘判断不准，会让彩色边缘发灰或让平坦区彩噪残留。
- `UVBuffEnable` 的大间距降噪可加强平坦区色噪处理，但过强会让色彩纹理变糊。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 平坦区更干净 | 先调 Threshold，再降低 DnsBack | 墙面 / 天空噪声下降 | 弱纹理损失、涂抹感增加 |
| 主观更锐 | 提高 ShpKG / ShpKL / ShpLim | 边界和纹理更清楚 | 白边、黑边、噪声增强 |
| 控制白边黑边 | 调 ShpKWht/Blk、ShpLimWht/Blk 和 Cut | 高反差边缘更自然 | 边缘可能变软 |
| 色噪更少 | 开 UVDNS / UVBuff，调 UV 边缘判断 | 彩噪下降 | 彩色纹理变灰、边缘色彩损失 |
| 低照更自然 | 降低锐化、增强 YDNS / UVDNS | 噪声更稳 | 清晰度下降 |

## 调试步骤
1. Threshold：关闭 YDNS，打开 Sharpness 并调强，调边缘阈值，使平坦区不被锐化。
2. YDNS：关闭锐化，打开 YDNS，调平坦区域亮度降噪。
3. Sharpness：调基础锐化强度、限制、白边 / 黑边增益和 cut 参数。
4. UVDNS：先调 UV 边缘判断，尽可能区分平坦和边缘；再调平坦区色噪；最后调边缘降彩噪。
5. 回看 HDR、NR、Saturation 和 CCM，确认锐化没有放大伪彩、色噪和 HDR 接缝。

## 常见问题入口
- [[wiki/issues/锐化过强|锐化过强]]：重点检查 Sharpness 强度、限制和白 / 黑边参数。
- [[wiki/issues/噪声大|噪声大]]：重点检查 Threshold、YDNS 和 UVDNS。
- [[wiki/issues/色噪|色噪]]：重点检查 UVDNS、UVBuff 和 Saturation。
- [[wiki/issues/细节损失|细节损失]]：重点检查 YDNS 是否过强、边缘阈值是否过大。
- [[wiki/issues/假边|假边]]：联查 CAC、HDR Combine 和锐化白黑边。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.12 Sharpness(YUVDNS)。
