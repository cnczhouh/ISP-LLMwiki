# SC121AT_AWB

SC121AT 自动白平衡模块整理，用于记录 AWB 标定、白点判断、graph 边界和偏色设置。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：AWB
- 场景：白平衡标定、偏色排查、低色温/低光偏色调整
- 适用范围：指定平台

## 模块作用
- AWB 模块分为 Calibration 和 Debug 两部分。
- 新镜头或新模组导入时，需要先做 AWB 标定，再做白点识别与偏色调试。
- AWB 不是只调最终色偏，还要先确认白点区域是否正确，否则后续 CCM / Saturation 调整会掩盖根因。

## 标定流程
1. 勾选 Calibration，打开标定功能。
2. 勾选 Calibration_Step1 的 Enable，使能 Step1。
3. 勾选参与标定的色温。
4. 在灯箱中依次切换色温并调节亮度，避免画面出现过曝区域。
5. 对每个色温点击 Read，读取当前色温的白平衡值。
6. 根据 Step1 结果进入 Step2，调整高、中、低色温标定区间。

## 调试流程
1. 勾选 Check_White_Pixel 的 Mark，打开白点标记功能。
2. 在灯箱中切换光源，观察 AWB 是否正确找到白点。
3. 如果不能正确找到白点，结合 Calibration_Step2 的 Single Side 定位是哪一侧、哪一色温的白点边界出问题。
4. 白点正确后，关闭 Calibration，进入 Debug，勾选 Enable。
5. 若白点正确但白色仍偏色，读取当前 B_Gain 和 R_Gain，检查是否受到 Step1 的 Min / Max 限制。
6. 如受到限制，调整 Min / Max 后 Write 生效。

## Graph 理解
- Graph 中 x 轴是 R/G，y 轴是 B/G。
- Step1 生成的 Max / Min 会体现在坐标轴上。
- Step2 的高中低色温区域应尽量形成刚好封闭的区域。
- `(B+R)/G` 主要决定高中低色温区域的斜边，min 影响左下角斜边，max 影响右上角斜边。
- 区域不宜一次调太大，否则会把大量非白色物体识别为白点，导致 AWB 不准确。

## 偏色设置
- Color_Bias_Setting 可分别对高、中、低色温，以及低色温低光环境做偏色设置。
- 滑动条范围为 -7 ~ 8，数值越大效果越强。
- Strengthen 会让偏色设置强度加倍。
- 低色温和低光环境也可以通过调整 B_Gain / R_Gain 范围实现偏色设置。
- State 表示当前环境是否处于低色温或低光环境，Update 可更新当前状态。

## 常见问题入口
- TL84 或低色温下找不到白点：先看白点标记，再调 Step2 区域，不要直接调 CCM。
- 白点找到但仍偏色：检查 B_Gain / R_Gain 是否被 Min / Max 限制。
- 低照偏色：重点检查低色温低光环境的偏色设置和增益范围。
- 白色物体受彩色物体干扰：检查白点区域是否过大，尤其是 Graph 的封闭区域是否误收颜色点。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/modules/SC121AT_Saturation|SC121AT_Saturation]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
