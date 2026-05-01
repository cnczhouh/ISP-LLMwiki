# SC121AT_Gamma

SC121AT Gamma / GammaGain 模块整理，用于记录整体亮度层次、GammaA / GammaB 插值、曲线编辑、Reference Set、Import_Export，以及高频细节增强曲线的调试方式。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：Gamma / GammaGain
- 场景：亮度层次调整、暗部抬升、高亮压缩、主观通透性调整、高频细节增强
- 适用范围：指定平台

## 模块作用
- Gamma 用于调整整体亮度层次和灰阶响应。
- SC121AT Gamma 模块包含 GammaA 和 GammaB 两条曲线。
- 高亮场景时 GammaA 生效，低亮场景时 GammaB 生效，中等亮度场景取 GammaA 与 GammaB 插值。
- GammaGain 用于增加高频信号，横轴代表亮度，纵轴代表高频信息增强强度；值越高，对应亮度处的细节增强强度越高。

## Gamma 曲线编辑
- 每条 Gamma 曲线分布 33 个点，每个点可单独上下调节。
- Curve 可选择曲线上取点个数，便于修改曲线，支持 5、8、12、16、20、33 点。
- 工具提供三次样条插值和 Bezier 两种曲线平滑方式。
- 三次样条更贴近控制点；Bezier 可保证整条曲线平滑，但缺点是不经过所有点。
- 右侧列表显示当前 Gamma 曲线对应的寄存器地址和值。

## Reference Set 与 Import_Export
- Reference Set 提供 5 组 gamma 数据暂存。
- Save：保存当前 gamma 值到对应 Set 组。
- Use：调出对应 Set 组 gamma 值，刷新到页面并写入对应寄存器。
- Import_Export 提供 gamma 数据导入导出。
- Save Data：将当前 gamma 数据保存到本地。
- Load Data：从本地导入存有 gamma 数据的 `.txt` 文档，将曲线绘制到页面并写入对应寄存器。

## GammaGain
- GammaGain 的曲线调试方法与 Gamma 完全一致。
- GammaGain 曲线 A / B 与 Gamma 模块中曲线 A / B 共用一套增益逻辑：
  - 高亮场景时 GammaA / GammaGain A 生效。
  - 低亮场景时 GammaB / GammaGain B 生效。
  - 中等亮度场景取 A / B 插值。
- GammaGain 调高会提升对应亮度段的高频增强，但也可能放大噪声、假边和过锐观感。

## 调试建议
1. 先确认 [[wiki/modules/SC121AT_AE|SC121AT_AE]] target 和 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]] Tonemapping 合理，再调 Gamma。
2. 暗部发灰时，不要只抬 Gamma，也要检查 Local Tonemapping、[[wiki/modules/SC121AT_Contrast|SC121AT_Contrast]]、LSC 和黑电平。
3. 高亮场景优先看 GammaA，低亮场景优先看 GammaB，中间亮度注意插值过渡是否自然。
4. Gamma 曲线不要出现局部突变，否则容易造成灰阶断层或亮度不自然。
5. 若提升 GammaGain 后清晰度变好但噪声、假边更明显，应联查 [[wiki/modules/SC121AT_NR|SC121AT_NR]] 和 [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]。
6. 多版本曲线对比优先使用 Reference Set，避免直接覆盖已验证曲线。

## 常见问题入口
- [[wiki/issues/亮度不自然|亮度不自然]]：检查 GammaA / GammaB 与 HDR tone mapping 是否冲突。
- [[wiki/issues/暗部发灰|暗部发灰]]：检查 GammaB、Contrast Low Level、Local Tonemapping 和 LSC。
- [[wiki/issues/细节损失|细节损失]]：检查 GammaGain 是否过弱，或 NR 是否已抹掉细节。
- [[wiki/issues/假边|假边]]：检查 GammaGain、Sharpness 和 HDR 合成边缘。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_Contrast|SC121AT_Contrast]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
