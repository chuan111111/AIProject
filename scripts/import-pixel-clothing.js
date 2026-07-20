#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function fail(message) {
  throw new Error('[import-pixel-clothing] ' + message)
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function rgbaFromHex(value) {
  let color = String(value || '').replace('#', '')
  if (color.length === 6) color += 'FF'
  if (!/^[0-9A-Fa-f]{8}$/.test(color)) fail('非法颜色 ' + value)
  return [0, 2, 4, 6].map(function (offset) {
    return parseInt(color.slice(offset, offset + 2), 16)
  })
}

function crc32(buffer) {
  let crc = 0xFFFFFFFF
  for (let index = 0; index < buffer.length; index += 1) {
    crc ^= buffer[index]
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, payload) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4)
  length.writeUInt32BE(payload.length)
  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(Buffer.concat([name, payload])))
  return Buffer.concat([length, name, payload, checksum])
}

function encodePng(width, height, rgba) {
  const stride = width * 4
  const rows = []
  for (let y = 0; y < height; y += 1) {
    rows.push(Buffer.from([0]))
    rows.push(rgba.slice(y * stride, (y + 1) * stride))
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8
  header[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0))
  ])
}

function encodeRow(row, symbols) {
  const result = []
  let start = 0
  while (start < row.length) {
    let end = start + 1
    while (end < row.length && row[end] === row[start]) end += 1
    result.push(String(end - start) + symbols[row[start]])
    start = end
  }
  return result.join(' ')
}

function matrixRgba(matrix, colors) {
  const rgba = Buffer.alloc(64 * 64 * 4)
  let offset = 0
  matrix.forEach(function (row) {
    row.forEach(function (index) {
      const color = colors[index]
      rgba[offset] = color[0]
      rgba[offset + 1] = color[1]
      rgba[offset + 2] = color[2]
      rgba[offset + 3] = color[3]
      offset += 4
    })
  })
  return rgba
}

function copyIfPresent(sourceDir, outputDir, fileName) {
  const source = path.join(sourceDir, fileName)
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(outputDir, fileName))
}

function main() {
  const sourceDir = path.resolve(process.argv[2] || '')
  if (!process.argv[2] || !fs.existsSync(sourceDir)) {
    fail('用法：node scripts/import-pixel-clothing.js <素材目录>')
  }
  const projectRoot = path.resolve(__dirname, '..')
  const pixels = readJson(path.join(sourceDir, 'pixels.json'))
  const paletteFile = readJson(path.join(sourceDir, 'palette.json'))
  const regions = readJson(path.join(sourceDir, 'regions.json'))
  if (pixels.canvas.width !== 64 || pixels.canvas.height !== 64) fail('画布必须为 64×64')
  const palette = paletteFile.palette
  const colors = {}
  const symbols = {}
  palette.forEach(function (item) {
    colors[item.index] = rgbaFromHex(item.color)
    symbols[item.index] = item.symbol
  })
  const layerNames = ['back', 'main', 'front']
  const runtimeLayers = {}
  layerNames.forEach(function (name) {
    const layer = pixels.layers[name]
    if (!layer || layer.pixels.length !== 64) fail('缺少 64 行图层 ' + name)
    layer.pixels.forEach(function (row, y) {
      if (row.length !== 64) fail(name + ' ROW ' + y + ' 不是 64 格')
      row.forEach(function (index) {
        if (!colors[index]) fail(name + ' 使用了未知索引 ' + index)
      })
    })
    runtimeLayers[name] = {
      zIndex: layer.zIndex,
      encodedRows: layer.pixels.map(function (row) { return encodeRow(row, symbols) })
    }
  })

  const outputDir = path.join(projectRoot, 'miniprogram/assets/pixel/clothing', pixels.id)
  fs.mkdirSync(outputDir, { recursive: true })
  ;['pixels.json', 'palette.json', 'regions.json', 'design.txt', 'asset.pixel'].forEach(function (name) {
    copyIfPresent(sourceDir, outputDir, name)
  })
  copyIfPresent(sourceDir, outputDir, 'sprite.png')
  copyIfPresent(sourceDir, outputDir, 'preview_sheet.png')
  copyIfPresent(sourceDir, outputDir, 'worn_preview_64.png')

  const fallbackLayers = {}
  layerNames.forEach(function (name) {
    const fileName = 'layer-' + name + '.png'
    fallbackLayers[name] = '/assets/pixel/clothing/' + pixels.id + '/' + fileName
    fs.writeFileSync(
      path.join(outputDir, fileName),
      encodePng(64, 64, matrixRgba(pixels.layers[name].pixels, colors))
    )
  })

  const runtime = {
    version: pixels.version,
    id: pixels.id,
    name: pixels.name,
    canvas: pixels.canvas,
    design: pixels.design,
    palette: palette,
    editableRegions: regions.editableRegions,
    lockedPaletteIndices: regions.lockedPaletteIndices,
    layers: runtimeLayers,
    fallbackLayers: fallbackLayers,
    previewPath: '/assets/pixel/clothing/' + pixels.id + '/sprite.png',
    wornPreviewPath: fs.existsSync(path.join(sourceDir, 'worn_preview_64.png'))
      ? '/assets/pixel/clothing/' + pixels.id + '/worn_preview_64.png'
      : '/assets/pixel/clothing/' + pixels.id + '/sprite.png'
  }
  fs.writeFileSync(
    path.join(outputDir, 'runtime.js'),
    'module.exports = ' + JSON.stringify(runtime, null, 2) + '\n'
  )
  console.log('Imported ' + pixels.id + ' -> ' + path.relative(projectRoot, outputDir))
}

main()
