# GW5_GE

GW5 Green Equalization（GE）模块整理，用于记录 GEO GW5 ISP Gr / Gb 不平衡校正、checker pattern 抑制和 demosaic 前置验证。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Green Equalization / GE
- 场景：Gr/Gb 不平衡、checker pattern、false color、demosaic 前置校正
- 适用范围：指定平台

## 模块作用
- GE 用于校正 Gr 与 Gb 色彩平面之间的响应不一致，使两类 green pixel 具有更接近的敏感度。
- GE 可降低 demosaic 后 checker pattern，并改善 demosaic false color correction。
- 现代 sensor 通常 Gr/Gb 不平衡较小，默认值可能已足够，但进入 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 前仍应验证。

## 调试阶段
- Phase One：不调。
- Phase Two：在 Demosaic 前验证或调试。
- Phase Three：通常不调，除非怀疑 GE 引入 artifact。

## 前置条件
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
- Noise profile 已生成。

## 关键参数
- `greeneq.enable`：GE 开关。
- `greeneq.strength`：GE 强度。
- `greeneq.threshold`：触发 GE 所需的 Gr/Gb 差异阈值。
- `greeneq.slope`：超过阈值后的 Gr/Gb blending。
- `greeneq.sensitivity`：对边缘区域的 GE 敏感度。

## 参数理解
- 当 green pixel 与邻近 Gr / Gb 平均值差异小于 `threshold` 时，会按差异和 raw pixel 值替换为 blended value。
- 增大 `threshold` 或 `slope` 会让 GE 更激进。
- `sensitivity` 用于控制边缘上的 GE，值越高，边缘上的 green equalization 越强。

## 默认验证值
- `greeneq.enable = 0`
- `greeneq.strength = 248`
- `greeneq.threshold = 170`
- `greeneq.slope = 285`
- `greeneq.sensitivity = 128`

## 调试风险
- GE 不应在真实边缘上过强校正，否则可能引入边缘 artifact。
- 若 Demosaic 调试中关闭 GE 后 artifact 消失，应回调 `threshold`、`strength` 和 `sensitivity`。
- GE 与 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 强相关，不能孤立看 checker pattern。

## 相关页面
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_DPC|GW5_DPC]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/细节损失|细节损失]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
