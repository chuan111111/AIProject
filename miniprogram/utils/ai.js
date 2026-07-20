const persona = require('./persona')

const FUNCTION_NAME = 'qwenAgent'

function callCloud(action, payload) {
  return new Promise(function (resolve, reject) {
    if (!wx.cloud || !wx.cloud.callFunction) {
      reject(new Error('当前小程序尚未启用云开发'))
      return
    }
    wx.cloud.callFunction({
      name: FUNCTION_NAME,
      data: { action: action, payload: payload || {} },
      success: function (response) {
        const result = response && response.result
        if (!result || !result.ok) {
          const error = new Error(result && result.message ? result.message : 'Qwen 云函数调用失败')
          error.code = result && result.code ? result.code : 'CLOUD_RESULT_ERROR'
          reject(error)
          return
        }
        resolve(result.data)
      },
      fail: reject
    })
  })
}

function offlineReply(input, reason) {
  const result = persona.createStructuredReply(
    input.character,
    input.userMessage,
    input.canonItems,
    input.memories,
    input.state
  )
  return Object.assign({}, result, {
    provider: 'offline',
    model: '离线人格引擎',
    fallbackReason: reason && reason.message ? reason.message : '云端模型不可用'
  })
}

function createStructuredReply(input) {
  return callCloud('chat', {
    character: input.character,
    userMessage: input.userMessage,
    recentMessages: input.recentMessages,
    canonItems: input.canonItems,
    memories: input.memories,
    state: input.state
  }).catch(function (error) {
    return offlineReply(input, error)
  })
}

function extractCanon(rawProfile, character) {
  return callCloud('extractCanon', {
    rawProfile: rawProfile,
    character: character || {}
  }).catch(function (error) {
    return {
      items: persona.extractCanonCandidates(rawProfile),
      provider: 'offline',
      model: '离线锚点提取器',
      fallbackReason: error && error.message ? error.message : '云端模型不可用'
    }
  })
}

function checkHealth() {
  return callCloud('health', {}).then(function (data) {
    return {
      available: Boolean(data.configured),
      model: data.model || 'qwen3.7-plus',
      label: data.configured ? (data.model || 'qwen3.7-plus') + ' · 云端' : 'Qwen 尚未配置密钥'
    }
  }).catch(function () {
    return { available: false, model: '', label: '离线人格引擎' }
  })
}

module.exports = {
  createStructuredReply: createStructuredReply,
  extractCanon: extractCanon,
  checkHealth: checkHealth
}
