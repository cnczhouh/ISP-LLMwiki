# SC360AT_Saturation

SC360AT Saturation 模块支持手动 / 自动饱和度调整、随 gain 降饱和、局部亮度降饱和、蓝色像素饱和度处理和红绿灯识别饱和度增强。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC360AT|SC360AT]]
- 模块：Saturation / Blue Pixel / Traffic Light
- 场景：整体饱和度、低照降饱和、暗处色噪、蓝色像素、高光阴影、红绿灯识别
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/SC360AT_索引|SC360AT_索引]]
- [[wiki/workflows/SC360AT_图像质量调整流程|SC360AT_图像质量调试流程]]

## 模块作用
- 支持长 / 中 / 短不同帧不同饱和度基数调整，以及 After HDR 整体调整。
- 支持按 gain 自适应降低饱和度，控制低照色噪和偏色。
- 支持高色温场景降低蓝色像素饱和度、低照偏红场景降低整体饱和度。
- 支持红绿灯识别后的饱和度增强，服务车载识别和主观显示。

## 关键参数和功能
### 手动模式
- `Manual`：手动调整饱和度，范围 0~0xff，值越大色彩饱和度越高。
- 当 ISPC_HDR 中选中 Sat 后，此处不支持调整。

### 增益控制
- `GainEnable`：Gain 降饱和度开关。
- `Current Gain`：当前长曝光增益。
- `Start Gain`：gain 调试曲线起始值。
- `End Gain`：gain 调试曲线终值。
- `Delta`：gain 调试曲线调节幅度。

### Normal 模式
- `Adjust by local brightness`：根据局部亮度自适应调整饱和度。
- 增益条件：`Sat Thre`、`Speed`，决定增益大于阈值后暗处降饱和开启速度。
- 亮度条件：`Sat Thre`、`Speed`、`Saturation Max`，决定点亮度低于阈值后饱和度降低程度。
- 增益和亮度条件需同时满足才开始降饱和。

### Blue Pixel
- 低色温高增益场景：按 gain 和色温条件降低蓝色饱和度。
- `Cur Blue Sat`：当前蓝色饱和度。
- `Min Base`：蓝色饱和度降低最小值。
- `Gain Thre`、`Lower Speed By Gain`：随增益降低饱和度的阈值和速度。
- `Scene Thre`、`Lower Speed By Color Temp`：随色温降低蓝色饱和度的阈值和速度。
- 高光阴影场景：按曝光、亮度条件降低蓝色像素饱和度。
- `Blue Comp (B-G)`、`Red Comp (B-R)`：蓝色点判断附加条件，值越大判断越松。
- `Blue Speed`、`Red Speed`：蓝色 / 红色分量满足判断的快慢。

### Traffic Light
- `Enable Night Enhance`：夜晚红绿灯加强。
- `Final Sat Max`：最终最大饱和度限制。
- 红灯 / 绿灯分别通过 U 分量、V 分量、Brightness、Gain 条件判断。
- `Mark Enable / Thre`：红灯 / 绿灯标记功能和可能性阈值。

## 调试视角
SC360AT Saturation 不只是整体饱和度滑杆，还包含低照降色噪、蓝色像素保护和红绿灯识别增强三条车载专项逻辑。

- 整体饱和度越高，颜色越鲜艳，但低照彩噪、红蓝溢色和偏色更明显。
- Gain 降饱和可控制高 gain 色噪，但会让夜景颜色变淡，影响红绿灯、车灯、招牌等识别观感。
- 局部亮度降饱和能压暗部色噪，但阈值过高会让阴影区域颜色发灰。
- Blue Pixel 逻辑需要同时满足 gain / 色温或曝光 / 亮度条件，判断过松会误伤蓝天、蓝车、蓝色标识；判断过严则蓝色阴影或偏蓝噪声残留。
- Blue pixel 通过 B-G 与 B-R 判断蓝色点，ratio 不合理会产生分层或局部颜色断裂。
- Traffic Light 增强要先确认 Mark 是否识别到红绿灯，再增加饱和度；增强过强会使灯色溢出或影响周边颜色。
- ISPC_HDR 接管 Sat 后，本页面手动调整可能无效，必须先看控制权。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 画面更鲜艳 | 提高整体饱和度 | 主观色彩更浓 | 色噪、溢色、偏色增加 |
| 低照更干净 | 开启 gain / 暗部降饱和 | 暗处色噪下降 | 夜景颜色变淡 |
| 蓝色阴影更稳 | 调 Blue Pixel 条件和 Min Base | 偏蓝阴影 / 蓝噪减少 | 真实蓝色物体可能变灰 |
| 红绿灯更突出 | 启用 Traffic Light 夜晚增强 | 红绿灯识别和显示更明显 | 灯色溢出、周围色彩被带动 |
| 避免颜色跳变 | 平滑 gain / 亮度 / 色温速度参数 | 过渡自然 | 响应变慢 |

## 调试步骤
1. 先确认 AWB 和 CCM 基本正确，再调整整体饱和度。
2. 按明亮、低照、高 gain 场景配置 GainEnable、Start / End Gain 和 Delta。
3. 开启局部亮度降饱和，观察暗处色噪和阴影颜色是否自然。
4. 对低色温高 gain 和高光阴影场景分别调 Blue Pixel。
5. 用 Mark 功能确认红绿灯识别，再调红 / 绿灯饱和度增强和 Final Sat Max。
6. 若启用 ISPC_HDR Sat，确认本页面调整是否被接管。

## 常见问题入口
- [[wiki/issues/饱和度异常|饱和度异常]]：重点检查整体 sat、gain 降饱和、ISPC_HDR Sat。
- [[wiki/issues/色噪|色噪]]：重点检查低照降饱和、Blue Pixel、UVDNS。
- [[wiki/issues/颜色不自然|颜色不自然]]：联查 AWB、CCM、HDR 和 Traffic Light 增强。
- [[wiki/issues/偏色|偏色]]：不要用 Saturation 掩盖 AWB / CCM 基础偏色。

## 来源
- [[raw/SC360AT_ISPTuning Guide_20251121(1)(1).pdf]]：1.10 饱和度。
