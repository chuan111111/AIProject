const KEYS = {
  character: 'oc_demo_character',
  messages: 'oc_demo_messages',
  memories: 'oc_demo_memories',
  memoryProposals: 'oc_demo_memory_proposals',
  canon: 'oc_demo_canon_items',
  characterState: 'oc_demo_character_state',
  characterVersions: 'oc_demo_character_versions',
  diaries: 'oc_demo_diaries',
  chatDraft: 'oc_demo_chat_draft',
  housemates: 'oc_demo_housemates',
  scene: 'oc_demo_scene'
}

function nowId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 10000)
}

function todayKey() {
  const date = new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
}

function typeLabel(type) {
  if (type === 'evolvable') return '可以成长'
  if (type === 'temporary') return '临时状态'
  return '不可改变'
}

function getCharacter() {
  return wx.getStorageSync(KEYS.character) || null
}

function saveCharacter(character) {
  const value = Object.assign({}, character, {
    id: character.id || nowId('char'),
    updatedAt: Date.now()
  })
  wx.setStorageSync(KEYS.character, value)
  return value
}

function getSceneId() {
  return wx.getStorageSync(KEYS.scene) || 'farm'
}

function saveSceneId(sceneId) {
  const value = String(sceneId || 'farm')
  wx.setStorageSync(KEYS.scene, value)
  return value
}

function makeCanonItem(content, options) {
  const config = options || {}
  const type = config.type || 'immutable'
  return {
    id: config.id || nowId('canon'),
    content: String(content || '').trim(),
    category: config.category || '核心设定',
    type: type,
    typeLabel: typeLabel(type),
    priority: config.priority || (type === 'immutable' ? 5 : 3),
    source: config.source || 'profile',
    locked: type !== 'temporary',
    createdAt: config.createdAt || Date.now()
  }
}

function defaultCanonItems(character) {
  const items = []
  if (!character) return items
  if (character.relationship) {
    items.push(makeCanonItem(character.name + '与用户的关系：' + character.relationship, {
      id: 'canon_relationship', category: '关系定义', priority: 5
    }))
  }
  if (character.personality && character.personality.length) {
    items.push(makeCanonItem('核心性格：' + character.personality.join('、'), {
      id: 'canon_personality', category: '核心性格', priority: 5
    }))
  }
  if (character.speakingStyle) {
    items.push(makeCanonItem('说话方式：' + character.speakingStyle, {
      id: 'canon_voice', category: '语言习惯', priority: 4
    }))
  }
  if (character.forbidden) {
    items.push(makeCanonItem('绝不会：' + character.forbidden, {
      id: 'canon_boundary', category: '行为边界', priority: 5
    }))
  }
  if (character.likes) {
    items.push(makeCanonItem('目前喜欢：' + character.likes, {
      id: 'canon_likes', category: '成长特征', type: 'evolvable', priority: 3
    }))
  }
  return items
}

function saveCanonItems(items) {
  const normalized = (items || []).filter(function (item) { return item.content }).map(function (item) {
    return makeCanonItem(item.content, item)
  })
  wx.setStorageSync(KEYS.canon, normalized)
  return normalized
}

function initializeCanon(character, extractedItems) {
  const current = wx.getStorageSync(KEYS.canon) || []
  const preserved = current.filter(function (item) {
    return item.source === 'correction' || item.source === 'manual'
  })
  const combined = defaultCanonItems(character).concat((extractedItems || []).map(function (item) {
    return makeCanonItem(item.content, Object.assign({}, item, { source: item.source || 'imported' }))
  })).concat(preserved)
  const seen = {}
  const unique = combined.filter(function (item) {
    if (!item.content || seen[item.content]) return false
    seen[item.content] = true
    return true
  })
  return saveCanonItems(unique)
}

function getCanonItems() {
  const items = wx.getStorageSync(KEYS.canon) || []
  if (items.length) return items
  const character = getCharacter()
  return character ? initializeCanon(character, []) : []
}

function addCanonItem(content, options) {
  const normalized = String(content || '').trim()
  if (!normalized) return null
  const items = getCanonItems()
  const duplicate = items.find(function (item) { return item.content === normalized })
  if (duplicate) return duplicate
  const item = makeCanonItem(normalized, Object.assign({ source: 'manual' }, options || {}))
  items.unshift(item)
  saveCanonItems(items)
  return item
}

function demoCharacter() {
  return {
    id: 'char_xiaomian',
    name: '小眠',
    callName: '你',
    relationship: '你亲手创造的小人，也是相识多年的朋友，不是恋人',
    personality: ['温柔', '嘴硬', '黏人'],
    speakingStyle: '短句，关心别人时会先吐槽再行动',
    likes: '草莓牛奶、晒太阳、安静地陪着你',
    forbidden: '不说教，不使用过度亲密的称呼，不编造不存在的共同经历',
    avatarStyle: 'berry-cream',
    rawProfile: '小眠是一个温柔但嘴硬的小人。她和用户是认识多年的朋友，不是恋人。她害怕在人多的地方表演，也不会主动唱歌。她关心别人时不会直说“我担心你”，而是用吐槽或行动表达。',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

function ensureDemoCharacter() {
  clearCharacterStory()
  const character = demoCharacter()
  wx.setStorageSync(KEYS.character, character)
  saveCanonItems([
    makeCanonItem('小眠和用户是相识多年的朋友，不是恋人', { id: 'canon_relation_demo', category: '关系定义' }),
    makeCanonItem('核心性格：温柔、嘴硬、黏人', { id: 'canon_personality_demo', category: '核心性格' }),
    makeCanonItem('关心别人时不会直接说“我担心你”，而是用吐槽或行动表达', { id: 'canon_care_demo', category: '语言习惯' }),
    makeCanonItem('害怕在人多的地方表演，也不会主动唱歌', { id: 'canon_stage_demo', category: '行为边界' }),
    makeCanonItem('不会像心理医生一样说教，也不会编造不存在的共同经历', { id: 'canon_boundary_demo', category: '行为边界' }),
    makeCanonItem('最近开始喜欢草莓牛奶', { id: 'canon_likes_demo', category: '成长特征', type: 'evolvable' })
  ])
  saveCharacterVersion(character, '初次锁定角色原典')
  setCharacterState({
    mood: 'waiting',
    currentActivity: '在窗边留了一盏灯，等你回来',
    scene: 'window_waiting',
    basedOn: '原典：关心别人时会用行动表达'
  })
  return character
}

function getHousemates() {
  return (wx.getStorageSync(KEYS.housemates) || []).slice(0, 2)
}

function inviteHousemate() {
  const presets = [
    {
      id: 'guest_lili',
      name: '栗栗',
      relationship: '来像素小屋串门的点心研究员',
      personality: ['活泼', '嘴硬'],
      speakingStyle: '短句，喜欢吐槽',
      likes: '焦糖饼干、收集贴纸',
      avatarStyle: 'berry-cream',
      guest: true
    },
    {
      id: 'guest_atuan',
      name: '阿团',
      relationship: '安静但可靠的小屋住户',
      personality: ['安静', '温柔'],
      speakingStyle: '慢慢说，偶尔接梗',
      likes: '薄荷茶、整理房间',
      avatarStyle: 'mint',
      guest: true
    }
  ]
  const housemates = getHousemates()
  const next = presets.find(function (item) {
    return !housemates.some(function (resident) { return resident.id === item.id })
  })
  if (!next) return housemates
  housemates.push(next)
  wx.setStorageSync(KEYS.housemates, housemates)
  return housemates
}

function getMessages() {
  return wx.getStorageSync(KEYS.messages) || []
}

function saveMessages(messages) {
  wx.setStorageSync(KEYS.messages, messages.slice(-80))
}

function appendMessage(message) {
  const messages = getMessages()
  const value = Object.assign({}, message, {
    id: message.id || nowId('msg'),
    createdAt: message.createdAt || Date.now()
  })
  messages.push(value)
  saveMessages(messages)
  return value
}

function getMemories() {
  let memories = wx.getStorageSync(KEYS.memories) || []
  const legacy = memories.filter(function (item) { return item.approvedByUser !== true })
  if (legacy.length) {
    const proposals = wx.getStorageSync(KEYS.memoryProposals) || []
    legacy.forEach(function (item) {
      const content = item.content.replace(/^你说过：/, '')
      const exists = proposals.some(function (proposal) { return proposal.content === content })
      if (!exists) proposals.unshift({
        id: nowId('proposal'),
        content: content,
        sourceMessageId: '',
        status: 'pending',
        createdAt: Date.now()
      })
    })
    memories = memories.filter(function (item) { return item.approvedByUser === true })
    wx.setStorageSync(KEYS.memories, memories)
    wx.setStorageSync(KEYS.memoryProposals, proposals.slice(0, 30))
  }
  const today = todayKey()
  return memories.filter(function (item) {
    return item.scope !== 'today' || item.dateKey === today
  })
}

function addMemory(content, options) {
  const normalized = String(content || '').trim()
  if (!normalized) return getMemories()
  const config = options || {}
  const memories = wx.getStorageSync(KEYS.memories) || []
  const duplicated = memories.some(function (item) { return item.content === normalized })
  if (!duplicated) {
    memories.unshift({
      id: nowId('mem'),
      content: normalized,
      scope: config.scope || 'permanent',
      dateKey: config.scope === 'today' ? todayKey() : '',
      approvedByUser: true,
      createdAt: Date.now()
    })
  }
  wx.setStorageSync(KEYS.memories, memories.slice(0, 20))
  return getMemories()
}

function getMemoryProposals() {
  return wx.getStorageSync(KEYS.memoryProposals) || []
}

function getPendingMemoryProposals() {
  return getMemoryProposals().filter(function (item) { return item.status === 'pending' })
}

function addMemoryProposal(content, sourceMessageId) {
  const normalized = String(content || '').trim()
  if (!normalized) return null
  const proposals = getMemoryProposals()
  const memories = getMemories()
  const duplicate = proposals.find(function (item) {
    return item.content === normalized && item.status === 'pending'
  }) || memories.find(function (item) { return item.content === normalized })
  if (duplicate) return null
  const proposal = {
    id: nowId('proposal'),
    content: normalized,
    sourceMessageId: sourceMessageId || '',
    status: 'pending',
    createdAt: Date.now()
  }
  proposals.unshift(proposal)
  wx.setStorageSync(KEYS.memoryProposals, proposals.slice(0, 30))
  return proposal
}

function decideMemoryProposal(id, decision, editedContent) {
  const proposals = getMemoryProposals()
  const index = proposals.findIndex(function (item) { return item.id === id })
  if (index < 0) return null
  const proposal = proposals[index]
  proposal.content = String(editedContent || proposal.content).trim()
  proposal.status = decision
  proposal.decidedAt = Date.now()
  if (decision === 'approved') addMemory(proposal.content, { scope: 'permanent' })
  if (decision === 'today') addMemory(proposal.content, { scope: 'today' })
  wx.setStorageSync(KEYS.memoryProposals, proposals)
  return proposal
}

function getCharacterState() {
  return wx.getStorageSync(KEYS.characterState) || {
    mood: 'waiting',
    currentActivity: '在房间里等你回来',
    scene: 'room_waiting',
    basedOn: '角色原典'
  }
}

function setCharacterState(state) {
  const value = Object.assign({}, getCharacterState(), state, { updatedAt: Date.now() })
  wx.setStorageSync(KEYS.characterState, value)
  return value
}

function getCharacterVersions() {
  return wx.getStorageSync(KEYS.characterVersions) || []
}

function saveCharacterVersion(snapshot, reason) {
  const versions = getCharacterVersions()
  versions.unshift({
    id: nowId('version'),
    version: versions.length + 1,
    snapshot: snapshot,
    changeReason: reason || '更新角色设定',
    createdAt: Date.now()
  })
  wx.setStorageSync(KEYS.characterVersions, versions.slice(0, 20))
  return versions[0]
}

function getConsistencyScore() {
  const results = getMessages().filter(function (item) {
    return item.role === 'assistant' && typeof item.oocRisk === 'number'
  })
  if (!results.length) return 98
  const total = results.reduce(function (sum, item) { return sum + (1 - item.oocRisk) * 100 }, 0)
  return Math.round(total / results.length)
}

function setChatDraft(text) {
  wx.setStorageSync(KEYS.chatDraft, text)
}

function consumeChatDraft() {
  const value = wx.getStorageSync(KEYS.chatDraft) || ''
  wx.removeStorageSync(KEYS.chatDraft)
  return value
}

function getDiaries() {
  return wx.getStorageSync(KEYS.diaries) || []
}

function saveDiary(diary) {
  const diaries = getDiaries()
  const nextDiary = Object.assign({}, diary, {
    id: diary.id || nowId('diary'),
    createdAt: diary.createdAt || Date.now()
  })
  const existedIndex = diaries.findIndex(function (item) { return item.dateKey === nextDiary.dateKey })
  if (existedIndex >= 0) diaries.splice(existedIndex, 1, nextDiary)
  else diaries.unshift(nextDiary)
  wx.setStorageSync(KEYS.diaries, diaries.slice(0, 30))
  return nextDiary
}

function clearCharacterStory() {
  wx.setStorageSync(KEYS.messages, [])
  wx.setStorageSync(KEYS.memories, [])
  wx.setStorageSync(KEYS.memoryProposals, [])
  wx.setStorageSync(KEYS.canon, [])
  wx.setStorageSync(KEYS.characterVersions, [])
  wx.setStorageSync(KEYS.diaries, [])
  wx.setStorageSync(KEYS.characterState, {})
  wx.setStorageSync(KEYS.housemates, [])
}

module.exports = {
  getCharacter: getCharacter,
  saveCharacter: saveCharacter,
  getSceneId: getSceneId,
  saveSceneId: saveSceneId,
  ensureDemoCharacter: ensureDemoCharacter,
  getHousemates: getHousemates,
  inviteHousemate: inviteHousemate,
  getMessages: getMessages,
  saveMessages: saveMessages,
  appendMessage: appendMessage,
  getMemories: getMemories,
  addMemory: addMemory,
  getMemoryProposals: getMemoryProposals,
  getPendingMemoryProposals: getPendingMemoryProposals,
  addMemoryProposal: addMemoryProposal,
  decideMemoryProposal: decideMemoryProposal,
  getCanonItems: getCanonItems,
  saveCanonItems: saveCanonItems,
  initializeCanon: initializeCanon,
  addCanonItem: addCanonItem,
  getCharacterState: getCharacterState,
  setCharacterState: setCharacterState,
  getCharacterVersions: getCharacterVersions,
  saveCharacterVersion: saveCharacterVersion,
  getConsistencyScore: getConsistencyScore,
  setChatDraft: setChatDraft,
  consumeChatDraft: consumeChatDraft,
  getDiaries: getDiaries,
  saveDiary: saveDiary,
  clearCharacterStory: clearCharacterStory
}
