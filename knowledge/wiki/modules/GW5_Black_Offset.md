# GW5_Black_Offset

GW5 Black Offset / Black Level Correction 模块整理，用于记录 GEO GW5 ISP 黑电平静态标定、gain 相关 LUT 和后级模块基线风险。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Black Offset / Black Level Correction
- 场景：暗场标定、黑位基线、低照偏色、后级 ISP 调试前置条件
- 适用范围：指定平台

## 模块作用
- Black Offset 用于移除 sensor 输出中的黑电平 offset，是 GW5 调试流程中最先需要调定的模块之一。
- 该模块对后续所有 ISP 模块都有影响；黑电平不准会影响 [[wiki/modules/GW5_LSC|GW5_LSC]]、[[wiki/modules/GW5_AWB|GW5_AWB]]、[[wiki/modules/GW5_Color|GW5_Color]]、[[wiki/modules/GW5_LTM|GW5_LTM]] 和降噪判断。
- 校正通过四个 Bayer 分量分别减去 offset：R、GR、GB、B。

## 调试阶段
- Phase One：在实验室暗场条件下完成所有场景黑电平标定，使用 GEO Calibration Tool。
- Phase Two：通常不再调，除非 Phase One 标定表现不佳。
- Phase Three：通常不再调，若此阶段发现黑电平问题，调整后需要重新验证后级系统。

## 关键参数
- `black_offset.r_lut`：R 通道黑电平 offset。
- `black_offset.gr_lut`：GR 通道黑电平 offset。
- `black_offset.gb_lut`：GB 通道黑电平 offset。
- `black_offset.b_lut`：B 通道黑电平 offset。

## 调试流程
1. 盖住镜头，关闭所有灯光，并遮挡 PCB LED 等不可关闭光源，确保 sensor 完全处于黑暗。
2. 在最小 gain、最大 integration lines 下抓暗场图。
3. 按 gain 逐级递增，每个 gain 抓一张暗场图，直到 sensor 最大 gain。
4. 打开 GEO Calibration Tool，从 gain 0 对应图开始加载暗场图并分析 R / GR / GB / B offset。
5. 若 offset 符合规格，继续下一个 gain；若不符合，重新抓图。
6. 全部 gain 图像分析完成后，保存标定参数。

## 调试风险
- 若 sensor 黑电平不均匀，可适当设置更高黑电平，避免局部色偏。
- 高 gain 下黑电平可能不同，需要建立随 gain 变化的 LUT，避免低照局部色偏或暗部 artifact。
- 若 Phase Two / Three 才修改黑电平，后续模块需要重新验证，因为黑位基线已经改变。

## 相关页面
- [[wiki/platforms/GW5|GW5]]
- [[wiki/workflows/GW5_图像质量调整流程|GW5_图像质量调试流程]]
- [[wiki/modules/GW5_LSC|GW5_LSC]]
- [[wiki/modules/GW5_LTM|GW5_LTM]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/偏色|偏色]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]

