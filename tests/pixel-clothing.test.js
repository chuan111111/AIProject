const assert = require('assert')
const fs = require('fs')
const path = require('path')
const appearance = require('../miniprogram/utils/appearance')
const pixelClothing = require('../miniprogram/utils/pixel-clothing')

function sourceJson(group, id) {
  return JSON.parse(fs.readFileSync(path.join(
    __dirname, '../miniprogram/assets/pixel', group, id, 'pixels.json'
  ), 'utf8'))
}

function runtimeMatchesSource(asset, group) {
  const source = sourceJson(group, asset.id)
  const compiled = pixelClothing.compileAsset(asset)
  compiled.layers.forEach(function (layer) {
    const expected = [].concat.apply([], source.layers[layer.name].pixels)
    assert.strictEqual(layer.pixels.length, 4096)
    assert.deepStrictEqual(layer.pixels, expected)
  })
  return source
}

function occupiedXs(matrix, y) {
  const result = []
  matrix[y].forEach(function (value, x) { if (value !== 0) result.push(x) })
  return result
}

const bodyAsset = appearance.BODY_MANIFEST.assets[0]
const hairAsset = appearance.HAIR_MANIFEST.assets[0]
const dressAsset = appearance.CLOTHING_MANIFEST.assets[0]
const bodySource = runtimeMatchesSource(bodyAsset, 'body')
const hairSource = runtimeMatchesSource(hairAsset, 'hair')
const dressSource = runtimeMatchesSource(dressAsset, 'clothing')
const clothingSources = appearance.CLOTHING_MANIFEST.assets.map(function (asset) {
  return runtimeMatchesSource(asset, 'clothing')
})

assert.strictEqual(appearance.SPRITE_SPEC.canvasWidth, 64)
assert.strictEqual(appearance.SPRITE_SPEC.canvasHeight, 64)
assert.strictEqual(appearance.SPRITE_SPEC.centerX, 32)
assert.strictEqual(appearance.SPRITE_SPEC.groundY, 61)
assert.deepStrictEqual(appearance.SPRITE_SPEC.anchors.headTop, [32, 4])
assert.deepStrictEqual(appearance.SPRITE_SPEC.anchors.leftShoulder, [25, 30])
assert.deepStrictEqual(appearance.SPRITE_SPEC.anchors.rightShoulder, [38, 30])
assert.deepStrictEqual(appearance.SPRITE_SPEC.anchors.waistCenter, [32, 43])
assert.deepStrictEqual(appearance.SPRITE_SPEC.anchors.hipCenter, [32, 47])

const bodyRoles = bodyAsset.palette.map(function (item) { return item.role })
assert.strictEqual(bodyAsset.design.bald, true)
assert.strictEqual(bodyRoles.some(function (role) { return role.indexOf('hair') >= 0 }), false)
assert(bodyAsset.palette.length >= 12)
assert(hairAsset.palette.length >= 9)
assert(dressAsset.palette.length >= 11)
assert(dressAsset.palette.some(function (item) {
  return item.role === 'primary_highlight' && item.linkedTone > 0
}))
assert.strictEqual(appearance.CLOTHING_MANIFEST.version, 2)
assert.strictEqual(appearance.OUTFITS.length, 5)
assert.strictEqual(new Set(appearance.OUTFITS.map(function (item) { return item.template })).size, 5)
assert.strictEqual(appearance.COLORWAYS[0].id, 'template-original')
appearance.CLOTHING_MANIFEST.assets.forEach(function (asset, assetIndex) {
  assert.deepStrictEqual(Object.keys(clothingSources[assetIndex].layers), ['back', 'main', 'front'])
  assert.deepStrictEqual(asset.design.anchors, appearance.SPRITE_SPEC.anchors)
  assert.strictEqual(asset.design.compatibleBody, bodyAsset.id)
  assert.deepStrictEqual(asset.palette.filter(function (item) { return item.editable }).map(function (item) {
    return item.index
  }), [2, 4, 5, 10])
})
const clothingPixelCounts = clothingSources.map(function (source) {
  return Object.keys(source.layers).reduce(function (count, name) {
    return count + source.layers[name].pixels.reduce(function (layerCount, row) {
      return layerCount + row.filter(function (index) { return index !== 0 }).length
    }, 0)
  }, 0)
})
assert.strictEqual(new Set(clothingPixelCounts).size, 5)
assert.deepStrictEqual(Object.keys(bodySource.layers), [
  'body_core', 'arms_back', 'arms_front', 'hands_front', 'face'
])

const bodyCore = bodySource.layers.body_core.pixels
assert.strictEqual(occupiedXs(bodyCore, 7).length, 6)
assert.strictEqual(occupiedXs(bodyCore, 10).length, 18)
assert(occupiedXs(bodyCore, 26).length < occupiedXs(bodyCore, 10).length)
for (let y = 49; y <= 58; y += 1) {
  assert.strictEqual(bodyCore[y][31], 0)
  assert.strictEqual(bodyCore[y][32], 0)
  assert.strictEqual(bodyCore[y][33], 0)
}
assert(occupiedXs(bodyCore, 61).length > 0)
assert.strictEqual(occupiedXs(bodyCore, 62).length, 0)
assert(bodyCore[35].some(function (index) { return index === 9 }))

const armsBack = bodySource.layers.arms_back.pixels
const armsFront = bodySource.layers.arms_front.pixels
const handsFront = bodySource.layers.hands_front.pixels
assert(Math.max.apply(null, occupiedXs(armsBack, 37).filter(function (x) { return x < 32 })) <= 23)
assert(Math.min.apply(null, occupiedXs(armsBack, 37).filter(function (x) { return x > 32 })) >= 40)
assert(occupiedXs(armsFront, 43).indexOf(21) >= 0)
assert(occupiedXs(armsFront, 43).indexOf(42) >= 0)
assert(occupiedXs(handsFront, 46).length >= 6)

const combinedBounds = { minX: 64, minY: 64, maxX: -1, maxY: -1 }
;[bodySource, hairSource].forEach(function (source) {
  Object.keys(source.layers).forEach(function (name) {
    source.layers[name].pixels.forEach(function (row, y) {
      row.forEach(function (value, x) {
        if (!value) return
        combinedBounds.minX = Math.min(combinedBounds.minX, x)
        combinedBounds.minY = Math.min(combinedBounds.minY, y)
        combinedBounds.maxX = Math.max(combinedBounds.maxX, x)
        combinedBounds.maxY = Math.max(combinedBounds.maxY, y)
      })
    })
  })
})
assert.deepStrictEqual(combinedBounds, { minX: 20, minY: 4, maxX: 44, maxY: 61 })
const measuredHeadShare = (27 - 4 + 1) / (61 - 4 + 1)
assert(Math.abs(measuredHeadShare - 0.40) < 0.02)

assert.strictEqual(dressSource.design.compatibleBody, bodyAsset.id)
assert.strictEqual(occupiedXs(dressSource.layers.main.pixels, 28).length > 0, true)
assert.strictEqual(occupiedXs(dressSource.layers.main.pixels, 56).length > 0, true)
assert.strictEqual(occupiedXs(dressSource.layers.main.pixels, 57).length, 0)
assert(dressSource.layers.main.pixels[43].some(function (index) { return index === 5 }))
assert(dressSource.layers.main.pixels[42].slice(18, 24).some(function (index) { return index === 2 }))
assert(dressSource.layers.main.pixels[42].slice(40, 45).some(function (index) { return index === 2 }))

const defaultAppearance = appearance.defaultAppearance()
const defaultLayers = appearance.avatarLayers(defaultAppearance, 'happy')
assert.deepStrictEqual(defaultLayers.map(function (layer) { return layer.z }), [
  5, 10, 20, 25, 30, 40, 45, 50, 60, 65, 70, 75
])
defaultLayers.forEach(function (layer) {
  assert.strictEqual(layer.kind, 'matrix')
  assert.strictEqual(layer.pixels.length, 4096)
})
const baseOnlyLayers = appearance.avatarLayers(defaultAppearance, 'happy', null, { hideOutfit: true })
assert.strictEqual(baseOnlyLayers.some(function (layer) { return ['back', 'main', 'front'].indexOf(layer.slot) >= 0 }), false)
assert.strictEqual(baseOnlyLayers.some(function (layer) { return layer.slot === 'body_core' }), true)
assert.strictEqual(baseOnlyLayers.some(function (layer) { return layer.slot === 'hair_front' }), true)

const blue = appearance.appearanceForOutfit(dressAsset.id, 'blueberry', {
  skinTone: 'cocoa', hairTone: 'ink'
})
const blueDress = pixelClothing.paletteColors(dressAsset, blue.paletteOverrides)
const cocoaBody = pixelClothing.paletteColors(bodyAsset, blue.bodyPaletteOverrides)
const inkHair = pixelClothing.paletteColors(hairAsset, blue.hairPaletteOverrides)
assert.strictEqual(blueDress[2], '#74899D')
assert.notStrictEqual(blueDress[3], '#A86678')
assert.strictEqual(cocoaBody[2], '#80523F')
assert.notStrictEqual(cocoaBody[3], '#D69B82')
assert.strictEqual(inkHair[2], '#34313E')
assert.notStrictEqual(inkHair[3], '#472B23')
assert.strictEqual(pixelClothing.paletteColors(bodyAsset, { 1: '#FFFFFF' })[1], '#69473D')

const migrated = appearance.normalizeAppearance({
  version: 21, spriteSpecVersion: 2, colorway: 'cloud'
})
assert.strictEqual(migrated.outfitId, dressAsset.id)
assert.strictEqual(migrated.bodyId, bodyAsset.id)
assert.strictEqual(migrated.hairId, hairAsset.id)
assert.strictEqual(migrated.colorway, 'blueberry')
assert.strictEqual(migrated.columns, 64)
assert.strictEqual(migrated.rows, 64)

const custom = appearance.normalizeAppearance({
  version: appearance.APPEARANCE_VERSION,
  spriteSpecVersion: appearance.SPRITE_SPEC.version,
  bodyId: bodyAsset.id,
  hairId: hairAsset.id,
  outfitId: dressAsset.id,
  colorway: 'berry-cream',
  skinTone: 'peach',
  hairTone: 'chestnut',
  paletteOverrides: { 2: '#112233', 1: '#FFFFFF' },
  bodyPaletteOverrides: { 2: '#AA8866' },
  hairPaletteOverrides: { 2: '#221F2A' }
})
assert.strictEqual(custom.paletteOverrides[2], '#112233')
assert.strictEqual(custom.paletteOverrides[1], undefined)
assert.strictEqual(custom.bodyPaletteOverrides[2], '#AA8866')
assert.strictEqual(custom.hairPaletteOverrides[2], '#221F2A')

const customTemplate = appearance.appearanceForOutfit(
  appearance.CLOTHING_MANIFEST.assets[1].id,
  'template-original',
  { paletteOverrides: { 2: '#123456', 10: '#00000000' } }
)
assert.strictEqual(customTemplate.paletteOverrides[2], '#123456')
assert.strictEqual(customTemplate.paletteOverrides[10], '#00000000')
const customTemplateColors = pixelClothing.paletteColors(
  appearance.CLOTHING_MANIFEST.assets[1], customTemplate.paletteOverrides
)
assert.strictEqual(customTemplateColors[2], '#123456')
assert.strictEqual(customTemplateColors[10], '#00000000')
assert.notStrictEqual(customTemplateColors[3], appearance.CLOTHING_MANIFEST.assets[1].palette[3].color)

console.log('pixel-clothing tests passed')
