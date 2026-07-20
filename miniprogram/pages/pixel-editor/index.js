const storage = require('../../utils/storage')
const appearance = require('../../utils/appearance')

const DISPLAY_SCALE = 3

const PALETTE_LABELS = {
  2: '主布料',
  4: '辅布料',
  5: '强调色',
  10: '刺绣'
}

const CUSTOM_COLORS = [
  { id: 'berry', name: '莓果', color: '#D39AA3' },
  { id: 'rose', name: '玫瑰', color: '#C88D99' },
  { id: 'cream', name: '奶油', color: '#F6E8D4' },
  { id: 'oat', name: '燕麦', color: '#DDC9AE' },
  { id: 'sage', name: '鼠尾草', color: '#879789' },
  { id: 'mint', name: '灰薄荷', color: '#A7B5A6' },
  { id: 'navy', name: '雾海军', color: '#687C91' },
  { id: 'sky', name: '烟蓝', color: '#8FA4B3' },
  { id: 'cocoa', name: '可可', color: '#806052' },
  { id: 'caramel', name: '焦糖', color: '#B78369' },
  { id: 'plum', name: '梅子', color: '#8E6876' },
  { id: 'charcoal', name: '炭灰', color: '#56545B' }
]

function normalizeCustomColor(value) {
  const color = String(value || '').trim().toUpperCase()
  return /^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(color) ? color : ''
}

function guideAnchors() {
  return Object.keys(appearance.SPRITE_SPEC.anchors).map(function (name) {
    const point = appearance.SPRITE_SPEC.anchors[name]
    return {
      name: name,
      x: point[0],
      y: point[1],
      left: point[0] * DISPLAY_SCALE,
      top: point[1] * DISPLAY_SCALE
    }
  })
}

Page({
  data: {
    character: {},
    previewCharacter: {},
    spriteSpec: appearance.SPRITE_SPEC,
    anchors: guideAnchors(),
    groundTop: appearance.SPRITE_SPEC.groundY * DISPLAY_SCALE,
    outfits: appearance.OUTFITS,
    hairItems: appearance.HAIR_ITEMS,
    colorways: appearance.COLORWAYS,
    skinTones: appearance.SKIN_TONES,
    hairTones: appearance.HAIR_TONES,
    outfitId: appearance.CLOTHING_MANIFEST.defaultId,
    hairId: appearance.HAIR_MANIFEST.defaultId,
    colorway: appearance.COLORWAYS[0].id,
    skinTone: appearance.SKIN_TONES[0].id,
    hairTone: appearance.HAIR_TONES[0].id,
    currentOutfit: appearance.OUTFITS[0],
    palette: [],
    paletteOverrides: {},
    selectedPaletteIndex: 2,
    customHex: '#D39AA3',
    customChannels: [],
    customColors: CUSTOM_COLORS,
    embroideryHidden: false,
    bodyPalette: [],
    hairPalette: [],
    layers: [],
    showGuides: false,
    layerCount: 0
  },

  onLoad: function () {
    const character = storage.getCharacter()
    if (!character) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    const normalized = appearance.normalizeAppearance(character.appearance, character.avatarStyle)
    this.setData({
      character: character,
      outfitId: normalized.outfitId,
      hairId: normalized.hairId,
      colorway: normalized.colorway,
      skinTone: normalized.skinTone,
      hairTone: normalized.hairTone,
      paletteOverrides: normalized.paletteOverrides
    })
    this.refreshPreview()
  },

  currentAppearance: function () {
    return appearance.appearanceForOutfit(this.data.outfitId, this.data.colorway, {
      hairId: this.data.hairId,
      skinTone: this.data.skinTone,
      hairTone: this.data.hairTone,
      paletteOverrides: this.data.paletteOverrides
    })
  },

  refreshPreview: function () {
    const nextAppearance = this.currentAppearance()
    const outfit = appearance.OUTFITS.find(function (item) {
      return item.id === nextAppearance.outfitId
    }) || appearance.OUTFITS[0]
    const palette = appearance.editablePalette(nextAppearance)
    const selectedIndex = Number(this.data.selectedPaletteIndex)
    const selected = palette.find(function (item) { return item.index === selectedIndex }) || palette[0]
    this.setData({
      currentOutfit: outfit,
      previewCharacter: Object.assign({}, this.data.character, { appearance: nextAppearance }),
      palette: palette,
      customChannels: palette.map(function (item) {
        return Object.assign({}, item, { label: PALETTE_LABELS[item.index] || item.role })
      }),
      selectedPaletteIndex: selected ? selected.index : 2,
      customHex: selected ? selected.color : '#D39AA3',
      embroideryHidden: palette.some(function (item) {
        return item.index === 10 && item.color === '#00000000'
      }),
      bodyPalette: appearance.bodyPalette(nextAppearance),
      hairPalette: appearance.hairPalette(nextAppearance),
      layers: appearance.layerSummaries(nextAppearance),
      layerCount: appearance.avatarLayers(nextAppearance, 'happy').length
    })
  },

  selectOutfit: function (event) {
    this.setData({
      outfitId: event.currentTarget.dataset.outfit,
      colorway: 'template-original',
      paletteOverrides: {}
    }, this.refreshPreview.bind(this))
  },

  selectColorway: function (event) {
    this.setData({
      colorway: event.currentTarget.dataset.colorway,
      paletteOverrides: {}
    }, this.refreshPreview.bind(this))
  },

  selectPaletteChannel: function (event) {
    this.setData({ selectedPaletteIndex: Number(event.currentTarget.dataset.index) },
      this.refreshPreview.bind(this))
  },

  selectCustomColor: function (event) {
    this.applyPaletteColor(event.currentTarget.dataset.color)
  },

  handleCustomHex: function (event) {
    this.setData({ customHex: event.detail.value })
  },

  applyCustomHex: function () {
    const color = normalizeCustomColor(this.data.customHex)
    if (!color) {
      wx.showToast({ title: '请输入 #RRGGBB', icon: 'none' })
      return
    }
    this.applyPaletteColor(color)
  },

  applyPaletteColor: function (color) {
    const normalized = normalizeCustomColor(color)
    if (!normalized) return
    const overrides = Object.assign({}, this.data.paletteOverrides)
    overrides[Number(this.data.selectedPaletteIndex)] = normalized
    this.setData({ paletteOverrides: overrides }, this.refreshPreview.bind(this))
  },

  hideEmbroidery: function () {
    const overrides = Object.assign({}, this.data.paletteOverrides, { 10: '#00000000' })
    this.setData({ paletteOverrides: overrides }, this.refreshPreview.bind(this))
  },

  restoreEmbroidery: function () {
    const overrides = Object.assign({}, this.data.paletteOverrides)
    delete overrides[10]
    this.setData({ paletteOverrides: overrides }, this.refreshPreview.bind(this))
  },

  resetCustomPalette: function () {
    this.setData({ paletteOverrides: {} }, this.refreshPreview.bind(this))
  },

  selectSkinTone: function (event) {
    this.setData({ skinTone: event.currentTarget.dataset.tone }, this.refreshPreview.bind(this))
  },

  selectHair: function (event) {
    this.setData({ hairId: event.currentTarget.dataset.hair }, this.refreshPreview.bind(this))
  },

  selectHairTone: function (event) {
    this.setData({ hairTone: event.currentTarget.dataset.tone }, this.refreshPreview.bind(this))
  },

  toggleGuides: function () {
    this.setData({ showGuides: !this.data.showGuides })
  },

  saveAppearance: function () {
    const character = Object.assign({}, this.data.character, {
      avatarStyle: this.data.colorway,
      appearance: Object.assign(this.currentAppearance(), { updatedAt: Date.now() })
    })
    storage.saveCharacter(character)
    this.setData({ character: character })
    wx.showToast({ title: '64×64 造型已保存', icon: 'success' })
    setTimeout(function () { wx.navigateBack({ delta: 1 }) }, 420)
  }
})
