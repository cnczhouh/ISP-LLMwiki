# Gamma

Gamma 校正用于调整亮度或色彩的层次映射，是 ISX031 图像质量调优链路中的关键信号级功能。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Gamma 校正
- 场景：亮度层次、对比度观感、色彩观感
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台 Gamma 调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Gamma 校正
- 场景：亮度层次、对比度观感、色彩观感

## 核心要点
- 调优手册将 Gamma adjustment 归入信号级系统调整
- 应用说明书将 Gamma 细分为 [[wiki/modules/ISX031_Gamma|RGB Gamma]] 与 [[wiki/modules/ISX031_Gamma|Y Gamma]] 两类功能
- Gamma 与 [[wiki/modules/ISX031_ATR|ATR]]、[[wiki/modules/ISX031_CCM|CCM]]、[[wiki/modules/ISX031_AWB|AWB]] 的主观观感耦合较强
- RGB Gamma 在 YCbCr 转换前作用于 RGB 信号，Y Gamma 在 YCbCr 转换后作用于亮度信号

## 调试方法
1. 先确认 [[wiki/modules/ISX031_AE|AE]]、[[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_ATR|ATR]] 基本稳定，再调 Gamma。
2. 明确是颜色层次问题还是亮度层次问题：前者先看 [[wiki/modules/ISX031_Gamma|RGB Gamma]]，后者先看 [[wiki/modules/ISX031_Gamma|Y Gamma]]。
3. 以典型场景或对比度调试场景为基准，观察暗部、中间调、高光过渡。
4. 按控制点逐段调整曲线，而不是一次性整体拉升或压低。
5. 调整后回看颜色、对比度、肤色和噪声感知是否一起被改变。
6. 每次调整后保存修正值，并在多个亮度场景下复核。

## 关键寄存器与调整作用
- `PICT_YGAMMA`
  - 控制对象：Y Gamma 功能总开关或主控制入口。
  - 调大/调高：更适合作为功能使能或主控制状态理解；启用后，亮度层次将按照 Y Gamma 曲线映射，主观明暗关系会发生明显变化。
  - 调小/调低：关闭或减弱后，输出更接近未做 Y Gamma 修正时的亮度关系。
  - 观察现象：整体亮度层次是否开始按曲线变化，暗部/高光过渡是否明显变化。

- `YGM_CTRL_POINT_01_GAI` ~ `YGM_CTRL_POINT_21_GAI`
  - 控制对象：Y Gamma 的 21 个控制点，用于定义亮度曲线形状。
  - 调大/调高：某段控制点上抬，会让对应输入亮度区间的输出更亮；暗部点上抬会提暗部，中间点上抬会提中间调，高光点上抬会让高亮更容易顶住。
  - 调小/调低：对应亮度区间被压低，暗部会更沉，中间调更收敛，高光更容易被压住保层次。
  - 观察现象：是哪一段层次发生变化，暗部是否抬灰，高光是否压死，中间调是否仍然自然。

- `YGM_GAIN2_01_IL_TYPE_SEL`、`N2_01_VAL_A`、`N2_01_VAL_B`
  - 控制对象：与 Y Gamma 曲线控制点和照度联动相关的参数分组。
  - 调大/调高：不同照度下的曲线差异会更明显，低照和高照的亮度风格更容易被区分开。
  - 调小/调低：不同照度间的曲线差异缩小，整机风格更统一，但特殊照度场景下优化空间会变小。
  - 观察现象：白天和夜晚是否沿用不同亮度层次策略，切换照度时画面风格是否突变。

- `RGB Gamma` 控制点组
  - 控制对象：RGB 通道在进入 YCbCr 之前的层次映射，主要影响色彩明暗关系与颜色观感。
  - 调大/调高：对应通道或区段被抬起后，相关颜色会更亮、更显，若三通道不一致还会引入新的偏色。
  - 调小/调低：对应颜色区段会被压暗，能压住某些颜色溢出，但也可能让肤色或主色显得发闷。
  - 观察现象：偏色是来自 [[wiki/modules/ISX031_AWB|AWB]] / [[wiki/modules/ISX031_CCM|CCM]] 还是来自 RGB Gamma，肤色和高饱和色块是否变得不自然。

## 可观察项
- RGB Gamma 的 21 个 Knot Points
- Y Gamma 的 21 个 Knot Points
- 暗部层次是否抬灰
- 高光是否压死
- 中间调过渡是否自然

## 调试重点
- 分清亮度层次问题和色彩问题分别落在哪类 Gamma 上
- 调整前先确认曝光和白平衡基本稳定
- 观察暗部层次、高光压缩和中间调过渡是否自然
- Gamma 容易与 [[wiki/modules/ISX031_ATR|ATR]] 和 [[wiki/modules/ISX031_CCM|CCM]] 互相掩盖问题

## 常见问题
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/偏色|偏色]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/workflows/ISX031_图像质量调整流程|ISX031_图像质量调试流程]]
- [[wiki/modules/ISX031_ATR|ATR]]
- [[wiki/modules/ISX031_CCM|CCM]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_Gamma|RGB Gamma]]
- [[wiki/modules/ISX031_Gamma|Y Gamma]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]


