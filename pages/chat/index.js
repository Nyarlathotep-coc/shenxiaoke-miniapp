Page({
  data: { agent: 'study', title: '学习助手', agentMark: '学' },
  onLoad(options) {
    const names = { study: '学习助手', life: '生活助手', accounting: '记账助手' }
    const marks = { study: '学', life: '生', accounting: '账' }
    const agent = names[options.agent] ? options.agent : 'study'
    this.setData({ agent, title: names[agent], agentMark: marks[agent] })
    wx.setNavigationBarTitle({ title: names[agent] })
  }
})

