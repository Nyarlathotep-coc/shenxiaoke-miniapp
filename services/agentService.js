const storageService = require('./storageService')
const { user, agentConfigs, agentReplyRules } = require('./mockData')

const VALID_AGENTS = Object.keys(agentConfigs)

function assertAgent(agentType) {
  if (!VALID_AGENTS.includes(agentType)) {
    throw new Error('不支持的 Agent 类型')
  }
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function getAgentConfig(agentType) {
  assertAgent(agentType)
  return Object.assign({}, agentConfigs[agentType])
}

function listSessions(agentType, options = {}) {
  assertAgent(agentType)
  const includeArchived = Boolean(options.includeArchived)
  return storageService.getAgentSessions(agentType)
    .filter(session => includeArchived || !session.archived)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

function createSession(agentType, title = '新对话') {
  assertAgent(agentType)
  const now = new Date().toISOString()
  const session = {
    id: createId('session'),
    userId: user.id,
    agentType,
    title,
    archived: false,
    createdAt: now,
    updatedAt: now
  }
  const sessions = storageService.getAgentSessions(agentType)
  storageService.setAgentSessions(agentType, [session].concat(sessions))
  storageService.setAgentMessages(agentType, session.id, [])
  return session
}

function findSession(agentType, sessionId) {
  assertAgent(agentType)
  const session = storageService.getAgentSessions(agentType).find(item => item.id === sessionId)
  if (!session || session.agentType !== agentType) {
    throw new Error('会话不存在或无权访问')
  }
  return session
}

function listMessages(agentType, sessionId) {
  findSession(agentType, sessionId)
  return storageService.getAgentMessages(agentType, sessionId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

function createTitle(content) {
  const normalized = content.replace(/\s+/g, ' ').trim()
  return normalized.length > 16 ? `${normalized.slice(0, 16)}…` : normalized
}

function mockAgentReply(agentType, content, context) {
  const rules = agentReplyRules[agentType] || []
  const matched = rules.find(rule => rule.keywords.every(keyword => content.includes(keyword))) ||
    rules.find(rule => rule.keywords.some(keyword => content.includes(keyword)))
  if (matched) return matched.reply

  const fallback = {
    study: '我已记录你的学习问题。当前是本地 Mock 模式，你可以询问课表、复习计划或学习任务。',
    life: '我已收到你的校园生活问题。当前是本地 Mock 模式，可以协助活动、请假和餐食推荐。',
    accounting: '当前是本地 Mock 模式。需要记账时请进入 AI 记账页，识别结果会先由你确认。'
  }
  const hasContext = context.some(message => message.role === 'user')
  return `${fallback[agentType]}${hasContext ? ' 我会结合本会话内的上下文继续回答。' : ''}`
}

function sendMessage(agentType, sessionId, content) {
  const session = findSession(agentType, sessionId)
  const text = content.trim()
  if (!text) throw new Error('消息不能为空')

  const messages = storageService.getAgentMessages(agentType, sessionId)
  const now = new Date().toISOString()
  const userMessage = { id: createId('message'), sessionId, role: 'user', content: text, createdAt: now }
  const context = messages.slice(-10)
  const assistantMessage = {
    id: createId('message'),
    sessionId,
    role: 'assistant',
    content: mockAgentReply(agentType, text, context),
    createdAt: new Date(Date.now() + 1).toISOString()
  }
  storageService.setAgentMessages(agentType, sessionId, messages.concat(userMessage, assistantMessage))

  const sessions = storageService.getAgentSessions(agentType)
  const updated = sessions.map(item => item.id === sessionId ? Object.assign({}, item, {
    title: messages.length === 0 ? createTitle(text) : session.title,
    updatedAt: assistantMessage.createdAt
  }) : item)
  storageService.setAgentSessions(agentType, updated)
  return { userMessage, assistantMessage }
}

function setArchived(agentType, sessionId, archived) {
  findSession(agentType, sessionId)
  const sessions = storageService.getAgentSessions(agentType).map(item => item.id === sessionId
    ? Object.assign({}, item, { archived: Boolean(archived), updatedAt: new Date().toISOString() })
    : item)
  storageService.setAgentSessions(agentType, sessions)
}

function deleteSession(agentType, sessionId) {
  findSession(agentType, sessionId)
  const sessions = storageService.getAgentSessions(agentType).filter(item => item.id !== sessionId)
  storageService.setAgentSessions(agentType, sessions)
  storageService.removeAgentMessages(agentType, sessionId)
}

module.exports = {
  getAgentConfig,
  listSessions,
  createSession,
  findSession,
  listMessages,
  sendMessage,
  setArchived,
  deleteSession
}

