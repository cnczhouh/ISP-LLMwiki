# ATR

ATR 用于基于亮度信息做层次压缩或补偿，以增强亮部和暗部的可见性。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Adaptive Tone Reproduction
- 场景：亮度观感、暗部可见性、高光压缩
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台 ATR 调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Adaptive Tone Reproduction
- 场景：亮度观感、暗部可见性、高光压缩

## 核心要点
- ATR 影响最终输出图像的主观亮度，不等同于 RAW 曝光控制
- 调整亮度时，手册建议通过 ATR 的 tone curve 作为代表性方法
- AE 调整完成后，最终观感仍可能因 ATR 设置不同而变化

## 调试方法
1. 先区分问题属于曝光不足，还是 ATR tone curve 导致的观感偏暗/偏亮。
2. 调整 `STRENGTH_MODE_OBLEND_RATIO`，观察整体亮度变化。
3. 在暗部细节、高光压缩和中间调自然度之间找平衡。
4. ATR 调整前先让 [[wiki/modules/ISX031_AE|AE]] 基本稳定，否则两者会互相掩盖问题。
5. 调完 ATR 后回看 [[wiki/modules/ISX031_Gamma|Gamma]]、[[wiki/modules/ISX031_CCM|CCM]] 和噪声观感是否被一并改变。

## 关键寄存器与调整作用
- `STRENGTH_MODE_OBLEND_RATIO`
  - 控制对象：用于亮度信息压缩的色调曲线混合比例，可理解为 ATR 对输出亮度观感的参与强度。
  - 调大/调高：暗部更容易被抬起，整体观感会更亮，高光压缩也会更明显；过高时画面容易发灰、层次变假。
  - 调小/调低：画面更接近原始亮度关系，对比感更直接，但暗部可见性下降，高反差场景更容易显得压暗。
  - 观察现象：暗部是否更可见，高光是否被压平，中间调是否自然，整体亮度是否只是“更亮”而不是“更脏”。

- `STRENGTH_MODE_GAIN_RATIO`
  - 控制对象：对比度分量的解压缩级别。
  - 调大/调高：屏幕上的对比感会更强，层次更“立”，但也更容易让亮暗交界显硬，并放大噪声和颜色不均。
  - 调小/调低：对比度更平缓，画面更柔和，但若过低会显得发闷、缺少立体感。
  - 观察现象：主体轮廓是否更立体，中间调是否更有层次，暗部噪声和肤色过渡是否被一起拉坏。

## 可观察项
- `STRENGTH_MODE_OBLEND_RATIO`
- 暗部细节是否抬起
- 高光是否被压扁
- 中间调是否失真
- 最终主观亮度与 RAW 曝光是否一致

## 调试重点
- ATR 调的是输出观感，不是直接修改 RAW 曝光
- 亮度问题先分 AE 还是 ATR，再决定从哪边下手
- 调得过强会让画面发灰、层次假或对比度异常

## 常见问题
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/亮度不自然|亮度不自然]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_AE|AE]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_HDR|HDR]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]

