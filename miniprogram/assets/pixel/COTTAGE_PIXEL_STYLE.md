# 高精度少女像素换装画风规范

本项目的正式素材仍然是 `64×64` 调色板索引矩阵。参考图只用于定义视觉语言，
不能作为运行时贴图或替代 `pixels.json + palette.json`。

## 视觉基准

- 日系治愈、复古田园、头大身小的少女换装风。
- 使用奶油白、豆沙粉、鼠尾草绿、灰蓝和暖棕等低饱和颜色。
- 描边统一使用深暖棕，不使用纯黑。
- 无渐变、无抗锯齿、无半透明边缘、无平滑缩放。
- 细节由离散像素簇表达：发丝、布褶、缝线、纽扣、蕾丝、刺绣和小花。

## 语义色阶

每个可换色材质至少保留以下角色：

```text
outline
deep_shadow
soft_shadow
primary
highlight
detail / embroidery
```

矩阵只保存 palette index。`deep_shadow`、`soft_shadow` 和 `highlight` 通过
`linkedTo + linkedTone` 关联主色，因此换色不会破坏明暗层次。

## 图层顺序

```text
hair_back
→ clothes_back
→ body_core
→ arms_back
→ clothes_main
→ arms_front
→ hands_front
→ clothes_front
→ hair_main
→ face
→ hair_front
→ hair_accessory / headwear
```

前刘海必须绘制在面部之后，避免眼睛错误覆盖刘海。

## 固定坐标

- 画布 `64×64`，中心轴 `x=32`，脚底线 `y=61`。
- 头发外轮廓约为 `x=20..44, y=4..27`，约占人物总高度 40%。
- 左右肩 `(25,30)`、`(38,30)`。
- 腰线 `y=43`，胯线 `y=47`，腿部控制在 `y=47..61`。
- 双臂自然下垂，不允许 T-pose。
- BASE 展示使用独立头发、身体与奶油色基础内搭，不显示外穿服装。
- 所有槽位使用完整画布，禁止自动裁切或单素材位置偏移。
