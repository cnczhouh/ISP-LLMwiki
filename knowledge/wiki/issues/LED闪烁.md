# LED闪烁

LED 闪烁是指 LED 灯牌、车灯、交通灯、室内 LED 光源在画面中出现亮度断续、条纹、频闪或视频帧间亮度不稳定的问题。

## 页面属性
- 类型：通用问题
- 厂家：跨厂家 / Sony / SmartSens / GEO
- 平台：跨平台
- 模块：AE / Antiflicker / HDR / Exposure / Frame Rate
- 场景：LED 灯牌、车灯、交通灯、室内 LED、车载夜景
- 适用范围：跨平台

## 现象表现
- LED 灯在视频中一闪一闪，肉眼看正常但画面不稳定。
- 灯牌或车灯出现横条、断续或局部熄灭。
- 不同帧之间 LED 亮度差异很大。
- HDR 多曝光下某一路捕获到 LED 亮，另一路捕获到 LED 暗，造成合成异常。

## 优先排查顺序
1. 确认光源类型和 PWM 频率，区分电网频闪和 LED PWM。
2. 检查曝光时间是否与 LED 闪烁周期冲突。
3. 检查 Antiflicker 频率、曝光行数约束和帧率设置。
4. HDR 场景检查长 / 中 / 短曝光是否分别采到不同 LED 相位。
5. 若 LED 区域伴随高光过曝，联查 [[wiki/issues/高光过曝|高光过曝]]。

## 常见处理方向
- 根据地区设置 50Hz / 60Hz antiflicker，并确认曝光行数受控。
- 对 LED PWM 场景，尽量选择覆盖完整 PWM 周期的曝光时间。
- HDR 场景中避免短曝光过短导致 LED 断续。
- 车载夜景需同时验证交通灯、车灯、LED 屏和路灯。

## 平台差异入口
- SC121AT：优先关联 [[wiki/modules/SC121AT_AE|SC121AT_AE]] 和 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]，检查 Antiflicker 与 HDR 曝光比例。
- SC361AT：优先关联 [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]，检查 LE / SE 曝光时间和 gain 约束。
- GW5：优先关联 [[wiki/modules/GW5_AE|GW5_AE]] 和 [[wiki/modules/GW5_AFD|GW5_AFD]]。

## 相关页面
- [[wiki/issues/闪烁|闪烁]]
- [[wiki/issues/曝光不稳|曝光不稳]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]
- [[wiki/modules/GW5_AFD|GW5_AFD]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
- [[raw/GW5_ISP Tunning中英文.pdf]]
