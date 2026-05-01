# SC121AT_LSC

SC121AT Lens Shading 校正模块整理，用于记录 LSC 标定流程、raw-full size 要求、Option software setting、矩阵强度和随增益衰减策略。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：LSC / Lens Shading Correction
- 场景：镜头阴影校正、亮度不均、色 shading、低照边缘噪声放大控制
- 适用范围：指定平台

## 模块作用
- LSC 用于补偿镜头造成的亮度和颜色不均。
- SC121AT 工具中 LSC 既包含标定流程，也包含随 gain 降低校正强度的策略。
- 高 gain 下 LSC 可能把边缘噪声一起放大，因此需要结合 gain 做强度衰减。

## 标定流程
1. I2C 连通时，先用 Erase 擦掉 EEPROM 中原本配置。
2. 用 Write 写入 raw 配置，确保烧录成功。
3. 重新上电后用 raw config 点亮。
4. LSC 标定必须使用 raw-full size 配置。
5. 调整灯箱亮度并设置曝光，使中心亮度平均值约为饱和值 70%。
6. 点击 Display Ctrl，设置 3D Str 值，例如 9，然后 Apply。
7. 抓取 LCG raw 图：在 capture 中选择 RAW Data 数据模式，选择 bmp 文件类型抓取 processed raw 图。
8. 进入 Option / software setting：
   - zoom algorithm：设置为 null。
   - Round setting：设置圆心 X / Y 与半径；圆心为 sensor 中心，半径在 X、Y 之间，LFS 半径可适当大些。
   - 点击 set。
9. 进入 Calibration，导入抓取的 raw.bmp 图，生成参数 txt。
10. 点击 Apply，将标定生成的参数写入对应寄存器。
11. 修改强度后点击 calibrate-apply，将指定强度的 LSC 矩阵写入寄存器。
12. 用 Save All 保存新参数。

## 强度说明
- 原文说明：1 为 100%，0 表示不做校准。
- 强度修改后需要通过 calibrate-apply 写入矩阵，再保存参数。

## 参数理解
- `Type`：手动模式或自动模式。
- `Current Gain`：当前 gain。
- `Cur Q`：乘在 LSC gain 上的系数，随 Gain 增大线性减少，用于线性减少 LENC 效果，降低噪声通过 LENC 被增强的风险。
- `GainMin`：Q 随 gain 降低的起始阈值。
- `GainMax`：Q 随 gain 降低的终止阈值。
- `QMax`：Gain 小于 GainMin 时的 Q 值。
- `QMin`：Gain 大于 GainMax 时的 Q 值；GainMin < Gain < GainMax 时，Q 在 QMax 和 QMin 之间线性插值。
- `Order`：拟合阶次。
- `PointSpan`：拟合基线长度，范围 0~128。
- `StartGain`：LSC 强度调整起始 gain。
- `Ratio`：LSC 强度随 gain 变化速度。
- `YRatio`：手动调整 G 通道强度。
- `CRatio`：手动调整 B 与 R 通道强度。

## 调试建议
1. 标定前先确认镜头遮光、灯箱均匀性、曝光和 raw-full size 配置，否则生成的矩阵会把环境问题写进参数。
2. 抓图格式必须用 RAW Data / bmp 的 processed raw 图，不要用后级 YUV 图做 LSC 标定。
3. 低照边缘噪声大时，不要只调 NR，也要检查 LSC 随 gain 衰减是否足够。
4. 色 shading 明显时，优先检查 YRatio / CRatio 与 AWB 标定是否互相打架。
5. 如果高温场景边缘噪声或颜色变化明显，还要联查 [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]] 中 LENC ratio 的高温控制。

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：检查 LSC chroma shading 与 AWB 是否互相影响。
- [[wiki/issues/噪声大|噪声大]]：检查高 gain 下 LSC 是否放大边缘噪声。
- [[wiki/issues/暗部发灰|暗部发灰]]：检查边缘补偿、黑位和 tone mapping 是否叠加异常。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]]
- [[wiki/modules/SC121AT_Option|SC121AT_Option]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/偏色|偏色]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
