# GW5_Demosaic

GW5 Demosaic & Sharpening 模块整理，用于记录 GEO GW5 ISP Bayer 插值、方向梯度检测、false color 抑制、edge-adaptive sharpening 和 gain 相关细调。

## 页面属性
- 类型：平台模块
- 厂家：GEO Semiconductor
- 平台：[[wiki/platforms/GW5|GW5]]
- 模块：Demosaic / Sharpening / False Color
- 场景：分辨率、摩尔纹、假色、细节增强、worming、checker/maze artifact、高 gain 锐化调制
- 适用范围：指定平台

## 模块作用
- Demosaic 从 Bayer RAW 插值得到 RGB，是图像颜色和细节的基础来源。
- GW5 Demosaic 使用方向相关插值降低 artifacts，并结合 edge-adaptive sharpening 处理不同空间频率。
- 调试目标是在分辨率、假色、锐度、噪声和主观 artifact 之间平衡。

## 调试阶段
- Phase One：不调。
- Phase Two：调 demosaic blend、gradient detection、false color 和基础 sharpening。
- Phase Three：按 gain 细调 sharpening 与 `noise_profile_offset`。

## 前置条件
- [[wiki/modules/GW5_Black_Offset|GW5_Black_Offset]] 已调定。
- Noise profile 已生成。
- [[wiki/modules/GW5_GE|GW5_GE]] 已调定。
- [[wiki/modules/GW5_DPC|GW5_DPC]] 已调定。
- [[wiki/modules/GW5_SNR|GW5_SNR]] 已调定并启用。

## 关键参数分组
- `rggbstart`：Bayer pattern，0/1/2/3 对应 RGGB / GRBG / GBRG / BGGR。
- `[vh/aa/va/uu]Slope`、`[vh/aa/va/uu]Thresh`、`[vh/aa/va/uu]Offset`：方向梯度检测。
- `fcSlope`、`fcAliasSlope`、`fcAliasThresh`：false color / aliasing 控制。
- `sharp_alt_ld_strength`、`sharp_alt_ldu_strength`、`sharp_alt_lu_strength`：高 / 中 / 低频锐化强度。
- `sharp_alt_d_strength`、`sharp_alt_ud_strength`：方向 / 非方向 sharp mask 强度。
- `sad_amp`：高频与中频分量 blend 偏置。
- `noise_profile_offset`：高 gain 下抑制噪声导致的误边缘检测。

## Debug mask
- `demosaic.dmscCfg = 4`：UU mask，边缘为白，平坦区为黑。
- `demosaic.dmscCfg = 17`：AA mask，135° 为白，45° 为黑，平坦区为中灰。
- `demosaic.dmscCfg = 18`：VA mask，45°/135° 为白，垂直/水平为黑。
- `demosaic.dmscCfg = 19`：VH mask，垂直边为白，水平边为黑。
- `demosaic.dmscCfg = 27`：高 / 中频与低频分类 mask，用于观察 `sad_amp`。

## Phase Two 调试流程
1. 使用 ISO12233 等分辨率卡，保持 framing marker 完整且均匀。
2. 先调 VH：`dmscCfg=19`，调 `vhSlope` 到接近 Nyquist，再调 `vhThresh` 去除 45° / 135° 误检。
3. 再按同样方法调 AA：`dmscCfg=17`，目标是正确识别 45° / 135° 方向，避免无效增加 slope。
4. 调 VA：`dmscCfg=18`，综合垂直、水平和角向检测。
5. 调 UU：`dmscCfg=4`，过高的 `uuSlope` 会让平坦区变噪并引入 worming 或 checker artifact。
6. `dmscCfg=0` 查看最终图像并记录参数。
7. 调 false color：从 `fcSlope=0`、`fcAliasSlope=255` 开始，先增加 `fcSlope` 降低摩尔纹，再降低 `fcAliasSlope` 去除 aliasing 和 ColorChecker artifact。
8. 调 sharpening：用 Imatest SFR 看 MTF50 和 overshoot，按高 / 中 / 低频分别调 `sharp_alt_ld/ldu/lu`。

## Phase Three 细调
- 在所有 gain 下重复 sharpness 调试，填充锐化强度 LUT。
- 高 gain 下调 `noise_profile_offset`，减少噪声导致的 false edge、checker pattern 和 maze pattern。
- `noise_profile_offset` 增大可减少平坦区误边缘，但可能增加高频区域 false color，需要结合 SNR 和 sharpening 一起判断。

## 调试风险
- demosaic slope 过高会产生 checker / maze pattern。
- `uuSlope` 过高会让边缘和平坦区变噪，引入 worming。
- 过度 sharpening 可能提高客观 MTF，但主观出现 halo、噪声增强和假边。
- 若 artifact 随 DPC 或 GE 开关变化，应回查 [[wiki/modules/GW5_DPC|GW5_DPC]] 或 [[wiki/modules/GW5_GE|GW5_GE]]，不要只调 demosaic。
- 过强 NR 会让图像变糊，影响 demosaic / sharpness 判断。

## 相关页面
- [[wiki/modules/GW5_SNR|GW5_SNR]]
- [[wiki/modules/GW5_DPC|GW5_DPC]]
- [[wiki/modules/GW5_GE|GW5_GE]]
- [[wiki/issues/假边|假边]]
- [[wiki/issues/细节损失|细节损失]]
- [[wiki/issues/噪声大|噪声大]]

## 来源
- [[raw/GW5_ISP Tunning中英文.pdf]]
