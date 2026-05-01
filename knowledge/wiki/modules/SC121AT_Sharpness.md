# SC121AT_Sharpness

SC121AT 锐化模块整理，用于记录边缘增强、长 / 中曝光分支、手动 / 自动强度、随增益自适应和正负边缘限制。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：Sharpness / Edge Enhancement
- 场景：主观清晰度、细节增强、假边 / 黑边 / 噪声增强排查
- 适用范围：指定平台

## 模块作用
- Sharpness 模块分为手动设置、自动设置和边缘增强限制三部分。
- 可按曝光类型选择长曝光或中曝光，当前调试效果只对当前选择的曝光生效。
- 自动模式可按不同 gain 配置边缘增强强度，实现随增益自适应。
- Sharpness 应在 [[wiki/modules/SC121AT_NR|SC121AT_NR]] 基线完成后调，否则会放大残余噪声。

## 关键参数
- `Enable`：当前曝光类型对应的边缘增强开关。
- `Exp_Type`：曝光类型选择，分长曝光和中曝光。
- `Current Gain`：当前 gain 倍数，点击 Update 更新；自动模式下按当前 gain 配置边缘增强强度。
- `Manual`：手动边缘增强强度设置模块。
- `Auto`：自动边缘增强强度设置模块，可通过配置不同 gain 的边缘增强强度实现自适应。
- `Limitation`：边缘增强限制模块。
- `Ratio_Value`：比例值限制，用于限制正负边缘相对于细节的最大增强比例。
- `Absolute_Value`：绝对值限制，用于限制正负边缘最大值。
- `N_Strength`：负边缘增强强度。
- `P_Strength`：正边缘增强强度。
- `N_Strength current` / `P_Strength current`：当前正负边缘增强强度。

## 调试建议
1. 先完成 NR，再调 Sharpness；否则锐化会放大残余噪声。
2. 按长曝光 / 中曝光分别确认效果，不要只调一个分支。
3. 低 gain 可适当增强清晰度，高 gain 应通过 Auto 降低锐化强度，避免低照噪声被拉起。
4. 假边明显时，先检查 `Ratio_Value` / `Absolute_Value`，再看 `P_Strength` / `N_Strength` 是否过高。
5. 文字边缘有白边 / 黑边时，分别观察正边缘和负边缘，不要只整体降低锐化。
6. HDR 高反差边缘出现黑边时，先回看 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]] Combine 的 Edge Tuning 与 Black Edge，再判断 Sharpness。

## 常见问题入口
- [[wiki/issues/假边|假边]]：检查边缘限制、正负边缘强度和 HDR 合成边界。
- [[wiki/issues/细节损失|细节损失]]：确认 NR 是否先抹掉细节，再用锐化硬拉。
- [[wiki/issues/噪声大|噪声大]]：高 gain 锐化过强会放大噪声。
- [[wiki/issues/涂抹感|涂抹感]]：锐化无法真正恢复被 NR 抹掉的纹理。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/细节损失|细节损失]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
