const agentService = require('../../services/agentService')

Page({
  data: {
    agent: 'study',
    agentName: '学习助手',
    sessions: [],
    showArchived: false,
    loading: true
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
    this.setData({ agent, agentName: config.name })
    wx.setNavigationBarTitle({ title: `${config.name}会话` })
  },

  onShow() {
    this.loadSessions()
  },

  loadSessions() {
    const all = agentService.listSessions(this.data.agent, { includeArchived: true })
    const sessions = all.filter(item => Boolean(item.archived) === this.data.showArchived)
      .map(item => Object.assign({}, item, { displayTime: this.formatTime(item.updatedAt) }))
    this.setData({ sessions, loading: false })
  },

  formatTime(value) {
    const date = new Date(value)
    const pad = number => String(number).padStart(2, '0')
    return `${date.getMonth() + 1}月${date.getDate()}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },

  toggleArchived() {
    this.setData({ showArchived: !this.data.showArchived }, () => this.loadSessions())
  },

  createSession() {
    const session = agentService.createSession(this.data.agent)
    wx.navigateTo({ url: `/pages/chat/index?agent=${this.data.agent}&sessionId=${session.id}` })
  },

  openSession(event) {
    const sessionId = event.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/chat/index?agent=${this.data.agent}&sessionId=${sessionId}` })
  },

  toggleSessionArchive(event) {
    const sessionId = event.currentTarget.dataset.id
    const archived = event.currentTarget.dataset.archived
    try {
      agentService.setArchived(this.data.agent, sessionId, !archived)
      this.loadSessions()
      wx.showToast({ title: archived ? '已恢复' : '已归档', icon: 'success' })
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' })
    }
  },

  deleteSession(event) {
    const sessionId = event.currentTarget.dataset.id
    wx.showModal({
      title: '删除会话',
      content: '仅删除当前 Agent 的此会话及消息，不会删除已确认账单。',
      confirmColor: '#c83b3b',
      success: result => {
        if (!result.confirm) return
        try {
          agentService.deleteSession(this.data.agent, sessionId)
          this.loadSessions()
          wx.showToast({ title: '已删除', icon: 'success' })
        } catch (error) {
          wx.showToast({ title: error.message, icon: 'none' })
        }
      }
    })
  }
})

