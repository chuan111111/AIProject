# 64×64 正面角色母版规范

## 固定坐标

- 画布：`64×64`，左上角原点，中心轴 `x=32`。
- 头发顶部：`(32,4)`；脸部中心：`(32,19)`；颈部中心：`(32,28)`。
- 左右肩：`(25,30)`、`(38,30)`。
- 腰线：`y=43`；胯线：`y=47`；脚底线：`y=61`。
- 左右腕：`(21,43)`、`(42,43)`；整体人物横向范围控制在 `x=20..44`。
- 左右腿分别围绕 `x=28`、`x=36`，腿部只占 `y=47..61`，中间必须保持透明。

以上比例来自例图中央 `BASE` 的像素测量：头部（含头发）约占人物总高度 40%，
颈部以下约占 60%，不得再次拉长腿部或上移肩线。

以上锚点属于身体规范。服装、头发或配饰不得修改它们。

## 身体图层

每层必须是完整的 64×64 调色板索引矩阵：

```text
body_core
arms_back
arms_front
hands_front
face
```

`body_core` 必须是光头，不得包含任何头发颜色或固定发型轮廓。默认发型独立使用：

```text
hair_back
hair_main
hair_front
hair_accessory
```

## 标准渲染顺序

```text
hair_back
→ clothing_back
→ body_core
→ arms_back
→ clothing_main
→ arms_front
→ hands_front
→ clothing_front
→ hair_main
→ face
→ hair_front
→ hair_accessory / headwear
```

## 正式数据

身体、发型和服装分别维护自己的：

```text
pixels.json + palette.json
```

矩阵格子只保存 palette index。肤色、发色和服装颜色分别通过各自调色板替换，
阴影索引通过 `linkedTo` 跟随主色。PNG 与 `runtime.js` 均为派生物。
