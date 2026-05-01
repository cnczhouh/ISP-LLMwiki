# DemoSensor_AE

DemoSensor_AE 用于演示自动曝光页面的基本写法：先写模块目标，再写观察指标、参数影响和常见问题入口。

## 页面属性
- 类型：平台模块
- 厂家：Demo Vendor
- 平台：[[wiki/platforms/DemoSensor|DemoSensor]]
- 模块：Auto Exposure / AE
- 场景：亮度目标、曝光收敛、低照增益限制
- 适用范围：指定平台

## 模块作用
- AE 负责根据场景亮度调整曝光时间和增益。
- 亮度目标过低时，画面可能整体偏暗；亮度目标过高时，高光区域更容易过曝。
- AE 的输出会影响后续 Gamma、Tone Mapping 和降噪模块的调试基准。

## 调试视角
- 先确认曝光统计区域是否覆盖主体。
- 再确认最大曝光时间、最大 gain 和目标亮度是否符合场景。
- 低照场景需要同时观察亮度、噪声和拖影，不建议只追求画面变亮。

## 相关页面
- [[wiki/platforms/DemoSensor|DemoSensor]]
- [[wiki/issues/画面偏暗|画面偏暗]]
- [[wiki/workflows/图像问题排查流程|图像问题排查流程]]
- [[wiki/tools/Demo_Tuning_Tool|Demo_Tuning_Tool]]

## 来源
- [[raw/README.md|示例 raw 目录说明]]

