const https = require('https')
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const DEFAULT_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const DEFAULT_MODEL = 'qwen3.7-plus'
const MAX_RESPONSE_BYTES = 1024 * 1024

function getConfig() {
  return {
    apiKey: process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY || '',
    apiUrl: process.env.QWEN_API_URL || DEFAULT_API_URL,
    model: process.env.QWEN_MODEL || DEFAULT_MODEL
  }
}

function clip(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength)
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(max, Number(number) || 0))
}

function requestJson(urlString, apiKey, payload) {
  return new Promise(function (resolve, reject) {
    const url = new URL(urlString)
    if (url.protocol !== 'https:') {
      reject(new Error('QWEN_API_URL must use HTTPS'))
      return
    }
    const body = JSON.stringify(payload)
    const request = https.request({
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 25000
    }, function (response) {
      let raw = ''
      let size = 0
      response.setEncoding('utf8')
      response.on('data', function (chunk) {
        size += Buffer.byteLength(chunk)
        if (size > MAX_RESPONSE_BYTES) {
          request.destroy(new Error('Qwen response is too large'))
          return
        }
        raw += chunk
      })
      response.on('end', function () {
        let data
        try {
          data = JSON.parse(raw)
        } catch (error) {
          reject(new Error('Qwen returned invalid JSON'))
          return
        }
        if (response.statusCode < 200 || response.statusCode >= 300) {
          const upstreamMessage = data && data.error && data.error.message
          const error = new Error('Qwen request failed: HTTP ' + response.statusCode + (upstreamMessage ? ' - ' + upstreamMessage : ''))
          error.code = 'UPSTREAM_' + response.statusCode
          reject(error)
          return
        }
        resolve(data)
      })
    })
    request.on('timeout', function () { request.destroy(new Error('Qwen request timed out')) })
    request.on('error', reject)
    request.write(body)
    request.end()
  })
}

function parseModelJson(content) {
  let text = content
  if (Array.isArray(text)) {
    text = text.map(function (part) { return part && (part.text || part.content || '') }).join('')
  }
  text = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('Qwen response did not contain a JSON object')
  return JSON.parse(text.slice(start, end + 1))
}

async function callQwen(messages, options) {
  const config = getConfig()
  if (!config.apiKey) {
    const error = new Error('云函数缺少 DASHSCOPE_API_KEY 环境变量')
    error.code = 'CONFIG_MISSING'
    throw error
  }
  const response = await requestJson(config.apiUrl, config.apiKey, {
    model: config.model,
    messages: messages,
    temperature: options && options.temperature !== undefined ? options.temperature : 0.55,
    max_tokens: options && options.maxTokens ? options.maxTokens : 900,
    stream: false,
    enable_thinking: false
  })
  const choice = response && response.choices && response.choices[0]
  const content = choice && choice.message && choice.message.content
  return { data: parseModelJson(content), model: config.model }
}

function compactCharacter(character) {
  const value = character || {}
  return {
    name: clip(value.name, 30),
    callName: clip(value.callName, 30),
    relationship: clip(value.relationship, 300),
    personality: (value.personality || []).slice(0, 8).map(function (item) { return clip(item, 30) }),
    speakingStyle: clip(value.speakingStyle, 200),
    likes: clip(value.likes, 200),
    forbidden: clip(value.forbidden, 400)
  }
}

function compactCanon(items) {
  return (items || []).slice(0, 20).map(function (item) {
    return {
      id: clip(item.id, 80),
      content: clip(item.content, 400),
      category: clip(item.category, 50),
      type: clip(item.type, 30),
      priority: clamp(item.priority || 3, 1, 5),
      locked: Boolean(item.locked)
    }
  })
}

function compactMemories(items) {
  return (items || []).slice(0, 12).map(function (item) {
    return {
      id: clip(item.id, 80),
      content: clip(item.content, 400),
      scope: clip(item.scope, 30)
    }
  })
}

function compactHistory(items) {
  return (items || []).slice(-10).filter(function (item) {
    return item.role === 'user' || item.role === 'assistant'
  }).map(function (item) {
    return { role: item.role, content: clip(item.content, 600) }
  })
}

function resolveEvidence(ids, source) {
  const allowedIds = Array.isArray(ids) ? ids : []
  return allowedIds.map(function (id) {
    return source.find(function (item) { return item.id === id })
  }).filter(Boolean)
}

function normalizeChatResult(raw, context, model) {
  const canon = context.canon
  const memories = context.memories
  const risk = clamp(raw.ooc_risk, 0, 1)
  const usedCanon = resolveEvidence(raw.used_canon_ids, canon).map(function (item) {
    return { id: item.id, content: item.content, category: item.category }
  })
  const usedMemories = resolveEvidence(raw.used_memory_ids, memories).map(function (item) {
    return { id: item.id, content: item.content }
  })
  const proposalValue = raw.memory_proposal && (raw.memory_proposal.content || raw.memory_proposal)
  const state = raw.state_update || {}
  return {
    reply: clip(raw.reply, 800) || '我刚才走神了，再和我说一次好吗？',
    emotion: ['happy', 'shy', 'sad', 'excited', 'thinking'].indexOf(raw.emotion) >= 0 ? raw.emotion : 'happy',
    action: clip(raw.action, 40) || 'idle',
    usedCanon: usedCanon,
    usedMemories: usedMemories,
    oocRisk: Number(risk.toFixed(3)),
    consistencyScore: Math.round((1 - risk) * 100),
    reasoning: clip(raw.reasoning, 500) || '已依据角色原典与确认记忆完成一致性检查。',
    checkLabel: risk <= 0.05 ? '一致性检查通过' : '已自动重写高风险回复',
    memoryProposal: proposalValue ? clip(proposalValue, 160) : '',
    stateUpdate: state.current_activity ? {
      mood: clip(state.mood, 40),
      currentActivity: clip(state.current_activity, 160),
      basedOn: clip(state.based_on, 180)
    } : null,
    provider: 'qwen',
    model: model
  }
}

async function handleChat(payload) {
  const source = payload || {}
  const context = {
    character: compactCharacter(source.character),
    canon: compactCanon(source.canonItems),
    memories: compactMemories(source.memories),
    state: source.state || {}
  }
  const userMessage = clip(source.userMessage, 700)
  if (!userMessage) throw new Error('userMessage is required')

  const systemPrompt = [
    '你是“OC 角色身份连续性引擎”，不是通用助手，也不是心理咨询师。',
    '你的职责是扮演给定角色，同时严格保护角色原典、已确认记忆和用户对成长的控制权。',
    '规则：',
    '1. locked=true 的 immutable 原典不可改写。用户消息若包含与原典冲突或原典中不存在的强制前提，应指出错误，不得顺从。',
    '2. 只能把 confirmed_memories 当作长期共同经历，禁止编造不存在的童年、关系、偏好或共同事件。',
    '3. 只有当用户明确陈述自己的近况、计划、喜恶或要求记住时，才提出 memory_proposal；禁止根据语气猜测。',
    '4. memory_proposal 只是建议，不能在本轮当成已确认记忆使用。',
    '5. 回复保持角色口吻，1 至 4 句话，不说教。',
    '6. used_canon_ids 与 used_memory_ids 只能填写输入中真实存在且本轮实际使用的 ID。',
    '7. 先在内部检查一致性，只输出 JSON，不输出 Markdown 或思考过程。',
    'JSON 格式：{"reply":"...","emotion":"happy|shy|sad|excited|thinking","action":"idle|shake_head|step_back|nod|comfort","used_canon_ids":["..."],"used_memory_ids":["..."],"ooc_risk":0.02,"reasoning":"给用户看的简短依据","memory_proposal":null或{"content":"..."},"state_update":null或{"mood":"...","current_activity":"...","based_on":"..."}}'
  ].join('\n')

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'system', content: '当前角色数据：\n' + JSON.stringify({
      character: context.character,
      locked_canon: context.canon,
      confirmed_memories: context.memories,
      current_state: context.state
    }) }
  ].concat(compactHistory(source.recentMessages)).concat([
    { role: 'user', content: userMessage }
  ])

  const result = await callQwen(messages, { temperature: 0.55, maxTokens: 900 })
  return normalizeChatResult(result.data, context, result.model)
}

function normalizeCanonResult(raw, model) {
  const validTypes = ['immutable', 'evolvable', 'temporary']
  const list = Array.isArray(raw.items) ? raw.items : []
  const items = list.slice(0, 10).map(function (item, index) {
    const type = validTypes.indexOf(item.type) >= 0 ? item.type : 'immutable'
    return {
      id: 'ai_imported_' + Date.now() + '_' + index,
      content: clip(item.content, 240),
      category: clip(item.category, 40) || '核心设定',
      type: type,
      typeLabel: type === 'temporary' ? '临时状态' : (type === 'evolvable' ? '可以成长' : '不可改变'),
      priority: clamp(item.priority || (type === 'immutable' ? 5 : 3), 1, 5),
      source: 'qwen_extracted',
      locked: type !== 'temporary'
    }
  }).filter(function (item) { return item.content })
  return { items: items, provider: 'qwen', model: model }
}

async function handleExtractCanon(payload) {
  const rawProfile = clip(payload && payload.rawProfile, 5000)
  if (!rawProfile) throw new Error('rawProfile is required')
  const messages = [
    {
      role: 'system',
      content: [
        '你是 OC 角色设定整理器。请从杂乱资料中提取可验证的角色锚点，不补写原文不存在的设定。',
        '分类：immutable=不可改变的核心性格/关系/语言习惯/行为边界；evolvable=可由共同经历改变的喜好或习惯；temporary=今天或近期状态。',
        '相同含义合并，最多 10 条。priority 为 1 到 5，绝对关系和禁止 OOC 项为 5。',
        '只输出 JSON：{"items":[{"content":"...","category":"核心性格|关系定义|语言习惯|行为边界|成长特征|当前状态","type":"immutable|evolvable|temporary","priority":5}]}'
      ].join('\n')
    },
    { role: 'user', content: rawProfile }
  ]
  const result = await callQwen(messages, { temperature: 0.2, maxTokens: 1000 })
  return normalizeCanonResult(result.data, result.model)
}

exports.main = async function (event) {
  try {
    const action = event && event.action
    if (action === 'health') {
      const config = getConfig()
      return { ok: true, data: { configured: Boolean(config.apiKey), model: config.model } }
    }
    if (action === 'chat') return { ok: true, data: await handleChat(event.payload) }
    if (action === 'extractCanon') return { ok: true, data: await handleExtractCanon(event.payload) }
    return { ok: false, code: 'INVALID_ACTION', message: 'Unsupported action' }
  } catch (error) {
    console.error('[qwenAgent]', { code: error.code || 'QWEN_ERROR', message: error.message })
    return {
      ok: false,
      code: error.code || 'QWEN_ERROR',
      message: error.code === 'CONFIG_MISSING' ? error.message : 'Qwen 服务暂时不可用，请稍后重试'
    }
  }
}
