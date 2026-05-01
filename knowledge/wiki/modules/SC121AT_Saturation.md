# SC121AT_Saturation

SC121AT 饱和度模块整理，用于记录整体饱和度、Normal After HDR、Bright Adaptive、Blue Pixel、Red Scene，以及低照 / 高亮 / 局部颜色的降饱和策略。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：Saturation
- 场景：色彩风格调整、低照降饱和、高亮 / 暗部色彩控制、蓝色像素和红色场景抑制
- 适用范围：指定平台

## 模块作用
- Saturation 模块分手动模式和自动模式。
- Manual 模式可直接调整整体饱和度，范围 0~255，值越大色彩饱和度越高。
- Normal 位于 After HDR，用于调整 HDR 后整体饱和度。
- Bright Adaptive 用于根据局部亮度自适应降低饱和度。
- Blue Pixel 和 Red Scene 用于处理特定颜色区域或场景的饱和度异常。

## 全局手动 / 增益控制
- `GainEnable`：Gain 调试功能开关。
- `Current Gain`：当前 gain 值，点击 Update 可实时更新。
- `Start Gain`：Gain 调试曲线起始值。
- `End Gain`：Gain 调试曲线终值。
- `Delta`：Gain 调试曲线调节幅度值。

## Normal：After HDR 整体饱和度
- 可选择 Manual 或 Auto 模式。
- `Saturation`：手动模式下拖动调整整体饱和度，范围 0~ff，值越大饱和度越高。
- `Cur Sat`：当前饱和度值。
- `Cur L Gain`：当前 long exposure gain 值。
- `Auto`：自动模式下调整 1x~128x 的值，实现饱和度随 gain 自适应调整。

## Bright Adaptive：局部亮度自适应
- `Enable`：功能开关。
- `Bright Thre`：亮度阈值，当前点亮度小于该阈值时饱和度减小。
- `Bright Lower Speed`：饱和度随亮度减小而减小的速度，值越大越快。
- `Bright Lower Max`：饱和度随亮度减小而减小的最大值。
- `Gain Thre`：场景 gain 阈值，当 gain 大于该阈值时，暗处降饱和功能开启。
- `Gain Speed`：暗处降饱和功能随 gain 增大而开启的速度，值越大开启越快。

## Blue Pixel：蓝色像素点饱和度调整
- `Enable`：开启局部蓝色调整。
- `Cur Base`：点击 Update 读出当前场景蓝色基准饱和度。
- `Min Base`：蓝色基准饱和度最小值，范围 0~ff。
- `Cur L Gain`：当前场景 long exposure gain。
- `Gain Thre`：长曝光 gain 大于该值时，可降低蓝色点饱和度，范围 0~ff。
- `Color Temp`：点击 Update 读出当前场景色温。
- `Scene Thre`：色温大于该值时，可降低蓝色点饱和度，范围 0~ff。
- `Lower Speed By Color Temp`：蓝色点随色温增高降低饱和度的速度，范围 0~f。
- `Lower Speed By Gain`：蓝色点随 gain 降低饱和度的速度，范围 0~f。

### Highlight Shadow
- `Time Thre`：曝光时间阈值，曝光时间小于该阈值时，蓝色像素点饱和度可降为 0。
- `Speed`：蓝色像素饱和度随曝光时间减小而减小的速度，值越大下降越快。
- `Min`：高光阴影蓝色像素点饱和度最小值。
- `Brightness Thre`：pixel 亮度阈值，蓝色 pixel 亮度小于该阈值时饱和度降到最低。
- `Blue Comp` / `Red Comp`：有符号数，蓝色点判断的蓝色 / 红色分量附加判断；值越大判断越松，0x80 最小，0x7f 最大。
- `Blue Speed` / `Red Speed`：蓝色点判断中蓝色 / 红色分量符合要求的快慢。

## Red Scene
- `Enable Lower Sat`：开启红色场景降饱和。
- `Enable Calc`：开启红色场景饱和度调整计算。
- `Cur Base`：点击 Update 读出当前场景红色场景饱和度。
- `Min Base`：红色基准饱和度最小值。
- `Cur L Gain`：当前场景 long exposure gain。
- `Gain Thre`：gain 大于该值时，可以降低红色场景饱和度。
- `By Gain`：饱和度随 gain 增加而下降的速度。
- `Eigen`：点击 Update 读出当前场景红色特征值。
- `Scene Thre`：红色场景判断阈值，红色特征值大于该值时可以降低红色场景饱和度。
- `By Scene`：饱和度随红色场景变红而下降的速度。

## 调试建议
1. 饱和度调整应在 [[wiki/modules/SC121AT_AWB|AWB]]、[[wiki/modules/SC121AT_CCM|SC121AT_CCM]] 基本正确后进行。
2. Normal 先定整体色彩浓淡，再用 Bright Adaptive 处理暗处脏色。
3. 低照色噪明显时，可结合 Gain Thre / Gain Speed 做暗处降饱和，但要避免画面发灰。
4. 蓝天、高光阴影或蓝色局部异常时，再进入 Blue Pixel，不要用全局降饱和牺牲整图颜色。
5. 红色场景压饱和要结合车载场景验证，避免红色交通标志、尾灯被压得过淡。
6. Saturation 会放大或压低色噪观感，低照下需联查 [[wiki/modules/SC121AT_NR|SC121AT_NR]] 和 [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]]。

## 常见问题入口
- [[wiki/issues/颜色不自然|颜色不自然]]：先区分 AWB / CCM 根因和 Saturation 风格问题。
- [[wiki/issues/偏色|偏色]]：白点正确后再调饱和度。
- [[wiki/issues/肤色不准|肤色不准]]：避免用全局饱和度硬救肤色。
- [[wiki/issues/噪声大|噪声大]]：饱和度提升会让低照彩噪更明显。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/modules/SC121AT_AWB|SC121AT_AWB]]
- [[wiki/modules/SC121AT_CCM|SC121AT_CCM]]
- [[wiki/modules/SC121AT_NR|SC121AT_NR]]
- [[wiki/modules/SC121AT_HTEMP|SC121AT_HTEMP]]
- [[wiki/issues/颜色不自然|颜色不自然]]
- [[wiki/issues/偏色|偏色]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
