# Pixel Shading Compensation

Pixel Shading Compensation 用于补偿像素级响应不均，减少画面固定位置的亮度或颜色偏差。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：像素阴影补偿
- 场景：固定位置偏色、边缘线性异常、HDR 复合区边缘不一致
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台像素级补偿调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：像素阴影补偿
- 场景：固定位置偏色、边缘线性异常、HDR 复合区边缘不一致

## 核心要点
- 它属于硬件变异补偿阶段，是后续 [[wiki/modules/ISX031_HDR|HDR]]、[[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_CCM|CCM]] 正常工作的前提之一
- 若像素级响应不一致未先补好，后面算法会把固定缺陷当成真实画面信息处理
- Pixel Shading Compensation 常直接影响边缘亮度一致性与局部偏色观感

## 调试方法
1. 先在均匀场景下观察中心到边缘是否存在固定亮度或颜色变化。
2. 若问题在固定位置重复出现，优先怀疑补偿不足，而不是后级自动控制问题。
3. HDR 相关问题尤其要回看边缘线性与复合区一致性，确认不是像素补偿不齐造成的假象。
4. 调整后要复查白场、灰场和多亮度场景，确认不是只在单场景下看着正常。

## 关键寄存器与调整作用
- `PICT_SPSHD_GAIN_OTP`
  - 控制对象：像素阴影补偿相关的增益入口。
  - 调大/调高：补偿更积极，固定位置亮度/颜色不均更容易被拉平，但过度会引入反向异常。
  - 调小/调低：补偿减弱，原始不均更容易暴露。
  - 观察现象：固定位置暗角、边缘偏色、局部亮度线性是否改善。

- `SHD_GAIN_*` 同类寄存器组
  - 控制对象：阴影补偿增益分布。
  - 调大/调高：对应区域补偿更强。
  - 调小/调低：对应区域补偿更弱。
  - 观察现象：中心到边缘过渡是否自然，是否出现补过头的亮边或色边。

## 可观察项
- 固定位置亮度不均
- 固定位置偏色
- HDR 边缘复合区一致性

## 调试重点
- 先把固定位置问题与场景内容问题分开
- 这类问题优先放在前级补偿阶段解决，不要让后级模块替它背锅

## 常见问题
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/高光过曝|高光过曝]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_HDR|HDR]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_CCM|CCM]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
