# SC360AT_ISP_Tuning_Tool

SC360AT ISP Tuning Tool 是 SmartSens 为 SC360AT 提供的在线调试工具，用于实时调节 ISP 参数、保存和加载调试效果参数。

## 页面属性
- 类型：工具
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：ISP Tuning Tool / 在线调参
- 场景：实时调参、参数读写、保存加载、模块调试入口
- 适用范围：指定平台

## 工具模块
- Option
- [[wiki/modules/SC360AT_AE|AE]]
- AWB Calibration
- [[wiki/modules/SC360AT_AWB|AWB]]
- [[wiki/modules/SC360AT_CAC|CAC]]
- [[wiki/modules/SC360AT_CCM|CCM]]
- [[wiki/modules/SC360AT_Contrast|Contrast]]
- [[wiki/modules/SC360AT_HDR|HDR]]
- [[wiki/modules/SC360AT_Gamma|Gamma / GammaGain]]
- [[wiki/modules/SC360AT_LSC|LSC]]
- [[wiki/modules/SC360AT_NR|NR]]
- [[wiki/modules/SC360AT_Saturation|Saturation]]
- [[wiki/modules/SC360AT_Sharpness|Sharpness / YUVDNS]]
- ISP Control：包含 ISPC_HDR、AWB_WP_WEIGHT 等控制入口。

## 使用注意
- 调试界面左侧点击 ISP 节点后展开模块树，右侧显示对应模块参数。
- 多数模块支持 Read / Write / Save / Load 类操作，调试时应保存原始参数和修改后参数。
- 当 ISPC_HDR 中启用某些子模块时，上方 HDR、AE、Saturation 等页面中对应功能会失效，显示值变为 ISPC 插值结果。
- HDR 抓图可选择 Combine、HCG、LCG、S、VS 五帧，排查问题时优先保存各分支图。

## 相关页面
- [[wiki/platforms/SC360AT|SC360AT]]
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.1 简介。
