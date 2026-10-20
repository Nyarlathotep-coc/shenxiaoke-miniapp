const PREFIX = 'shenxiaoke.v1'

function read(key, fallback) {
  try {
    const value = wx.getStorageSync(`${PREFIX}.${key}`)
    return value === '' || value === undefined || value === null ? fallback : value
  } catch (error) {
    console.error('读取本地数据失败', key, error)
    return fallback
  }
}

function write(key, value) {
  try {
    wx.setStorageSync(`${PREFIX}.${key}`, value)
    return value
  } catch (error) {
    console.error('保存本地数据失败', key, error)
    throw new Error('本地数据保存失败，请检查存储空间')
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(`${PREFIX}.${key}`)
  } catch (error) {
    console.error('删除本地数据失败', key, error)
    throw new Error('本地数据删除失败')
  }
}

function agentSessionsKey(agentType) {
  return `agent.${agentType}.sessions`
}

function agentMessagesKey(agentType, sessionId) {
  return `agent.${agentType}.messages.${sessionId}`
}

function getAgentSessions(agentType) {
  return read(agentSessionsKey(agentType), [])
}

function setAgentSessions(agentType, sessions) {
  return write(agentSessionsKey(agentType), sessions)
}

function getAgentMessages(agentType, sessionId) {
  return read(agentMessagesKey(agentType, sessionId), [])
}

function setAgentMessages(agentType, sessionId, messages) {
  return write(agentMessagesKey(agentType, sessionId), messages)
}

function removeAgentMessages(agentType, sessionId) {
  remove(agentMessagesKey(agentType, sessionId))
}

module.exports = {
  read,
  write,
  remove,
  getAgentSessions,
  setAgentSessions,
  getAgentMessages,
  setAgentMessages,
  removeAgentMessages
}

