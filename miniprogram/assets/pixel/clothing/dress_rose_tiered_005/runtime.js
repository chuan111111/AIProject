module.exports = {
  "version": "3.0",
  "id": "dress_rose_tiered_005",
  "name": "玫瑰奶霜分层蕾丝裙",
  "canvas": {
    "width": 64,
    "height": 64,
    "origin": "top-left",
    "centerX": 32,
    "groundY": 61,
    "cellOrder": "row-major",
    "indexFormula": "index = y * 64 + x"
  },
  "design": {
    "type": "dress",
    "compatibleBody": "body_chibi_64_v2",
    "anchors": {
      "headTop": [
        32,
        4
      ],
      "faceCenter": [
        32,
        19
      ],
      "leftEar": [
        22,
        17
      ],
      "rightEar": [
        42,
        17
      ],
      "neckCenter": [
        32,
        28
      ],
      "leftShoulder": [
        25,
        30
      ],
      "rightShoulder": [
        38,
        30
      ],
      "chestCenter": [
        32,
        35
      ],
      "waistCenter": [
        32,
        43
      ],
      "hipCenter": [
        32,
        47
      ],
      "leftElbow": [
        22,
        37
      ],
      "rightElbow": [
        41,
        37
      ],
      "leftWrist": [
        21,
        43
      ],
      "rightWrist": [
        42,
        43
      ],
      "leftKnee": [
        28,
        54
      ],
      "rightKnee": [
        36,
        54
      ],
      "leftAnkle": [
        28,
        59
      ],
      "rightAnkle": [
        36,
        59
      ],
      "leftFoot": [
        28,
        61
      ],
      "rightFoot": [
        36,
        61
      ]
    },
    "template": "rose-tiered-lace",
    "silhouette": "tiered-bell-dress",
    "collar": "lace-square-collar",
    "sleeve": "short-puff-sleeve",
    "waist": "double-bow-at-y42",
    "hem": "three-tier-lace-at-y48-56",
    "patternDescription": "分层蕾丝、玫瑰花与蝴蝶结编辑区"
  },
  "palette": [
    {
      "index": 0,
      "symbol": "T",
      "role": "transparent",
      "color": "#00000000",
      "editable": false
    },
    {
      "index": 1,
      "symbol": "O",
      "role": "outline",
      "color": "#60443B",
      "editable": false
    },
    {
      "index": 2,
      "symbol": "M",
      "role": "primary",
      "color": "#C88D99",
      "editable": true
    },
    {
      "index": 3,
      "symbol": "S",
      "role": "primary_shadow",
      "color": "#9c6e77",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": -0.22
    },
    {
      "index": 4,
      "symbol": "L",
      "role": "secondary",
      "color": "#F6E7D5",
      "editable": true
    },
    {
      "index": 5,
      "symbol": "A",
      "role": "accent",
      "color": "#9A6E72",
      "editable": true
    },
    {
      "index": 6,
      "symbol": "H",
      "role": "primary_highlight",
      "color": "#d2a2ab",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": 0.18
    },
    {
      "index": 7,
      "symbol": "D",
      "role": "secondary_shadow",
      "color": "#dbcebe",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": -0.11
    },
    {
      "index": 8,
      "symbol": "C",
      "role": "lace_highlight",
      "color": "#f7e9d9",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": 0.1
    },
    {
      "index": 9,
      "symbol": "G",
      "role": "accent_shadow",
      "color": "#7b585b",
      "editable": false,
      "linkedTo": 5,
      "linkedTone": -0.2
    },
    {
      "index": 10,
      "symbol": "N",
      "role": "embroidery",
      "color": "#B8756C",
      "editable": true
    }
  ],
  "editableRegions": [
    {
      "id": "primary_fabric",
      "type": "palette_recolor",
      "paletteIndex": 2,
      "bounds": [
        16,
        28,
        32,
        29
      ],
      "description": "服装主布料"
    },
    {
      "id": "secondary_fabric",
      "type": "palette_recolor",
      "paletteIndex": 4,
      "bounds": [
        16,
        28,
        32,
        29
      ],
      "description": "衬衫、围裙或蕾丝辅布料"
    },
    {
      "id": "accent_ribbon",
      "type": "palette_recolor",
      "paletteIndex": 5,
      "bounds": [
        18,
        29,
        28,
        27
      ],
      "description": "领结、腰带与强调色装饰"
    },
    {
      "id": "embroidery",
      "type": "palette_recolor",
      "paletteIndex": 10,
      "bounds": [
        18,
        31,
        28,
        26
      ],
      "description": "纽扣、格纹与刺绣，可隐藏"
    },
    {
      "id": "skirt_pattern",
      "type": "pixel_edit",
      "bounds": [
        18,
        44,
        28,
        13
      ],
      "allowedPaletteIndices": [
        0,
        2,
        4,
        5,
        8,
        10
      ],
      "description": "分层蕾丝、玫瑰花与蝴蝶结编辑区"
    }
  ],
  "lockedPaletteIndices": [
    0,
    1,
    3,
    6,
    7,
    8,
    9
  ],
  "layers": {
    "back": {
      "zIndex": 10,
      "encodedRows": [
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T"
      ]
    },
    "main": {
      "zIndex": 30,
      "encodedRows": [
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "29T 1O 4T 1O 29T",
        "27T 3O 4T 3O 27T",
        "22T 5O 2M 1O 4T 1O 1M 1S 5O 22T",
        "20T 2O 3L 1D 1O 3M 4O 2M 1S 1O 4L 2O 20T",
        "19T 1O 2L 1C 2L 1D 1O 9M 1S 1O 4L 1C 1D 1O 19T",
        "19T 1O 5L 1D 1O 9M 1S 1O 4L 2D 1O 19T",
        "20T 1O 4L 1D 1O 9M 1S 1O 4L 1D 1O 20T",
        "20T 5L 2O 9M 1S 2O 5L 20T",
        "20T 5L 1T 1O 9M 1S 1O 1T 5L 20T",
        "26T 1O 9M 1S 1O 26T",
        "26T 1O 9M 1S 1O 26T",
        "26T 1O 9M 1S 1O 26T",
        "26T 1O 9M 1S 1O 26T",
        "27T 1O 8M 1O 27T",
        "27T 10O 27T",
        "27T 1O 8M 1O 27T",
        "26T 1O 4M 1H 5M 1O 26T",
        "25T 1O 5M 1H 6M 1O 25T",
        "24T 1O 6M 1H 6M 1S 1O 24T",
        "23T 1O 1S 6M 1H 6M 1S 1M 1O 23T",
        "22T 1O 1M 1S 6M 1H 6M 1S 1M 1S 1O 22T",
        "21T 1O 2M 1S 6M 1H 6M 1S 1M 2S 1O 21T",
        "20T 1O 3M 1S 6M 1H 6M 1S 1M 3S 1O 20T",
        "19T 1O 4M 1S 6M 1H 6M 1S 1M 4S 1O 19T",
        "18T 1O 5M 1S 6M 1H 6M 1S 1M 5S 1O 18T",
        "18T 1O 5M 1S 6M 1H 6M 1S 1M 5S 1O 18T",
        "17T 1O 6M 1S 6M 1H 6M 1S 1M 6S 1O 17T",
        "16T 1O 3M 1O 3M 1S 1O 4M 1O 1H 3M 1O 2M 1S 1M 1O 4S 1O 1S 1O 16T",
        "16T 4O 1T 4O 1T 4O 1T 4O 1T 4O 1T 4O 1T 2O 16T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T"
      ]
    },
    "front": {
      "zIndex": 50,
      "encodedRows": [
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "27T 10L 27T",
        "27T 10L 27T",
        "27T 1O 1L 6C 1L 1O 27T",
        "29T 6C 29T",
        "29T 1O 1C 2H 1C 1O 29T",
        "31T 2H 31T",
        "31T 2N 31T",
        "31T 2H 31T",
        "31T 2H 31T",
        "31T 2N 31T",
        "31T 2H 31T",
        "31T 2H 31T",
        "27T 10O 27T",
        "27T 4A 2C 4A 27T",
        "27T 4A 2O 4A 27T",
        "27T 4A 2T 4A 27T",
        "64T",
        "64T",
        "64T",
        "23T 1L 1C 2L 1C 2L 1C 2L 1C 2L 1C 2L 1C 1L 23T",
        "23T 1C 17T 1C 22T",
        "22T 1L 1N 1L 7T 1C 7T 1L 1N 1L 21T",
        "23T 1A 7T 1L 1N 1L 7T 1A 22T",
        "32T 1A 31T",
        "19T 2L 1C 2L 1C 2L 1C 2L 1C 2L 1C 2L 1C 2L 1C 2L 1C 2L 19T",
        "64T",
        "19T 1C 2T 1N 2T 1C 2T 1N 2T 1C 2T 1N 2T 1C 2T 1N 2T 1C 20T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T",
        "64T"
      ]
    }
  },
  "fallbackLayers": {
    "back": "/assets/pixel/clothing/dress_rose_tiered_005/layer-back.png",
    "main": "/assets/pixel/clothing/dress_rose_tiered_005/layer-main.png",
    "front": "/assets/pixel/clothing/dress_rose_tiered_005/layer-front.png"
  },
  "previewPath": "/assets/pixel/clothing/dress_rose_tiered_005/sprite.png",
  "wornPreviewPath": "/assets/pixel/clothing/dress_rose_tiered_005/worn_preview_64.png",
  "colorwayPreviews": {
    "berry-cream": "/assets/pixel/clothing/dress_rose_tiered_005/catalog-berry-cream.png",
    "blueberry": "/assets/pixel/clothing/dress_rose_tiered_005/catalog-blueberry.png",
    "mint": "/assets/pixel/clothing/dress_rose_tiered_005/catalog-mint.png"
  }
}
