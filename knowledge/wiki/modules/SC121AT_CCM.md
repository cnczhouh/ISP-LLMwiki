# SC121AT_CCM

SC121AT Color Correction Matrix（CCM）模块整理，用于记录 SmartSens Tuning Tool 中 CCMAuto、CCM-ISPC、色温阈值和随增益降低 CCM 强度的调试逻辑。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：CCM / Color Correction Matrix
- 场景：颜色校正、色温切换、饱和度后矩阵微调、低照降低 CCM 强度
- 适用范围：指定平台

## 模块作用
- CCM 用于通过颜色校正矩阵修正色彩还原，是 AWB 之后、Saturation 等主观颜色调整之前的关键模块。
- SC121AT 工具中 CCM 分为 CCMAuto 和 CCM-ISPC 两块，资料说明 SC121AT 使用 CCM-ISPC。
- CCMAuto 和 CCM-ISPC 都提供高色温和低色温两组 CCM 矩阵，可根据实际效果微调矩阵值。

## 控制权关系
- 当选用 CCM-ISPC 时，CCMAuto 会失效。
- 若出现矩阵参数修改不生效，应先确认当前使用的是 CCM-ISPC 还是 CCMAuto，以及是否被其他 ISPC 逻辑接管。

## 色温阈值与插值
- `CT` 用于设置色温阈值。
- 当前色温大于 A 阈值时，选择 CCML。
- 当前色温小于 D65 阈值时，选择 CCMH。
- A 与 D65 之间时，CCMH 与 CCML 做线性插值。
- CT 计算方式：`BGain << 8 / Rgain`，其中 BGain 和 Rgain 可从 [[wiki/modules/SC121AT_AWB|SC121AT_AWB]] 模块读取。
- `A`：设置 A 光源色温阈值。
- `D65`：设置 D65 色温阈值。

## 随增益降低 CCM 强度
- CCM_ISPC 支持随增益降低 CCM 强度至单位矩阵。
- `Gain_start_th`：开始降低 CCM 强度的 gain 阈值。
- `Gain_end_th`：结束降低 CCM 强度的 gain 阈值。
- `Cur_gain`：当前 gain 值。
- 该策略适合低照高 gain 场景，避免强矩阵放大颜色噪声或造成低照颜色不稳定。

## Import_Export
- Save Data：保存 CCM 矩阵参数到本地。
- Load Data：从本地导入 CCM 矩阵参数，刷新到页面并写入对应寄存器。

## 调试建议
1. 先确认 [[wiki/modules/SC121AT_AWB|SC121AT_AWB]] 能正确识别白点，再调 CCM。
2. 一般情况下，先完成基础饱和度方向判断，再微调 CCM 矩阵。
3. 若高低色温之间颜色跳变，检查 A / D65 阈值和 CCMH / CCML 插值。
4. 若低照颜色发脏或色噪明显，检查 `Gain_start_th` / `Gain_end_th` 是否让 CCM 强度随 gain 合理回落。
5. 若灰卡正常但肤色或草地不讨好，再进入 CCM 与 [[wiki/modules/SC121AT_Saturation|SC121AT_Saturation]] 的主观风格平衡。

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：先分清 AWB 白点错误还是 CCM 矩阵错误。
- [[wiki/issues/颜色不自然|颜色不自然]]：检查 CCM 与 Saturation 是否调过头。
- [[wiki/issues/肤色不准|肤色不准]]：灰卡中性后再看 CCM 与 Saturation。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]
- [[wiki/modules/SC121AT_Saturation|SC121AT_Saturation]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/肤色不准|肤色不准]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
