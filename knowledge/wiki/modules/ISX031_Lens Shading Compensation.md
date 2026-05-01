# Lens Shading Compensation

Lens Shading Compensation 用于补偿镜头带来的中心到边缘亮度或颜色衰减。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：镜头阴影补偿
- 场景：边缘发暗、边缘偏色、广角镜头亮度不均
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台镜头阴影补偿调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：镜头阴影补偿
- 场景：边缘发暗、边缘偏色、广角镜头亮度不均

## 核心要点
- 它属于硬件变异补偿阶段，主要解决镜头系统带来的渐进式不均
- 与 [[wiki/modules/ISX031_Pixel Shading Compensation|Pixel Shading Compensation]] 的差别在于，它更偏向光学系统引起的整体空间分布问题
- 如果 Lens Shading 没打好，边缘偏色与边缘发暗会持续影响 [[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_CCM|CCM]] 和主观观感

## 调试方法
1. 在均匀白场、灰场或积分球场景下观察中心到边缘的亮度与颜色变化。
2. 先区分问题是固定局部异常，还是典型的中心到边缘渐进变化。
3. 若边缘总是偏暗或偏某种颜色，优先回看镜头阴影补偿而不是直接调后级风格。
4. 调整后同时看多色温场景，避免白场补平了，但暖光/冷光下边缘颜色又不一致。

## 关键寄存器与调整作用
- `SHD_GAIN_*` 同类补偿寄存器组
  - 控制对象：镜头阴影补偿的空间增益分布。
  - 调大/调高：边缘补偿更强，边缘更亮，边缘色差也可能被拉回。
  - 调小/调低：边缘补偿更弱，镜头原始衰减更容易暴露。
  - 观察现象：边缘发暗是否改善，边缘偏色是否减轻，是否出现补偿过头的亮边。

## 可观察项
- 中心到边缘亮度衰减
- 中心到边缘颜色变化
- 多色温下边缘一致性

## 调试重点
- 先判断是镜头渐进问题还是像素/坏点类固定问题
- 优先在均匀场景下确认，不要拿复杂纹理画面直接判断

## 常见问题
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/亮度不自然|亮度不自然]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_Pixel Shading Compensation|Pixel Shading Compensation]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_CCM|CCM]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]

