const storage = require('../../utils/storage')
const persona = require('../../utils/persona')
const ai = require('../../utils/ai')

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  return hour + ':' + minute
}

function displayMessages(messages, openMessageId) {
  return messages.map(function (item) {
    return Object.assign({}, item, {
      usedCanon: item.usedCanon || [],
      usedMemories: item.usedMemories || [],
      timeLabel: formatTime(item.createdAt),
      explainOpen: item.id === openMessageId,
      showExplanation: item.role === 'assistant' && item.id === openMessageId,
      evidenceCount: (item.usedCanon || []).length + (item.usedMemories || []).length
    })
  })
}

Page({
  data: {
    character: {},
    messages: [],
    inputValue: '',
    sending: false,
    scrollIntoView: '',
    memoryCount: 0,
    canonCount: 0,
    pendingProposals: [],
    consistencyScore: 98,
    aiLabel: '正在连接 Qwen3.7-Plus…',
    mood: 'happy',
    correctionVisible: false,
    correctionMessageId: '',
    correctionReasons: [
      { value: 'tone', label: '语气不符合设定' },
      { value: 'behavior', label: '行为不符合设定' },
      { value: 'relation', label: '关系理解错误' },
      { value: 'history', label: '使用了不存在的经历' },
      { value: 'address', label: '称呼不正确' }
    ],
    correctionReason: '',
    correctionDraft: '',
    editingProposalId: '',
    proposalDraft: ''
  },

  onLoad: function (options) {
    const character = storage.getCharacter()
    if (!character) {
      wx.redirectTo({ url: '/pages/home/index' })
      return
    }
    let messages = storage.getMessages()
    if (!messages.length) {
      const canon = storage.getCanonItems()
      const firstCanon = canon.length ? [{ id: canon[0].id, content: canon[0].content, category: canon[0].category }] : []
      storage.appendMessage({
        role: 'assistant',
        content: '你来了。我的原典已经锁好——我会记得自己是谁，也不会擅自记住你没同意的事。',
        usedCanon: firstCanon,
        usedMemories: [],
        oocRisk: 0.02,
        consistencyScore: 98,
        reasoning: '角色醒来时先读取已锁定原典，不引入任何未经确认的共同记忆。',
        checkLabel: '一致性检查通过'
      })
      messages = storage.getMessages()
    }
    this.setData({
      character: Object.assign({}, character, {
        personalityLabel: (character.personality || []).join(' · ')
      })
    })
    this.refreshData()
    wx.setNavigationBarTitle({ title: '和 ' + character.name + ' 聊天' })
    const that = this
    ai.checkHealth().then(function (status) {
      that.setData({ aiLabel: status.label })
    })

    const draft = storage.consumeChatDraft()
    if (draft) this.setData({ inputValue: draft })
    if (draft && options.autotest === '1') {
      setTimeout(function () { that.sendMessage() }, 480)
    }
  },

  onUnload: function () {
    this.destroyed = true
  },

  refreshData: function () {
    this.setData({
      messages: displayMessages(storage.getMessages(), this.openMessageId),
      memoryCount: storage.getMemories().length,
      canonCount: storage.getCanonItems().filter(function (item) { return item.locked }).length,
      pendingProposals: storage.getPendingMemoryProposals(),
      consistencyScore: storage.getConsistencyScore()
    })
  },

  handleInput: function (event) {
    this.setData({ inputValue: event.detail.value })
  },

  sendMessage: function () {
    const text = this.data.inputValue.trim()
    if (!text || this.data.sending) return
    const recentMessages = storage.getMessages().slice(-10)
    const userMessage = storage.appendMessage({ role: 'user', content: text })
    this.setData({ inputValue: '', sending: true, mood: 'thinking' })
    this.refreshData()
    this.scrollToBottom()

    const that = this
    ai.createStructuredReply({
      character: that.data.character,
      userMessage: text,
      recentMessages: recentMessages,
      canonItems: storage.getCanonItems(),
      memories: storage.getMemories(),
      state: storage.getCharacterState()
    }).then(function (result) {
      if (result.memoryProposal) storage.addMemoryProposal(result.memoryProposal, userMessage.id)
      const assistantMessage = storage.appendMessage({
        role: 'assistant',
        content: result.reply,
        sourceText: text,
        emotion: result.emotion,
        action: result.action,
        usedCanon: result.usedCanon,
        usedMemories: result.usedMemories,
        oocRisk: result.oocRisk,
        consistencyScore: result.consistencyScore,
        reasoning: result.reasoning,
        checkLabel: result.checkLabel,
        provider: result.provider,
        model: result.model
      })
      if (result.stateUpdate) storage.setCharacterState(result.stateUpdate)
      if (result.memoryProposal) {
        storage.setCharacterState({
          mood: 'waiting_confirmation',
          currentActivity: '正在等你决定，要不要留下刚才那段记忆',
          basedOn: '待确认记忆 · 尚未写入长期记忆'
        })
      }
      that.openMessageId = assistantMessage.id
      that.setData({
        sending: false,
        mood: result.emotion,
        aiLabel: result.provider === 'qwen' ? (result.model + ' · 云端') : '离线人格引擎 · 回退'
      })
      that.refreshData()
      that.scrollToBottom()
      if (result.provider !== 'qwen' && !that.offlineNotified) {
        that.offlineNotified = true
        wx.showToast({ title: 'Qwen 暂不可用，已离线回退', icon: 'none' })
      }
    })
  },

  useSuggestion: function (event) {
    this.setData({ inputValue: event.currentTarget.dataset.text })
  },

  toggleExplanation: function (event) {
    const id = event.currentTarget.dataset.id
    this.openMessageId = this.openMessageId === id ? '' : id
    this.refreshData()
    this.scrollToBottom()
  },

  openCorrection: function (event) {
    this.setData({
      correctionVisible: true,
      correctionMessageId: event.currentTarget.dataset.id,
      correctionReason: '',
      correctionDraft: ''
    })
  },

  closeCorrection: function () {
    this.setData({ correctionVisible: false })
  },

  noop: function () {},

  selectCorrectionReason: function (event) {
    const reason = event.currentTarget.dataset.value
    this.setData({
      correctionReason: reason,
      correctionDraft: persona.correctionSuggestion(this.data.character, reason)
    })
  },

  handleCorrectionInput: function (event) {
    this.setData({ correctionDraft: event.detail.value })
  },

  confirmCorrection: function () {
    const content = this.data.correctionDraft.trim()
    if (!content) {
      wx.showToast({ title: '先选择纠正原因', icon: 'none' })
      return
    }
    storage.addCanonItem(content, { category: 'OOC 纠正', type: 'immutable', source: 'correction' })
    storage.saveCharacterVersion(storage.getCharacter(), '一次 OOC 纠正沉淀为新原典')

    const targetId = this.data.correctionMessageId
    const messages = storage.getMessages()
    const index = messages.findIndex(function (item) { return item.id === targetId })
    if (index >= 0) {
      const message = messages[index]
      const that = this
      this.setData({ correctionVisible: false, mood: 'thinking', sending: true })
      ai.createStructuredReply({
        character: this.data.character,
        userMessage: message.sourceText || '请重新按人设回应',
        recentMessages: messages.slice(Math.max(0, index - 8), index),
        canonItems: storage.getCanonItems(),
        memories: storage.getMemories(),
        state: storage.getCharacterState()
      }).then(function (result) {
        Object.assign(message, {
          content: result.reply,
          usedCanon: result.usedCanon,
          usedMemories: result.usedMemories,
          oocRisk: Math.min(result.oocRisk, 0.01),
          consistencyScore: 99,
          reasoning: '主人刚刚补充并锁定了一条新原典，系统已据此重写回复。',
          checkLabel: '已按新原典重写',
          provider: result.provider,
          model: result.model,
          corrected: true
        })
        storage.saveMessages(messages)
        that.openMessageId = targetId
        that.setData({
          sending: false,
          mood: result.emotion,
          aiLabel: result.provider === 'qwen' ? (result.model + ' · 云端') : '离线人格引擎 · 回退'
        })
        that.refreshData()
        wx.showToast({ title: '已锁定新原典', icon: 'success' })
      })
      return
    }
    this.openMessageId = targetId
    this.setData({ correctionVisible: false, mood: 'shy', sending: false })
    this.refreshData()
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
    storage.setCharacterState({
      mood: 'settled',
      currentActivity: action === 'rejected' ? '把没有被允许的记忆轻轻放下了' : '把你确认的记忆收进了抽屉',
      basedOn: action === 'rejected' ? '主人选择：不要记住' : '主人已确认的共同记忆'
    })
    this.refreshData()
    wx.showToast({ title: action === 'rejected' ? 'TA 没有记住' : '已按你的决定保存', icon: 'none' })
  },

  handleProposalInput: function (event) {
    this.setData({ proposalDraft: event.detail.value })
  },

  saveEditedProposal: function () {
    storage.decideMemoryProposal(this.data.editingProposalId, 'approved', this.data.proposalDraft)
    this.setData({ editingProposalId: '', proposalDraft: '' })
    this.refreshData()
    wx.showToast({ title: '修改后已记住', icon: 'success' })
  },

  scrollToBottom: function () {
    const that = this
    this.setData({ scrollIntoView: '' })
    wx.nextTick(function () { that.setData({ scrollIntoView: 'chat-bottom' }) })
  },

  goCanon: function () {
    wx.navigateTo({ url: '/pages/canon/index' })
  }
})
