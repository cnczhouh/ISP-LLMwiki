# SC361AT_PWL

SC361AT Piecewise Linear（PWL）功能整理，用于记录 datasheet 中四帧融合后 20bit 到 12bit 的分段线性压缩、节点、斜率和寄存器入口。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC361AT|SC361AT]]
- 模块：PWL / Piecewise Linear
- 场景：HDR 压缩、20bit 到 12bit 映射、高光保护、暗部层次、亮度不自然排查
- 适用范围：指定平台

## 模块作用
- SC361AT PWL 将四帧融合之后的 20bit 图像分段映射到 12bit。
- PWL 是 HDR 合成后亮度压缩的重要环节，会直接影响高光保留、暗部可见性和中间调层次。
- PWL 曲线起点 `(0, 0)` 为固定点，不能更改。

## 曲线结构
- 起点和终点之间需要配置 4 个自定义节点：
  - `(x_list[0], y_list[0])`
  - `(x_list[1], y_list[1])`
  - `(x_list[2], y_list[2])`
  - `(x_list[3], y_list[3])`
- 需要配置对应斜率 `slope[0]` 到 `slope[4]`。
- slope 有 11bit 小数，写寄存器时需要左移 11 位。
- 节点之间通过插值计算压缩值：`if x(i) < x < x(i+1), y = y(i) + (x - x(i)) * slope(i)`。

## 参数示例
| X_list | Y_list | Slope |
|---:|---:|---:|
| 0 | 0 | 1 |
| 3ff0 | 8 | 1fff |
| 43f0 | 1008 | 200 |
| 7f00 | 1ecc | 20 |
| 43000 | 2d90 | 8 |

## 寄存器入口
| 功能 | 寄存器 | 描述 |
|---|---|---|
| PWL x_list[0] | `16'h5d54[3:0]`, `16'h5d55[7:0]`, `16'h5d56[7:0]` | `x_list[0]` |
| PWL x_list[1] | `16'h5d57[3:0]`, `16'h5d58[7:0]`, `16'h5d59[7:0]` | `x_list[1]` |
| PWL x_list[2] | `16'h5d5a[3:0]`, `16'h5d5b[7:0]`, `16'h5d5c[7:0]` | `x_list[2]` |
| PWL x_list[3] | `16'h5d5d[3:0]`, `16'h5d5e[7:0]`, `16'h5d5f[7:0]` | `x_list[3]` |
| PWL y_list[0] | `16'h5d60[7:0]`, `16'h5d61[7:0]` | `y_list[0]` |
| PWL y_list[1] | `16'h5d62[7:0]`, `16'h5d63[7:0]` | `y_list[1]` |
| PWL y_list[2] | `16'h5d64[7:0]`, `16'h5d65[7:0]` | `y_list[2]` |
| PWL y_list[3] | `16'h5d66[7:0]`, `16'h5d67[7:0]` | `y_list[3]` |
| PWL slope[0] | `16'h5d68[4:0]`, `16'h5d69[7:0]` | `slope[0]` |
| PWL slope[1] | `16'h5d6a[4:0]`, `16'h5d6b[7:0]` | `slope[1]` |
| PWL slope[2] | `16'h5d6c[4:0]`, `16'h5d6d[7:0]` | `slope[2]` |
| PWL slope[3] | `16'h5d6e[4:0]`, `16'h5d6f[7:0]` | `slope[3]` |
| PWL slope[4] | `16'h5d70[4:0]`, `16'h5d71[7:0]` | `slope[4]` |

## 调试建议
- 高光过曝或层次断裂时，优先检查高亮段节点和 slope 是否压缩不足或过硬。
- 暗部发灰时，不要只抬暗部 slope，也要联查 black level、AEC / AGC 和 HDR 合成输出。
- PWL 曲线应保持单调和过渡平滑，避免节点间斜率突变造成灰阶断层。
- PWL 位于 HDR 压缩链路中，应和 [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]、AEC / AGC 一起判断，不应单点优化。

## 常见问题入口
- [[wiki/issues/高光过曝|高光过曝]]：检查高亮段压缩和 HDR 分支是否给 PWL 留出余量。
- [[wiki/issues/暗部发灰|暗部发灰]]：检查低亮段 slope 和黑位。
- [[wiki/issues/亮度不自然|亮度不自然]]：检查 PWL 节点和 slope 是否造成中间调不连续。

## 相关页面
- [[wiki/platforms/SC361AT|SC361AT]]
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]
- [[wiki/issues/高光过曝|高光过曝]]
- [[wiki/issues/暗部发灰|暗部发灰]]

## 来源
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
