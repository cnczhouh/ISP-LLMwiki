# FH833X_CNR

FH833X CNR 色度去噪模块，用于控制色彩噪声，并通过颜色保护和 NR3D coeff 联动降低运动区域色噪。

## 页面属性
- 类型：平台模块
- 厂家：Fullhan / 富瀚微
- 平台：[[wiki/platforms/FH833X|FH833X]]
- 模块：CNR / 色度降噪 / 颜色保护 / coeff 联动
- 场景：色噪、低照颜色保护、运动区域色噪、饱和度损伤权衡
- 适用范围：指定平台

## 作用
- 消除色度噪声。
- 通过颜色保护避免正常颜色被去噪损伤。
- 结合 NR3D coeff 对运动区域做色度去噪和颜色调整。

## 关键参数
- `cnr_en`：CNR 策略开关。
- `cnr_mode`：manual / gainMapping。
- `cnr_str`：色度噪声消除强度，值越大色噪越小，但可能损伤正常颜色。
- `col_thl`：颜色保护阈值下限，值越小颜色保护越好，去噪越弱。
- `col_thh`：颜色保护阈值上限，需满足 `col_thh > col_thl`；值越小颜色保护越好，去噪越弱。
- `cnr_mt_en`：CNR 联动使能。
- `cnr_mt_str_mode`：联动强度 manual / gainMapping。
- `cnr_mt_str`：运动区域 CNR 联动强度。
- `cnr_mt_offset`：CNR 联动偏移，值越大色噪消除越强。
- `cnr_mt_col_str`：联动颜色保护强度，值越大颜色保护越强、去色噪越弱。

## 调试步骤
1. 调 `cnr_str` 消除色噪，并配合 `col_thl/col_thh` 保护正常颜色。
2. 打开 `cnr_mt_en`，先设 `cnr_mt_offset=0`，再调 `cnr_mt_str` 消除运动区域色噪。
3. 在不同亮度条件下调整多组 `cnr_str`、`col_thl/col_thh`、`cnr_mt_str`，写入 gainMapping。
4. 亮环境色噪小，可用较小 `cnr_str/cnr_mt_str`，加大 `col_thh`、适当减小 `col_thl`，保留浓郁颜色。
5. 暗环境色噪大，可加大 `cnr_str/cnr_mt_str`，同时减小 `col_thl/col_thh` 保护图像颜色。

## 调试权衡
CNR 的目标不是把色噪完全抹掉，而是在低照彩噪、真实颜色饱和度和运动区域颜色稳定性之间取舍。

- `cnr_str` 越大，彩噪越少，但低饱和颜色、皮肤细微色差和暗部色彩层次会被抹淡。
- `col_thl/col_thh` 越偏向保护颜色，真实颜色越不容易被误伤，但色噪也更容易留下；保护不足时，彩色纹理会变灰或出现色块化。
- `cnr_mt_str` 和 `cnr_mt_offset` 主要处理运动区域色噪。运动区加强 CNR 可以降低彩色拖尾和闪烁，但也会让运动物体颜色变淡。
- `cnr_mt_col_str` 增大能保护运动区域颜色，但会削弱运动色噪处理能力，需要和 NR3D coeff、YNR / APC 运动联动一起看。
- 低照下 CNR、CE、CCM、AWB 是串联影响：AWB / CCM 把颜色拉浓后，CNR 压力会增大；CE 提饱和也会把残留色噪重新放大。

### 典型调试取舍
| 目标 | 常见调整方向 | 图像收益 | 主要副作用 |
| --- | --- | --- | --- |
| 低照彩噪更少 | 增大 `cnr_str`，适当降低颜色保护 | 色斑、彩点减少 | 颜色变淡、肤色层次损失 |
| 保留真实颜色 | 增强 `col_thl/col_thh` 颜色保护 | 饱和物体更自然 | 彩噪残留增加 |
| 压运动色噪 | 增强 `cnr_mt_str/offset` | 运动区域彩噪下降 | 运动物体颜色发灰 |
| 避免 CE 放大色噪 | 先定 CNR，再限制 CE 暗部饱和度 | 暗部颜色更稳 | 夜景主观饱和度降低 |

## 关联页面
- [[wiki/issues/色噪|色噪]]
- [[wiki/issues/噪声大|噪声大]]
- [[wiki/issues/饱和度异常|饱和度异常]]
- [[wiki/modules/FH833X_SHARP_NOISE|FH833X_SHARP_NOISE]]

## 来源
- [[raw/FH833X_效果调试手册-v2.0.4.pdf]]：23 CNR。
