module.exports = {
  "version": "3.0",
  "id": "dress_navy_sailor_003",
  "name": "雾蓝海军领百褶裙",
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
    "template": "navy-sailor",
    "silhouette": "short-pleated-dress",
    "collar": "wide-sailor-v-collar",
    "sleeve": "short-puff-sleeve",
    "waist": "high-waist-at-y42",
    "hem": "double-stripe-at-y54-55",
    "patternDescription": "百褶与双条纹下摆编辑区"
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
      "color": "#687C91",
      "editable": true
    },
    {
      "index": 3,
      "symbol": "S",
      "role": "primary_shadow",
      "color": "#516171",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": -0.22
    },
    {
      "index": 4,
      "symbol": "L",
      "role": "secondary",
      "color": "#F4E4D1",
      "editable": true
    },
    {
      "index": 5,
      "symbol": "A",
      "role": "accent",
      "color": "#B87882",
      "editable": true
    },
    {
      "index": 6,
      "symbol": "H",
      "role": "primary_highlight",
      "color": "#8394a5",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": 0.18
    },
    {
      "index": 7,
      "symbol": "D",
      "role": "secondary_shadow",
      "color": "#d9cbba",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": -0.11
    },
    {
      "index": 8,
      "symbol": "C",
      "role": "lace_highlight",
      "color": "#f5e7d6",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": 0.1
    },
    {
      "index": 9,
      "symbol": "G",
      "role": "accent_shadow",
      "color": "#936068",
      "editable": false,
      "linkedTo": 5,
      "linkedTone": -0.2
    },
    {
      "index": 10,
      "symbol": "N",
      "role": "embroidery",
      "color": "#D4AA79",
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
      "description": "百褶与双条纹下摆编辑区"
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
        "22T 5O 2L 1O 4T 1O 1L 1D 5O 22T",
        "20T 2O 3L 1D 1O 3L 4O 2L 1D 1O 4L 2O 20T",
        "19T 1O 2L 1C 2L 1D 1O 9L 1D 1O 4L 1C 1D 1O 19T",
        "19T 1O 5L 1D 1O 9L 1D 1O 4L 2D 1O 19T",
        "20T 1O 4L 1D 1O 9L 1D 1O 4L 1D 1O 20T",
        "20T 5M 2O 9L 1D 2O 5M 20T",
        "20T 5M 1T 1O 9L 1D 1O 1T 5M 20T",
        "26T 1O 9L 1D 1O 26T",
        "26T 1O 9L 1D 1O 26T",
        "26T 1O 9L 1D 1O 26T",
        "26T 1O 9L 1D 1O 26T",
        "27T 1O 8L 1O 27T",
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
        "16T 32O 16T",
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
        "26T 4M 4T 4M 26T",
        "26T 5M 2T 5M 26T",
        "26T 5M 2T 5M 26T",
        "26T 5M 2T 5M 26T",
        "26T 4M 1C 2T 1C 4M 26T",
        "28T 3M 2O 3M 28T",
        "29T 6A 29T",
        "29T 2A 2C 2A 29T",
        "29T 2A 2G 2A 29T",
        "31T 2G 31T",
        "31T 2G 31T",
        "31T 2G 31T",
        "27T 10O 27T",
        "27T 1O 8A 1O 27T",
        "27T 10O 27T",
        "64T",
        "28T 1H 4T 1S 30T",
        "28T 1H 4T 1S 4T 1H 25T",
        "28T 1H 4T 1S 4T 1H 25T",
        "23T 1S 4T 1H 4T 1S 4T 1H 25T",
        "23T 1S 4T 1H 4T 1S 4T 1H 25T",
        "23T 1S 4T 1H 4T 1S 4T 1H 25T",
        "23T 1S 4T 1H 4T 1S 4T 1H 4T 1S 20T",
        "23T 1S 4T 1H 4T 1S 4T 1H 4T 1S 20T",
        "19T 26L 19T",
        "19T 26N 19T",
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
    "back": "/assets/pixel/clothing/dress_navy_sailor_003/layer-back.png",
    "main": "/assets/pixel/clothing/dress_navy_sailor_003/layer-main.png",
    "front": "/assets/pixel/clothing/dress_navy_sailor_003/layer-front.png"
  },
  "previewPath": "/assets/pixel/clothing/dress_navy_sailor_003/sprite.png",
  "wornPreviewPath": "/assets/pixel/clothing/dress_navy_sailor_003/worn_preview_64.png",
  "colorwayPreviews": {
    "berry-cream": "/assets/pixel/clothing/dress_navy_sailor_003/catalog-berry-cream.png",
    "blueberry": "/assets/pixel/clothing/dress_navy_sailor_003/catalog-blueberry.png",
    "mint": "/assets/pixel/clothing/dress_navy_sailor_003/catalog-mint.png"
  }
}
