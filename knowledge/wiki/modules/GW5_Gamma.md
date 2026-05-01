# GW5_Gamma

GW5 Gamma 模块整理，用于记录 GEO GW5 ISP 输出色彩空间 Gamma、对比度调整和 Dynamic Gamma 调试入口。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Gamma / Dynamic Gamma
- 场景：全局对比度、低照暗部细节、高光表现、AE target 联动、ColorChecker 灰阶验证
- 适用范围：指定平台

## 模块作用
- Gamma 用于编码输出色彩空间 gamma，调整输入和输出强度比例，从而影响整体对比度。
- GW5 的 Gamma LUT 对 R / G / B 三个通道分别生效，每条 LUT 有 257 个均匀节点。
- 每个节点是 12-bit unsigned number，期望 `gamma[0]=0`、末端为 4095，其余节点定义 Gamma 曲线。

## 调试阶段
- Phase One：使用 GEO Calibration Tool 在实验室条件下完成基础 Gamma，推荐初始使用 Rec.709。
- Phase Two：结合 [[wiki/modules/GW5_AE|GW5_AE]] target 微调对比度。
- Phase Three：必要时全场景细调，并启用 Dynamic Gamma 改善低照或高光表现。

## 关键参数
- `gamma.enable`：Gamma 开关。
- `gamma.gamma_lut`：Gamma LUT。
- `dynamic_gamma_enable`：启用 Dynamic Gamma。
- `highlight_gamma_lut`：高光 / 亮场 Gamma LUT。
- `lowlight_gamma_lut`：低照 Gamma LUT。
- `highlight_gamma_switch_ev`：切换到 lowlight / highlight Gamma 的 EV 边界之一。
- `lowlight_gamma_switch_ev`：切换到 lowlight / highlight Gamma 的 EV 边界之一。
- `alpha_ev`：EV filtering alpha，值越大滤波越强，范围 0.0 到 1.0。

## Phase Two / Three 对比度调试
1. 用 ISPTune 关闭 CCM 和 Gamma，抓 ColorChecker 图。
2. 统计 ColorChecker patch 19（白）、22（中灰）、24（黑）的 mean pixel value。
3. 参考目标：白约 `236 ± 10`，中灰约 `119 ± 10`，黑约 `52 ± 10`。
4. 若对比度和主观观感不达标，打开 Gamma 模块，通过曲线 marker 调整 tone curve。
5. 调 Gamma 时不要改变 AE target point；Gamma 与 AE target 应联合找平衡。
6. 重复抓图、测量和主观确认，直到对比度满足规格。

## Dynamic Gamma
- Dynamic Gamma 建议在 Phase Three 使用。
- 低照 Gamma 通常在暗部更激进，用于提升暗部细节。
- 当前 Gamma curve 会根据 EV 与 highlight / lowlight LUT 以及 alpha filter 动态计算。
- `alpha_ev` 越大切换越平滑，但响应速度越慢。

## 调试风险
- Gamma 不是曝光补救工具；RAW 或线性数据曝光不对时，应先调 [[wiki/modules/GW5_AE|GW5_AE]]。
- 曲线局部突变会造成灰阶不顺或亮度不自然。
- 低照 Dynamic Gamma 抬暗过强会放大噪声，需要联查 [[wiki/modules/GW5_SNR|GW5_SNR]] 和 [[wiki/modules/GW5_LTM|GW5_LTM]]。
- Gamma 调整会影响 [[wiki/modules/GW5_Color|GW5_Color]] / CCM 评估，必要时需回看 CCM。

## 相关页面
- [[wiki/modules/GW5_AE|GW5_AE]]
- [[wiki/modules/GW5_Color|GW5_Color]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
