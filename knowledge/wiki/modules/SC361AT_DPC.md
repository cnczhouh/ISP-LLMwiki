# SC361AT_DPC

SC361AT Defective Pixel Correction（DPC）功能整理，用于记录 datasheet 中亮坏点、暗坏点判断逻辑和开关寄存器。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC361AT|SC361AT]]
- 模块：DPC / Defective Pixel Correction
- 场景：亮坏点、暗坏点、固定异常点、低照异常点排查
- 适用范围：指定平台

## 模块作用
- SC361AT 支持坏点校正（Defective Pixel Correction, DPC）。
- DPC 判断原理：当前像素值比周围相同颜色的像素都大或都小，并且差值都大于设定阈值。
- 按判断方向分为亮坏点（white pixel）和暗坏点（black pixel）。

## 控制寄存器
| 功能 | 寄存器 | 默认值 | 描述 |
|---|---|---:|---|
| 亮点消除功能开关 | `16'h5000[2]`, `16'h5002[2]` | `2'b11` | White pixel cancellation enable：`2'b11` enable，`2'b00` disable |
| 暗坏点消除功能开关 | `16'h5000[1]`, `16'h5002[1]` | `2'b11` | Black pixel cancellation enable：`2'b11` enable，`2'b00` disable |

## 调试建议
- 若画面中有固定亮点或暗点，先确认 DPC 亮点 / 暗点消除开关是否开启。
- 若异常点只在高 gain 或高温下出现，应区分 sensor 噪声点、热噪点和真正坏点。
- DPC 过强可能误伤细小纹理，若细节损失或星点被抹掉，需要结合实际场景评估。
- HDR 场景中异常点可能来自某一曝光 / gain 分支，需结合 [[wiki/modules/SC361AT_HDR|SC361AT_HDR]] 和 [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]] 判断。

## 常见问题入口
- [[wiki/issues/噪声大|噪声大]]：区分随机噪声、固定坏点和高温热噪点。
- [[wiki/issues/细节损失|细节损失]]：DPC 过强可能误伤小纹理。

## 相关页面
- [[wiki/platforms/SC361AT|SC361AT]]
- [[wiki/modules/SC361AT_HDR|SC361AT_HDR]]
- [[wiki/modules/SC361AT_AEC_AGC|SC361AT_AEC_AGC]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/细节损失|细节损失]]

## 来源
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
