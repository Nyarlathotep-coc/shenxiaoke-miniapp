Page({
  data: { scheduleMode: 'today' },
  setScheduleMode(event) { this.setData({ scheduleMode: event.currentTarget.dataset.mode }) },
  goChat() { wx.navigateTo({ url: '/pages/chat/index?agent=study' }) },
  goSessions() { wx.navigateTo({ url: '/pages/sessions/index?agent=study' }) }
})

