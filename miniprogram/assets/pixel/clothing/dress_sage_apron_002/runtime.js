module.exports = {
  "version": "3.0",
  "id": "dress_sage_apron_002",
  "name": "鼠尾草奶油围裙裙",
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
    "template": "sage-apron",
    "silhouette": "apron-a-line-knee-length",
    "collar": "cream-petal-collar",
    "sleeve": "long-bishop-sleeve-natural-arm",
    "waist": "rose-ribbon-at-y43",
    "hem": "sage-scallop-at-y56",
    "patternDescription": "围裙口袋与裙摆花束编辑区"
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
      "color": "#879789",
      "editable": true
    },
    {
      "index": 3,
      "symbol": "S",
      "role": "primary_shadow",
      "color": "#69766b",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": -0.22
    },
    {
      "index": 4,
      "symbol": "L",
      "role": "secondary",
      "color": "#F3E6D3",
      "editable": true
    },
    {
      "index": 5,
      "symbol": "A",
      "role": "accent",
      "color": "#C78E96",
      "editable": true
    },
    {
      "index": 6,
      "symbol": "H",
      "role": "primary_highlight",
      "color": "#9daa9e",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": 0.18
    },
    {
      "index": 7,
      "symbol": "D",
      "role": "secondary_shadow",
      "color": "#d8cdbc",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": -0.11
    },
    {
      "index": 8,
      "symbol": "C",
      "role": "lace_highlight",
      "color": "#f4e9d7",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": 0.1
    },
    {
      "index": 9,
      "symbol": "G",
      "role": "accent_shadow",
      "color": "#9f7278",
      "editable": false,
      "linkedTo": 5,
      "linkedTone": -0.2
    },
    {
      "index": 10,
      "symbol": "N",
      "role": "embroidery",
      "color": "#B87568",
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
      "description": "围裙口袋与裙摆花束编辑区"
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
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 3A 8T 3A 25T",
        "25T 1G 10T 3A 25T",
        "38T 1G 25T",
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
        "19T 1O 5L 1D 1O 9M 1S 1O 4L 2D 1O 19T",
        "20T 1O 1C 3L 1D 1O 9M 1S 1O 4L 1C 1O 20T",
        "19T 1O 5L 2O 9M 1S 2O 3L 2D 1O 19T",
        "19T 1O 5L 2O 9M 1S 2O 3L 2D 1O 19T",
        "18T 1O 5L 1O 1T 1O 9M 1S 1O 1T 1O 2L 3D 1O 18T",
        "18T 1O 2L 1C 2L 1O 1T 1O 9M 1S 1O 1T 1O 2L 1C 2D 1O 18T",
        "19T 1O 3L 1O 2T 1O 9M 1S 1O 2T 1O 1L 2D 1O 19T",
        "19T 1O 3L 1O 3T 1O 8M 1O 3T 1O 1L 2D 1O 19T",
        "19T 5A 3T 1O 8M 1O 3T 5A 19T",
        "19T 5A 3T 10O 3T 5A 19T",
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
        "17T 1O 2M 1O 3M 1S 1O 4M 1O 1H 3M 1O 2M 1S 1M 1O 4S 2O 17T",
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
        "27T 4L 2T 4L 27T",
        "27T 4L 2T 4L 27T",
        "27T 1O 3L 2T 3L 1O 27T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "28T 2L 4T 2L 28T",
        "27T 3O 4A 3O 27T",
        "27T 1O 3A 2C 3A 1O 27T",
        "27T 3O 4A 3O 27T",
        "27T 1O 8L 1O 27T",
        "26T 1O 10L 1O 26T",
        "25T 1O 2L 1O 6C 1O 2L 1O 25T",
        "24T 1O 3L 8C 2L 1D 1O 24T",
        "23T 1O 4L 8C 2L 2D 1O 23T",
        "23T 1O 4L 8C 2L 2D 1O 23T",
        "22T 1O 5L 8C 2L 3D 1O 22T",
        "22T 1O 1L 1C 3L 1O 6C 1O 2L 2D 1C 1O 22T",
        "21T 1O 1L 1C 1N 1C 5L 1C 1N 1C 4L 1D 1C 1N 1C 1O 21T",
        "21T 22O 21T",
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
    }
  },
  "fallbackLayers": {
    "back": "/assets/pixel/clothing/dress_sage_apron_002/layer-back.png",
    "main": "/assets/pixel/clothing/dress_sage_apron_002/layer-main.png",
    "front": "/assets/pixel/clothing/dress_sage_apron_002/layer-front.png"
  },
  "previewPath": "/assets/pixel/clothing/dress_sage_apron_002/sprite.png",
  "wornPreviewPath": "/assets/pixel/clothing/dress_sage_apron_002/worn_preview_64.png",
  "colorwayPreviews": {
    "berry-cream": "/assets/pixel/clothing/dress_sage_apron_002/catalog-berry-cream.png",
    "blueberry": "/assets/pixel/clothing/dress_sage_apron_002/catalog-blueberry.png",
    "mint": "/assets/pixel/clothing/dress_sage_apron_002/catalog-mint.png"
  }
}
