# SC121AT_ISPC_Controller

SC121AT ISPC_Controller 模块整理，用于记录 ISPC_HDR 和 ISPC_LTMBLC 对上层模块参数的接管关系。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：ISPC_Controller / ISPC_HDR / ISPC_LTMBLC
- 场景：HDR 参数插值、自动亮度映射、BLC 联动、控制权排查
- 适用范围：指定平台

## 模块作用
- ISPC_Controller 包含 HDR、LTMBLC 等小模块。
- 启用 ISPC 中的模块后，上方对应模块中的部分功能会不生效，对应值会变成 ISPC 模块计算出的值。
- 排查参数不生效时，要优先确认是否被 ISPC_Controller 接管。

## ISPC_HDR
- Enable：使能 ISPC_HDR。
- hdr_enable：启用 HDR 控制，下方可选择开启对应小模块。
- 可接管的项目包括 Max Gamma、Global Gamma、Local Gamma Alpha、Curve Alpha、High Margin、AWB Luma Low Th、AE Target、Comps。
- Int Gain Luma：根据 IntL、GainL、LumaL 计算 DR 值，并根据 `int_gain_luma` 在 Dy_Th 不同区间对 HDR 参数插值。
- Int L_m：曝光权重，影响 `int_gain_luma`。
- Gain L_m：增益权重，影响 `int_gain_luma`。
- Luma L_m：亮度权重，影响 `int_gain_luma`。
- Dy Th1~4：四段阈值。
- Luma Th：当前亮度阈值，决定 Luma L 值。
- Base：影响 `int_gain_luma`。
- HDR_Para：四段参数插值，Out 为插值结果。

## ISPC_LTMBLC
- Enable：使能 ISPC_LTMBLC。
- CurBlc：当前 BLC 值。
- CurGain：当前增益。
- Min blt_manual：手动设置 BLC 值。
- Gain_node1-2：插值计算阈值。
- Delta_base：需要减掉的 BLC。
- DR / Gain / COMPS Ratio：动态范围、增益、COMPS 计算对应比率。

## 调试建议
- 如果 [[wiki/modules/SC121AT_HDR|HDR]]、[[wiki/modules/SC121AT_AE|AE]] 页面中的参数修改无效，先检查 ISPC_HDR 是否开启。
- ISPC_HDR 适合做随曝光、增益、亮度和动态范围变化的自动插值，但需要记录四段阈值和 Out 结果，避免不知道当前实际生效值。
- ISPC_LTMBLC 会按动态范围、增益和 COMPS 强度调整 BLC，暗部发灰或黑位漂移时要纳入排查。

## 相关页面
- [[wiki/modules/SC121AT_HDR|SC121AT_HDR]]
- [[wiki/modules/SC121AT_AE|SC121AT_AE]]
- [[wiki/modules/SC121AT_Gamma|SC121AT_Gamma]]
- [[wiki/issues/亮度不自然|亮度不自然]]
- [[wiki/issues/暗部发灰|暗部发灰]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
