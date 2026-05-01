# SC360AT_LSC

SC360AT LSC 模块用于镜头阴影校正，重点处理镜头像场导致的亮度 shading 和边缘补偿，并支持随增益降低 LSC 强度以控制高 gain 噪声。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：LSC / Lens Shading Correction
- 场景：镜头阴影校正、raw-full size 标定、mirror / flip、边缘噪声、增益联动 LSC 强度
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- LSC 用于补偿镜头带来的中心和边缘亮度不一致。
- SC360AT LSC 标定需要使用 raw-full size 配置，并在标定前关闭所有 mirror / flip，包括车载项目默认 mirror。
- 支持 Ratio Down，使 LSC 强度随增益升高而降低，避免高 gain 下边缘噪声被放大。

## 标定流程
1. I2C 连通后，先用 Erase 擦掉 EEPROM 原配置，再用 Write 写入 raw 配置，重新上电后用 raw config 点亮。
2. 调整灯箱亮度并设置曝光，使中心亮度平均值约为饱和值 70%。
3. 点击 Display Ctrl，设置 3D Str，例如 9，并 Apply。
4. 抓取 LCG raw 图，capture 中选择 RAW Data 数据模式，文件类型选择 bmp，抓取 processed raw 图。
5. Round setting 设置圆心 X / Y 和半径，圆心为 sensor 中心，半径在 X、Y 之间。
6. Calibration 导入 raw.bmp，生成参数 txt，再 Apply 写入寄存器。
7. 修改强度后用 calibrate-apply 写入指定强度 LSC 矩阵，并用 save all 保存新参数。

## 关键参数
- `Enable`：LSC 开关。
- `Type`：手动模式 / 自动模式。
- `Ratio Down Enable`：LSC 强度随增益降低开关。
- `EndGain`：LSC 强度随增益降低结束增益。
- `Slope`：LSC 强度随增益降低快慢。
- `StartGain`：LSC 强度随增益降低开始增益，只读，由 EndGain 和 Slope 计算。
- `Edge opt`：可调 Edge Ratio；未勾选时默认 70%。
- `Edge Ratio`：边缘区域越暗，Edge Ratio 需设得越小。
- `Width/Height/Bit Depth`：当前图像宽度、高度、位宽。
- `X/Y/R`：LSC 圆心和半径；边缘较亮设略小于 X，边缘较暗设 0.8X 或更小。
- `Channel/Tag/+-Step`：按通道和圈层位置微调强度。

## 调试视角
SC360AT LSC 不是只追求边缘完全拉平，而是在边缘亮度、噪声、色彩一致性和高 gain 稳定性之间取舍。

- 标定时 mirror / flip 未关闭，会导致 LSC 表空间位置和实际图像不匹配，表现为单边过补、暗角方向错误或局部偏色。
- 中心亮度约 70% 饱和值是为了避免过曝影响标定，同时保持足够信噪比；中心太暗会使标定表带入噪声。
- LSC 强度越高，边缘越亮，但边角噪声和彩噪也会被拉起；夜景和高 gain 下尤其明显。
- Ratio Down 能在高 gain 降低 LSC 效果，牺牲一部分边缘均匀性来换取低噪声。
- Edge Ratio、圆心和半径会直接决定边缘补偿形态，配错时会出现局部环状亮暗、单边过亮或边缘仍暗。
- LSC 会影响 AWB 白点统计和 CCM 主观颜色，标定错误会被后级误判成偏色或饱和度问题。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 边缘更亮 | 提高 LSC 强度或调 Edge Ratio | 暗角改善 | 边角噪声和彩噪增加 |
| 高 gain 更干净 | 开启 Ratio Down，降低高 gain LSC | 夜景边缘噪声下降 | 暗角残留增加 |
| 校正更居中 | 校准 X/Y/R 和 raw-full size | 亮度分布更对称 | 参数错误会造成环状或单边异常 |
| 色彩更稳定 | 重新标定而非后级补色 | AWB / CCM 基础更准 | 需要稳定灯箱和 raw 抓图流程 |

## 常见问题入口
- [[wiki/issues/噪声大|噪声大]]：重点看高 gain 下 LSC 是否拉起边角噪声。
- [[wiki/issues/偏色|偏色]]：重点检查 LSC 表和 mirror / flip 是否匹配。
- [[wiki/issues/暗部发灰|暗部发灰]]：联查 LSC 边角拉升、Gamma 和 HDR LTM。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.8 Lens shading 校正。
