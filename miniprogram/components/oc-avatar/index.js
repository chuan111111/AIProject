const appearance = require('../../utils/appearance')

const CANVAS_WIDTH = appearance.SPRITE_SPEC.canvasWidth
const CANVAS_HEIGHT = appearance.SPRITE_SPEC.canvasHeight

function appearancePresentation(character, mood, baseOnly) {
  const source = character || {}
  return appearance.avatarLayers(source.appearance, mood || 'happy', source.avatarStyle, {
    hideOutfit: Boolean(baseOnly)
  })
}

function colorToRgb(color) {
  const value = String(color || '').replace('#', '')
  if (!/^[0-9A-Fa-f]{6}$/.test(value)) return null
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  ]
}

function rgbKey(red, green, blue) {
  function part(value) { return value.toString(16).padStart(2, '0') }
  return ('#' + part(red) + part(green) + part(blue)).toUpperCase()
}

function fallbackPresentation(layers) {
  return layers.filter(function (layer) { return Boolean(layer.image) }).map(function (layer) {
    return {
      id: layer.id,
      image: layer.image,
      z: layer.z,
      leftPercent: ((layer.x || 0) / CANVAS_WIDTH) * 100,
      topPercent: ((layer.y || 0) / CANVAS_HEIGHT) * 100,
      widthPercent: ((layer.width || CANVAS_WIDTH) / CANVAS_WIDTH) * 100,
      heightPercent: ((layer.height || CANVAS_HEIGHT) / CANVAS_HEIGHT) * 100
    }
  })
}

Component({
  properties: {
    character: {
      type: Object,
      value: {},
      observer: function () { this.refreshAppearance() }
    },
    size: {
      type: String,
      value: 'medium'
    },
    mood: {
      type: String,
      value: 'happy',
      observer: function () { this.refreshAppearance() }
    },
    animated: {
      type: Boolean,
      value: true
    },
    baseOnly: {
      type: Boolean,
      value: false,
      observer: function () { this.refreshAppearance() }
    }
  },

  data: {
    appearanceLayers: [],
    canvasReady: false
  },

  lifetimes: {
    ready: function () { this.prepareCanvas() },
    detached: function () {
      this._drawToken = (this._drawToken || 0) + 1
      this._canvas = null
      this._context = null
      this._scratchCanvas = null
      this._scratchContext = null
      this._imageCache = null
      this._renderLayers = null
    }
  },

  methods: {
    refreshAppearance: function () {
      const layers = appearancePresentation(this.data.character, this.data.mood, this.data.baseOnly)
      this._renderLayers = layers
      this.setData({ appearanceLayers: fallbackPresentation(layers) }, this.queueCanvasDraw.bind(this))
    },

    prepareCanvas: function () {
      const that = this
      this.createSelectorQuery().select('#avatarCanvas').fields({ node: true, size: true }).exec(function (result) {
        const field = result && result[0]
        if (!field || !field.node) return
        that._canvas = field.node
        that._context = field.node.getContext('2d')
        that._canvas.width = CANVAS_WIDTH
        that._canvas.height = CANVAS_HEIGHT
        that._context.imageSmoothingEnabled = false
        that._imageCache = {}
        if (wx.createOffscreenCanvas) {
          that._scratchCanvas = wx.createOffscreenCanvas({
            type: '2d',
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT
          })
          that._scratchContext = that._scratchCanvas.getContext('2d')
          that._scratchContext.imageSmoothingEnabled = false
        }
        that.refreshAppearance()
      })
    },

    queueCanvasDraw: function () {
      if (!this._canvas || !this._context) return
      const that = this
      wx.nextTick(function () { that.drawAppearance() })
    },

    loadCanvasImage: function (source) {
      if (!source || !this._canvas) return Promise.resolve(null)
      if (this._imageCache[source]) return this._imageCache[source]
      const canvas = this._canvas
      this._imageCache[source] = new Promise(function (resolve) {
        const image = canvas.createImage()
        image.onload = function () { resolve(image) }
        image.onerror = function () { resolve(null) }
        image.src = source
      })
      return this._imageCache[source]
    },

    drawImageLayer: function (image, layer) {
      const recolorMap = layer.recolorMap || {}
      const keys = Object.keys(recolorMap)
      const x = layer.x || 0
      const y = layer.y || 0
      const width = layer.width || CANVAS_WIDTH
      const height = layer.height || CANVAS_HEIGHT
      if (!keys.length || !this._scratchCanvas || !this._scratchContext) {
        this._context.drawImage(image, x, y, width, height)
        return
      }
      const scratch = this._scratchContext
      scratch.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      scratch.imageSmoothingEnabled = false
      scratch.drawImage(image, x, y, width, height)
      const imageData = scratch.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      const data = imageData.data
      for (let offset = 0; offset < data.length; offset += 4) {
        if (!data[offset + 3]) continue
        const replacement = recolorMap[rgbKey(data[offset], data[offset + 1], data[offset + 2])]
        if (!replacement) continue
        const rgb = colorToRgb(replacement)
        if (!rgb) continue
        data[offset] = rgb[0]
        data[offset + 1] = rgb[1]
        data[offset + 2] = rgb[2]
      }
      scratch.putImageData(imageData, 0, 0)
      this._context.drawImage(this._scratchCanvas, 0, 0)
    },

    matrixImageData: function (layer, context) {
      const imageData = context.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT)
      const target = imageData.data
      layer.pixels.forEach(function (paletteIndex, pixelIndex) {
        const rgba = layer.paletteRgba[paletteIndex]
        const offset = pixelIndex * 4
        target[offset] = rgba[0]
        target[offset + 1] = rgba[1]
        target[offset + 2] = rgba[2]
        target[offset + 3] = rgba[3]
      })
      return imageData
    },

    drawMatrixLayer: function (layer) {
      if (this._scratchCanvas && this._scratchContext) {
        this._scratchContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this._scratchContext.putImageData(this.matrixImageData(layer, this._scratchContext), 0, 0)
        this._context.drawImage(this._scratchCanvas, 0, 0)
        return
      }
      const current = this._context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      layer.pixels.forEach(function (paletteIndex, pixelIndex) {
        const rgba = layer.paletteRgba[paletteIndex]
        if (!rgba[3]) return
        const offset = pixelIndex * 4
        const alpha = rgba[3] / 255
        const inverse = 1 - alpha
        current.data[offset] = Math.round(rgba[0] * alpha + current.data[offset] * inverse)
        current.data[offset + 1] = Math.round(rgba[1] * alpha + current.data[offset + 1] * inverse)
        current.data[offset + 2] = Math.round(rgba[2] * alpha + current.data[offset + 2] * inverse)
        current.data[offset + 3] = Math.round(rgba[3] + current.data[offset + 3] * inverse)
      })
      this._context.putImageData(current, 0, 0)
    },

    drawAppearance: function () {
      if (!this._context) return
      const that = this
      const layers = (this._renderLayers || []).slice().sort(function (left, right) {
        return left.z - right.z
      })
      const token = (this._drawToken || 0) + 1
      this._drawToken = token
      Promise.all(layers.map(function (layer) {
        if (layer.kind === 'matrix') return Promise.resolve({ layer: layer, image: null })
        return that.loadCanvasImage(layer.image).then(function (image) {
          return { layer: layer, image: image }
        })
      })).then(function (loadedLayers) {
        if (that._drawToken !== token || !that._context) return
        that._context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        that._context.imageSmoothingEnabled = false
        loadedLayers.forEach(function (item) {
          if (item.layer.kind === 'matrix') that.drawMatrixLayer(item.layer)
          else if (item.image) that.drawImageLayer(item.image, item.layer)
        })
        if (!that.data.canvasReady) that.setData({ canvasReady: true })
      })
    }
  }
})
