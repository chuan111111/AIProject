const SCENES = [
  {
    id: 'farm',
    name: '晴日农场',
    shortName: '农场',
    path: '/assets/pixel/scenes/farm-home-lite.jpg',
    note: '阳光、菜地与乡间小路'
  },
  {
    id: 'seaside',
    name: '蓝屿海岸',
    shortName: '海岸',
    path: '/assets/pixel/scenes/seaside-promenade-lite.jpg',
    note: '碧海、白栏与扶桑花'
  },
  {
    id: 'rainy-town',
    name: '街雨花巷',
    shortName: '雨巷',
    path: '/assets/pixel/scenes/rainy-boutique-lite.jpg',
    note: '雨后倒影与服装橱窗'
  },
  {
    id: 'dessert-atelier',
    name: '甜点衣橱',
    shortName: '甜点屋',
    path: '/assets/pixel/scenes/dessert-atelier-lite.jpg',
    note: '缎带、蛋糕与梦幻衣橱'
  }
]

function sceneById(id) {
  return SCENES.find(function (scene) { return scene.id === id }) || SCENES[0]
}

module.exports = {
  SCENES: SCENES,
  sceneById: sceneById
}
