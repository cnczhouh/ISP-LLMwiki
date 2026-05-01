# FH833X_APC

FH833X APC 模块用于增强图像清晰度，通过细节层、边缘层、强边抑制和运动联动控制锐化效果。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：APC / 锐化
- 场景：清晰度、细节锐化、边界锐化、白边黑边、强边抑制、运动联动
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/FH833X_索引|FH833X_索引]]
- [[wiki/workflows/FH833X_图像质量调试流程|FH833X_图像质量调试流程]]

## 模块作用
- APC 通过滤波得到细节层和边缘层，分别做 LUT 映射和增益增强。
- 通过 DETAB / FLATTAB / SHOOTTAB 控制细节边界融合、平坦区域抑制和强边抑制。
- APC 可与 NR3D coeff 联动，降低运动区域锐化，控制运动噪声和尖锐伪影。

## 调试目标
- 静止画面边界和纹理足够清晰。
- 低照下不把噪声锐化成白点、黑点或颗粒。
- 强边缘不过度产生白边 / 黑边。
- 运动区域锐化不过强，避免运动身后尖锐噪声。

## 关键参数
### 基础控制
- `apc_en`：策略总开关。
- `apc_mode`：manual 或 gainMapping。

### 锐化总增益
- `pgain`：总体正向增益，值越大白边或白点越明显。
- `ngain`：总体负向增益，值越大黑边或黑点越明显。
- 一般照度越低，`pgain/ngain` 越应减小。

### 细节锐化
- `detailFNum`：细节滤波器选择，值越小细节越锐，默认偏弱。
- `detailGain`：细节纹理频率控制，值越大细节更细碎。
- `detailLutNum`：细节增强 LUT，值越大增强越明显，但噪声也会增大。
- `posDeStr` / `negDeStr`：正 / 负向细节锐化强度。

低照下建议降低细节锐化，避免把噪声变成细碎颗粒。

### 边界锐化
- `edgeFNum`：边界滤波器选择，值越小边界越锐。
- `edgeGain`：边界频率控制，值越大边界越细。
- `edgeLutNum`：边界增强 LUT，值越大边界增强越明显。
- `posEsStr` / `negEsStr`：正 / 负向边界锐化强度。

低照下可降低 `edgeGain`，倾向描大边界、忽略小边界，以保持主观清晰度并减少噪声。

### 细节 / 边界融合
- `mergeType=0`：选择细节和边界最大值，默认常用。
- `mergeType=1`：通过 DETAB 曲线加权融合细节和边界。
- `detabThL/detabThH`、`detabThlY/detabThhY`：DETAB 梯度映射参数。

### 平坦区域抑制
- `flattabThL`：区分平坦区的下阈值。
- `flattabSlo`：平坦区映射斜率。
- `flattabMin` / `flattabMax`：映射强度范围。
- FLATTAB 用于减少平坦区域锐化强度，从而降低噪声；阈值过大容易损伤细节。

### 亮度锐化强度
- `lightStrEn`：锐化强度随亮度变化使能。
- `lightGainThL` / `lightGainThH`：作用 gain 范围。
- `light0~32StrThl/Thh`：不同亮度等级的锐化强度。
- 特殊低照场景可降低暗部亮度等级锐化，减少暗部白点噪声。

### 强边抑制
- `locctrlSupsteady`：强边缘选择阈值，大于该值才判断为强边缘。
- `locctrlSupstep`：强边缘抑制强度，小于 64 起抑制作用，越小抑制越强；大于 64 起增强作用。
- `shoottabTh/Slo/Min/Max`：强边抑制结果与前置锐化结果的融合曲线。

默认可先不做强边抑制：`locctrlSupsteady=511`，`locctrlSupstep=64`。

### 运动联动
- `apc_mt_en`：锐化联动使能。
- `motionTh`：NR3D coeff 下阈值。
- `motionSlope`：运动锐化权重映射斜率。
- `motionThMin` / `motionThMax`：运动权重最小 / 最大值。
- NR3D 很弱或关闭时，可关闭 APC-MT，或将所有 coeff 等级权重设为相同。

## 调试视角
APC 调试要把细节锐化、边界锐化、平坦区抑制、强边抑制和运动联动一起看，不能只用清晰度测试卡判断。

- `pgain/ngain` 提高会让整体清晰度更强，但正向过强容易白边 / 白点，负向过强容易黑边 / 黑点。
- Detail 侧增强细碎纹理，适合草地、毛发、布料，但低照下会把噪声锐成颗粒；Edge 侧增强大边界，主观清晰度明显，但过强会有硬边和假边。
- FLATTAB 能压平坦区噪声锐化，阈值过强会把弱纹理误判为平坦区，导致墙面、皮肤、低对比细节发糊。
- 强边抑制能控制白边 / 黑边，但抑制过强会让真实边界发软，和 DRC 局部对比一起调时尤其明显。
- 运动联动依赖 NR3D coeff，能降低运动区域尖锐噪声；若 NR3D coeff 本身不准，APC 可能把静止细节误当运动压掉，或让运动噪声继续被锐化。
- NR / YNR 过强时，APC 只能锐化残留边缘，无法恢复已经被抹掉的真实纹理。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 主观更清晰 | 提高 `pgain/ngain` 或 Edge 强度 | 边界更锐 | 白边、黑边、假边增加 |
| 纹理更丰富 | 增强 Detail 侧 | 草地 / 毛发更清楚 | 低照噪声颗粒增加 |
| 平坦区更干净 | 加强 FLATTAB 或暗部亮度锐化抑制 | 墙面 / 天空噪声下降 | 弱纹理损失 |
| 运动噪声更少 | 开启 APC-MT 降低运动区锐化 | 运动区域尖噪下降 | 运动物体发软 |

## 调试步骤
1. 在 NR3D、NR2D、YNR 基础状态确认后再调 APC。
2. 先不开强边抑制，`mergeType=0`，FLATTAB 先弱化影响，通过 `pgain/ngain` 设定整体清晰度。
3. 调细节锐化：根据草坪、纹理、小物体等细节区域调整 `detailFNum/detailGain/detailLutNum/posDeStr/negDeStr`。
4. 调边界锐化：根据视力表、TVLine、桌边等强边界调整 `edgeFNum/edgeGain/edgeLutNum/posEsStr/negEsStr`。
5. 调 FLATTAB，减少平坦区域锐化噪声，但避免误伤细节。
6. 如白边 / 黑边明显，再用 `locctrlSupsteady/locctrlSupstep` 和 SHOOTTAB 做强边抑制。
7. 低照暗部白点明显时，可开启亮度锐化强度，降低暗部锐化。
8. 开启运动联动，根据 NR3D coeff 降低大运动区域锐化，保留静止区域清晰度。

## 常见问题入口
- [[wiki/issues/锐化过强|锐化过强]]：重点检查 `pgain/ngain`、Detail / Edge 强度、强边抑制和亮度锐化强度。
- [[wiki/issues/噪声大|噪声大]]：APC 会放大噪声，尤其低照和暗区白点。
- [[wiki/issues/细节损失|细节损失]]：联查 NR 是否过强、FLATTAB 是否误伤细节、APC 细节锐化是否不足。
- [[wiki/issues/假边|假边]]：检查强边抑制、边界锐化和 DRC 局部对比。

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：21 APC；29.1.10、29.1.14、29.1.15、29.1.17。