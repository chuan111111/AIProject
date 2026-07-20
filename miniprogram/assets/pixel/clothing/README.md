# 64×64 矩阵服装运行时

每套服装目录中的正式数据是 `pixels.json + palette.json`。`regions.json` 描述
编辑范围；`runtime.js`、`layer-*.png`、`sprite.png` 和预览图都是派生物。

当前模板库：

- `dress_berry_cream_001`：莓果奶油田园刺绣连衣裙
- `dress_sage_apron_002`：鼠尾草奶油围裙裙
- `dress_navy_sailor_003`：雾蓝海军领百褶裙
- `outfit_cocoa_academy_004`：可可学院背心裙
- `dress_rose_tiered_005`：玫瑰奶霜分层蕾丝裙

所有模板统一开放四个语义索引：`2=主布料`、`4=辅布料`、`5=强调色`、
`10=刺绣`。编辑器只保存这些索引的 `paletteOverrides`；索引 `3/6/7/8/9`
会通过 `linkedTo + linkedTone` 自动生成阴影和高光。将索引 `10` 覆盖为
`#00000000` 可隐藏刺绣，矩阵轮廓本身不会改变。

导入或更新素材：

```bash
npm run import:clothing -- /absolute/path/to/dress_asset
npm run test:clothing
```

运行时链路：

```text
appearance(bodyId + hairId + outfitId + paletteOverrides)
→ 分别展开身体、发型和服装的 64×64 索引矩阵
→ 各资产独立执行 palette index → RGBA
→ hair_back → dress_back → body_core → arms_back → dress_main
→ arms_front → hands_front → dress_front → hair_main → face
→ hair_front → hair_accessory / headwear
→ Canvas 最近邻显示
```

Canvas 主路径直接读取矩阵；`layer-*.png` 只供 Canvas 尚未就绪时的 WXML
备用显示，不能反向覆盖矩阵。

统一身体是 `body/body_chibi_64_v2`，其中不包含头发；默认发型是
`hair/hair_soft_bob_64_v2`。服装不得携带自己的身体或发型，也不得为单件衣服
改变 `sprite-spec.js` 中的肩线、腰线、胯线和脚底线。

新增素材还必须遵循相邻目录的 `COTTAGE_PIXEL_STYLE.md`：使用暖棕描边、
低饱和田园色，以及通过 `linkedTo + linkedTone` 派生的高光和阴影色阶。
