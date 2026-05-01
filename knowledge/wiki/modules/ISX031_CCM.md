# CCM

颜色矩阵用于校正 RGB 颜色映射关系，是颜色还原和偏色控制中的关键模块。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Color Correction Matrix
- 场景：偏色调试、色卡校色、颜色风格调整
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台 CCM 调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：RGB Matrix / Color Matrix
- 场景：偏色调试、色卡校色、颜色风格调整

## 核心要点
- 应用说明书第 6.1 章明确包含 RGB 矩阵功能
- CCM 与 [[wiki/modules/ISX031_AWB|AWB]]、[[wiki/modules/ISX031_Gamma|Gamma]]、[[wiki/modules/ISX031_Color Adjustment|Color Adjustment]] 共同决定颜色观感
- 若从上层调试入口看，[[wiki/modules/ISX031_Color Adjustment|Color Adjustment]] 与 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]] 都可归到 [[wiki/modules/ISX031_usr_adj|usr_adj]]
- 适合作为跨平台颜色校正共性知识节点
- 手册说明低照度下还会联动色度抑制与 RGB matrix 强度控制

## 调试方法
1. 先确认 [[wiki/modules/ISX031_AWB|AWB]] 和 [[wiki/modules/ISX031_Gamma|Gamma]] 已基本正确，再进入颜色矩阵调试。
2. 用灰卡、色卡或稳定光源场景确认中性色是否正确。
3. 观察主色偏差、肤色表现和不同色温下颜色是否一致。
4. 若是全局颜色方向错误，优先看矩阵；若是局部颜色风格问题，再看 [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]；若是整体反差或亮度风格问题，再看 [[wiki/modules/ISX031_Brightness Adjustment|Brightness Adjustment]]。
5. 低照度下同时观察色噪抑制与矩阵强度联锁，避免颜色一边被压一边被拉。
6. 调完后回查不同亮度、不同光源下的稳定性。

## 关键寄存器与调整作用
- `PICT_RGBMTX`
  - 控制对象：RGB Matrix 功能总开关或主控制入口。
  - 调大/调高：启用后，RGB 三通道会按照矩阵关系重新混合，整幅图的颜色方向会明显变化。
  - 调小/调低：关闭或减弱后，颜色更接近未做矩阵补偿时的状态，传感器与 IR cut 带来的固有色偏会更明显。
  - 观察现象：全局偏色是否改善，中性灰是否回正，主色方向是否整体往正确方向移动。

- `RMT_MTX_GAIN4_01_VAL_A`、`RMT_MTX_GAIN4_01_VAL_B`、`RMT_MTX_GAIN4_01_VAL_C`、`RMT_MTX_GAIN4_01_VAL_D`
  - 控制对象：RGB 矩阵补偿增益的调整率。
  - 调大/调高：矩阵补偿更强，颜色纠偏能力更明显，但过强时肤色、草地、天空等典型颜色容易被拉过头。
  - 调小/调低：矩阵补偿更弱，颜色变化更温和，但原始偏色残留会更多。
  - 观察现象：主色偏差是否收敛，肤色是否自然，色卡上的红绿蓝是否更接近目标。

- `RMT_GAIN4_01_IL_TYPE_SEL`
  - 控制对象：RGB Matrix 的照度联动类型或不同照度档位下的矩阵增益策略。
  - 调大/调高：不同照度下可使用更有区分度的矩阵强度，低照和高照的颜色策略能分开优化，但切换不当会造成风格跳变。
  - 调小/调低：不同照度下的矩阵差异减小，颜色风格更统一，但特殊照度场景下的优化空间更少。
  - 观察现象：白天与夜晚颜色是否一致，照度切换时肤色和主色是否突然偏移。

- `RMT_MODE_WS0`、`RMT_MODE_WS1`
  - 控制对象：不同白平衡场景下的 RGB Matrix 模式选择。
  - 调大/调高：不同色温场景能分别采用更有针对性的矩阵，纠偏更灵活，但 AWB 与 CCM 的联动会更复杂。
  - 调小/调低：不同色温下更偏向同一套矩阵，风格更一致，但某些光源下校色可能不够准。
  - 观察现象：室内暖光、室外日光和混光环境下，颜色是否都能保持一致，不会某一类光源总是偏某个方向。

## 调试重点
- 先保证曝光与白平衡基本正确，再看颜色矩阵
- 观察灰阶中性、主色偏差和肤色表现
- 做颜色调整时要区分矩阵问题与后续色彩增强问题
- 颜色问题不要只看单场景，要看室内外和明暗切换

## 常见问题
- [[wiki/issues/偏色|偏色]]
- [[wiki/issues/肤色不准|肤色不准]]
- [[wiki/issues/颜色不自然|颜色不自然]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_AWB|AWB]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_Color Adjustment|Color Adjustment]]
- [[wiki/modules/ISX031_CCM|RGB Matrix]]

## 来源
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]

