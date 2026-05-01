# SC121AT_CAC

SC121AT Chromatic Aberration Correction（CAC）模块整理，用于记录 SmartSens Tuning Tool 中去蓝紫边的曝光分支、触发条件和强度控制方法。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：CAC / 去紫边 / Chromatic Aberration Correction
- 场景：蓝紫边、强反差边缘、长/中/短曝光分支校正、边缘色散排查
- 适用范围：指定平台

## 模块作用
- CAC 主要用于消除蓝紫边影响。
- SC121AT CAC 分 L / M / S 三帧分别做校正，需要在 `EType` / `Type` 中选择当前曝光模式。
- 当前页面调试效果只对当前选择的曝光模式生效；HDR 场景下应分别检查长、中、短曝光分支。
- 默认勾选 Enable 开启 CAC。

## 基础参数
- `Enable`：CAC 使能开关。
- `Type`：选择长 / 中 / 短曝光。
- `Edge Width`：设置边缘宽度，仅长曝光和中曝光可设。

## Calibration_Area
### Brightness_Conditions
- `Cal_Area`：范围 0~ff；当前点所在区域最大亮度点大于设置值时，认为该区域是需要校正的区域，适用于长 / 中曝光。
- `ISGreater_Thre`：未勾选时，2×3 区域大于亮度阈值认为满足 CAC 亮度条件；勾选时，1×3 区域大于亮度阈值认为满足条件，适用于长 / 中曝光。
- `Large_ISBright`：用于中 / 短曝光亮度条件。

### Gain_conditions
- `Gain_Thre`：范围 0~0x7f；当长曝光全局增益大于该阈值时，CAC 校正强度逐渐减弱。
- `Speed`：CAC 强度随增益增加而减弱的快慢，范围 0~0xf。

### Color_Conditions
- `Blue`：蓝色通道阈值，值越大越容易被判定为满足 CAC 条件。
- `Red`：红色通道阈值，值越大越容易被判定为满足 CAC 条件。
- 蓝色通道与红色通道同时满足 CAC 条件的点才做 CAC 校正。
- `Blue Speed` / `Red Speed`：蓝色 / 红色满足 CAC 条件的快慢，范围 0~3，值越小速度越快。

### Edge_Conditions
- `ValueThre`：第一边缘阈值，范围 0~0xff；边缘值大于该值后满足 CAC 条件，否则随边缘值降低而减弱 CAC 强度。
- `ValueSpeed`：CAC 强度随边缘值降低而减弱的快慢；默认值 4 表示亮度值大于阈值超过 64（8bit）时 CAC 强度降为 0。

### Blue_Conditions
- `Enable`：蓝色判断条件开关。
- `BlueThre`：蓝色通道亮度阈值；蓝色通道亮度小于设置值时满足 CAC 条件，否则随亮度升高开始减弱 CAC 强度。
- `BlueSpeed`：CAC 强度随蓝色亮度升高而减弱的快慢。

## Calibration_Strength
- `Strength`：CAC 校正基准强度，设置值越小，校正强度越大。
- `LowerThre`：CAC 强度降低起始阈值。
- `LowerSpeed`：CAC 强度降低快慢。
- `LowerMax`：CAC 强度降低最大值。

## 调试建议
1. 先确认紫边出现在哪个曝光分支，再选择对应 Type 调试。
2. 对强反差边缘蓝紫边，优先检查 Color_Conditions 与 Edge_Conditions 是否能准确触发。
3. 高 gain 下若 CAC 造成边缘颜色异常或噪声增强，检查 `Gain_Thre` 和 `Speed` 是否让 CAC 强度合理减弱。
4. `Strength` 数值越小强度越大，调试时要避免方向误判。
5. 若紫边与 HDR 合成边界、锐化假边同时出现，应联查 [[wiki/modules/SC121AT_HDR|SC121AT_HDR]] 和 [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]。

## 常见问题入口
- [[wiki/issues/假边|假边]]：区分蓝紫边、HDR 合成边界和锐化假边。
- [[wiki/issues/颜色不自然|颜色不自然]]：CAC 过强可能造成边缘局部颜色异常。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_Sharpness|SC121AT_Sharpness]]
- [[wiki/issues/假边|假边]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
