# SC121AT_ISP_Tuning_Tool

SC121AT 在线 ISP 调试工具页面，用于记录工具模块、基础操作、调参入口和容易混淆的控制权关系。

## 页面属性
- 类型：工具
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 工具：SC121AT ISP Tuning Tool
- 场景：在线调参、参数导入导出、效果保存、模块调试
- 适用范围：指定平台

## 工具定位
- ISP Tuning Tool 用于实时调节 SC121AT 参数，保存和加载调试效果参数。
- 工具左侧通过 ISP 节点展开模块树，右侧显示对应模块内容。
- 基本功能包括开关、配置参数导入/导出、自检测、刷新/写入、硬件选择、默认寄存器保存/写入、Base E2 Hex。

## 工具模块
- Option
- [[wiki/modules/SC121AT_AE|AE]]
- [[wiki/modules/SC121AT_AWB|AWB]]
- CAC
- CCM
- Contrast
- [[wiki/modules/SC121AT_HDR|HDR]]
- [[wiki/modules/SC121AT_Gamma|Gamma]] / GammaGain
- [[wiki/modules/SC121AT_LSC|LSC]]
- [[wiki/modules/SC121AT_NR|NR]]
- [[wiki/modules/SC121AT_Saturation|Saturation]]
- [[wiki/modules/SC121AT_Sharpness|Sharpness]]
- [[wiki/modules/SC121AT_HTEMP|HTEMP]]
- [[wiki/modules/SC121AT_ISPC_Controller|ISPC_Controller]]

## 使用主线
1. 在 Option 中确认硬件连接、配置导入/导出、默认寄存器、保存和写入功能。
2. 先调自动控制：[[wiki/modules/SC121AT_AE|AE]]、[[wiki/modules/SC121AT_AWB|AWB]]。
3. 再调动态范围与亮度映射：[[wiki/modules/SC121AT_HDR|HDR]]、Gamma、GammaGain、Contrast、ISPC_HDR。
4. 然后调镜头与噪声：[[wiki/modules/SC121AT_LSC|LSC]]、[[wiki/modules/SC121AT_NR|NR]]。
5. 最后调主观风格：Saturation、Sharpness、HTEMP、CCM。

## 关键注意事项
- 工具每个模块右上角的刷新、写入、保存动作要区分清楚：调试时先 Read / Update 看当前状态，再 Write / Apply 让参数生效，最后 Save All 保存新参数。
- 启用 [[wiki/modules/SC121AT_ISPC_Controller|ISPC_Controller]] 后，对应上层模块中的部分参数会失效，显示值变成 ISPC 插值结果。
- [[wiki/modules/SC121AT_AE|AE]] 中 HDR 输出格式可切 Combine、Long_exp、Medium_exp、Short_exp，适合查看不同曝光分支问题。
- 抓图格式支持 Null、Single、HDR；HDR 抓图会抓取 Combine、长、中、短四帧图像，适合排查 HDR 合成前后差异。
- LSC 标定需要 raw-full size 配置，且要确认 EEPROM 旧配置已经擦除、raw 配置已写入并重新上电验证。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/indexes/SC121AT_索引|SC121AT_索引]]
- [[wiki/workflows/SC121AT_图像质量调整流程|SC121AT_图像质量调试流程]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]

