# MIPI_DVP_LVDS接收异常

MIPI / DVP / LVDS 接收异常是指 sensor 物理接口或接收端配置不匹配，导致无帧、掉帧、花屏、同步错误或数据解析异常。

## 页面属性
- 类型：通用问题
- 厂家：跨厂家
- 平台：跨平台
- 模块：MIPI / DVP / LVDS / Receiver / Clock / Sync
- 场景：点亮 bring-up、接口联调、接收端配置、硬件连线确认
- 适用范围：跨平台

## 现象表现
- 接收端无 lock、无 frame start 或帧率异常。
- MIPI CRC / ECC 错误、DVP 同步错误或 LVDS 解串异常。
- 有数据但画面花屏、行错位或帧错位。
- 改 lane 数、速率、bit depth 后异常变化明显。

## 优先排查顺序
1. 确认接口类型、lane 数、lane mapping、clock 和速率配置。
2. 检查 sensor 端和接收端是否使用相同 bit depth、data type、VC 和同步方式。
3. MIPI 场景检查 HS settle、LP / HS 切换、电气连接和错误计数。
4. DVP 场景检查 PCLK、HSYNC、VSYNC、极性和采样边沿。
5. LVDS 场景检查 lane、解串、bit order 和同步码。

## 常见处理方向
- 用标准分辨率和标准 bit depth 先验证物理链路，再增加 HDR、VC、压缩或缩放。
- 同时检查硬件连线、sensor 寄存器和接收端驱动配置。
- 花屏时保存接口错误计数和原始帧 dump，区分链路错误和格式解析错误。
- 接收端日志里的 CRC / ECC / frame sync 错误通常比显示画面更可靠。

## 相关页面
- [[wiki/issues/无图花屏|无图花屏]]
- [[wiki/issues/输出格式错误|输出格式错误]]
- [[wiki/issues/分辨率和裁剪异常|分辨率和裁剪异常]]
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/platforms/SC361AT|SC361AT]]

## 来源
- [[raw/SC121AT_数据手册_V0.1(2).pdf]]
- [[raw/SC361AT-00_数据手册_V1.0.pdf]]
