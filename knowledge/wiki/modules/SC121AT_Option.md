# SC121AT_Option

SC121AT Option 模块整理，用于记录 SmartSens Tuning Tool 中全局开关、参数导入导出、硬件选择、自检测、保存与写入等基础操作入口。

## 页面属性
- 类型：平台模块
- 厂家：SmartSens / 思特威
- 平台：[[wiki/platforms/SC121AT|SC121AT]]
- 模块：Option / 工具全局配置
- 场景：参数导入导出、硬件选择、寄存器写入、默认配置保存、调试配置管理
- 适用范围：指定平台

## 模块作用
- Option 是 SC121AT ISP Tuning Tool 的全局配置页，负责开关功能、配置参数导入导出、自检测和硬件选择。
- 各模块右上角通常有刷新 / 写入功能，但整套 ISP 参数的导入、导出和多套 reference set 管理集中在 Option。
- 调试前应先确认 Option 中硬件、通信、配置文件和默认寄存器保存方式正确，否则模块页参数可能写入失败或保存不完整。

## Import_Export
- Import_Export 用于导入和导出整个 ISP 模块调试参数配置文件。
- 工具提供两类让参数生效的方法：直接写入寄存器，以及通过 Reference Set 管理多套参数。

### 方法 1：直接生效到寄存器
- Save：将当前 sensor 初始化配置中 ISP 部分与 default 不一致的寄存器生成 `ISP_Data_xxx.hex` 和 `ISP_Data_xxx.bin` 文件并保存到本地。
- Load：从本地导入前缀名为 `ISP_Data_xxx.hex` 或 `ISP_Data_xxx.bin` 的文件，刷新到页面并写入对应寄存器。

### 方法 2：Reference Set
- Clean：勾选后保存 clean 版本配置。
- Set1-10：可载入 1 到 10 套参数。
- Save：保存当前 sensor 的所有调试参数为 `.ini` 文件。
- Load：载入 `.ini` 参数，可载入 Set1-10。
- Use：使用载入参数并写入对应寄存器。

## 调试要点
- 做模块调参前，先确认当前加载的是目标 sensor 初始化配置和目标 reference set。
- 多套参数对比时，建议通过 Set1-10 管理，而不是手工反复覆盖同一份配置。
- 若页面参数显示已变化但图像无变化，应先排查是否执行了 Use / Load / 写入寄存器，以及当前模块是否被 [[wiki/modules/SC121AT_ISPC_Controller|SC121AT_ISPC_Controller]] 接管。
- LSC 标定流程中需要进入 Option / software setting 设置 zoom algorithm 和 Round setting。

## 相关页面
- [[wiki/platforms/SC121AT|SC121AT]]
- [[wiki/tools/SC121AT_ISP_Tuning_Tool|SC121AT ISP Tuning Tool]]
- [[wiki/modules/SC121AT_ISPC_Controller|SC121AT_ISPC_Controller]]
- [[wiki/modules/SC121AT_LSC|SC121AT_LSC]]

## 来源
- [[raw/sc121at_ISP_Tuning_Tool使用指南_V1.2.pdf]]
