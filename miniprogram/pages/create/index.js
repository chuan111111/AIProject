const storage = require('../../utils/storage')
const persona = require('../../utils/persona')
const ai = require('../../utils/ai')
const appearance = require('../../utils/appearance')

const EMPTY_FORM = {
  name: '',
  callName: '你',
  relationship: '',
  personality: [],
  speakingStyle: '简短自然',
  likes: '',
  forbidden: '不说教，不否认我的感受',
  avatarStyle: 'berry-cream',
  rawProfile: ''
}

Page({
  data: {
    mode: 'new',
    form: Object.assign({}, EMPTY_FORM),
    personalityOptions: ['温柔', '傲娇', '活泼', '安静', '嘴硬', '黏人'].map(function (value) {
      return { value: value, selected: false }
    }),
    speakingOptions: ['简短自然', '像朋友', '像小动物', '有点中二'],
    avatarOptions: [
      { value: 'berry-cream', label: '莓果奶油' },
      { value: 'blueberry', label: '蓝莓奶霜' },
      { value: 'mint', label: '薄荷焦糖' }
    ],
    extractedCanon: [],
    hasExtracted: false,
    extracting: false,
    extractionEngine: ''
  },

  onLoad: function (options) {
    const mode = options.mode || 'edit'
    const existing = storage.getCharacter()
    if (existing && mode !== 'new') {
      const form = Object.assign({}, EMPTY_FORM, existing)
      form.avatarStyle = appearance.normalizeAppearance(existing.appearance, existing.avatarStyle).colorway
      this.setData({
        mode: mode,
        form: form,
        personalityOptions: this.data.personalityOptions.map(function (item) {
          return { value: item.value, selected: form.personality.indexOf(item.value) >= 0 }
        })
      })
    } else {
      this.setData({ mode: mode })
    }
  },

  handleInput: function (event) {
    const field = event.currentTarget.dataset.field
    const value = event.detail.value
    const update = {}
    update['form.' + field] = value
    this.setData(update)
  },

  fillSample: function () {
    const sample = '小眠是一个温柔但嘴硬的小人。她和用户是认识多年的朋友，不是恋人。她害怕在人多的地方表演，也不会主动唱歌。她关心别人时不会直说“我担心你”，而是用吐槽或行动表达。最近开始喜欢草莓牛奶。'
    this.setData({ 'form.rawProfile': sample })
  },

  extractCanon: function () {
    const rawProfile = this.data.form.rawProfile.trim()
    if (!rawProfile) {
      wx.showToast({ title: '先粘贴一段角色设定', icon: 'none' })
      return
    }
    if (this.data.extracting) return
    this.setData({ extracting: true })
    const that = this
    ai.extractCanon(rawProfile, this.data.form).then(function (result) {
      const items = result.items || []
      that.setData({
        extractedCanon: items,
        hasExtracted: Boolean(items.length),
        extracting: false,
        extractionEngine: result.provider === 'qwen' ? (result.model + ' · 云端提取') : '离线提取器 · 回退'
      })
      if (!items.length) {
        wx.showToast({ title: '没有提取到有效锚点', icon: 'none' })
        return
      }
      wx.showToast({
        title: result.provider === 'qwen' ? 'Qwen 已提取 ' + items.length + ' 条' : '已离线提取 ' + items.length + ' 条',
        icon: 'none'
      })
    })
  },

  togglePersonality: function (event) {
    const value = event.currentTarget.dataset.value
    const selected = this.data.form.personality.slice()
    const index = selected.indexOf(value)
    if (index >= 0) {
      selected.splice(index, 1)
    } else if (selected.length < 3) {
      selected.push(value)
    } else {
      wx.showToast({ title: '最多选择 3 个', icon: 'none' })
      return
    }
    this.setData({
      'form.personality': selected,
      personalityOptions: this.data.personalityOptions.map(function (item) {
        return { value: item.value, selected: selected.indexOf(item.value) >= 0 }
      })
    })
  },

  selectSpeaking: function (event) {
    this.setData({ 'form.speakingStyle': event.currentTarget.dataset.value })
  },

  selectAvatar: function (event) {
    this.setData({ 'form.avatarStyle': event.currentTarget.dataset.value })
  },

  saveCharacter: function () {
    const form = this.data.form
    if (!form.name.trim()) {
      wx.showToast({ title: '先给 TA 起个名字吧', icon: 'none' })
      return
    }
    if (!form.relationship.trim()) {
      wx.showToast({ title: '写下你们的关系吧', icon: 'none' })
      return
    }
    if (!form.personality.length) {
      wx.showToast({ title: '至少选择一个性格', icon: 'none' })
      return
    }

    const existing = storage.getCharacter()
    if (this.data.mode === 'new') storage.clearCharacterStory()
    const currentAppearance = appearance.normalizeAppearance(
      existing && existing.appearance,
      form.avatarStyle
    )
    const character = storage.saveCharacter(Object.assign({}, existing || {}, form, {
      name: form.name.trim(),
      callName: form.callName.trim() || '你',
      relationship: form.relationship.trim(),
      likes: form.likes.trim(),
      forbidden: form.forbidden.trim(),
      appearance: Object.assign(
        appearance.appearanceForOutfit(currentAppearance.outfitId, form.avatarStyle, {
          bodyId: currentAppearance.bodyId,
          hairId: currentAppearance.hairId,
          skinTone: currentAppearance.skinTone,
          hairTone: currentAppearance.hairTone,
          bodyPaletteOverrides: currentAppearance.bodyPaletteOverrides,
          hairPaletteOverrides: currentAppearance.hairPaletteOverrides
        }),
        { updatedAt: Date.now() }
      ),
      createdAt: existing && this.data.mode !== 'new' ? existing.createdAt : Date.now()
    }))

    const extracted = this.data.extractedCanon.length ? this.data.extractedCanon : persona.extractCanonCandidates(form.rawProfile)
    storage.initializeCanon(character, extracted)
    storage.saveCharacterVersion(character, this.data.mode === 'new' ? '初次锁定角色原典' : '主人更新了角色原典')
    storage.setCharacterState({
      mood: 'waiting',
      currentActivity: '在像素小屋里整理刚刚锁定的原典',
      scene: 'canon_awake',
      basedOn: '主人确认的角色原典'
    })
    wx.showToast({ title: character.name + ' 入住啦', icon: 'success' })
    setTimeout(function () {
      wx.redirectTo({ url: '/pages/room/index?welcome=1' })
    }, 450)
  }
})
