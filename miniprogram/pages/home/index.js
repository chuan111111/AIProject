const storage = require('../../utils/storage')
const scenes = require('../../utils/scenes')

Page({
  data: {
    hasCharacter: false,
    character: {},
    displayCharacter: { avatarStyle: 'berry-cream' },
    canonCount: 0,
    pendingCount: 0,
    consistencyScore: 98,
    characterState: {},
    residentCount: 1,
    scenes: scenes.SCENES,
    currentScene: scenes.sceneById('farm')
  },

  onShow: function () {
    const character = storage.getCharacter()
    if (character) storage.getMemories()
    this.setData({
      hasCharacter: Boolean(character),
      character: character || {},
      displayCharacter: character || { avatarStyle: 'berry-cream' },
      canonCount: character ? storage.getCanonItems().filter(function (item) { return item.locked }).length : 0,
      pendingCount: storage.getPendingMemoryProposals().length,
      consistencyScore: storage.getConsistencyScore(),
      characterState: storage.getCharacterState(),
      residentCount: character ? 1 + storage.getHousemates().length : 1,
      currentScene: scenes.sceneById(storage.getSceneId())
    })
  },

  createCharacter: function () {
    wx.navigateTo({ url: '/pages/create/index?mode=new' })
  },

  enterRoom: function () {
    wx.navigateTo({ url: '/pages/room/index' })
  },

  selectScene: function (event) {
    const scene = scenes.sceneById(event.currentTarget.dataset.id)
    storage.saveSceneId(scene.id)
    this.setData({ currentScene: scene })
  },

  goCanon: function () {
    wx.navigateTo({ url: '/pages/canon/index' })
  },

  goPixelEditor: function () {
    wx.navigateTo({ url: '/pages/pixel-editor/index' })
  },

  runIdentityTest: function () {
    storage.setChatDraft('你不是最喜欢在人多的地方唱歌吗？')
    wx.navigateTo({ url: '/pages/chat/index?autotest=1' })
  },

  tryDemo: function () {
    storage.ensureDemoCharacter()
    wx.navigateTo({ url: '/pages/room/index?welcome=1' })
  }
})
