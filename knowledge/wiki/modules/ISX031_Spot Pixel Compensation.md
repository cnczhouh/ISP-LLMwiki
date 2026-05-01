# Spot Pixel Compensation

Spot Pixel Compensation 用于补偿坏点、亮点、暗点等孤立像素缺陷，避免它们在画面中形成固定噪点或异常彩点。

## 页面属性
- 类型：通用模块
- 厂家：Sony
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：坏点补偿
- 场景：固定亮点、固定暗点、孤立彩点、长曝后明显点缺陷
- 适用范围：当前以 [[wiki/platforms/ISX031|ISX031]] 为主，后续可扩展为跨平台坏点补偿调试知识

## 适用范围
- 平台：[[wiki/platforms/ISX031|ISX031]]
- 模块：坏点补偿
- 场景：固定亮点、固定暗点、孤立彩点、长曝后明显点缺陷

## 核心要点
- 它属于硬件变异补偿阶段，优先于后级画质风格调整
- 坏点问题如果不先处理，后面的 [[wiki/modules/ISX031_NR|NR]]、[[wiki/modules/ISX031_Sharpen|Sharpen]] 容易把异常点进一步放大或涂抹成更怪的痕迹
- Spot Pixel Compensation 更关注孤立缺陷，不是解决整片脏噪声的模块

## 调试方法
1. 在暗场、均匀灰场和长曝场景下找固定位置异常点。
2. 先确认异常点是否固定在同一像素位置，排除随机噪声或压缩伪影。
3. 若固定点明显，优先进入坏点补偿流程，不要先靠 [[wiki/modules/ISX031_NR|NR]] 或 [[wiki/modules/ISX031_Sharpen|Sharpen]] 掩盖。
4. 调整后回看高照、低照和动态场景，避免补偿后出现周围纹理被误伤。

## 关键寄存器与调整作用
- 坏点补偿相关阈值与使能寄存器组
  - 控制对象：坏点检测与补偿强度。
  - 调大/调高：补偿更积极，固定亮点/暗点更容易被吃掉，但也更容易误伤真实细小亮点或细纹理。
  - 调小/调低：补偿更保守，真实细节保留更多，但坏点残留风险更高。
  - 观察现象：固定点是否消失，星点/高光小点是否被误当坏点处理。

## 可观察项
- 固定亮点 / 暗点是否消失
- 是否误伤细小高光点
- 是否影响局部纹理

## 调试重点
- 先确认是固定位置缺陷，再调 Spot Pixel Compensation
- 不要用后级降噪替代坏点补偿

## 常见问题
- [[wiki/issues/噪声大|噪声大]]

## 相关页面
- [[wiki/platforms/ISX031|ISX031]]
- [[wiki/modules/ISX031_NR|NR]]
- [[wiki/modules/ISX031_Sharpen|Sharpen]]

## 来源
- [[raw/ISX031_ImageTuningManual_E_Rev.en_zh-CN.pdf]]
- [[raw/ISX031_ApplicationNote_E_Rev1.zh-CN.pdf]]
