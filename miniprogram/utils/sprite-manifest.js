module.exports = {
  "version": 1,
  "sprites": [
    {
      "id": "body-chibi-v1",
      "slot": "baseBody",
      "spritePath": "/assets/pixel/sprite-v1/base/body-chibi-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "skin": [
          "#ECA58D",
          "#C97870",
          "#FFD0B6"
        ],
        "neutral": [
          "#E8D8C7",
          "#FFF7E8"
        ]
      },
      "editableRegions": {},
      "compatibilityTags": [
        "body:chibi-v1",
        "pose:front",
        "grid:32x48"
      ]
    },
    {
      "id": "soft-bob-back-v1",
      "slot": "backHair",
      "spritePath": "/assets/pixel/sprite-v1/hair/soft-bob-back-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#6E5A82",
          "#4A3B5F",
          "#9B88B2"
        ]
      },
      "editableRegions": {
        "primary": [
          "#6E5A82",
          "#4A3B5F",
          "#9B88B2"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "hair:soft-bob-v1",
        "grid:32x48"
      ]
    },
    {
      "id": "soft-bob-front-v1",
      "slot": "frontHair",
      "spritePath": "/assets/pixel/sprite-v1/hair/soft-bob-front-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#6E5A82",
          "#4A3B5F",
          "#9B88B2"
        ]
      },
      "editableRegions": {
        "primary": [
          "#6E5A82",
          "#4A3B5F",
          "#9B88B2"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "hair:soft-bob-v1",
        "grid:32x48"
      ]
    },
    {
      "id": "face-soft-v1",
      "slot": "face",
      "spritePath": "/assets/pixel/sprite-v1/face/face-soft-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "iris": [
          "#6E5A82",
          "#9B88B2"
        ],
        "white": [
          "#FFF7E8"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "editableRegions": {},
      "compatibilityTags": [
        "body:chibi-v1",
        "face:soft-v1",
        "grid:32x48"
      ]
    },
    {
      "id": "cloud-top-v1",
      "slot": "top",
      "spritePath": "/assets/pixel/sprite-v1/top/cloud-top-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#709BC2",
          "#4E7295",
          "#A5C6DC"
        ],
        "secondary": [
          "#F4E6CD"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "editableRegions": {
        "primary": [
          "#709BC2",
          "#4E7295",
          "#A5C6DC"
        ],
        "secondary": [
          "#F4E6CD"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "shoulder:10-22",
        "waist:29",
        "grid:32x48"
      ]
    },
    {
      "id": "navy-pants-v1",
      "slot": "bottom",
      "spritePath": "/assets/pixel/sprite-v1/bottom/navy-pants-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#536889",
          "#394A68",
          "#8295B2"
        ]
      },
      "editableRegions": {
        "primary": [
          "#536889",
          "#394A68",
          "#8295B2"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "waist:29",
        "legs:11-15|17-21",
        "grid:32x48"
      ]
    },
    {
      "id": "brown-boots-v1",
      "slot": "shoes",
      "spritePath": "/assets/pixel/sprite-v1/shoes/brown-boots-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#8A5948",
          "#5D3C34",
          "#C27C5F"
        ]
      },
      "editableRegions": {
        "primary": [
          "#8A5948",
          "#5D3C34",
          "#C27C5F"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "feet:13-19",
        "ground:46",
        "grid:32x48"
      ]
    },
    {
      "id": "cloud-cap-v1",
      "slot": "headwear",
      "spritePath": "/assets/pixel/sprite-v1/headwear/cloud-cap-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#709BC2",
          "#4E7295",
          "#A5C6DC"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "editableRegions": {
        "primary": [
          "#709BC2",
          "#4E7295",
          "#A5C6DC"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "compatibilityTags": [
        "body:chibi-v1",
        "headTop:16,2",
        "grid:32x48"
      ]
    },
    {
      "id": "thinking-effect-v1",
      "slot": "effect",
      "spritePath": "/assets/pixel/sprite-v1/effect/thinking-effect-v1.png",
      "palette": {
        "outline": [
          "#3B3046"
        ],
        "primary": [
          "#FFF7E8"
        ],
        "accent": [
          "#CA7087"
        ]
      },
      "editableRegions": {},
      "compatibilityTags": [
        "body:chibi-v1",
        "effect:thinking",
        "grid:32x48"
      ]
    }
  ],
  "equipment": {
    "hair": {
      "soft-bob-v1": [
        "soft-bob-back-v1",
        "soft-bob-front-v1"
      ]
    },
    "top": {
      "cloud-top-v1": [
        "cloud-top-v1"
      ]
    },
    "bottom": {
      "navy-pants-v1": [
        "navy-pants-v1"
      ]
    },
    "shoes": {
      "brown-boots-v1": [
        "brown-boots-v1"
      ]
    },
    "headwear": {
      "cloud-cap-v1": [
        "cloud-cap-v1"
      ]
    }
  },
  "fixed": {
    "baseBody": "body-chibi-v1",
    "face": "face-soft-v1"
  },
  "effects": {
    "thinking": "thinking-effect-v1"
  },
  "defaultEquipped": {
    "hair": "soft-bob-v1",
    "top": "cloud-top-v1",
    "bottom": "navy-pants-v1",
    "shoes": "brown-boots-v1",
    "headwear": "cloud-cap-v1"
  }
}
