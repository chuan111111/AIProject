const storage = require('../../utils/storage')

Page({
  data: {
    character: {},
    immutableItems: [],
    evolvableItems: [],
    temporaryItems: [],
    pendingProposals: [],
    approvedMemories: [],
    consistencyScore: 98,
    versionCount: 1,
    newCanon: '',
    editingProposalId: '',
    proposalDraft: ''
  },

  onShow: function () {
    const character = storage.getCharacter()
    if (!character) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    const items = storage.getCanonItems()
    const approvedMemories = storage.getMemories()
    this.setData({
      character: character,
      immutableItems: items.filter(function (item) { return item.type === 'immutable' }),
      evolvableItems: items.filter(function (item) { return item.type === 'evolvable' }),
      temporaryItems: items.filter(function (item) { return item.type === 'temporary' }),
      pendingProposals: storage.getPendingMemoryProposals(),
      approvedMemories: approvedMemories,
      consistencyScore: storage.getConsistencyScore(),
      versionCount: Math.max(storage.getCharacterVersions().length, 1)
    })
    wx.setNavigationBarTitle({ title: character.name + ' 的角色原典' })
  },

  handleCanonInput: function (event) {
    this.setData({ newCanon: event.detail.value })
  },

  addCanon: function () {
    const content = this.data.newCanon.trim()
    if (!content) return
    storage.addCanonItem(content, { category: '主人补充', type: 'immutable', source: 'manual' })
    storage.saveCharacterVersion(storage.getCharacter(), '主人补充并锁定新原典')
    this.setData({ newCanon: '' })
    this.onShow()
    wx.showToast({ title: '新原典已锁定', icon: 'success' })
  },

  decideProposal: function (event) {
    const id = event.currentTarget.dataset.id
    const action = event.currentTarget.dataset.action
    if (action === 'edit') {
      const proposal = this.data.pendingProposals.find(function (item) { return item.id === id })
      this.setData({ editingProposalId: id, proposalDraft: proposal ? proposal.content : '' })
      return
    }
    storage.decideMemoryProposal(id, action)
    this.onShow()
    wx.showToast({ title: action === 'rejected' ? '没有记住' : '已按你的决定保存', icon: 'none' })
  },

  handleProposalInput: function (event) {
    this.setData({ proposalDraft: event.detail.value })
  },

  saveEditedProposal: function () {
    storage.decideMemoryProposal(this.data.editingProposalId, 'approved', this.data.proposalDraft)
    this.setData({ editingProposalId: '', proposalDraft: '' })
    this.onShow()
    wx.showToast({ title: '修改后已记住', icon: 'success' })
  },

  runIdentityTest: function () {
    storage.setChatDraft('你不是最喜欢在人多的地方唱歌吗？')
    wx.navigateTo({ url: '/pages/chat/index?autotest=1' })
  },

  editProfile: function () {
    wx.navigateTo({ url: '/pages/create/index?mode=edit' })
  }
})
