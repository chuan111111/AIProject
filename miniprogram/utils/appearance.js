const SPRITE_SPEC = require('./sprite-spec')
const BODY_MANIFEST = require('./body-manifest')
const HAIR_MANIFEST = require('./hair-manifest')
const CLOTHING_MANIFEST = require('./clothing-manifest')
const pixelClothing = require('./pixel-clothing')

const GRID_COLUMNS = SPRITE_SPEC.canvasWidth
const GRID_ROWS = SPRITE_SPEC.canvasHeight
const APPEARANCE_VERSION = 26

function indexAssets(manifest) {
  return manifest.assets.reduce(function (result, asset) {
    result[asset.id] = asset
    return result
  }, {})
}

const BODIES_BY_ID = indexAssets(BODY_MANIFEST)
const HAIR_BY_ID = indexAssets(HAIR_MANIFEST)
const CLOTHING_BY_ID = indexAssets(CLOTHING_MANIFEST)

const OUTFITS = CLOTHING_MANIFEST.assets.map(function (asset) {
  return {
    id: asset.id,
    name: asset.name,
    template: asset.design.template || asset.id,
    silhouette: asset.design.silhouette,
    swatches: asset.palette.filter(function (item) {
      return [2, 4, 5].indexOf(item.index) >= 0
    }).map(function (item) { return item.color }),
    preview: asset.previewPath,
    wornPreview: asset.wornPreviewPath
  }
})

const HAIR_ITEMS = HAIR_MANIFEST.assets.map(function (asset) {
  return { id: asset.id, name: asset.name, preview: asset.previewPath }
})

const COLORWAYS = [
  {
    id: 'template-original', name: '模板原色',
    swatches: ['#C88D99', '#F4E6D2', '#849184'],
    paletteOverrides: {}
  },
  {
    id: 'berry-cream', name: '莓果奶油',
    preview: '/assets/pixel/clothing/dress_berry_cream_001/catalog-berry-cream.png',
    swatches: ['#D39AA3', '#F6E8D4', '#91A095'],
    paletteOverrides: { 2: '#D39AA3', 4: '#F6E8D4', 5: '#91A095', 10: '#B8796F' }
  },
  {
    id: 'blueberry', name: '雾蓝奶霜',
    preview: '/assets/pixel/clothing/dress_berry_cream_001/catalog-blueberry.png',
    swatches: ['#74899D', '#F2E5CF', '#A58691'],
    paletteOverrides: { 2: '#74899D', 4: '#F2E5CF', 5: '#A58691', 10: '#A66E72' }
  },
  {
    id: 'mint', name: '鼠尾草茶',
    preview: '/assets/pixel/clothing/dress_berry_cream_001/catalog-mint.png',
    swatches: ['#879789', '#F1E3CE', '#B78369'],
    paletteOverrides: { 2: '#879789', 4: '#F1E3CE', 5: '#B78369', 10: '#A66F64' }
  }
]

const SKIN_TONES = [
  { id: 'peach', name: '蜜桃', swatches: ['#F2C6A8', '#EAA29B'], paletteOverrides: { 2: '#F2C6A8', 4: '#EAA29B' } },
  { id: 'honey', name: '暖蜜', swatches: ['#C98E6B', '#D98579'], paletteOverrides: { 2: '#C98E6B', 4: '#D98579' } },
  { id: 'cocoa', name: '可可', swatches: ['#80523F', '#B86F68'], paletteOverrides: { 2: '#80523F', 4: '#B86F68' } }
]

const HAIR_TONES = [
  { id: 'chestnut', name: '栗棕', preview: '/assets/pixel/hair/hair_soft_bob_64_v2/catalog-chestnut.png', swatches: ['#795644', '#AB8065'], paletteOverrides: { 2: '#795644', 4: '#AB8065', 7: '#D39AA3' } },
  { id: 'ink', name: '墨黑', preview: '/assets/pixel/hair/hair_soft_bob_64_v2/catalog-ink.png', swatches: ['#34313E', '#625D70'], paletteOverrides: { 2: '#34313E', 4: '#625D70', 7: '#B98A98' } },
  { id: 'rosewood', name: '莓木', preview: '/assets/pixel/hair/hair_soft_bob_64_v2/catalog-rosewood.png', swatches: ['#7B4E5D', '#B27B8F'], paletteOverrides: { 2: '#7B4E5D', 4: '#B27B8F', 7: '#D4A1A8' } }
]

const LAYER_LABELS = {
  hair_back: '后发', back: '衣服后层', body_core: '身体核心', arms_back: '后侧手臂',
  main: '服装主体', arms_front: '前侧手臂', hands_front: '前层手掌', front: '衣服前饰',
  hair_main: '头发主体', hair_front: '前发', face: '面部', hair_accessory: '发饰'
}

function assetById(collection, requested, fallback) {
  return collection[requested] || collection[fallback]
}

function bodyById(bodyId) {
  return assetById(BODIES_BY_ID, bodyId, BODY_MANIFEST.defaultId)
}

function hairById(hairId) {
  return assetById(HAIR_BY_ID, hairId, HAIR_MANIFEST.defaultId)
}

function outfitById(outfitId) {
  return assetById(CLOTHING_BY_ID, outfitId, CLOTHING_MANIFEST.defaultId)
}

function presetById(items, requested, fallbackId) {
  return items.find(function (item) { return item.id === requested }) ||
    items.find(function (item) { return item.id === fallbackId }) || items[0]
}

function legacyColorwayId(value) {
  const aliases = { cloud: 'blueberry', berry: 'berry-cream', lilac: 'blueberry', sunset: 'berry-cream', night: 'blueberry' }
  return presetById(COLORWAYS, aliases[value] || value, COLORWAYS[0].id).id
}

function validOverrides(asset, source, preset) {
  const result = Object.assign({}, (preset && preset.paletteOverrides) || {})
  const editable = {}
  asset.palette.forEach(function (item) { if (item.editable) editable[item.index] = true })
  Object.keys(source || {}).forEach(function (index) {
    const numericIndex = Number(index)
    const color = pixelClothing.normalizeHex(source[index])
    if (editable[numericIndex] && color) result[numericIndex] = color
  })
  return result
}

function defaultAppearance() {
  return appearanceForOutfit(CLOTHING_MANIFEST.defaultId, COLORWAYS[0].id)
}

function normalizeAppearance(value, legacyStyle) {
  const source = value || {}
  const body = bodyById(source.bodyId)
  const hair = hairById(source.hairId)
  const outfit = outfitById(source.outfitId)
  const colorway = presetById(COLORWAYS, legacyColorwayId(source.colorway || legacyStyle), COLORWAYS[0].id)
  const skinTone = presetById(SKIN_TONES, source.skinTone, SKIN_TONES[0].id)
  const hairTone = presetById(HAIR_TONES, source.hairTone, HAIR_TONES[0].id)
  const current = source.version === APPEARANCE_VERSION && source.spriteSpecVersion === SPRITE_SPEC.version
  return {
    version: APPEARANCE_VERSION,
    spriteSpecVersion: SPRITE_SPEC.version,
    bodyId: body.id,
    hairId: hair.id,
    outfitId: outfit.id,
    colorway: colorway.id,
    skinTone: skinTone.id,
    hairTone: hairTone.id,
    paletteOverrides: validOverrides(outfit, current ? source.paletteOverrides : {}, colorway),
    bodyPaletteOverrides: validOverrides(body, current ? source.bodyPaletteOverrides : {}, skinTone),
    hairPaletteOverrides: validOverrides(hair, current ? source.hairPaletteOverrides : {}, hairTone),
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
    updatedAt: source.updatedAt
  }
}

function imageLayer(id, slot, z, image, options) {
  const config = options || {}
  return {
    id: id, kind: 'image', slot: slot, z: z, image: image,
    x: config.x || 0, y: config.y || 0,
    width: config.width || GRID_COLUMNS, height: config.height || GRID_ROWS,
    recolorMap: config.recolorMap || {}
  }
}

function avatarLayers(value, mood, legacyStyle, options) {
  const config = options || {}
  const normalized = normalizeAppearance(value, legacyStyle)
  const body = bodyById(normalized.bodyId)
  const hair = hairById(normalized.hairId)
  const outfit = outfitById(normalized.outfitId)
  const result = []
    .concat(pixelClothing.runtimeLayers(hair, normalized.hairPaletteOverrides))
    .concat(config.hideOutfit ? [] : pixelClothing.runtimeLayers(outfit, normalized.paletteOverrides))
    .concat(pixelClothing.runtimeLayers(body, normalized.bodyPaletteOverrides))
  if (mood === 'thinking') {
    result.push(imageLayer('thinking-effect-v1', 'effect', 100,
      '/assets/pixel/sprite-v1/effect/thinking-effect-v1.png',
      { x: 16, y: 0, width: 32, height: 48 }))
  }
  return result.sort(function (left, right) { return left.z - right.z })
}

function appearanceForOutfit(outfitId, colorwayId, options) {
  const config = options || {}
  const body = bodyById(config.bodyId)
  const hair = hairById(config.hairId)
  const outfit = outfitById(outfitId)
  const colorway = presetById(COLORWAYS, legacyColorwayId(colorwayId), COLORWAYS[0].id)
  const skinTone = presetById(SKIN_TONES, config.skinTone, SKIN_TONES[0].id)
  const hairTone = presetById(HAIR_TONES, config.hairTone, HAIR_TONES[0].id)
  return {
    version: APPEARANCE_VERSION,
    spriteSpecVersion: SPRITE_SPEC.version,
    bodyId: body.id,
    hairId: hair.id,
    outfitId: outfit.id,
    colorway: colorway.id,
    skinTone: skinTone.id,
    hairTone: hairTone.id,
    paletteOverrides: validOverrides(outfit, config.paletteOverrides, colorway),
    bodyPaletteOverrides: validOverrides(body, config.bodyPaletteOverrides, skinTone),
    hairPaletteOverrides: validOverrides(hair, config.hairPaletteOverrides, hairTone),
    columns: GRID_COLUMNS,
    rows: GRID_ROWS
  }
}

function editablePalette(value) {
  const normalized = normalizeAppearance(value)
  return pixelClothing.editablePalette(outfitById(normalized.outfitId), normalized.paletteOverrides)
}

function bodyPalette(value) {
  const normalized = normalizeAppearance(value)
  return pixelClothing.editablePalette(bodyById(normalized.bodyId), normalized.bodyPaletteOverrides)
}

function hairPalette(value) {
  const normalized = normalizeAppearance(value)
  return pixelClothing.editablePalette(hairById(normalized.hairId), normalized.hairPaletteOverrides)
}

function layerSummaries(value) {
  const normalized = normalizeAppearance(value)
  const assets = [hairById(normalized.hairId), outfitById(normalized.outfitId), bodyById(normalized.bodyId)]
  const result = []
  assets.forEach(function (asset) {
    pixelClothing.compileAsset(asset).layers.forEach(function (layer) {
      result.push({
        id: layer.name,
        label: LAYER_LABELS[layer.name] || layer.name,
        zIndex: layer.zIndex,
        nonTransparent: layer.pixels.filter(function (index) { return index !== 0 }).length
      })
    })
  })
  return result.sort(function (left, right) { return left.zIndex - right.zIndex })
}

module.exports = {
  APPEARANCE_VERSION: APPEARANCE_VERSION,
  GRID_COLUMNS: GRID_COLUMNS,
  GRID_ROWS: GRID_ROWS,
  SPRITE_SPEC: SPRITE_SPEC,
  BODY_MANIFEST: BODY_MANIFEST,
  HAIR_MANIFEST: HAIR_MANIFEST,
  CLOTHING_MANIFEST: CLOTHING_MANIFEST,
  OUTFITS: OUTFITS,
  HAIR_ITEMS: HAIR_ITEMS,
  COLORWAYS: COLORWAYS,
  SKIN_TONES: SKIN_TONES,
  HAIR_TONES: HAIR_TONES,
  defaultAppearance: defaultAppearance,
  normalizeAppearance: normalizeAppearance,
  avatarLayers: avatarLayers,
  appearanceForOutfit: appearanceForOutfit,
  editablePalette: editablePalette,
  bodyPalette: bodyPalette,
  hairPalette: hairPalette,
  layerSummaries: layerSummaries,
  legacyColorwayId: legacyColorwayId
}
