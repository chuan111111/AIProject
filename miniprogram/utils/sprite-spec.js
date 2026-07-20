const SPRITE_SPEC = {
  version: 4,
  canvasWidth: 64,
  canvasHeight: 64,
  centerX: 32,
  groundY: 61,
  anchors: {
    headTop: [32, 4],
    faceCenter: [32, 19],
    leftEar: [22, 17],
    rightEar: [42, 17],
    neckCenter: [32, 28],
    leftShoulder: [25, 30],
    rightShoulder: [38, 30],
    chestCenter: [32, 35],
    waistCenter: [32, 43],
    hipCenter: [32, 47],
    leftElbow: [22, 37],
    rightElbow: [41, 37],
    leftWrist: [21, 43],
    rightWrist: [42, 43],
    leftKnee: [28, 54],
    rightKnee: [36, 54],
    leftAnkle: [28, 59],
    rightAnkle: [36, 59],
    leftFoot: [28, 61],
    rightFoot: [36, 61]
  },
  regions: {
    head: [4, 27],
    neck: [27, 30],
    torso: [30, 48],
    legs: [47, 59],
    feet: [60, 61]
  },
  layerOrder: [
    'hairBack',
    'clothingBack',
    'bodyCore',
    'armsBack',
    'clothingMain',
    'armsFront',
    'handsFront',
    'clothingFront',
    'hairMain',
    'face',
    'hairFront',
    'hairAccessory',
    'headwear',
    'effect'
  ]
}

module.exports = SPRITE_SPEC
