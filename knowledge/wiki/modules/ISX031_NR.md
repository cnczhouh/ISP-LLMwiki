# NR

噪声减少用于抑制图像噪声，是 ISX031 图像质量调优中影响纯净度与细节保留的重要模块。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Noise Reduction
- 场景：高感噪声、低照度调试、纹理保留
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台 NR 调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：Noise Reduction
- 场景：高感噪声、低照度调试、纹理保留

## 核心要点
- 调优手册把 NR adjustment 归入分辨率、NR 与颜色调整阶段
- 应用说明书中明确覆盖 [[wiki/modules/ISX031_NR|RAW Noise Reduction]] 与 [[wiki/modules/ISX031_NR|Chroma Noise Reduction]]
- NR 调节通常会与 [[wiki/modules/ISX031_Sharpen|Sharpen]]、[[wiki/modules/ISX031_Gamma|Gamma]] 和颜色观感联动
- 手册说明可按子像素与颜色滤光片分别调整噪声检测灵敏度与降噪级别

## 调试方法
1. 先判断噪声来源：RAW 侧随机噪声，还是色度噪声更明显。
2. 低照度场景优先看纯色区域、暗部和边缘附近的噪声。
3. 先启用/关闭 NR 功能确认影响方向，再细调检测灵敏度与降噪级别。
4. 先压制最影响观感的噪声，再回看细节损失、涂抹感和边缘发虚。
5. 调 NR 时同步观察 [[wiki/modules/ISX031_Sharpen|Sharpen]]，避免一个模块增强另一个模块放大的噪声。
6. 不同照度下复查，避免白天干净、夜晚糊，或夜晚干净、白天假边过强。

## 关键寄存器与调整作用
- `IR_IS_RNR_ON`
  - 控制对象：RAW Noise Reduction 的开关。
  - 调大/调高：启用后，RAW 侧随机噪声会被抑制，暗部颗粒通常会先变干净，但细纹理也可能被一起抹平。
  - 调小/调低：关闭后，原始纹理保留更多，但暗部颗粒、彩点和固定噪声也会更明显。
  - 观察现象：纯色暗部是否更干净，细节是否立刻变糊，动态场景中拖影感是否被放大。

- `CNR_EDGE_TH_CB_GAIN4_03_VA` 及同类 CNR 边缘阈值寄存器
  - 控制对象：色度降噪时对边缘和非边缘区域的区分门限。
  - 调大/调高：更多区域会被当成边缘保留下来，色度降噪会更克制，边缘保真更好，但色噪更容易残留。
  - 调小/调低：更多区域会落入强降噪处理，色块和彩噪会减轻，但边缘和低对比纹理也更容易被糊掉。
  - 观察现象：彩噪是否下降，边缘色彩是否被吃掉，细线条附近是否变脏或变软。

- `CNR_COEF_CR_M_GAIN4_03_VAL_*`、`CNR_COEF_CR_GAIN4_03_VAL_*` 及同类系数寄存器
  - 控制对象：色度噪声减少的强度系数。
  - 调大/调高：色度噪声压制更强，纯色区和暗部彩噪更容易消失，但颜色细节、彩色纹理和肤色微变化也可能被抹平。
  - 调小/调低：颜色层次保留更多，但暗部彩噪和色块感会更明显。
  - 观察现象：暗部彩点是否减少，肤色是否变塑料，彩色边缘是否被抹成块。

- `RAW Noise Reduction` 检测灵敏度与等级寄存器组
  - 控制对象：RAW 噪声检测门限、不同增益档位下的降噪强度。
  - 调大/调高：在高增益场景下更积极地判定并处理噪声，夜景会更干净，但高频纹理和微细节更容易丢。
  - 调小/调低：更保留原始细节，但随机颗粒和行列噪声也会显著保留。
  - 观察现象：夜景树叶、衣物纹理、暗部墙面是“干净但糊”还是“清楚但脏”。

## 可观察项
- `IR_IS_RNR_ON`
- RAW 区域噪声
- 色块/暗部色噪
- 纹理保留程度
- 边缘是否被抹平

## 调试重点
- 区分亮度噪声与色度噪声
- 平衡噪声抑制与细节损失
- 低照度场景下同时关注拖影、涂抹感和边缘质量
- NR 参数不能只看静态图，还要看动态和暗场稳定性

## 常见问题
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/涂抹感|涂抹感]]
- [[wiki/issues/细节损失|细节损失]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/workflows/ISX031_图像质量调整流程|ISX031_图像质量调试流程]]
- [[wiki/modules/ISX031_Sharpen|Sharpen]]
- [[wiki/modules/ISX031_Gamma|Gamma]]
- [[wiki/modules/ISX031_NR|RAW Noise Reduction]]
- [[wiki/modules/ISX031_NR|Chroma Noise Reduction]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]


