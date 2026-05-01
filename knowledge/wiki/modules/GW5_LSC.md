# GW5_LSC

GW5 Lens Shading Correction（LSC）模块整理，用于记录 GEO GW5 ISP mesh-based lens shading、chroma shading、色温表和 EV strength LUT 调试。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Lens Shading Correction / Mesh Shading / LSC
- 场景：暗角、chroma shading、边角噪声、色温相关阴影、低照 gain 下 LSC 强度衰减
- 适用范围：指定平台

## 模块作用
- LSC 用于修正镜头 vignetting，即中心到边角的亮度渐降。
- 同时可修正 chroma shading，避免边角颜色不均影响最终色彩还原。
- GW5 当前资料重点使用 mesh-based shading，因为它能修正空间非对称失真，比 radial-based 更稳健。

## 调试阶段
- Phase One：在实验室用 GEO Calibration Tool 完成主要 LSC 标定。
- Phase Two：通常不调，除非前期标定或依赖模块表现不佳。
- Phase Three：通过 `mesh_shading.strength_lut` 按 EV 调整强度，处理高 gain 边角噪声。

## 关键参数
- `mesh_shading.enable`：启用 mesh shading correction。
- `adaptive_strength_enable`：启用 adaptive strength LUT。
- `show`：显示 mesh shading data，用于 debug。
- `mesh_width` / `mesh_height`：mesh 节点数量。
- `mesh_scale`：mesh coefficient 格式和最大增益范围。
- `num_lens_shading_tables`：shading table 数量。
- `mesh_low/medium/high_tbl_r/g/b`：低 / 中 / 高色温下 RGB shading table。
- `mesh_low/medium/high_color_temperature`：各 table 对应色温。
- `alpha_mode`：mesh table alpha blending 模式。
- `strength` / `strength_lut`：mesh shading correction 强度及 EV LUT。

## Phase One 标定流程
1. 前置条件：[[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
2. 在 D65、D50、A 光源下抓 flat field 图，覆盖高到低色温。
3. 光源尽量均匀，diffuser 靠近镜头，并保持 lens、sensor、diffuser 与光源平行。
4. 在 GEO Calibration Tool 的 Shading 模块选择 Mesh Shading，加载对应光源图像。
5. 每个光源可加载多张图，工具通过 image averaging 提高标定准确性。
6. Chroma strength 设为 100；Luma strength 尽量高但不超过 4x gain。
7. 将光源色温写入对应 JSON 参数，使 ISP 根据 AWB 估计色温选择或 blend mesh table。

## Luma / Chroma 强度建议
- chroma shading 应尽量 100% 修正。
- luma shading 不一定 100% 修正，因为边角补偿 gain 会同步放大噪声。
- 资料示例中，D65/D50 可约 97%，TL84/D40/CWF 可约 95%，A/Halogen 可约 90%，实际应按参考系统和规格调整。

## Phase Three 强度 LUT
- `mesh_shading.strength_lut` 按 EV 控制 shading strength。
- 低 EV / 亮场低噪声时可保持高强度，例如 4095 表示 100% correction。
- 高 EV / 低照高 gain 时，边角噪声更明显，应降低 strength，必要时最高 gain 可降到 0。
- 若 [[wiki/modules/GW5_SNR|GW5_SNR]] 的 radial noise reduction 不能在不模糊的情况下去除边角噪声，应降低 LSC strength。

## 调试风险
- `mesh_scale` 最大 gain 越高，gain 精度越低，可能带来 banding。
- Luma correction 过强会让边角噪声暴露；过弱则暗角残留明显。
- AWB 色温估计会影响 mesh table 选择，LSC 与 AWB 需要联合验证。

## 相关页面
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]]
- [[wiki/modules/GW5_AWB|GW5_AWB]]
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/issues/暗部发灰|暗部发灰]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/偏色|偏色]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
