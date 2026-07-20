module.exports = {
  "version": "3.0",
  "id": "dress_berry_cream_001",
  "name": "莓果奶油田园刺绣连衣裙",
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
    "template": "berry-cottage",
    "silhouette": "a-line-knee-length",
    "collar": "scalloped-double-petal-round-collar",
    "sleeve": "long-bishop-sleeve-natural-arm",
    "waist": "sage-ribbon-at-y43",
    "hem": "embroidered-cream-lace-at-y53-56",
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
    }
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
      "color": "#D39AA3",
      "editable": true
    },
    {
      "index": 3,
      "symbol": "S",
      "role": "primary_shadow",
      "color": "#A57078",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": -0.22
    },
    {
      "index": 4,
      "symbol": "L",
      "role": "secondary",
      "color": "#F6E8D4",
      "editable": true
    },
    {
      "index": 5,
      "symbol": "A",
      "role": "accent",
      "color": "#91A095",
      "editable": true
    },
    {
      "index": 6,
      "symbol": "H",
      "role": "primary_highlight",
      "color": "#DCAEB5",
      "editable": false,
      "linkedTo": 2,
      "linkedTone": 0.18
    },
    {
      "index": 7,
      "symbol": "D",
      "role": "secondary_shadow",
      "color": "#D9C7AF",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": -0.11
    },
    {
      "index": 8,
      "symbol": "C",
      "role": "lace_highlight",
      "color": "#FFF3DF",
      "editable": false,
      "linkedTo": 4,
      "linkedTone": 0.1
    },
    {
      "index": 9,
      "symbol": "G",
      "role": "accent_shadow",
      "color": "#657A70",
      "editable": false,
      "linkedTo": 5,
      "linkedTone": -0.2
    },
    {
      "index": 10,
      "symbol": "N",
      "role": "embroidery",
      "color": "#B8796F",
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
        29,
        32,
        28
      ],
      "description": "裙身、袖口与领口主色"
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
      "description": "上衣、袖子与下摆花边"
    },
    {
      "id": "accent_ribbon",
      "type": "palette_recolor",
      "paletteIndex": 5,
      "bounds": [
        23,
        29,
        18,
        22
      ],
      "description": "腰带、蝴蝶结、花朵与下摆点缀"
    },
    {
      "id": "embroidery",
      "type": "palette_recolor",
      "paletteIndex": 10,
      "bounds": [
        18,
        33,
        28,
        24
      ],
      "description": "纽扣、花心与蕾丝绣线"
    },
    {
      "id": "skirt_pattern",
      "type": "pixel_edit",
      "bounds": [
        18,
        47,
        28,
        9
      ],
      "allowedPaletteIndices": [
        0,
        4,
        5,
        8,
        10
      ],
      "description": "裙摆局部图案编辑区"
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
        "24T 4G 8T 4G 24T",
        "23T 1O 4G 8T 4G 1O 23T",
        "24T 4G 8T 4G 24T",
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
        "22T 8O 4T 8O 22T",
        "20T 2O 4L 2D 2O 4T 2O 6L 2O 20T",
        "18T 2O 3L 1C 2L 2D 1O 1L 4O 1L 1O 4L 1C 1L 2D 2O 18T",
        "18T 1O 7L 2D 1O 6L 1O 6L 3D 1O 18T",
        "18T 1O 2L 1C 4L 1D 1O 8L 1O 5L 1C 2D 1O 18T",
        "18T 1O 7L 1D 1O 8L 1O 5L 3D 1O 18T",
        "19T 1O 6L 1O 9L 1D 1O 4L 2D 1O 19T",
        "19T 1O 2L 1C 2L 2O 9L 1D 2O 2L 1C 2D 1O 19T",
        "19T 1O 5L 2O 9L 1D 2O 3L 2D 1O 19T",
        "18T 1O 5L 1O 1T 1O 9L 1D 1O 1T 1O 2L 3D 1O 18T",
        "18T 1O 2L 1C 2L 1O 1T 1O 9L 1D 1O 1T 1O 2L 1C 2D 1O 18T",
        "18T 1O 5L 1O 1T 1O 9L 1D 1O 1T 1O 2L 3D 1O 18T",
        "19T 1O 1C 2L 1O 3T 1O 8L 1O 3T 1O 1L 1D 1C 1O 19T",
        "19T 1O 1M 1H 1M 1O 3T 10O 3T 1O 1M 1H 1M 1O 19T",
        "19T 1O 3M 1O 3T 1O 8A 1O 3T 1O 3M 1O 19T",
        "26T 2O 8G 2O 26T",
        "24T 2O 1M 2S 3M 1H 3M 2S 2O 24T",
        "22T 2O 3M 2S 3M 1H 3M 2S 2M 2O 22T",
        "20T 2O 5M 2S 3M 1H 3M 2S 4M 2O 20T",
        "19T 1O 3M 1H 2M 2S 4M 1H 4M 2S 3M 2S 1O 19T",
        "18T 1O 7M 2S 4M 1H 4M 2S 3M 2S 1M 1O 18T",
        "17T 1O 5M 1H 2M 2S 4M 1H 4M 2S 3M 2S 2M 1O 17T",
        "17T 1O 7M 2S 5M 1H 5M 2S 3M 2S 1M 1O 17T",
        "16T 1O 6M 1H 1M 2S 5M 1H 5M 2S 3M 2S 2M 1O 16T",
        "16T 1O 30D 1O 16T",
        "16T 1O 30L 1O 16T",
        "17T 1O 2C 2L 1O 1C 2L 1C 1O 2L 2C 1O 1L 2C 1L 1O 2C 2L 1O 1C 2L 1O 17T",
        "18T 4O 1T 4O 1T 4O 1T 4O 1T 4O 1T 3O 18T",
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
        "27T 3M 4C 3M 27T",
        "27T 1O 2M 1C 2A 1C 2M 1O 27T",
        "27T 4M 2A 4M 27T",
        "27T 4M 2T 4M 27T",
        "27T 3M 4T 3M 27T",
        "27T 2M 1O 4T 1O 2M 27T",
        "27T 2M 1H 4M 1H 2M 27T",
        "27T 2M 1H 1M 1N 2M 1H 2M 27T",
        "27T 2M 1H 4M 1H 2M 27T",
        "18T 1O 5L 1O 2T 2M 1H 4M 1H 2M 2T 1O 2L 3D 1O 18T",
        "18T 1O 2L 1C 2L 1O 2T 2M 1H 2M 1N 1M 1H 2M 2T 1O 2L 1C 2D 1O 18T",
        "18T 1O 5L 1O 2T 2M 1H 1O 3M 1O 2M 2T 1O 2L 3D 1O 18T",
        "19T 1O 1C 2L 1O 3T 1O 3A 3M 3A 1O 2T 1O 1L 1D 1C 1O 19T",
        "19T 1O 1M 1H 1M 1O 4T 9A 3T 1O 1M 1H 1M 1O 19T",
        "19T 1O 3M 1O 4T 3A 1C 1A 1G 3A 3T 1O 3M 1O 19T",
        "31T 3A 30T",
        "30T 2A 1T 2A 29T",
        "30T 2A 1T 2A 29T",
        "24T 1S 5T 2A 1T 2A 6T 1H 22T",
        "29T 1H 2A 1T 2A 1T 1S 27T",
        "24T 1S 5T 1G 2T 2A 6T 1H 22T",
        "23T 1C 5T 1H 4T 1G 1T 1S 4T 1C 22T",
        "22T 1C 1N 1C 7T 1C 7T 1C 1N 1C 21T",
        "23T 1A 5T 1H 1T 1C 1N 1C 2T 1S 4T 1A 22T",
        "24T 1S 7T 1A 8T 1H 22T",
        "64T",
        "18T 1N 2T 1A 2T 1N 2T 1A 2T 1N 2T 1A 2T 1N 2T 1A 2T 1N 2T 1A 18T",
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
    "back": "/assets/pixel/clothing/dress_berry_cream_001/layer-back.png",
    "main": "/assets/pixel/clothing/dress_berry_cream_001/layer-main.png",
    "front": "/assets/pixel/clothing/dress_berry_cream_001/layer-front.png"
  },
  "previewPath": "/assets/pixel/clothing/dress_berry_cream_001/sprite.png",
  "wornPreviewPath": "/assets/pixel/clothing/dress_berry_cream_001/worn_preview_64.png",
  "colorwayPreviews": {
    "berry-cream": "/assets/pixel/clothing/dress_berry_cream_001/catalog-berry-cream.png",
    "blueberry": "/assets/pixel/clothing/dress_berry_cream_001/catalog-blueberry.png",
    "mint": "/assets/pixel/clothing/dress_berry_cream_001/catalog-mint.png"
  }
}
