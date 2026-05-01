# GW5_SNR

GW5 Spatial Noise Reduction（SNR）模块整理，用于记录 GEO GW5 ISP RAW 空间降噪、多频段阈值、径向降噪和 EV 相关调制。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Spatial Noise Reduction / SNR
- 场景：亮度噪声、低照高 gain、边角噪声、texture preservation、HDR 短曝光噪声
- 适用范围：指定平台

## 模块作用
- SNR 在 RAW spatial domain 中降低噪声，同时尽量保留纹理和细节。
- 目标是避免 posterization、banding 等不自然 artifact，并通过寄存器精细控制降噪强度。
- SNR 依赖 sensor calibration 生成的 noise profile LUT。

## 调试阶段
- Phase One：不调。
- Phase Two：在实验室主调大多数场景。
- Phase Three：按 EV fine tune，并与 DPC、Demosaic、Sharpening 逐 EV 联合调试。

## 前置条件
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
- [[wiki/modules/GW5_DPC|GW5_DPC]] 已调定。
- [[wiki/modules/GW5_GE|GW5_GE]] 已调定。
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]] 已调定。
- Noise profile 已生成。
- 调 SNR 时禁用 [[wiki/modules/GW5_LTM|GW5_LTM]]。

## 关键参数
- `noise_reduction.enable`：SNR 开关。
- `adaptive_enable`：启用 adaptive SNR。
- `intensity_config`：RAW 与 intensity image 的 alpha blend。
- `intensity_filter`：选择 intensity / RAW filter domain。
- `filter_select`：filter fine tuning，资料建议不要修改。
- `rm_enable`：启用 radial noise reduction modulation。
- `rm_center_x/y`：径向降噪中心坐标。
- `rm_off_center_mult`：径向表归一化因子。
- `radial_lut`：径向阈值 offset LUT。
- `noise_profile_lut`：sensor calibration 生成的 noise profile。
- `thresh_1h/1v`、`thresh_4h/4v`：高 / 低空间频率垂直 / 水平噪声阈值。
- `strength_1`、`strength_4`：高 / 低空间频率滤波结果 blending。
- `strength_lut`、`strength1_lut`、`strength4_lut`、`thresh1_lut`、`thresh4_lut`：EV 调制 LUT。

## Phase Two 调试流程
1. 使用含 ColorChecker、丰富纹理、彩色纹理、平坦区域和 / 或 ISO12233 的 studio scene。
2. 初始关闭 SNR，抓 gain 1 图，用 Imatest ColorChecker 统计 patch 22 SNR，作为未降噪基线。
3. 开启 SNR，观察纹理、细节和 SNR 变化。
4. 通过 `strength_lut` 控制全局降噪强度。
5. 区分高频 salt-and-pepper noise 与低频 blotches。
6. 若某类噪声可见，增加对应 `thresh_[1/4]v/h`；水平和垂直值应保持一致。
7. 若过度模糊，降低对应 `strength_[1/4]`，让部分噪声保留为纹理感。
8. 若 LSC 后边角噪声明显，启用 radial noise reduction，设置中心、`rm_off_center_mult` 和 `radial_lut`。
9. 对 sparkles，可调 `intensity_config`，但应先确认不是 DPC、Demosaic 或 Sharpening 引入。
10. 全 gain 抓图验证，确认 SNR 和 texture preservation 达标。

## Radial NR
- 若没有边角噪声问题，`rm_enable=0`。
- 若需要径向降噪，中心通常设为图像宽高一半。
- `rm_off_center_mult = 2^31 / R^2`，R 为中心到图像边缘最远距离。
- `radial_lut` 对所有 scale 和 main threshold 添加 offset，常只对靠近角落的节点增加值。

## 参考 SNR 目标
- D65 低 gain：Good 40~50，Fair 35~40，Poor <35。
- Halogen 最大 gain：Good 25~35，Fair 15~25，Poor <15。
- 这些数值只能作为起点，最终仍要按 sensor 噪声和主观细节判断。

## Phase Three 细调
- 噪声不可见的低 EV 场景，threshold 保持最小。
- 推荐保留 `strength_lut` 默认值，优先用 frequency noise filtering 的 LUT 调制。
- ON-ISP combined modes 下，可对每个曝光设置 noise profile scale，短曝光因积分时间短、噪声更高，通常需要更强 smoothing。

## 调试风险
- SNR 指标不能替代主观判断，SNR 高但纹理丢失仍不可接受。
- 低频噪声抑制过强会造成塑料感或涂抹。
- 高频噪声抑制不足会保留颗粒；抑制过强会损失细节。
- SNR 与 [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]、Sharpening、[[wiki/modules/GW5_LSC|GW5_LSC]]、[[wiki/modules/GW5_LTM|GW5_LTM]] 强耦合。

## 相关页面
- [[wiki/modules/GW5_DPC|GW5_DPC]]
- [[wiki/modules/GW5_Demosaic|GW5_Demosaic]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/涂抹感|涂抹感]]
- [[wiki/issues/细节损失|细节损失]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
