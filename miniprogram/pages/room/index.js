const storage = require('../../utils/storage')
const scenes = require('../../utils/scenes')
const appearance = require('../../utils/appearance')

const INTERACTIONS = [
  { line: '嗯……再摸一下也可以。', mood: 'shy' },
  { line: '你回来以后，房间都变暖了。', mood: 'happy' },
  { line: '今天也有好好想起我吗？', mood: 'thinking' },
  { line: '被你发现我在等你了。', mood: 'excited' }
]

Page({
  data: {
    character: {},
    mood: 'happy',
    speech: '',
    memories: [],
    latestDiary: null,
    outfitIndex: 0,
    canonCount: 0,
    pendingCount: 0,
    consistencyScore: 98,
    characterState: {},
    residents: [],
    residentCount: 1,
    emptySlots: [1, 2],
    scenes: scenes.SCENES,
    currentScene: scenes.sceneById('farm')
  },

  onLoad: function (options) {
    this.welcome = options.welcome === '1'
  },

  onShow: function () {
    const character = storage.getCharacter()
    if (!character) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    const state = storage.getCharacterState()
    const hour = new Date().getHours()
    let greeting = state.currentActivity || '你来了。要不要和我说说今天？'
    if (hour < 10) greeting = '早上好。我把窗边最暖的位置留给你了。'
    if (hour >= 22) greeting = '这么晚还来看我呀。今天过得怎么样？'
    if (this.welcome) greeting = '我醒来了。以后，这里就是我们的房间。'

    const diaries = storage.getDiaries()
    const residents = [character].concat(storage.getHousemates())
    this.setData({
      character: character,
      speech: greeting,
      memories: storage.getMemories(),
      latestDiary: diaries.length ? diaries[0] : null,
      canonCount: storage.getCanonItems().filter(function (item) { return item.locked }).length,
      pendingCount: storage.getPendingMemoryProposals().length,
      consistencyScore: storage.getConsistencyScore(),
      characterState: state,
      residents: residents,
      residentCount: residents.length,
      emptySlots: Array.from({ length: Math.max(0, 3 - residents.length) }, function (_, index) { return index }),
      currentScene: scenes.sceneById(storage.getSceneId())
    })
    wx.setNavigationBarTitle({ title: character.name + ' 的像素小屋' })
    this.welcome = false
  },

  onUnload: function () {
    if (this.moodTimer) clearTimeout(this.moodTimer)
  },

  touchCharacter: function () {
    const index = Math.floor(Math.random() * INTERACTIONS.length)
    const interaction = INTERACTIONS[index]
    this.setData({ mood: interaction.mood, speech: interaction.line })
    if (this.moodTimer) clearTimeout(this.moodTimer)
    const that = this
    this.moodTimer = setTimeout(function () {
      that.setData({ mood: 'happy' })
    }, 1800)
  },

  selectScene: function (event) {
    const scene = scenes.sceneById(event.currentTarget.dataset.id)
    storage.saveSceneId(scene.id)
    this.setData({ currentScene: scene, speech: '换到“' + scene.name + '”啦。这里也很适合今天的衣服。' })
  },

  touchResident: function (event) {
    const index = Number(event.currentTarget.dataset.index || 0)
    if (index === 0) {
      this.touchCharacter()
      return
    }
    const resident = this.data.residents[index]
    this.setData({ speech: resident.name + '：我只是来串门的！今天的小剧场也给我留一格吧。', mood: 'happy' })
  },

  inviteResident: function () {
    if (this.data.residentCount >= 3) return
    const residents = [this.data.character].concat(storage.inviteHousemate())
    this.setData({
      residents: residents,
      residentCount: residents.length,
      emptySlots: Array.from({ length: Math.max(0, 3 - residents.length) }, function (_, index) { return index }),
      speech: residents[residents.length - 1].name + ' 搬进来了。今晚会不会有新剧情呢？'
    })
    wx.showToast({ title: '新住户入住', icon: 'success' })
  },

  giveSnack: function () {
    const favorite = (this.data.character.likes || '点心').split(/[、，,]/)[0]
    this.setData({ mood: 'excited', speech: '是“' + favorite + '”！我会慢慢吃的，真的。' })
  },

  changeOutfit: function () {
    const currentAppearance = appearance.normalizeAppearance(
      this.data.character.appearance,
      this.data.character.avatarStyle
    )
    const colorways = appearance.COLORWAYS
    const current = colorways.findIndex(function (item) {
      return item.id === currentAppearance.colorway
    })
    const next = colorways[(current + 1) % colorways.length]
    const nextAppearance = appearance.appearanceForOutfit(currentAppearance.outfitId, next.id, {
      bodyId: currentAppearance.bodyId,
      hairId: currentAppearance.hairId,
      skinTone: currentAppearance.skinTone,
      hairTone: currentAppearance.hairTone,
      bodyPaletteOverrides: currentAppearance.bodyPaletteOverrides,
      hairPaletteOverrides: currentAppearance.hairPaletteOverrides
    })
    const character = Object.assign({}, this.data.character, {
      avatarStyle: next.id,
      appearance: Object.assign(nextAppearance, { updatedAt: Date.now() })
    })
    storage.saveCharacter(character)
    this.setData({ character: character, mood: 'shy', speech: '这套颜色怎么样？是特意换给你看的。' })
  },

  goChat: function () {
    wx.navigateTo({ url: '/pages/chat/index' })
  },

  goDiary: function () {
    wx.navigateTo({ url: '/pages/diary/index' })
  },

  goPixelEditor: function () {
    wx.navigateTo({ url: '/pages/pixel-editor/index' })
  },

  goCanon: function () {
    wx.navigateTo({ url: '/pages/canon/index' })
  },

  runIdentityTest: function () {
    storage.setChatDraft('你不是最喜欢在人多的地方唱歌吗？')
    wx.navigateTo({ url: '/pages/chat/index?autotest=1' })
  },

  editCharacter: function () {
    wx.navigateTo({ url: '/pages/create/index?mode=edit' })
  },

  goHome: function () {
    wx.reLaunch({ url: '/pages/home/index' })
  }
})
