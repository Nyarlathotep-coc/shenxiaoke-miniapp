const agentService = require('../../services/agentService')

Page({
  data: {
    agent: 'study',
    title: '学习助手',
    agentMark: '学',
    sessionId: '',
    messages: [],
    suggestions: [],
    inputValue: '',
    loading: true,
    sending: false,
    scrollTarget: ''
  },

  onLoad(options) {
    let agent = options.agent || 'study'
    let config
    try {
      config = agentService.getAgentConfig(agent)
    } catch (error) {
      agent = 'study'
      config = agentService.getAgentConfig(agent)
    }

    let session
    try {
      session = options.sessionId
        ? agentService.findSession(agent, options.sessionId)
        : agentService.createSession(agent)
    } catch (error) {
      session = agentService.createSession(agent)
    }

    this.setData({
      agent,
      title: config.name,
      agentMark: config.mark,
      suggestions: config.suggestions,
      sessionId: session.id,
      loading: false
    })
    wx.setNavigationBarTitle({ title: config.name })
    this.loadMessages()
  },

  loadMessages() {
    try {
      const messages = agentService.listMessages(this.data.agent, this.data.sessionId)
      this.setData({ messages, scrollTarget: messages.length ? `message-${messages[messages.length - 1].id}` : '' })
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' })
    }
  },

  onInput(event) {
    this.setData({ inputValue: event.detail.value })
  },

  useSuggestion(event) {
    this.setData({ inputValue: event.currentTarget.dataset.text })
    this.send()
  },

  send() {
    const content = this.data.inputValue.trim()
    if (!content || this.data.sending) return
    this.setData({ sending: true })
    try {
      agentService.sendMessage(this.data.agent, this.data.sessionId, content)
      this.setData({ inputValue: '', sending: false })
      this.loadMessages()
    } catch (error) {
      this.setData({ sending: false })
      wx.showToast({ title: error.message, icon: 'none' })
    }
  },

  newSession() {
    const session = agentService.createSession(this.data.agent)
    this.setData({ sessionId: session.id, messages: [], inputValue: '', scrollTarget: '' })
  },

  openSessions() {
    wx.navigateTo({ url: `/pages/sessions/index?agent=${this.data.agent}` })
  }
})

