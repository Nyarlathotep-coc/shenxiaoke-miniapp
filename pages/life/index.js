Page({
  goChat() { wx.navigateTo({ url: '/pages/chat/index?agent=life' }) },
  goSessions() { wx.navigateTo({ url: '/pages/sessions/index?agent=life' }) },
  goLeave() { wx.navigateTo({ url: '/pages/leave/index' }) },
  goAccounting() { wx.navigateTo({ url: '/pages/accounting/index' }) }
})

