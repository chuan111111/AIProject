#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const SIZE = 64
const PROJECT_ROOT = path.resolve(__dirname, '..')
const OUTPUT_ROOT = path.resolve(process.argv[2] || path.join(PROJECT_ROOT, 'miniprogram/assets/pixel'))

function matrix() {
  return Array.from({ length: SIZE }, function () { return Array(SIZE).fill(0) })
}

function mask() {
  return Array.from({ length: SIZE }, function () { return Array(SIZE).fill(false) })
}

function set(target, x, y, value) {
  if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) target[y][x] = value
}

function fillRect(target, x1, y1, x2, y2, value) {
  for (let y = y1; y <= y2; y += 1) {
    for (let x = x1; x <= x2; x += 1) set(target, x, y, value)
  }
}

function fillMaskRect(target, x1, y1, x2, y2) {
  fillRect(target, x1, y1, x2, y2, true)
}

function fillSpans(target, spans) {
  Object.keys(spans).forEach(function (key) {
    const y = Number(key)
    spans[key].forEach(function (span) { fillMaskRect(target, span[0], y, span[1], y) })
  })
}

function line(target, x1, y1, x2, y2, radius) {
  let x = x1
  let y = y1
  const dx = Math.abs(x2 - x1)
  const sx = x1 < x2 ? 1 : -1
  const dy = -Math.abs(y2 - y1)
  const sy = y1 < y2 ? 1 : -1
  let error = dx + dy
  while (true) {
    fillMaskRect(target, x - radius, y - radius, x + radius, y + radius)
    if (x === x2 && y === y2) break
    const twice = 2 * error
    if (twice >= dy) { error += dy; x += sx }
    if (twice <= dx) { error += dx; y += sy }
  }
}

function boundary(source, x, y) {
  return !source[y][x - 1] || !source[y][x + 1] ||
    !source[y - 1] || !source[y + 1] ||
    !source[y - 1][x] || !source[y + 1][x]
}

function paintMask(target, source, options) {
  const config = options || {}
  const outline = config.outline
  const fill = config.fill
  const shadow = config.shadow
  const shadowFromX = config.shadowFromX
  const shadowFromY = config.shadowFromY
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!source[y][x]) continue
      if (outline !== undefined && boundary(source, x, y)) {
        target[y][x] = outline
      } else if (shadow !== undefined &&
        ((shadowFromX !== undefined && x >= shadowFromX) ||
         (shadowFromY !== undefined && y >= shadowFromY))) {
        target[y][x] = shadow
      } else {
        target[y][x] = fill
      }
    }
  }
}

function bodyAsset() {
  const layers = {
    body_core: { zIndex: 20, pixels: matrix() },
    arms_back: { zIndex: 25, pixels: matrix() },
    arms_front: { zIndex: 40, pixels: matrix() },
    hands_front: { zIndex: 45, pixels: matrix() },
    face: { zIndex: 65, pixels: matrix() }
  }

  const head = mask()
  fillSpans(head, {
    7: [[29, 34]], 8: [[26, 37]], 9: [[24, 39]], 10: [[23, 40]],
    11: [[22, 41]], 12: [[22, 41]], 13: [[22, 41]],
    14: [[21, 42]], 15: [[21, 42]], 16: [[21, 42]], 17: [[21, 42]],
    18: [[21, 42]], 19: [[21, 42]], 20: [[22, 41]], 21: [[22, 41]],
    22: [[23, 40]], 23: [[24, 39]], 24: [[25, 38]], 25: [[27, 36]],
    26: [[29, 34]], 27: [[30, 33]]
  })
  paintMask(layers.body_core.pixels, head, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 39, shadowFromY: 24
  })
  ;[[27, 11], [28, 11], [24, 14], [24, 15], [25, 20], [26, 20]].forEach(function (point) {
    set(layers.body_core.pixels, point[0], point[1], 6)
  })

  const torso = mask()
  fillSpans(torso, {
    27: [[30, 33]], 28: [[29, 34]], 29: [[29, 34]],
    30: [[25, 38]], 31: [[26, 37]], 32: [[27, 36]], 33: [[27, 36]],
    34: [[27, 36]], 35: [[27, 36]], 36: [[27, 36]], 37: [[28, 35]],
    38: [[28, 35]], 39: [[28, 35]], 40: [[28, 35]], 41: [[28, 35]],
    42: [[28, 35]], 43: [[28, 35]], 44: [[27, 36]], 45: [[27, 36]],
    46: [[26, 37]], 47: [[26, 37]]
  })
  paintMask(layers.body_core.pixels, torso, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 35
  })
  fillRect(layers.body_core.pixels, 30, 28, 31, 29, 6)
  set(layers.body_core.pixels, 26, 31, 6)

  const underwear = mask()
  fillSpans(underwear, {
    30: [[28, 29], [34, 35]], 31: [[28, 29], [34, 35]],
    32: [[28, 35]], 33: [[27, 36]], 34: [[27, 36]], 35: [[27, 36]],
    36: [[27, 36]], 37: [[27, 36]], 38: [[28, 35]], 39: [[28, 35]],
    40: [[28, 35]], 41: [[28, 35]], 42: [[28, 35]], 43: [[27, 36]],
    44: [[26, 37]], 45: [[26, 31], [33, 37]],
    46: [[26, 30], [34, 38]], 47: [[26, 30], [34, 38]],
    48: [[27, 30], [34, 37]]
  })
  paintMask(layers.body_core.pixels, underwear, {
    outline: 1, fill: 9, shadow: 10, shadowFromX: 35, shadowFromY: 40
  })
  fillRect(layers.body_core.pixels, 29, 32, 34, 32, 11)
  ;[27, 29, 31, 33, 35].forEach(function (x) { set(layers.body_core.pixels, x, 44, 11) })

  const legs = mask()
  fillMaskRect(legs, 26, 47, 30, 59)
  fillMaskRect(legs, 34, 47, 38, 59)
  fillSpans(legs, {
    59: [[26, 30], [34, 38]],
    60: [[25, 30], [34, 39]],
    61: [[25, 31], [33, 39]]
  })
  paintMask(layers.body_core.pixels, legs, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 38, shadowFromY: 60
  })
  for (let y = 50; y <= 58; y += 4) {
    set(layers.body_core.pixels, 27, y, 6)
    set(layers.body_core.pixels, 35, y, 6)
  }
  paintMask(layers.body_core.pixels, underwear, {
    outline: 1, fill: 9, shadow: 10, shadowFromX: 35, shadowFromY: 45
  })
  fillRect(layers.body_core.pixels, 29, 32, 34, 32, 11)
  ;[27, 29, 31, 33, 35].forEach(function (x) { set(layers.body_core.pixels, x, 44, 11) })

  const arms = mask()
  line(arms, 25, 30, 22, 37, 1)
  line(arms, 22, 37, 21, 43, 1)
  line(arms, 38, 30, 41, 37, 1)
  line(arms, 41, 37, 42, 43, 1)
  fillMaskRect(arms, 20, 44, 23, 47)
  fillMaskRect(arms, 41, 44, 44, 47)
  const paintedArms = matrix()
  paintMask(paintedArms, arms, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 42, shadowFromY: 44
  })
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!paintedArms[y][x]) continue
      if (y <= 37) layers.arms_back.pixels[y][x] = paintedArms[y][x]
      else if (y <= 43) layers.arms_front.pixels[y][x] = paintedArms[y][x]
      else layers.hands_front.pixels[y][x] = paintedArms[y][x]
    }
  }
  ;[[21, 39], [21, 42], [42, 39], [42, 42]].forEach(function (point) {
    const target = point[1] <= 43 ? layers.arms_front.pixels : layers.hands_front.pixels
    if (target[point[1]][point[0]]) set(target, point[0], point[1], 6)
  })

  const face = layers.face.pixels
  fillRect(face, 27, 16, 29, 16, 1)
  fillRect(face, 34, 16, 36, 16, 1)
  fillRect(face, 27, 18, 29, 18, 1)
  fillRect(face, 34, 18, 36, 18, 1)
  fillRect(face, 27, 19, 29, 21, 7)
  fillRect(face, 34, 19, 36, 21, 7)
  fillRect(face, 28, 19, 29, 20, 5)
  fillRect(face, 34, 19, 35, 20, 5)
  set(face, 28, 19, 8); set(face, 35, 19, 8)
  set(face, 29, 21, 5); set(face, 34, 21, 5)
  set(face, 25, 22, 4); set(face, 26, 22, 4); set(face, 27, 22, 4)
  set(face, 36, 22, 4); set(face, 37, 22, 4); set(face, 38, 22, 4)
  set(face, 32, 22, 3)
  set(face, 31, 24, 1); set(face, 32, 24, 4); set(face, 33, 24, 1)

  return {
    version: '3.0', id: 'body_chibi_64_v2', name: '例图比例 64×64 正面角色母版',
    canvas: canvasSpec(),
    design: {
      type: 'body-master', pose: 'front-natural-arms', bald: true,
      visibleBounds: [20, 4, 25, 58], centerX: 32,
      anchors: anchors()
    },
    palette: [
      palette(0, 'T', 'transparent', '#00000000', false),
      palette(1, 'O', 'body_outline', '#69473D', false),
      palette(2, 'K', 'skin_main', '#F2C6A8', true),
      linkedPalette(3, 'S', 'skin_shadow', '#D99F86', 2, -0.16),
      palette(4, 'B', 'skin_blush', '#EAA29B', true),
      palette(5, 'E', 'eye', '#477B8C', true),
      linkedPalette(6, 'L', 'skin_highlight', '#FFE0C7', 2, 0.16),
      linkedPalette(7, 'D', 'eye_deep', '#294B58', 5, -0.34),
      palette(8, 'G', 'eye_glint', '#F4FAF2', false),
      palette(9, 'U', 'base_underwear', '#F4E8D5', false),
      palette(10, 'W', 'base_underwear_shadow', '#D7C2AE', false),
      palette(11, 'C', 'base_underwear_lace', '#FFF4E3', false)
    ],
    layers: layers,
    regions: {
      editableRegions: [
        recolorRegion('skin', 2, [20, 7, 25, 55], '身体、手臂与双腿肤色'),
        recolorRegion('blush', 4, [25, 22, 14, 1], '面部腮红'),
        recolorRegion('eyes', 5, [27, 19, 10, 3], '眼睛颜色')
      ],
      lockedPaletteIndices: [0, 1, 3, 6, 7, 8, 9, 10, 11]
    }
  }
}

function hairAsset() {
  const layers = {
    hair_back: { zIndex: 5, pixels: matrix() },
    hair_main: { zIndex: 60, pixels: matrix() },
    hair_front: { zIndex: 70, pixels: matrix() },
    hair_accessory: { zIndex: 75, pixels: matrix() }
  }
  const back = mask()
  fillSpans(back, {
    4: [[30, 33]], 5: [[27, 36]], 6: [[24, 39]], 7: [[22, 41]],
    8: [[21, 42]], 9: [[20, 43]], 10: [[20, 43]], 11: [[20, 43]],
    12: [[20, 44]], 13: [[20, 44]], 14: [[20, 44]], 15: [[20, 44]],
    16: [[20, 44]], 17: [[20, 44]], 18: [[20, 44]], 19: [[20, 44]],
    20: [[20, 25], [38, 44]], 21: [[20, 25], [38, 44]],
    22: [[20, 25], [38, 43]], 23: [[20, 24], [39, 43]],
    24: [[21, 24], [39, 42]], 25: [[20, 24], [39, 43]],
    26: [[21, 23], [40, 42]], 27: [[22, 23], [40, 41]]
  })
  paintMask(layers.hair_back.pixels, back, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 40, shadowFromY: 25
  })
  ;[[21, 13], [22, 14], [42, 13], [41, 14], [22, 19], [41, 19], [22, 23], [41, 23]].forEach(function (point) {
    if (layers.hair_back.pixels[point[1]][point[0]] === 2) set(layers.hair_back.pixels, point[0], point[1], 5)
  })

  const main = mask()
  fillSpans(main, {
    4: [[30, 33]], 5: [[27, 36]], 6: [[24, 39]], 7: [[22, 41]],
    8: [[21, 42]], 9: [[21, 42]], 10: [[21, 42]], 11: [[21, 42]],
    12: [[21, 25], [38, 42]], 13: [[21, 24], [39, 42]],
    14: [[21, 24], [39, 42]], 15: [[21, 24], [39, 42]],
    16: [[21, 24], [39, 42]], 17: [[21, 24], [39, 42]],
    18: [[21, 24], [39, 42]], 19: [[22, 24], [39, 41]],
    20: [[22, 24], [39, 41]], 21: [[22, 24], [39, 41]],
    22: [[23, 24], [39, 40]], 23: [[23, 24], [39, 40]],
    24: [[22, 24], [39, 41]], 25: [[23, 24], [39, 40]]
  })
  paintMask(layers.hair_main.pixels, main, {
    outline: 1, fill: 2, shadow: 3, shadowFromX: 40
  })
  ;[[27, 6], [28, 6], [29, 6], [25, 7], [26, 7], [27, 8], [24, 9],
    [23, 12], [23, 15], [23, 18], [40, 10], [40, 14], [40, 18]].forEach(function (point) {
    if (layers.hair_main.pixels[point[1]][point[0]] !== 1) set(layers.hair_main.pixels, point[0], point[1], 4)
  })
  ;[[25, 10], [24, 13], [24, 16], [24, 20], [39, 8], [40, 12], [40, 16], [39, 20],
    [23, 23], [40, 23]].forEach(function (point) {
    if (layers.hair_main.pixels[point[1]][point[0]] !== 1) set(layers.hair_main.pixels, point[0], point[1], 5)
  })

  const front = layers.hair_front.pixels
  const fringe = mask()
  fillSpans(fringe, {
    8: [[25, 38]], 9: [[23, 40]], 10: [[23, 40]], 11: [[23, 40]],
    12: [[24, 39]], 13: [[24, 29], [31, 35], [37, 39]],
    14: [[25, 29], [31, 35], [37, 38]],
    15: [[26, 28], [32, 34], [37, 38]],
    16: [[27, 27], [33, 33], [38, 38]]
  })
  paintMask(front, fringe, { outline: 1, fill: 2, shadow: 5, shadowFromX: 36 })
  ;[[26, 9], [27, 9], [28, 9], [25, 10], [29, 10], [30, 11], [32, 11]].forEach(function (point) {
    if (front[point[1]][point[0]] !== 1) set(front, point[0], point[1], 4)
  })
  ;[[25, 12], [29, 12], [31, 12], [35, 12], [37, 12], [27, 14], [33, 14], [38, 14]].forEach(function (point) {
    set(front, point[0], point[1], 3)
  })

  const accessory = layers.hair_accessory.pixels
  ;[[41, 8], [40, 9], [42, 9], [41, 10]].forEach(function (point) {
    set(accessory, point[0], point[1], 1)
  })
  set(accessory, 41, 9, 8)
  set(accessory, 40, 8, 7); set(accessory, 42, 8, 7)
  set(accessory, 40, 10, 7); set(accessory, 42, 10, 7)
  set(accessory, 43, 11, 1); set(accessory, 43, 12, 7)

  return {
    version: '2.1', id: 'hair_soft_bob_64_v2', name: '花结软圆短发 64×64',
    canvas: canvasSpec(),
    design: { type: 'hair', style: 'soft-bob', compatibleBody: 'body_chibi_64_v2' },
    palette: [
      palette(0, 'T', 'transparent', '#00000000', false),
      palette(1, 'O', 'hair_outline', '#513C38', false),
      palette(2, 'H', 'hair_primary', '#795644', true),
      linkedPalette(3, 'D', 'hair_deep_shadow', '#493025', 2, -0.34),
      palette(4, 'L', 'hair_highlight', '#AB8065', true),
      linkedPalette(5, 'S', 'hair_soft_shadow', '#624233', 2, -0.17),
      linkedPalette(6, 'G', 'hair_glint', '#C49A7D', 4, 0.14),
      palette(7, 'P', 'hair_accessory', '#D39AA3', true),
      palette(8, 'C', 'hair_accessory_light', '#F2E3CE', false)
    ],
    layers: layers,
    regions: {
      editableRegions: [
        recolorRegion('hair_primary', 2, [20, 4, 24, 22], '头发主色'),
        recolorRegion('hair_highlight', 4, [23, 6, 19, 19], '头发高光'),
        recolorRegion('hair_accessory', 7, [40, 8, 4, 5], '侧边小花与飘带')
      ],
      lockedPaletteIndices: [0, 1, 3, 5, 6, 8]
    }
  }
}

function dressAsset() {
  const layers = {
    back: { zIndex: 10, pixels: matrix() },
    main: { zIndex: 30, pixels: matrix() },
    front: { zIndex: 50, pixels: matrix() }
  }
  const main = layers.main.pixels

  const back = layers.back.pixels
  fillRect(back, 24, 41, 27, 43, 9)
  fillRect(back, 36, 41, 39, 43, 9)
  set(back, 23, 42, 1); set(back, 40, 42, 1)
  fillRect(back, 25, 44, 27, 48, 5)
  fillRect(back, 36, 44, 38, 49, 5)
  set(back, 25, 49, 9); set(back, 38, 50, 9)

  const bodice = mask()
  fillSpans(bodice, {
    28: [[29, 34]], 29: [[27, 36]], 30: [[25, 38]],
    31: [[26, 37]], 32: [[26, 37]], 33: [[26, 37]], 34: [[26, 37]],
    35: [[26, 37]], 36: [[26, 37]], 37: [[26, 37]], 38: [[26, 37]],
    39: [[26, 37]], 40: [[26, 37]], 41: [[27, 36]], 42: [[27, 36]],
    43: [[28, 35]]
  })
  fillMaskRect(bodice, 30, 28, 33, 30)
  for (let y = 28; y <= 30; y += 1) {
    for (let x = 30; x <= 33; x += 1) bodice[y][x] = false
  }
  paintMask(main, bodice, { outline: 1, fill: 4, shadow: 7, shadowFromX: 36 })

  const leftSleeve = mask()
  fillSpans(leftSleeve, {
    29: [[22, 27]], 30: [[20, 28]], 31: [[18, 28]], 32: [[18, 28]],
    33: [[18, 27]], 34: [[18, 27]], 35: [[19, 26]], 36: [[19, 25]],
    37: [[19, 25]], 38: [[18, 24]], 39: [[18, 24]], 40: [[18, 24]],
    41: [[19, 23]], 42: [[19, 23]], 43: [[19, 23]]
  })
  const rightSleeve = mask()
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) if (leftSleeve[y][x]) rightSleeve[y][63 - x] = true
  }
  paintMask(main, leftSleeve, { outline: 1, fill: 4, shadow: 7, shadowFromX: 26 })
  paintMask(main, rightSleeve, { outline: 1, fill: 4, shadow: 7, shadowFromX: 42 })
  ;[[23, 31], [21, 33], [22, 36], [21, 39], [20, 41],
    [40, 31], [42, 33], [41, 36], [42, 39], [43, 41]].forEach(function (point) {
    if (main[point[1]][point[0]] !== 1) set(main, point[0], point[1], 8)
  })
  fillRect(main, 19, 42, 23, 43, 2)
  fillRect(main, 40, 42, 44, 43, 2)
  set(main, 19, 42, 1); set(main, 23, 42, 1); set(main, 19, 43, 1); set(main, 23, 43, 1)
  set(main, 40, 42, 1); set(main, 44, 42, 1); set(main, 40, 43, 1); set(main, 44, 43, 1)
  set(main, 21, 42, 6); set(main, 42, 42, 6)

  const skirt = mask()
  fillSpans(skirt, {
    43: [[27, 36]], 44: [[26, 37]], 45: [[24, 39]], 46: [[22, 41]],
    47: [[20, 43]], 48: [[19, 44]], 49: [[18, 45]], 50: [[17, 46]],
    51: [[17, 46]], 52: [[16, 47]], 53: [[16, 47]], 54: [[16, 47]],
    55: [[17, 46]],
    56: [[18, 21], [23, 26], [28, 31], [33, 36], [38, 41], [43, 45]]
  })
  paintMask(main, skirt, { outline: 1, fill: 2 })
  for (let y = 45; y <= 53; y += 1) {
    const widening = Math.floor((y - 45) / 3)
    ;[27 - widening, 32, 36 + widening, 42 + Math.floor(widening / 2)].forEach(function (x, index) {
      if (main[y][x] === 2) main[y][x] = index === 1 ? 6 : 3
      if (main[y][x + 1] === 2 && index !== 1) main[y][x + 1] = 3
    })
    if (main[y][23] === 2 && y % 2 === 0) main[y][23] = 6
  }
  for (let y = 53; y <= 55; y += 1) {
    for (let x = 16; x <= 47; x += 1) {
      if (main[y][x] === 2 || main[y][x] === 3 || main[y][x] === 6) main[y][x] = y === 53 ? 7 : 4
    }
  }

  for (let x = 18; x <= 45; x += 4) {
    if (main[55][x] !== 1) main[55][x] = 8
    if (main[55][x + 1] !== 1) main[55][x + 1] = 8
  }

  fillRect(main, 27, 42, 36, 44, 1)
  fillRect(main, 28, 43, 35, 43, 5)
  fillRect(main, 28, 44, 35, 44, 9)

  const front = layers.front.pixels
  for (let y = 38; y <= 43; y += 1) {
    for (let x = 18; x <= 45; x += 1) {
      if ((x <= 24 || x >= 39) && main[y][x]) front[y][x] = main[y][x]
    }
  }
  fillRect(front, 27, 29, 29, 30, 2)
  fillRect(front, 34, 29, 36, 30, 2)
  fillRect(front, 27, 31, 30, 32, 2)
  fillRect(front, 33, 31, 36, 32, 2)
  set(front, 27, 30, 1); set(front, 36, 30, 1)
  fillRect(front, 30, 29, 33, 29, 8)
  set(front, 30, 30, 8); set(front, 33, 30, 8)
  fillRect(front, 31, 30, 32, 31, 5)

  fillRect(front, 27, 33, 29, 41, 2)
  fillRect(front, 34, 33, 36, 41, 2)
  fillRect(front, 29, 35, 34, 41, 6)
  fillRect(front, 30, 35, 33, 41, 2)
  set(front, 29, 34, 1); set(front, 34, 34, 1)
  set(front, 31, 36, 10); set(front, 32, 39, 10)

  fillRect(front, 28, 41, 30, 43, 5)
  fillRect(front, 34, 41, 36, 43, 5)
  fillRect(front, 31, 42, 33, 44, 5)
  set(front, 27, 41, 1); set(front, 30, 40, 1); set(front, 34, 40, 1); set(front, 37, 41, 1)
  set(front, 31, 43, 8); set(front, 33, 43, 9)
  fillRect(front, 30, 45, 31, 48, 5)
  fillRect(front, 33, 45, 34, 49, 5)
  set(front, 30, 49, 9); set(front, 34, 50, 9)

  ;[[24, 47], [29, 48], [36, 48], [41, 47]].forEach(function (point, index) {
    const x = point[0]
    for (let y = point[1]; y <= 53; y += 2) {
      if (main[y][x] && main[y][x] !== 1) set(front, x, y, index % 2 ? 6 : 3)
    }
  })

  ;[[23, 51], [32, 52], [41, 51]].forEach(function (point) {
    const x = point[0]
    const y = point[1]
    set(front, x, y - 1, 8); set(front, x - 1, y, 8); set(front, x, y, 10)
    set(front, x + 1, y, 8); set(front, x, y + 1, 5)
  })
  for (let x = 18; x <= 45; x += 3) {
    if (main[55][x]) set(front, x, 55, x % 2 ? 5 : 10)
    if (main[56][x] && main[56][x] !== 1) set(front, x, 56, 8)
  }

  return {
    version: '3.0', id: 'dress_berry_cream_001', name: '莓果奶油田园刺绣连衣裙',
    canvas: canvasSpec(),
    design: {
      type: 'dress', template: 'berry-cottage', silhouette: 'a-line-knee-length',
      collar: 'scalloped-double-petal-round-collar', sleeve: 'long-bishop-sleeve-natural-arm',
      waist: 'sage-ribbon-at-y43', hem: 'embroidered-cream-lace-at-y53-56',
      compatibleBody: 'body_chibi_64_v2', anchors: anchors()
    },
    palette: [
      palette(0, 'T', 'transparent', '#00000000', false),
      palette(1, 'O', 'outline', '#60443B', false),
      palette(2, 'M', 'primary', '#D39AA3', true),
      linkedPalette(3, 'S', 'primary_shadow', '#A57078', 2, -0.22),
      palette(4, 'L', 'secondary', '#F6E8D4', true),
      palette(5, 'A', 'accent', '#91A095', true),
      linkedPalette(6, 'H', 'primary_highlight', '#DCAEB5', 2, 0.18),
      linkedPalette(7, 'D', 'secondary_shadow', '#D9C7AF', 4, -0.11),
      linkedPalette(8, 'C', 'lace_highlight', '#FFF3DF', 4, 0.1),
      linkedPalette(9, 'G', 'accent_shadow', '#657A70', 5, -0.2),
      palette(10, 'N', 'embroidery', '#B8796F', true)
    ],
    layers: layers,
    regions: {
      editableRegions: [
        recolorRegion('primary_fabric', 2, [16, 29, 32, 28], '裙身、袖口与领口主色'),
        recolorRegion('secondary_fabric', 4, [16, 28, 32, 29], '上衣、袖子与下摆花边'),
        recolorRegion('accent_ribbon', 5, [23, 29, 18, 22], '腰带、蝴蝶结、花朵与下摆点缀'),
        recolorRegion('embroidery', 10, [18, 33, 28, 24], '纽扣、花心与蕾丝绣线'),
        {
          id: 'skirt_pattern', type: 'pixel_edit', bounds: [18, 47, 28, 9],
          allowedPaletteIndices: [0, 4, 5, 8, 10], description: '裙摆局部图案编辑区'
        }
      ],
      lockedPaletteIndices: [0, 1, 3, 6, 7, 8, 9]
    }
  }
}

function clothingPalette(primary, secondary, accent, embroidery) {
  return [
    palette(0, 'T', 'transparent', '#00000000', false),
    palette(1, 'O', 'outline', '#60443B', false),
    palette(2, 'M', 'primary', primary, true),
    linkedPalette(3, 'S', 'primary_shadow', toneHex(primary, -0.22), 2, -0.22),
    palette(4, 'L', 'secondary', secondary, true),
    palette(5, 'A', 'accent', accent, true),
    linkedPalette(6, 'H', 'primary_highlight', toneHex(primary, 0.18), 2, 0.18),
    linkedPalette(7, 'D', 'secondary_shadow', toneHex(secondary, -0.11), 4, -0.11),
    linkedPalette(8, 'C', 'lace_highlight', toneHex(secondary, 0.1), 4, 0.1),
    linkedPalette(9, 'G', 'accent_shadow', toneHex(accent, -0.2), 5, -0.2),
    palette(10, 'N', 'embroidery', embroidery, true)
  ]
}

function clothingRegions(patternDescription) {
  return {
    editableRegions: [
      recolorRegion('primary_fabric', 2, [16, 28, 32, 29], '服装主布料'),
      recolorRegion('secondary_fabric', 4, [16, 28, 32, 29], '衬衫、围裙或蕾丝辅布料'),
      recolorRegion('accent_ribbon', 5, [18, 29, 28, 27], '领结、腰带与强调色装饰'),
      recolorRegion('embroidery', 10, [18, 31, 28, 26], '纽扣、格纹与刺绣，可隐藏'),
      {
        id: 'skirt_pattern', type: 'pixel_edit', bounds: [18, 44, 28, 13],
        allowedPaletteIndices: [0, 2, 4, 5, 8, 10],
        description: patternDescription
      }
    ],
    lockedPaletteIndices: [0, 1, 3, 6, 7, 8, 9]
  }
}

function clothingShell(id, name, design, colorValues) {
  return {
    version: '3.0', id: id, name: name, canvas: canvasSpec(),
    design: Object.assign({
      type: 'dress', compatibleBody: 'body_chibi_64_v2', anchors: anchors()
    }, design),
    palette: clothingPalette(colorValues[0], colorValues[1], colorValues[2], colorValues[3]),
    layers: {
      back: { zIndex: 10, pixels: matrix() },
      main: { zIndex: 30, pixels: matrix() },
      front: { zIndex: 50, pixels: matrix() }
    },
    regions: clothingRegions(design.patternDescription || '裙摆局部图案编辑区')
  }
}

function mirrored(source) {
  const result = mask()
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) if (source[y][x]) result[y][63 - x] = true
  }
  return result
}

function drawNaturalSleeves(main, style) {
  const left = mask()
  if (style === 'short-puff') {
    fillSpans(left, {
      30: [[22, 27]], 31: [[20, 28]], 32: [[19, 28]],
      33: [[19, 27]], 34: [[20, 26]], 35: [[20, 25]], 36: [[21, 24]]
    })
  } else {
    fillSpans(left, {
      30: [[22, 27]], 31: [[20, 28]], 32: [[19, 28]], 33: [[19, 27]],
      34: [[19, 26]], 35: [[20, 26]], 36: [[19, 25]], 37: [[19, 25]],
      38: [[18, 24]], 39: [[18, 24]], 40: [[19, 23]], 41: [[19, 23]],
      42: [[19, 23]], 43: [[20, 23]]
    })
  }
  paintMask(main, left, { outline: 1, fill: 4, shadow: 7, shadowFromX: 25 })
  paintMask(main, mirrored(left), { outline: 1, fill: 4, shadow: 7, shadowFromX: 42 })
  ;[[22, 32], [21, 35], [21, 39], [42, 32], [42, 35], [42, 39]].forEach(function (point) {
    if (main[point[1]][point[0]] && main[point[1]][point[0]] !== 1) {
      set(main, point[0], point[1], 8)
    }
  })
}

function drawBodice(main, fillIndex) {
  const bodice = mask()
  fillSpans(bodice, {
    28: [[29, 34]], 29: [[27, 36]], 30: [[25, 38]], 31: [[26, 37]],
    32: [[26, 37]], 33: [[26, 37]], 34: [[26, 37]], 35: [[26, 37]],
    36: [[26, 37]], 37: [[26, 37]], 38: [[26, 37]], 39: [[26, 37]],
    40: [[26, 37]], 41: [[27, 36]], 42: [[27, 36]], 43: [[28, 35]]
  })
  for (let y = 28; y <= 30; y += 1) {
    for (let x = 30; x <= 33; x += 1) bodice[y][x] = false
  }
  paintMask(main, bodice, {
    outline: 1, fill: fillIndex,
    shadow: fillIndex === 2 ? 3 : 7, shadowFromX: 36
  })
}

function drawSkirt(main, options) {
  const config = options || {}
  const startY = config.startY || 43
  const endY = config.endY || 56
  const skirt = mask()
  for (let y = startY; y <= endY; y += 1) {
    const progress = y - startY
    const left = Math.max(16, 27 - Math.floor(progress * 0.9))
    const right = Math.min(47, 36 + Math.floor(progress * 0.9))
    if (config.scalloped && y === endY) {
      for (let x = left; x <= right; x += 5) fillMaskRect(skirt, x, y, Math.min(x + 3, right), y)
    } else {
      fillMaskRect(skirt, left, y, right, y)
    }
  }
  paintMask(main, skirt, { outline: 1, fill: 2, shadow: 3, shadowFromX: 40 })
  for (let y = startY + 2; y < endY; y += 1) {
    ;[24, 31, 38].forEach(function (x, index) {
      if (main[y][x] === 2) main[y][x] = index === 1 ? 6 : 3
    })
  }
  return skirt
}

function sageApronDressAsset() {
  const asset = clothingShell(
    'dress_sage_apron_002', '鼠尾草奶油围裙裙',
    {
      template: 'sage-apron', silhouette: 'apron-a-line-knee-length',
      collar: 'cream-petal-collar', sleeve: 'long-bishop-sleeve-natural-arm',
      waist: 'rose-ribbon-at-y43', hem: 'sage-scallop-at-y56',
      patternDescription: '围裙口袋与裙摆花束编辑区'
    },
    ['#879789', '#F3E6D3', '#C78E96', '#B87568']
  )
  const main = asset.layers.main.pixels
  drawNaturalSleeves(main, 'long')
  drawBodice(main, 2)
  drawSkirt(main, { startY: 43, endY: 56, scalloped: true })
  fillRect(main, 19, 42, 23, 43, 5); fillRect(main, 40, 42, 44, 43, 5)
  const back = asset.layers.back.pixels
  fillRect(back, 25, 43, 27, 49, 5); fillRect(back, 36, 43, 38, 50, 5)
  set(back, 25, 50, 9); set(back, 38, 51, 9)

  const front = asset.layers.front.pixels
  fillRect(front, 27, 29, 30, 31, 4); fillRect(front, 33, 29, 36, 31, 4)
  set(front, 27, 31, 1); set(front, 36, 31, 1)
  fillRect(front, 28, 32, 29, 43, 4); fillRect(front, 34, 32, 35, 43, 4)
  fillRect(front, 27, 42, 36, 44, 1); fillRect(front, 28, 43, 35, 43, 5)
  const apron = mask()
  fillSpans(apron, {
    44: [[28, 35]], 45: [[27, 36]], 46: [[26, 37]], 47: [[25, 38]],
    48: [[24, 39]], 49: [[23, 40]], 50: [[23, 40]], 51: [[22, 41]],
    52: [[22, 41]], 53: [[21, 42]], 54: [[21, 42]]
  })
  paintMask(front, apron, { outline: 1, fill: 4, shadow: 7, shadowFromX: 38 })
  fillRect(front, 28, 47, 35, 52, 8)
  set(front, 28, 47, 1); set(front, 35, 47, 1); set(front, 28, 52, 1); set(front, 35, 52, 1)
  ;[[24, 53], [32, 53], [40, 53]].forEach(function (point) {
    set(front, point[0], point[1] - 1, 8); set(front, point[0] - 1, point[1], 8)
    set(front, point[0], point[1], 10); set(front, point[0] + 1, point[1], 8)
  })
  fillRect(front, 30, 42, 33, 44, 5); set(front, 31, 43, 8); set(front, 32, 43, 8)
  return asset
}

function navySailorDressAsset() {
  const asset = clothingShell(
    'dress_navy_sailor_003', '雾蓝海军领百褶裙',
    {
      template: 'navy-sailor', silhouette: 'short-pleated-dress',
      collar: 'wide-sailor-v-collar', sleeve: 'short-puff-sleeve',
      waist: 'high-waist-at-y42', hem: 'double-stripe-at-y54-55',
      patternDescription: '百褶与双条纹下摆编辑区'
    },
    ['#687C91', '#F4E4D1', '#B87882', '#D4AA79']
  )
  const main = asset.layers.main.pixels
  drawNaturalSleeves(main, 'short-puff')
  drawBodice(main, 4)
  drawSkirt(main, { startY: 42, endY: 55, scalloped: false })
  fillRect(main, 20, 35, 24, 36, 2); fillRect(main, 39, 35, 43, 36, 2)
  const front = asset.layers.front.pixels
  fillRect(front, 26, 29, 29, 33, 2); fillRect(front, 34, 29, 37, 33, 2)
  fillRect(front, 28, 30, 30, 34, 2); fillRect(front, 33, 30, 35, 34, 2)
  set(front, 30, 33, 8); set(front, 33, 33, 8); set(front, 31, 34, 1); set(front, 32, 34, 1)
  fillRect(front, 29, 35, 31, 37, 5); fillRect(front, 32, 35, 34, 37, 5)
  set(front, 31, 36, 8); set(front, 32, 36, 8)
  fillRect(front, 31, 37, 32, 41, 9)
  fillRect(front, 27, 41, 36, 43, 1); fillRect(front, 28, 42, 35, 42, 5)
  for (let y = 45; y <= 52; y += 1) {
    ;[23, 28, 33, 38, 43].forEach(function (x, index) {
      if (main[y][x] && main[y][x] !== 1) set(front, x, y, index % 2 ? 6 : 3)
    })
  }
  for (let x = 19; x <= 44; x += 1) {
    if (main[53][x] && main[53][x] !== 1) set(front, x, 53, 4)
    if (main[54][x] && main[54][x] !== 1) set(front, x, 54, 10)
  }
  return asset
}

function cocoaAcademyDressAsset() {
  const asset = clothingShell(
    'outfit_cocoa_academy_004', '可可学院背心裙',
    {
      template: 'cocoa-academy', silhouette: 'vest-and-pleated-skirt',
      collar: 'cream-point-collar', sleeve: 'long-bishop-sleeve-natural-arm',
      waist: 'fitted-vest-at-y43', hem: 'short-plaid-pleats-at-y54',
      patternDescription: '学院格纹与口袋像素编辑区'
    },
    ['#806052', '#F1E3CF', '#849184', '#C99572']
  )
  const main = asset.layers.main.pixels
  drawNaturalSleeves(main, 'long')
  drawBodice(main, 4)
  drawSkirt(main, { startY: 43, endY: 54, scalloped: false })
  fillRect(main, 19, 42, 23, 43, 2); fillRect(main, 40, 42, 44, 43, 2)
  const front = asset.layers.front.pixels
  const vest = mask()
  fillSpans(vest, {
    31: [[27, 29], [34, 36]], 32: [[27, 30], [33, 36]],
    33: [[27, 30], [33, 36]], 34: [[27, 36]], 35: [[27, 36]],
    36: [[27, 36]], 37: [[27, 36]], 38: [[27, 36]], 39: [[27, 36]],
    40: [[27, 36]], 41: [[27, 36]], 42: [[28, 35]], 43: [[28, 35]]
  })
  paintMask(front, vest, { outline: 1, fill: 2, shadow: 3, shadowFromX: 35 })
  fillRect(front, 28, 29, 30, 32, 4); fillRect(front, 33, 29, 35, 32, 4)
  set(front, 30, 32, 1); set(front, 33, 32, 1)
  fillRect(front, 31, 32, 32, 38, 5); set(front, 31, 33, 9); set(front, 32, 33, 9)
  ;[35, 38, 41].forEach(function (y) { set(front, 32, y, 10) })
  fillRect(front, 27, 42, 36, 44, 1); fillRect(front, 28, 43, 35, 43, 5)
  for (let y = 45; y <= 53; y += 1) {
    for (let x = 20; x <= 43; x += 4) {
      if (main[y][x] && main[y][x] !== 1) set(front, x, y, y % 3 ? 3 : 10)
    }
    if (y === 48 || y === 52) {
      for (let x = 20; x <= 43; x += 1) if (main[y][x] && main[y][x] !== 1) set(front, x, y, 10)
    }
  }
  fillRect(front, 24, 38, 27, 40, 5); fillRect(front, 36, 38, 39, 40, 5)
  return asset
}

function roseTieredDressAsset() {
  const asset = clothingShell(
    'dress_rose_tiered_005', '玫瑰奶霜分层蕾丝裙',
    {
      template: 'rose-tiered-lace', silhouette: 'tiered-bell-dress',
      collar: 'lace-square-collar', sleeve: 'short-puff-sleeve',
      waist: 'double-bow-at-y42', hem: 'three-tier-lace-at-y48-56',
      patternDescription: '分层蕾丝、玫瑰花与蝴蝶结编辑区'
    },
    ['#C88D99', '#F6E7D5', '#9A6E72', '#B8756C']
  )
  const main = asset.layers.main.pixels
  drawNaturalSleeves(main, 'short-puff')
  drawBodice(main, 2)
  drawSkirt(main, { startY: 42, endY: 56, scalloped: true })
  fillRect(main, 20, 35, 24, 36, 4); fillRect(main, 39, 35, 43, 36, 4)
  const front = asset.layers.front.pixels
  fillRect(front, 27, 29, 36, 31, 4); fillRect(front, 29, 31, 34, 33, 8)
  set(front, 27, 31, 1); set(front, 36, 31, 1); set(front, 29, 33, 1); set(front, 34, 33, 1)
  fillRect(front, 31, 33, 32, 40, 6)
  ;[35, 38].forEach(function (y) { set(front, 31, y, 10); set(front, 32, y, 10) })
  fillRect(front, 27, 41, 36, 43, 1); fillRect(front, 28, 42, 35, 42, 5)
  fillRect(front, 27, 42, 30, 44, 5); fillRect(front, 33, 42, 36, 44, 5)
  set(front, 31, 42, 8); set(front, 32, 42, 8)
  ;[48, 53].forEach(function (y) {
    for (let x = 18; x <= 45; x += 1) {
      if (main[y][x] && main[y][x] !== 1) set(front, x, y, x % 3 ? 4 : 8)
    }
  })
  ;[[23, 50], [32, 51], [41, 50]].forEach(function (point) {
    const x = point[0]; const y = point[1]
    set(front, x, y - 1, 8); set(front, x - 1, y, 4); set(front, x, y, 10)
    set(front, x + 1, y, 4); set(front, x, y + 1, 5)
  })
  for (let x = 19; x <= 44; x += 3) if (main[55][x]) set(front, x, 55, x % 2 ? 8 : 10)
  return asset
}

function canvasSpec() {
  return {
    width: 64, height: 64, origin: 'top-left', centerX: 32,
    groundY: 61, cellOrder: 'row-major', indexFormula: 'index = y * 64 + x'
  }
}

function anchors() {
  return {
    headTop: [32, 4], faceCenter: [32, 19], leftEar: [22, 17], rightEar: [42, 17],
    neckCenter: [32, 28], leftShoulder: [25, 30], rightShoulder: [38, 30],
    chestCenter: [32, 35], waistCenter: [32, 43], hipCenter: [32, 47],
    leftElbow: [22, 37], rightElbow: [41, 37], leftWrist: [21, 43], rightWrist: [42, 43],
    leftKnee: [28, 54], rightKnee: [36, 54], leftAnkle: [28, 59], rightAnkle: [36, 59],
    leftFoot: [28, 61], rightFoot: [36, 61]
  }
}

function palette(index, symbol, role, color, editable) {
  return { index: index, symbol: symbol, role: role, color: color, editable: editable }
}

function linkedPalette(index, symbol, role, color, linkedTo, linkedTone) {
  return {
    index: index, symbol: symbol, role: role, color: color,
    editable: false, linkedTo: linkedTo, linkedTone: linkedTone === undefined ? -0.24 : linkedTone
  }
}

function recolorRegion(id, paletteIndex, bounds, description) {
  return { id: id, type: 'palette_recolor', paletteIndex: paletteIndex, bounds: bounds, description: description }
}

function assetComposite(asset) {
  const result = matrix()
  Object.keys(asset.layers).map(function (name) { return asset.layers[name] })
    .sort(function (left, right) { return left.zIndex - right.zIndex })
    .forEach(function (layer) {
      for (let y = 0; y < SIZE; y += 1) {
        for (let x = 0; x < SIZE; x += 1) if (layer.pixels[y][x]) result[y][x] = layer.pixels[y][x]
      }
    })
  return result
}

function toneHex(value, tone) {
  const source = rgba(value)
  const amount = Math.max(-1, Math.min(1, Number(tone === undefined ? -0.24 : tone)))
  const target = amount >= 0 ? 255 : 0
  const weight = Math.abs(amount)
  function channel(number) {
    return Math.max(0, Math.min(255, Math.round(number + (target - number) * weight)))
      .toString(16).padStart(2, '0')
  }
  return '#' + channel(source[0]) + channel(source[1]) + channel(source[2])
}

function colors(asset, overrides) {
  const requested = overrides || {}
  const hex = {}
  const changed = {}
  asset.palette.forEach(function (item) {
    const replacement = requested[item.index] || requested[String(item.index)]
    if (item.editable && replacement) {
      hex[item.index] = replacement
      changed[item.index] = true
    } else {
      hex[item.index] = item.color
    }
  })
  asset.palette.forEach(function (item) {
    if (item.linkedTo !== undefined && changed[item.linkedTo]) {
      hex[item.index] = toneHex(hex[item.linkedTo], item.linkedTone)
    }
  })
  const result = {}
  Object.keys(hex).forEach(function (index) { result[index] = rgba(hex[index]) })
  return result
}

function rgba(value) {
  let raw = value.slice(1)
  if (raw.length === 6) raw += 'FF'
  return [0, 2, 4, 6].map(function (offset) { return parseInt(raw.slice(offset, offset + 2), 16) })
}

function renderAssetLayers(assets) {
  const result = Buffer.alloc(SIZE * SIZE * 4)
  const entries = []
  assets.forEach(function (item) {
    const asset = item.asset || item
    const assetColors = colors(asset, item.overrides)
    Object.keys(asset.layers).forEach(function (name) {
      entries.push({ zIndex: asset.layers[name].zIndex, pixels: asset.layers[name].pixels, colors: assetColors })
    })
  })
  entries.sort(function (left, right) { return left.zIndex - right.zIndex }).forEach(function (entry) {
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        const index = entry.pixels[y][x]
        const source = entry.colors[index]
        if (!source || !source[3]) continue
        const offset = (y * SIZE + x) * 4
        result[offset] = source[0]
        result[offset + 1] = source[1]
        result[offset + 2] = source[2]
        result[offset + 3] = source[3]
      }
    }
  })
  return result
}

function crc32(buffer) {
  let crc = 0xFFFFFFFF
  for (let index = 0; index < buffer.length; index += 1) {
    crc ^= buffer[index]
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0)
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, payload) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4); length.writeUInt32BE(payload.length)
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([name, payload])))
  return Buffer.concat([length, name, payload, checksum])
}

function encodePng(width, height, rawRgba) {
  const stride = width * 4
  const rows = []
  for (let y = 0; y < height; y += 1) {
    rows.push(Buffer.from([0]), rawRgba.slice(y * stride, (y + 1) * stride))
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', header), pngChunk('IDAT', zlib.deflateSync(Buffer.concat(rows), { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0))
  ])
}

function scaleRgba(raw, scale) {
  const result = Buffer.alloc(SIZE * scale * SIZE * scale * 4)
  const width = SIZE * scale
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const source = (y * SIZE + x) * 4
      for (let yy = 0; yy < scale; yy += 1) {
        for (let xx = 0; xx < scale; xx += 1) {
          const target = ((y * scale + yy) * width + x * scale + xx) * 4
          raw.copy(result, target, source, source + 4)
        }
      }
    }
  }
  return result
}

function cropRgba(raw, x1, y1, width, height) {
  const result = Buffer.alloc(width * height * 4)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const source = ((y1 + y) * SIZE + x1 + x) * 4
      const target = (y * width + x) * 4
      raw.copy(result, target, source, source + 4)
    }
  }
  return result
}

function encodeRow(row, symbolByIndex) {
  const runs = []
  let start = 0
  while (start < row.length) {
    let end = start + 1
    while (end < row.length && row[end] === row[start]) end += 1
    runs.push(String(end - start) + symbolByIndex[row[start]])
    start = end
  }
  return runs.join(' ')
}

function dsl(asset) {
  const documentType = asset.design.type === 'dress' ? 'PIXEL_CLOTHING' : 'PIXEL_ASSET'
  const endType = asset.design.type === 'dress' ? 'END_CLOTHING' : 'END_ASSET'
  const lines = [
    documentType + ' 1.0', '', 'ID ' + asset.id, 'NAME ' + asset.name,
    'CANVAS 64 64', 'ORIGIN TOP_LEFT', 'ORDER ROW_MAJOR', '', 'PALETTE'
  ]
  asset.palette.forEach(function (item) {
    const flags = [item.editable ? 'editable' : 'locked']
    if (item.linkedTo !== undefined) {
      flags.push('linked:' + asset.palette[item.linkedTo].symbol)
      flags.push('tone:' + item.linkedTone)
    }
    lines.push([item.symbol, item.index, item.role, item.color].concat(flags).join(' '))
  })
  lines.push('END_PALETTE', '')
  const symbols = {}; asset.palette.forEach(function (item) { symbols[item.index] = item.symbol })
  Object.keys(asset.layers).sort(function (left, right) {
    return asset.layers[left].zIndex - asset.layers[right].zIndex
  }).forEach(function (name) {
    const layer = asset.layers[name]
    lines.push('LAYER ' + name + ' Z=' + layer.zIndex)
    layer.pixels.forEach(function (row, y) {
      lines.push('ROW ' + String(y).padStart(2, '0') + ': ' + encodeRow(row, symbols))
    })
    lines.push('END_LAYER', '')
  })
  lines.push(endType)
  return lines.join('\n') + '\n'
}

function writeAsset(group, asset) {
  const outputDir = path.join(OUTPUT_ROOT, group, asset.id)
  fs.mkdirSync(outputDir, { recursive: true })
  const paletteDocument = { version: asset.version, id: asset.id, palette: asset.palette }
  const regionsDocument = {
    version: asset.version, id: asset.id,
    coordinateSystem: 'top-left, x-right, y-down', boundsFormat: '[x, y, width, height]',
    editableRegions: asset.regions.editableRegions,
    lockedPaletteIndices: asset.regions.lockedPaletteIndices
  }
  const pixelsDocument = {
    version: asset.version, id: asset.id, name: asset.name, canvas: asset.canvas,
    design: asset.design, layers: asset.layers, compositePixels: assetComposite(asset)
  }
  fs.writeFileSync(path.join(outputDir, 'pixels.json'), JSON.stringify(pixelsDocument, null, 2) + '\n')
  fs.writeFileSync(path.join(outputDir, 'palette.json'), JSON.stringify(paletteDocument, null, 2) + '\n')
  fs.writeFileSync(path.join(outputDir, 'regions.json'), JSON.stringify(regionsDocument, null, 2) + '\n')
  fs.writeFileSync(path.join(outputDir, 'asset.pixel'), dsl(asset))
  fs.writeFileSync(path.join(outputDir, 'design.txt'), designText(asset))

  const fallbackLayers = {}
  const runtimeLayers = {}
  const paletteColors = colors(asset)
  Object.keys(asset.layers).forEach(function (name) {
    const fileName = 'layer-' + name + '.png'
    const layerRgba = Buffer.alloc(SIZE * SIZE * 4)
    let offset = 0
    asset.layers[name].pixels.forEach(function (row) {
      row.forEach(function (index) {
        const color = paletteColors[index]
        layerRgba[offset] = color[0]; layerRgba[offset + 1] = color[1]
        layerRgba[offset + 2] = color[2]; layerRgba[offset + 3] = color[3]
        offset += 4
      })
    })
    fs.writeFileSync(path.join(outputDir, fileName), encodePng(SIZE, SIZE, layerRgba))
    fallbackLayers[name] = '/assets/pixel/' + group + '/' + asset.id + '/' + fileName
    const symbols = {}; asset.palette.forEach(function (item) { symbols[item.index] = item.symbol })
    runtimeLayers[name] = {
      zIndex: asset.layers[name].zIndex,
      encodedRows: asset.layers[name].pixels.map(function (row) { return encodeRow(row, symbols) })
    }
  })
  const spriteRgba = renderAssetLayers([asset])
  fs.writeFileSync(path.join(outputDir, 'sprite.png'), encodePng(SIZE, SIZE, spriteRgba))
  fs.writeFileSync(path.join(outputDir, 'preview-4x.png'), encodePng(256, 256, scaleRgba(spriteRgba, 4)))
  const runtime = {
    version: asset.version, id: asset.id, name: asset.name, canvas: asset.canvas,
    design: asset.design, palette: asset.palette,
    editableRegions: asset.regions.editableRegions,
    lockedPaletteIndices: asset.regions.lockedPaletteIndices,
    layers: runtimeLayers, fallbackLayers: fallbackLayers,
    previewPath: '/assets/pixel/' + group + '/' + asset.id + '/sprite.png'
  }
  fs.writeFileSync(path.join(outputDir, 'runtime.js'), 'module.exports = ' + JSON.stringify(runtime, null, 2) + '\n')
  return outputDir
}

function designText(asset) {
  if (asset.id === 'body_chibi_64_v2') {
    return [
      '素材名称：例图比例 64×64 正面角色母版',
      '素材类型：光头基础身体',
      '整体比例：角色中心轴 x=32，含头发的头部约占总高度 40%，脚底线 y=61',
      '头部：外接发型范围 y=4..27，脸颊略宽、下巴收窄，不包含固定头发',
      '画风：低饱和肤色、暖棕描边、分级肤色高光与阴影、蓝灰眼睛',
      '脖子：中心 y=28；肩线：y=30；腰线：y=43；胯线：y=47',
      '手臂：自然下垂，拆分为 arms_back、arms_front、hands_front',
      '双腿：y=47..61，左右分离，中间保留透明缝隙，禁止再次拉长',
      '正式数据：pixels.json + palette.json',
      ''
    ].join('\n')
  }
  if (asset.id === 'hair_soft_bob_64_v2') {
    return [
      '素材名称：花结软圆短发 64×64',
      '素材类型：独立发型',
      '适配身体：body_chibi_64_v2',
      '图层：hair_back、hair_main、hair_front、hair_accessory',
      '画风：暖栗棕多段色阶、离散发丝高光、轻微波浪发尾、豆沙小花结',
      '限制：不允许修改 body_core；发色通过独立调色板换色',
      '正式数据：pixels.json + palette.json',
      ''
    ].join('\n')
  }
  return [
    '服装名称：' + asset.name,
    '服装模板：' + (asset.design.template || 'berry-cottage'),
    '服装类型：' + asset.design.silhouette,
    '适配身体：body_chibi_64_v2',
    '领口：' + asset.design.collar,
    '肩袖：' + asset.design.sleeve,
    '腰部：' + asset.design.waist,
    '下摆：' + asset.design.hem,
    '可编辑通道：主布料、辅布料、强调色、刺绣',
    '画风：严格使用例图比例、暖棕描边、低饱和奶油色阶与离散像素高光',
    '图层：back、main、front',
    '正式数据：pixels.json + palette.json',
    ''
  ].join('\n')
}

function writeWornPreview(body, hair, dress) {
  const outputDir = path.join(OUTPUT_ROOT, 'clothing', dress.id)
  const worn = renderAssetLayers([hair, dress, body])
  fs.writeFileSync(path.join(outputDir, 'worn_preview_64.png'), encodePng(SIZE, SIZE, worn))
  const dressOnly = renderAssetLayers([dress])
  const bald = renderAssetLayers([body])
  const panelWidth = 256
  const sheetWidth = panelWidth * 3
  const sheet = Buffer.alloc(sheetWidth * 256 * 4)
  for (let offset = 0; offset < sheet.length; offset += 4) {
    sheet[offset] = 249
    sheet[offset + 1] = 244
    sheet[offset + 2] = 234
    sheet[offset + 3] = 255
  }
  ;[dressOnly, worn, bald].forEach(function (raw, panel) {
    const scaled = scaleRgba(raw, 4)
    for (let y = 0; y < 256; y += 1) {
      for (let x = 0; x < 256; x += 1) {
        const source = (y * 256 + x) * 4
        if (!scaled[source + 3]) continue
        const target = (y * sheetWidth + panel * panelWidth + x) * 4
        scaled.copy(sheet, target, source, source + 4)
      }
    }
  })
  ;[255, 511].forEach(function (x) {
    for (let y = 8; y < 248; y += 8) {
      for (let yy = 0; yy < 3; yy += 1) {
        const offset = ((y + yy) * sheetWidth + x) * 4
        sheet[offset] = 202
        sheet[offset + 1] = 151
        sheet[offset + 2] = 132
        sheet[offset + 3] = 255
      }
    }
  })
  fs.writeFileSync(path.join(outputDir, 'preview_sheet.png'), encodePng(sheetWidth, 256, sheet))
  const runtimePath = path.join(outputDir, 'runtime.js')
  const runtime = require(runtimePath)
  runtime.wornPreviewPath = '/assets/pixel/clothing/' + dress.id + '/worn_preview_64.png'
  runtime.colorwayPreviews = {}
  ;[
    { id: 'berry-cream', overrides: { 2: '#D39AA3', 4: '#F6E8D4', 5: '#91A095', 10: '#B8796F' } },
    { id: 'blueberry', overrides: { 2: '#74899D', 4: '#F2E5CF', 5: '#A58691', 10: '#A66E72' } },
    { id: 'mint', overrides: { 2: '#879789', 4: '#F1E3CE', 5: '#B78369', 10: '#A66F64' } }
  ].forEach(function (variant) {
    const raw = renderAssetLayers([{ asset: dress, overrides: variant.overrides }])
    const catalogName = 'catalog-' + variant.id + '.png'
    fs.writeFileSync(path.join(outputDir, catalogName), encodePng(40, 40, cropRgba(raw, 12, 20, 40, 40)))
    runtime.colorwayPreviews[variant.id] = '/assets/pixel/clothing/' + dress.id + '/' + catalogName
  })
  fs.writeFileSync(runtimePath, 'module.exports = ' + JSON.stringify(runtime, null, 2) + '\n')

  const hairOutputDir = path.join(OUTPUT_ROOT, 'hair', hair.id)
  const hairRuntimePath = path.join(hairOutputDir, 'runtime.js')
  const hairRuntime = require(hairRuntimePath)
  const headBody = Object.assign({}, body, { layers: {} })
  ;['body_core', 'face'].forEach(function (name) {
    headBody.layers[name] = {
      zIndex: body.layers[name].zIndex,
      pixels: body.layers[name].pixels.map(function (row, y) {
        return y <= 28 ? row.slice() : Array(SIZE).fill(0)
      })
    }
  })
  hairRuntime.tonePreviews = {}
  ;[
    { id: 'chestnut', overrides: { 2: '#795644', 4: '#AB8065', 7: '#D39AA3' } },
    { id: 'ink', overrides: { 2: '#34313E', 4: '#625D70', 7: '#B98A98' } },
    { id: 'rosewood', overrides: { 2: '#7B4E5D', 4: '#B27B8F', 7: '#D4A1A8' } }
  ].forEach(function (variant) {
    const raw = renderAssetLayers([headBody, { asset: hair, overrides: variant.overrides }])
    const catalogName = 'catalog-' + variant.id + '.png'
    fs.writeFileSync(path.join(hairOutputDir, catalogName), encodePng(32, 32, cropRgba(raw, 16, 0, 32, 32)))
    hairRuntime.tonePreviews[variant.id] = '/assets/pixel/hair/' + hair.id + '/' + catalogName
  })
  fs.writeFileSync(hairRuntimePath, 'module.exports = ' + JSON.stringify(hairRuntime, null, 2) + '\n')
}

function validate(asset) {
  Object.keys(asset.layers).forEach(function (name) {
    const rows = asset.layers[name].pixels
    if (rows.length !== SIZE || rows.some(function (row) { return row.length !== SIZE })) {
      throw new Error(asset.id + ':' + name + ' 不是 64×64')
    }
    rows.forEach(function (row) {
      row.forEach(function (index) {
        if (!asset.palette.some(function (item) { return item.index === index })) {
          throw new Error(asset.id + ':' + name + ' 使用未知索引 ' + index)
        }
      })
    })
  })
}

function main() {
  const body = bodyAsset()
  const hair = hairAsset()
  const outfits = [
    dressAsset(),
    sageApronDressAsset(),
    navySailorDressAsset(),
    cocoaAcademyDressAsset(),
    roseTieredDressAsset()
  ]
  ;[body, hair].concat(outfits).forEach(validate)
  const bodyDir = writeAsset('body', body)
  const hairDir = writeAsset('hair', hair)
  const outfitDirs = outfits.map(function (outfit) {
    const outputDir = writeAsset('clothing', outfit)
    writeWornPreview(body, hair, outfit)
    return outputDir
  })
  console.log('Built body:', bodyDir)
  console.log('Built hair:', hairDir)
  outfitDirs.forEach(function (outputDir) { console.log('Built clothing:', outputDir) })
}

main()
