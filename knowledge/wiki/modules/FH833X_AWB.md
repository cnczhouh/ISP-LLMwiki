# FH833X_AWB

FH833X 自动白平衡模块，用于根据白点统计计算 R / G / B 增益，在不同色温和场景下还原真实色彩。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：AWB / 自动白平衡
- 场景：白点标定、白框配置、色温框、混合色温、低照偏色、WDR 统计
- 适用范围：指定平台

## 上级入口
- [[wiki/indexes/FH833X_索引|FH833X_索引]]
- [[wiki/workflows/FH833X_图像质量调试流程|FH833X_图像质量调试流程]]

## 模块作用
- AWB 根据白点统计计算白平衡增益，使白色 / 灰色物体在不同光源下恢复中性。
- FH833X 支持 `gray_world`、`global`、`advanced` 三种策略。
- `gray_world` 主要用于白点标定；`global` 计算简单但适应性有限；`advanced` 计算复杂但可调性和适应性更好。

## 关键参数
### 控制开关
- `awbEn`：AWB 策略总开关。
- `mwbEn`：手动 WB 使能。
- `pureColorEn`：纯色场景判断。
- `compEn`：R / G / B 增益补偿。
- `inOutEn`：室内外场景判断。
- `lightWeightEn`：亮度权重使能。
- `specWPEn`：特殊白点使能，可新增或删除白点。
- `winWeightEn`：统计分块权重使能。
- `fineTuneEn`：精细调整，主要用于肤色保护。
- `manualCTEn`：手动 CT，使 AWB Analyzer 选中白块可应用到全图。
- `lightStatEn`：统计亮度阈值按场景自适应。
- `lightCTWeightEn`：室内混色光场景下按照度切换色温权重线。
- `RangeWpEn`：软件筛白点色温范围独立配置。
- `minMaxSel`：增益计算方式；线性和多帧 WDR 通常建议采用最大值计算，避免高亮偏粉。
- `awbAlgType`：策略模式选择。

### 统计位置
- `stat`：线性模式下 AWB 统计位于 WDR 前或后。
- `statWdrMode`：WDR 多帧合成时是否合入中帧统计。
- `statWbGainBypass`：sensor 合成使用 sensor WB gain 时，统计前是否反除 WB gain。
- `awbSensorMode`：sensor 合成时使用 ISP WB gain 或 sensor WB gain。
- `awbShift`：AWB 统计数据移位。

### 白点、白框和色温框
- `AWB_WHITE_POINT0~3`：正常标定的四个色温白点，色温应依次升高。
- `AWB_STAT_P0~3`：硬件白框，决定硬件筛白点范围。
- `AWB_WHITE_POINT_MIN/MAX`：软件筛选的极限色温范围。
- `colorTempNum`：色温框数量，支持 4~12 个，默认 8 个。
- `ctWidthThl` / `ctWidthThh`：色温框宽度下 / 上阈值，低照可适当放宽。
- `ctWidthGainThl` / `ctWidthGainThh`：色温框宽度随 gain 插值的阈值。

### 亮度统计
- `statThl`：剔除亮度过低的白块。
- `statThh`：剔除过曝白块，需根据 sensor 在各色温下的最小通道增益确定。
- `statThlOutdoor` / `statThhOutdoor`：室外统计阈值，通常下限要大一些以剔除阴影高色温点。
- `statThlLowlight` / `statThhLowlight`：低照统计阈值，通常上限要小一些以剔除高亮光源。
- `lightWeightTh0~5` / `lightWight0~5`：亮度分段权重，亮度适中的白块权重通常更高。

### 场景权重
- `multiCTWeight0~11`：混合色温权重。
- `inDoorThresh` / `outDoorThresh`：通过曝光时间判断室内外。
- `outWeight0~11`：室外色温权重。
- `normalLightThresh` / `lowLightThresh`：通过增益判断正常照度和低照。
- `lowLightCTWeight0~11`：低照色温权重。

### 手动和补偿
- `mRgain` / `mGgain` / `mBgain`：手动 WB 增益。
- `rEnhance` / `gEnhance` / `bEnhance`：最终增益偏好补偿。
- `rGainMax` / `gGainMax` / `bGgainMax`：最大增益限制。

## 调试视角
AWB 的图像效果来自“白点选择范围、统计亮度过滤、色温框归属、场景权重、最终增益补偿”的联动，不是单纯调 R/B gain。

- 白框过大时，黄色墙面、蓝天、绿植等有色物体容易进入白点统计，画面会被拉向反色；白框过小时，极低 / 极高色温没有足够白点，钨丝灯、阴天或低照容易偏色。
- `statThl/statThh` 决定哪些亮度块参与统计。下限过低会把暗部噪声和阴影色偏纳入 AWB；上限过高会把高光光源、饱和区域纳入统计，导致低照或灯光场景跳色。
- 色温框宽度和 `ctWidthGainThl/Thh` 影响低照稳定性。低照放宽可减少来回跳色，但也更容易把混合光误判成单一色温。
- 室内外、低照、混合色温权重决定 AWB 的主观偏好。提高某色温权重不只是改变色温数值，也会改变肤色、白墙和灰物体的整体氛围。
- `rEnhance/gEnhance/bEnhance` 适合做最后少量风格补偿，不适合掩盖白点标定、LSC 或 CCM 的基础问题。
- WDR 或 sensor 合成场景要先确认统计位置和 WB gain 反除，否则 AWB 可能在错误颜色空间里收敛，表现为高光偏粉、低照偏绿或切换时跳色。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 白平衡更稳定 | 收窄白点范围、提高有效白块权重、放宽低照色温框 | 减少跳色和来回漂移 | 特殊光源适应性变差 |
| 混合光更符合主观 | 调整 `multiCTWeight` / `lowLightCTWeight` | 室内氛围、肤色更可控 | 白墙不一定完全中性 |
| 室外阴影不偏蓝 | 提高室外统计下限，降低阴影白点权重 | 天空 / 阴影干扰减少 | 暗主体参与统计变少 |
| 低照不被灯光带偏 | 降低低照统计上限，限制高亮光源白点 | 夜景色温更稳 | 真实高色温光源可能响应不足 |

## 调试步骤
1. 在 AE、BLC 已稳定后，用 `gray_world` 在 3000K、4000K、6000K / 室外、8000K 等色温下标定四个白点；再标定 2000K 和 10000K 等极限色温范围。
2. 用 CoolView 画白框，使白框包住所有标定白点；白框过大容易把浓黄 / 浓蓝物体误纳入统计，过小会导致极低 / 极高色温偏色。
3. 设置色温框数量、宽度上下阈值和 gain 插值阈值；低照下可适当放宽色温框。
4. 如有特殊光源，启用 `specWPEn` 增加特殊白点；如绿树等干扰明显，可添加删除白点。
5. 配置 `statThl/statThh`，剔除过暗和过曝统计块。
6. 配置低照、室外和混合色温权重。
7. 需要关注画面局部时，启用 256 分块权重。
8. 如有特殊色彩偏好，用 `rEnhance/gEnhance/bEnhance` 做少量补偿。

## 混合色温调试
- 室内混合色温通过 AWB Analyzer 观察各色温框白点分布。
- 如果希望画面偏暖，可提高高色温权重、降低低色温权重；反之亦然。
- 室外混合色温通常增大 `statThl`，剔除阴影区域的高色温白点。
- 低照混合色温通常减小 `statThh`，剔除高亮光源白点。

## 开机偏色
- 开机前几帧偏绿通常与 sensor 初始绿通道偏强有关。
- 非 sensor 合成可在 `BEFOR_INIT_DRV` 调用 `ISP_Awb_init_gain()` 初始化 WB gain。
- sensor 合成需在 sensor 配置和 `BEFORE_KICKOFF` 的硬件反除寄存器中保持增益一致。

## 常见问题入口
- [[wiki/issues/偏色|偏色]]：重点检查白点标定、白框范围、色温框、统计亮度门限和混合色温权重。
- [[wiki/issues/颜色不自然|颜色不自然]]：联查 CCM、DRC 饱和度、CE / LC、CNR、Purple 和 FC 是否误伤颜色。
- [[wiki/issues/肤色不准|肤色不准]]：重点检查 `fineTuneEn/fineTuneStr`、色温权重和白点分布。

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：6 AWB；29.1.5、29.1.7、29.1.21、29.1.24。