# Clamp

Clamp 用于建立稳定的黑电平参考，是后续 Dark Shading 与整条图像链路的基础。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：黑电平基准
- 场景：黑位不稳、暗部发灰、暗场偏色、前级基线不一致
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台黑电平基准调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：黑电平基准
- 场景：黑位不稳、暗部发灰、暗场偏色、前级基线不一致

## 核心要点
- Clamp 解决的是最前级的基准问题，不是后级主观风格问题
- 黑电平基准不稳时，后面的 [[wiki/modules/ISX031_Dark Shading Compensation|Dark Shading Compensation]]、[[wiki/modules/ISX031_AE|AE]]、[[wiki/modules/ISX031_Gamma|Gamma]] 都可能被连带影响
- 如果黑位已经漂了，后面很多“发灰”“偏色”“暗部脏”都可能是假象

## 调试方法
1. 先在暗场或遮光条件下观察黑位是否稳定。
2. 若黑位整体漂移或不同通道黑位不一致，优先回看 Clamp，而不是直接调 [[wiki/modules/ISX031_Gamma|Gamma]] 或 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]。
3. 调整后同时复查看暗部中性、黑位稳定性和不同温度/增益下的一致性。

## 关键寄存器与调整作用
- `DARK_LEVEL` 及同类黑电平相关状态量
  - 控制对象：黑电平基准与当前暗电平状态。
  - 调大/调高：黑位基线更高，暗部更容易发灰。
  - 调小/调低：黑位更低、更扎实，但若过头也可能吞暗部细节。
  - 观察现象：黑场是否中性，暗部是否灰，RGB 黑位是否一致。

## 可观察项
- `DARK_LEVEL`
- 黑位是否稳定
- 暗部是否发灰
- RGB 黑位是否一致

## 调试重点
- Clamp 是前级基准，不要把它和后级风格调节混在一起
- 先稳黑位，再谈后面层次和颜色

## 常见问题
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/偏色|偏色]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_Dark Shading Compensation|Dark Shading Compensation]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]

