# Dark Shading Compensation

Dark Shading Compensation 用于补偿暗电流和暗场下的空间不均，减少黑场偏差和暗部固定纹理异常。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：暗场阴影补偿
- 场景：暗场不均、黑位脏、暗部固定纹理、温漂带来的黑场异常
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台暗场补偿调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：暗场阴影补偿
- 场景：暗场不均、黑位脏、暗部固定纹理、温漂带来的黑场异常

## 核心要点
- 它建立在 [[wiki/modules/ISX031_Clamp(BLC)|Clamp(BLC)]] 之后，是硬件变异补偿阶段的重要一环
- 若 Dark Shading 没补好，暗部噪声和偏色会呈现出固定空间分布，而不是纯随机噪声
- 后级 [[wiki/modules/ISX031_NR|NR]] 只能压观感，不能根治前级暗场基线不均

## 调试方法
1. 在暗场或遮光场景下观察是否存在固定区域更亮、更脏或偏色。
2. 先确认 [[wiki/modules/ISX031_Clamp(BLC)|Clamp(BLC)]] 是否稳定，再进入 Dark Shading 补偿。
3. 若暗部问题在固定位置反复出现，优先怀疑暗场补偿不均，而不是只怪 NR。
4. 调整后复查不同温度、增益和曝光时间下的稳定性，因为暗电流问题常随条件变化。

## 关键寄存器与调整作用
- `DARK_LEVEL`、`DARKLEVEL_STB` 等黑场相关状态量
  - 控制对象：暗场基线与稳定状态。
  - 调大/调高：暗场补偿可能显得更积极，但黑位也可能被抬灰。
  - 调小/调低：黑位更低，但暗场不均可能残留。
  - 观察现象：暗场是否干净、中性，是否存在固定区域异常。

- 暗场补偿系数相关寄存器组
  - 控制对象：空间暗场补偿分布。
  - 调大/调高：对应区域补偿更强，固定暗场不均更容易被拉平。
  - 调小/调低：补偿更弱，原始暗场不均更容易显现。
  - 观察现象：固定亮斑、暗斑、彩斑是否减少，是否出现补偿过头的反向痕迹。

## 可观察项
- 暗场固定纹理
- 黑位中性
- 温漂后是否仍稳定
- 固定区域是否更脏或更亮

## 调试重点
- 先区分随机噪声和固定空间不均
- Dark Shading 是前级基线补偿，优先级高于后级观感修饰

## 常见问题
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/偏色|偏色]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_Clamp(BLC)|Clamp(BLC)]]
- [[wiki/modules/ISX031_NR|NR]]
- [[wiki/modules/ISX031_Gamma|Gamma]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]

