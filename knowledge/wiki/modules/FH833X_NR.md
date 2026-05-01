# FH833X_NR

FH833X 降噪知识页，聚合 NR3D、NR2D、YNR、CNR 与运动 / 静止区域联动降噪思路。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：NR / NR3D / NR2D / YNR / CNR
- 场景：低照噪声、运动噪声、拖影、WDR 短帧噪声、降噪与清晰度平衡
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/FH833X_索引|FH833X_索引]]
- [[wiki/workflows/FH833X_图像质量调试流程|FH833X_图像质量调试流程]]

## 调试目标
- 静止区域噪声足够安静。
- 运动区域不过度拖尾，运动物体身后噪声可控。
- WDR 中 / 短帧噪声不明显合入。
- 与 [[wiki/modules/FH833X_APC|FH833X_APC]] 平衡，避免降噪过强导致细节损失，也避免锐化放大噪声。

## NR3D
### 作用
- NR3D 是时域降噪，通过多帧叠加并结合运动判断降低随机噪声跳动。
- 强度过大容易产生拖影，尤其要关注低照下黑色物体在黑色背景上的拖尾。

### 关键参数
- `nr3d_en`：策略总开关。
- `nr3dHwBypass`：NR3D 硬件 bypass。
- `showCoefEn`：显示 coeff 分布，用于标定运动 / 静止区。
- `lfSlope/lfOffset`：长帧亮区 / 暗区噪声估计。
- `mfSlope/mfOffset`：中帧亮区 / 暗区噪声估计。
- `sfSlope/sfOffset`：短帧亮区 / 暗区噪声估计。
- `mdCoeffTh`：运动 coeff 门限。
- `mdGain`：运动强度增益；值越大 NR3D 越弱、噪声越大，值越小 NR3D 越强、拖尾越重。
- `mdFltCof`：运动信息滤波比例。
- `coeffMapIdx`：coeff 映射线，照度好可偏大，低照可逐渐减小以加强运动判断。
- `refCoeffTh`：参考帧 coeff 下限，增大可改善过渡不自然和拖尾噪声。
- `refCoeffRatio`：参考帧 coeff 比例因子；过小收敛快但易拖影。
- `nr3dDc`：NR3D 前处理 DC，值越大画面越蒙、噪声越小，可配合 BLC3。

### 参数联动对图像的影响
NR3D 的实际观感不是单个寄存器决定，而是“噪声模型 → 运动 coeff → 参考帧融合 → 后级 NR2D / YNR 联动”的结果。

- `lf/mf/sfSlope` 和 `lf/mf/sfOffset` 决定不同亮度、不同 WDR 帧的基础噪声估计。slope / offset 偏大时，静止区更容易被当成可融合区域，背景更干净，但运动边缘、暗部移动物体更容易拖影；偏小时，运动更利落，但静止背景颗粒、暗部闪噪和 WDR 中短帧噪声更容易露出。
- `mdCoeffTh`、`mdGain`、`mdFltCof` 决定运动判断的敏感度和稳定性。运动判断越敏感，运动物体越少融合历史帧，拖影下降但运动区域噪声上升；运动判断越迟钝，运动区域也被时域融合，噪声下降但容易出现尾巴、重影或边缘发虚。
- `coeffMapIdx` 会改变 coeff 映射曲线，相当于改变“静止、小运动、大运动”的分界。低照下如果全局 coeff 被噪声抬高，可通过映射让真实运动和静止噪声重新拉开；但映射过激会导致画面区域间降噪跳变。
- `refCoeffTh` 和 `refCoeffRatio` 控制参考帧参与程度。参考帧保留越多，静止区越干净，运动身后的噪声过渡越长；参考帧释放越快，拖影改善，但运动区域后方可能出现噪声尾巴或背景噪声突然冒出。
- `nr3dDc` 属于前处理型强度补偿，能压低底噪，但过强会让整体变蒙，并削弱后级 APC 可恢复的真实细节。
- WDR 下长 / 中 / 短帧 slope、offset 不一致时，问题会表现为局部亮度段或高光合成区域噪声、拖影、接缝更明显，而不是全画面一致变化。

### 典型调试取舍
| 目标          | 常见调整方向                                                       | 图像收益                 | 主要副作用                  |
| ----------- | ------------------------------------------------------------ | -------------------- | ---------------------- |
| 静止背景更干净     | 增大对应亮度段 slope / offset，减小 `mdGain`，提高参考帧参与                   | 背景随机噪声下降，低照画面更稳      | 运动拖尾、边缘发虚、细节时间方向被抹掉    |
| 减轻运动拖影      | 减小拖影亮度段 slope / offset，增大 `mdGain`，减少参考帧融合                   | 运动边界更利落，黑底黑物拖尾减轻     | 运动区域噪声上升，背景可能变粗        |
| 压运动身后噪声     | 适当增大 `refCoeffTh` / `refCoeffRatio`，再用 NR2D / YNR coeff 联动补充 | 运动轨迹后的噪声过渡更平滑        | 范围过大会变成拖影或“擦痕感”        |
| 保留低照细节      | 不把 NR3D 一次调满，给 NR2D / YNR 分担                                 | 纹理不容易被时域抹死，APC 更容易恢复 | 需要接受少量细噪，联调成本更高        |
| 降 WDR 中短帧噪声 | 单独加强 `mf/sfSlope`、`mf/sfOffset`，再看 merge 区域                  | 高光和短帧参与区域更干净         | 中短帧运动合入时更容易出现局部拖影或接缝噪声 |

### 观感判断方法
- 先用 `showCoefEn` 看静止区和运动区是否真正分开，再看正常图像，否则容易把 NR2D / APC 的问题误判成 NR3D。
- 如果只有暗部拖影，优先动 offset；如果只有亮部拖影，优先动 slope；如果全亮度段都有拖影，再动 `mdGain`、`refCoeffRatio`、`refCoeffTh`。
- 如果静止区干净但运动物体边缘有“灰尾巴”，通常是参考帧释放太慢或运动判断不够敏感。
- 如果运动物体没有明显拖影但身后噪声突然变粗，通常是参考帧释放太快，需要 NR2D / YNR 通过 coeff 联动接住。
- 如果调强 NR3D 后 APC 怎么加都不清晰，说明真实纹理已被时域融合抹掉，不能只靠锐化补救。
- 车载运动场景不要以静态图干净为唯一目标，应优先检查行进画面、低照运动边缘和黑物体拖尾。

### 标定方法
1. 初始设置 `mdCoeffTh=0x80`、`mdFltCof=0x80`、`mdGain=0x400`、`refCoeffTh=0`。
2. 线性模式标定 `lfSlope/lfOffset`；WDR 同时关注中 / 短帧 slope 和 offset。
3. 打开 `showCoefEn`，观察运动与静止分布。
4. 静止区域 8bit 显示值应大致在 10~20，运动区域约在 203 附近。
5. 若亮区静止 coeff 与运动区接近，增加 slope；若暗区静止 coeff 与运动区接近，增加 offset。
6. 若亮区拖影明显且亮区静止 coeff 远小于 10，减小 slope；若暗区拖影明显，减小 offset。
7. 各 db 重复标定，确保亮暗静止区 coeff 基本一致且能区分运动。

## NR2D
### 作用
- NR2D 是 Bayer 空域降噪，主要补充 NR3D，对运动区域和时域降噪后的残留噪声进行平滑。
- WDR 模式可分别对长 / 中 / 短帧调试，短帧通常需要更强降噪。

### 关键参数
- `nr2d_en`：策略总开关。
- `nr2dMode`：manual 或 gainMapping。
- `nr2dMenEn`：联动降噪使能。
- `lfK1/K2/O1/O2`：长帧亮 / 暗、白天 / 低照降噪估计。
- `mfK1/K2/O1/O2`：中帧降噪估计。
- `sfK1/K2/O1/O2`：短帧降噪估计。
- `nr2d_lf/mf/sf_slope_str`：各帧斜率估计强度。
- `nr2d_lf/mf/sf_offset_str`：各帧偏移估计强度。
- `nr2dLfSft/nr2dmfSft/nr2dSfSft`：整体偏移，影响较大。
- `refCoeffRatio`：NR2D coeff 收敛速度；值越大运动后噪声抹除范围越长。
- `SigLut`：根据 NR3D coeff 区分运动 / 静止并映射降噪强度。
- `AddLut`：根据 coeff 控制源数据回加。
- `LumaLut`：根据亮度控制源数据回加。

### 空域降噪调试
1. 将 `nr2dMode` 调成 manual，关闭 YNR，关闭 `nr2dMenEn`，排除联动影响。
2. 先配置合适的 slope / offset 强度和 shift。
3. 室内正常照度下调整 `lfK2/lfO2`，控制白天亮处 / 暗处噪声。
4. 低照下调整 `lfK1/lfO1`，控制低照亮处 / 暗处噪声。
5. 再根据运动区域调整 slope / offset 强度，为后续联动模块保留少量可处理噪声。
6. 切到 gainMapping，各照度下标定强度。
7. WDR 下分别调长 / 中 / 短帧，中 / 短帧通常更强。

### 联动降噪调试
- NR3D 很弱或关闭时，可关闭 `nr2dMenEn`，降低复杂度。
- NR3D 较强时，开启 `nr2dMenEn`，通过 SigLut、AddLut、LumaLut 区分运动和静止。
- `refCoeffRatio` 控制运动身后噪声抹除范围，低照下可适当增大，正常最大不建议过高。
- NR2D 可保留部分细噪，让后续 YNR 处理，避免画面过度涂抹。

## NR2D 内部 DPC
- NR2D 内部有简单坏点补偿，可作为前级 DPC 的补充。
- `enable`：白点 / 黑点去除开关。
- `str`：检测强度，越大越容易判成坏点。
- `w_dc` / `b_dc`：白点 / 黑点检测阈值，值越小能力越强。

## 常见问题入口
- [[wiki/issues/噪声大|噪声大]]：重点看 NR3D 噪声估计、NR2D 强度、WDR 中短帧降噪和 DRC 是否放大噪声。
- [[wiki/issues/拖影|拖影]]：重点看 NR3D 强度、`mdGain`、`refCoeffRatio` 和曝光时间。
- [[wiki/issues/涂抹感|涂抹感]]：重点看 NR2D / YNR 是否过强、AddLut / LumaLut 是否回加不足。
- [[wiki/issues/细节损失|细节损失]]：联查 NR2D、YNR、DPC 和 APC。
- [[wiki/issues/固定亮点暗点|固定亮点暗点]]：联查前级 DPC 和 NR2D 内部 DPC。

## 二级降噪页面
- [[wiki/modules/FH833X_YNR|FH833X_YNR]]：亮度降噪、NR3D coeff 联动和噪声回加。
- [[wiki/modules/FH833X_CNR|FH833X_CNR]]：色度降噪、颜色保护和运动区域色噪联动。
- [[wiki/modules/FH833X_SHARP_NOISE|FH833X_SHARP_NOISE]]：强 NR3D / 弱 3DNR 场景下锐化与降噪联调。

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：12 NR3D；13 NR2D；29.1.9、29.1.10、29.1.11、29.2.2。