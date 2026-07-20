const COMPILED = {}

function assert(condition, message) {
  if (!condition) throw new Error('[pixel-clothing] ' + message)
}

function normalizeHex(value) {
  const color = String(value || '').toUpperCase()
  if (/^#[0-9A-F]{6}$/.test(color)) return color
  if (/^#[0-9A-F]{8}$/.test(color)) return color
  return ''
}

function hexToRgba(value) {
  let color = normalizeHex(value).slice(1)
  if (color.length === 6) color += 'FF'
  return [
    parseInt(color.slice(0, 2), 16),
    parseInt(color.slice(2, 4), 16),
    parseInt(color.slice(4, 6), 16),
    parseInt(color.slice(6, 8), 16)
  ]
}

function toneLinkedColor(value, tone) {
  const rgba = hexToRgba(value)
  const amount = Math.max(-1, Math.min(1, Number(tone === undefined ? -0.24 : tone)))
  const target = amount >= 0 ? 255 : 0
  const weight = Math.abs(amount)
  function channel(number) {
    return Math.max(0, Math.min(255, Math.round(number + (target - number) * weight)))
      .toString(16).padStart(2, '0')
  }
  return ('#' + channel(rgba[0]) + channel(rgba[1]) + channel(rgba[2])).toUpperCase()
}

function compileAsset(asset) {
  if (COMPILED[asset.id]) return COMPILED[asset.id]
  const width = asset.canvas.width
  const height = asset.canvas.height
  assert(width === 64 && height === 64, asset.id + ' 必须是 64×64')
  const symbols = {}
  const indices = {}
  asset.palette.forEach(function (item) {
    assert(!Object.prototype.hasOwnProperty.call(symbols, item.symbol),
      '重复 palette symbol ' + item.symbol)
    assert(!Object.prototype.hasOwnProperty.call(indices, item.index),
      '重复 palette index ' + item.index)
    assert(Boolean(normalizeHex(item.color)), '非法颜色 ' + item.color)
    symbols[item.symbol] = item.index
    indices[item.index] = true
  })
  assert(indices[0], '缺少透明索引 0')

  const layers = Object.keys(asset.layers).map(function (name) {
    const layer = asset.layers[name]
    assert(layer.encodedRows.length === height, name + ' 必须有 64 行')
    const pixels = []
    layer.encodedRows.forEach(function (encoded, y) {
      const row = []
      String(encoded).trim().split(/\s+/).forEach(function (token) {
        const match = token.match(/^([1-9]\d*)([A-Za-z])$/)
        assert(match && Object.prototype.hasOwnProperty.call(symbols, match[2]),
          name + ' ROW ' + y + ' 存在非法游程 ' + token)
        const count = Number(match[1])
        for (let index = 0; index < count; index += 1) row.push(symbols[match[2]])
      })
      assert(row.length === width, name + ' ROW ' + y + ' 不是 64 格')
      Array.prototype.push.apply(pixels, row)
    })
    return {
      name: name,
      zIndex: layer.zIndex,
      pixels: pixels,
      fallbackImage: asset.fallbackLayers[name]
    }
  }).sort(function (left, right) { return left.zIndex - right.zIndex })

  COMPILED[asset.id] = { layers: layers }
  return COMPILED[asset.id]
}

function paletteColors(asset, overrides) {
  const requested = overrides || {}
  const colors = {}
  const changed = {}
  asset.palette.forEach(function (item) {
    const replacement = requested[item.index] || requested[String(item.index)] || requested[item.role]
    if (item.editable && normalizeHex(replacement)) {
      colors[item.index] = normalizeHex(replacement)
      changed[item.index] = true
    } else {
      colors[item.index] = normalizeHex(item.color)
    }
  })
  asset.palette.forEach(function (item) {
    if (item.linkedTo !== undefined && changed[item.linkedTo]) {
      colors[item.index] = toneLinkedColor(colors[item.linkedTo], item.linkedTone)
    }
  })
  return colors
}

function runtimeLayers(asset, overrides) {
  const compiled = compileAsset(asset)
  const colors = paletteColors(asset, overrides)
  const rgba = {}
  Object.keys(colors).forEach(function (index) { rgba[index] = hexToRgba(colors[index]) })
  return compiled.layers.map(function (layer) {
    return {
      id: asset.id + ':' + layer.name,
      kind: 'matrix',
      slot: layer.name,
      z: layer.zIndex,
      image: layer.fallbackImage,
      pixels: layer.pixels,
      paletteRgba: rgba,
      canvasWidth: asset.canvas.width,
      canvasHeight: asset.canvas.height
    }
  })
}

function editablePalette(asset, overrides) {
  const colors = paletteColors(asset, overrides)
  return asset.palette.filter(function (item) { return item.editable }).map(function (item) {
    return {
      index: item.index,
      symbol: item.symbol,
      role: item.role,
      color: colors[item.index]
    }
  })
}

module.exports = {
  compileAsset: compileAsset,
  paletteColors: paletteColors,
  runtimeLayers: runtimeLayers,
  editablePalette: editablePalette,
  normalizeHex: normalizeHex
}
