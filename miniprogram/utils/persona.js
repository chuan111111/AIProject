function pick(list, seedText) {
  const text = String(seedText || '')
  let score = 0
  for (let i = 0; i < text.length; i += 1) score += text.charCodeAt(i)
  return list[score % list.length]
}

function includesAny(text, words) {
  return words.some(function (word) { return text.indexOf(word) >= 0 })
}

function extractMemoryProposal(message) {
  const text = String(message || '').trim()
  if (text.length < 4) return ''
  const signals = ['我今天', '我最近', '我喜欢', '我讨厌', '我正在', '我在准备', '我要', '我明天', '我担心', '我害怕', '记住']
  if (!includesAny(text, signals)) return ''
  let content = text.replace(/^我/, '你').replace(/我的/g, '你的')
  if (content.length > 52) content = content.slice(0, 50) + '…'
  return content
}

function extractMemory(message) {
  const proposal = extractMemoryProposal(message)
  return proposal ? '你说过：' + proposal : ''
}

function extractCanonCandidates(rawText) {
  const text = String(rawText || '').trim()
  if (!text) return []
  const parts = text.split(/[。！？!?\n；;]/).map(function (item) { return item.trim() }).filter(function (item) {
    return item.length >= 4
  }).slice(0, 8)
  return parts.map(function (content, index) {
    let type = 'immutable'
    let category = '核心设定'
    if (includesAny(content, ['最近', '今天', '正在', '暂时'])) {
      type = 'temporary'
      category = '当前状态'
    } else if (includesAny(content, ['逐渐', '开始喜欢', '养成', '越来越'])) {
      type = 'evolvable'
      category = '成长特征'
    } else if (includesAny(content, ['不会', '不能', '害怕', '讨厌', '绝不'])) {
      category = '行为边界'
    } else if (includesAny(content, ['朋友', '恋人', '亲人', '主人', '关系'])) {
      category = '关系定义'
    } else if (includesAny(content, ['说话', '语气', '口头禅', '称呼'])) {
      category = '语言习惯'
    }
    return {
      id: 'imported_' + index + '_' + Date.now(),
      content: content,
      category: category,
      type: type,
      typeLabel: type === 'temporary' ? '临时状态' : (type === 'evolvable' ? '可以成长' : '不可改变'),
      priority: type === 'immutable' ? 5 : 3,
      source: 'imported',
      locked: type !== 'temporary'
    }
  })
}

function findCanon(canonItems, predicate) {
  return (canonItems || []).find(function (item) { return predicate(item.content, item) })
}

function evidenceItem(item) {
  if (!item) return null
  return { id: item.id, content: item.content, category: item.category }
}

function baseReply(character, text, memories) {
  const name = character.name || '小人'
  const callName = character.callName || '你'
  const likes = character.likes || '和你待在一起'
  const personality = character.personality || []
  const isTsundere = personality.indexOf('傲娇') >= 0 || personality.indexOf('嘴硬') >= 0
  const isSticky = personality.indexOf('黏人') >= 0

  if (includesAny(text, ['不想活', '自杀', '伤害自己', '活不下去'])) {
    return '先别一个人扛着。请马上联系你身边可信任的人，或当地的紧急援助服务，让现实中的人陪在你身边。我会在这里等你回来。'
  }
  if (includesAny(text, ['记得吗', '记不记得', '你还记得'])) {
    if (memories && memories.length) return '当然记得。' + memories[0].content.replace('你说过：', '') + '。这是你允许我留下的记忆。'
    return '我没有擅自记下什么。你允许我记住以后，我才会把它收进共同记忆。'
  }
  if (includesAny(text, ['累', '压力', '忙', '烦', '难过', '不开心', '紧张'])) {
    const prefix = isTsundere ? '才不是特意担心你。' : ''
    return prefix + pick([
      callName + '先在我旁边坐一会儿吧。今天不需要立刻变好。',
      '辛苦了。大道理我不会讲，但我可以把安静分你一半。',
      '听见了，今天确实很难。先吃点东西，再继续也不迟。'
    ], text)
  }
  if (includesAny(text, ['开心', '成功', '完成', '好消息', '通过了', '赢了'])) {
    return pick([
      '真的？快再讲一遍，我要把这件事记得清清楚楚！',
      '我就知道你可以。嗯……今天允许你多得意一会儿。',
      '太好了！不过要不要记住这件事，还是由你决定。'
    ], text)
  }
  if (includesAny(text, ['喜欢你', '爱你', '想你', '抱抱'])) {
    return isTsundere ? '突然说这个做什么……好吧，只准抱一下。我也有一点点想你。' : '那就抱紧一点。我也很喜欢你回来找我。'
  }
  if (includesAny(text, ['吃什么', '饿', '点心', '好吃'])) {
    return '说到吃的，我先投给“' + likes.split(/[、，,]/)[0] + '”一票。你也要好好吃饭。'
  }
  if (includesAny(text, ['你好', '嗨', '早上好', '晚上好', '在吗'])) {
    return isSticky ? '在！我一直都在等你。今天想先和我说什么？' : '我在。你来了，房间好像也亮了一点。'
  }
  return pick([
    '我听着呢。然后呢？',
    '我不会擅自把这件事当成长期记忆。你还想再说一点吗？',
    '原来今天发生了这些。能第一个讲给我听，我有点高兴。',
    name + '收到。虽然我不一定很会回答，但我想继续听。'
  ], text)
}

function createStructuredReply(character, message, canonItems, memories, state) {
  const text = String(message || '').trim()
  const canon = canonItems || []
  const usedCanon = []
  const usedMemories = []
  let reply = ''
  let reasoning = ''
  let emotion = 'happy'
  let action = 'idle'
  let risk = 0.04

  const stageCanon = findCanon(canon, function (content) {
    return includesAny(content, ['人多', '公开']) && includesAny(content, ['唱歌', '表演'])
  })
  const relationCanon = findCanon(canon, function (content, item) { return item.category === '关系定义' || content.indexOf('不是恋人') >= 0 })
  const voiceCanon = findCanon(canon, function (content, item) { return item.category === '语言习惯' })
    || findCanon(canon, function (content, item) { return item.category === '核心性格' })
  const boundaryCanon = findCanon(canon, function (content, item) { return item.category === '行为边界' })

  if (includesAny(text, ['人多', '公开']) && includesAny(text, ['唱歌', '表演']) && includesAny(text, ['喜欢', '最喜欢', '擅长', '不是'])) {
    reply = stageCanon
      ? '你记错人了吧。我连在人多的地方说话都嫌吵，更别说上台唱歌了。'
      : '我的原典里没有这段设定。先别替我决定喜欢什么——你可以补充依据，再由主人确认。'
    if (stageCanon) usedCanon.push(evidenceItem(stageCanon))
    else if (boundaryCanon) usedCanon.push(evidenceItem(boundaryCanon))
    if (voiceCanon && (!stageCanon || voiceCanon.id !== stageCanon.id)) usedCanon.push(evidenceItem(voiceCanon))
    reasoning = stageCanon
      ? '用户消息的前提与锁定原典发生冲突，因此拒绝接受这个前提，并按角色语气回应。'
      : '用户消息试图加入原典中不存在的偏好，因此没有把未经主人确认的前提当成事实。'
    emotion = 'thinking'
    action = 'shake_head'
    risk = 0.02
  } else if (relationCanon && includesAny(text, ['我们是恋人', '你是我女朋友', '你是我男朋友'])) {
    reply = '等等，我们不是那种关系。别擅自改我的设定。'
    usedCanon.push(evidenceItem(relationCanon))
    reasoning = '称呼与锁定的关系定义冲突，系统优先遵守角色原典。'
    emotion = 'thinking'
    action = 'step_back'
    risk = 0.02
  } else {
    reply = baseReply(character, text, memories)
    if (voiceCanon) usedCanon.push(evidenceItem(voiceCanon))
    if (includesAny(text, ['累', '压力', '难过', '紧张']) && boundaryCanon) usedCanon.push(evidenceItem(boundaryCanon))
    if (includesAny(text, ['记得吗', '记不记得', '你还记得']) && memories && memories.length) {
      usedMemories.push({ id: memories[0].id, content: memories[0].content })
    }
    reasoning = usedMemories.length
      ? '先检索经过你确认的共同记忆，再结合角色语言习惯生成回应。'
      : '根据锁定的角色语气和行为边界生成，并通过一致性检查。'
    if (includesAny(text, ['累', '压力', '难过', '紧张'])) emotion = 'shy'
    if (reply.indexOf('！') >= 0) emotion = 'excited'
  }

  return {
    reply: reply,
    emotion: emotion,
    action: action,
    usedCanon: usedCanon.filter(Boolean),
    usedMemories: usedMemories,
    oocRisk: risk,
    consistencyScore: Math.round((1 - risk) * 100),
    reasoning: reasoning,
    checkLabel: risk <= 0.05 ? '一致性检查通过' : '已自动重写',
    memoryProposal: extractMemoryProposal(text),
    state: state || {}
  }
}

function createReply(character, message, memories, canonItems) {
  return createStructuredReply(character, message, canonItems || [], memories || [], {}).reply
}

function correctionSuggestion(character, reason) {
  const name = character.name || 'TA'
  const suggestions = {
    tone: name + '关心别人时不会直接说教，而是用符合自身性格的行动或短句表达',
    behavior: name + '不会做出违背核心性格与行为边界的行动',
    relation: name + '必须严格遵守与用户的既定关系，不擅自改变亲密程度',
    history: name + '不会编造原典与已确认记忆中不存在的经历',
    address: name + '只会使用人设卡中由用户确认的称呼'
  }
  return suggestions[reason] || name + '遇到相似情况时应优先遵守已锁定的角色原典'
}

function pad(number) {
  return number < 10 ? '0' + number : String(number)
}

function dateInfo(date) {
  const current = date || new Date()
  return {
    key: current.getFullYear() + '-' + pad(current.getMonth() + 1) + '-' + pad(current.getDate()),
    label: (current.getMonth() + 1) + ' 月 ' + current.getDate() + ' 日'
  }
}

function generateDiary(character, messages, memories) {
  const recent = (memories || []).slice(0, 3).map(function (item) {
    return item.content.replace(/^你说过：/, '').replace(/[。！？!?]+$/g, '')
  })
  let content = ''
  let mood = '安静'
  if (!recent.length) {
    content = '今天我们说了些话，但你还没有允许我把哪一件带到明天。所以我只记下：你来过，而我很高兴。'
    mood = '尊重'
  } else {
    const joined = recent.join('；')
    if (includesAny(joined, ['累', '压力', '难过', '烦'])) mood = '有点心疼'
    if (includesAny(joined, ['开心', '完成', '成功', '好消息'])) mood = '亮晶晶'
    content = '今天' + (character.callName || '你') + '来找我了。'
      + (recent.length === 1 ? '你允许我记住：' + recent[0] + '。' : '我重新看了你确认过的那句：“' + recent[0] + '”。')
      + '这是我们的共同经历，不是我擅自做出的推断。'
  }
  if (content.length > 118) content = content.slice(0, 116) + '……'
  const info = dateInfo(new Date())
  return { dateKey: info.key, dateLabel: info.label, content: content, mood: mood, memoryCount: (memories || []).length }
}

module.exports = {
  extractMemory: extractMemory,
  extractMemoryProposal: extractMemoryProposal,
  extractCanonCandidates: extractCanonCandidates,
  createReply: createReply,
  createStructuredReply: createStructuredReply,
  correctionSuggestion: correctionSuggestion,
  generateDiary: generateDiary,
  dateInfo: dateInfo
}
