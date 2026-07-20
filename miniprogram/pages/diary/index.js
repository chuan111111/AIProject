const storage = require('../../utils/storage')
const persona = require('../../utils/persona')

function shorten(text, limit) {
  const value = String(text || '').replace(/\s+/g, '')
  return value.length > limit ? value.slice(0, limit) + '…' : value
}

function buildStoryFrames(diary, character, memories) {
  if (!diary) return []
  const memory = memories.length ? memories[0].content : '把小屋最暖的位置留给你'
  return [
    { id: 'frame_1', index: '01', scene: 'window', mood: 'thinking', caption: character.name + ' 在窗边等你回来。' },
    { id: 'frame_2', index: '02', scene: 'snack', mood: 'excited', caption: shorten(memory, 24) },
    { id: 'frame_3', index: '03', scene: 'talk', mood: 'shy', caption: shorten(diary.content, 26) },
    { id: 'frame_4', index: '04', scene: 'night', mood: 'happy', caption: '“' + diary.mood + '的一天，被好好存档了。”' }
  ]
}

Page({
  data: {
    character: {},
    currentDiary: null,
    history: [],
    chatCount: 0,
    memoryCount: 0,
    generating: false,
    storyFrames: [],
    residentCount: 1
  },

  onShow: function () {
    const character = storage.getCharacter()
    if (!character) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    const diaries = storage.getDiaries()
    const today = persona.dateInfo(new Date()).key
    const currentDiary = diaries.find(function (item) { return item.dateKey === today }) || null
    const memories = storage.getMemories()
    this.setData({
      character: character,
      currentDiary: currentDiary,
      history: diaries.filter(function (item) { return item.dateKey !== today }),
      chatCount: storage.getMessages().filter(function (item) { return item.role === 'user' }).length,
      memoryCount: memories.length,
      storyFrames: buildStoryFrames(currentDiary, character, memories),
      residentCount: 1 + storage.getHousemates().length
    })
    wx.setNavigationBarTitle({ title: character.name + ' 的日记' })
  },

  onUnload: function () {
    if (this.generateTimer) clearTimeout(this.generateTimer)
  },

  generateDiary: function () {
    if (this.data.generating) return
    this.setData({ generating: true })
    const that = this
    this.generateTimer = setTimeout(function () {
      const diary = persona.generateDiary(
        that.data.character,
        storage.getMessages(),
        storage.getMemories()
      )
      storage.saveDiary(diary)
      that.setData({
        currentDiary: diary,
        generating: false,
        storyFrames: buildStoryFrames(diary, that.data.character, storage.getMemories())
      })
      wx.showToast({ title: '四格小剧场生成啦', icon: 'success' })
    }, 780)
  },

  goChat: function () {
    wx.navigateTo({ url: '/pages/chat/index' })
  },

  goRoom: function () {
    wx.navigateBack({ delta: 1 })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.character.name + ' 今天演了一段像素小剧场',
      path: '/pages/home/index'
    }
  }
})
