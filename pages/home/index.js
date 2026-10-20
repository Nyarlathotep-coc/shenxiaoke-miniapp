Page({
  data: {
    userName: '小科同学',
    courses: [
      { time: '08:20', name: '高等数学', location: '教学楼 A203' },
      { time: '14:00', name: '大学英语', location: '教学楼 B105' }
    ],
    todos: [
      { title: '复习高数第三章', done: false },
      { title: '提交英语作业', done: true }
    ],
    activity: { title: '校园科技文化节', time: '周三 18:30', place: '大学生活动中心' },
    summary: { expense: '826.50', balance: '3173.50' }
  },

  goAgent(event) {
    const agent = event.currentTarget.dataset.agent
    wx.navigateTo({ url: `/pages/chat/index?agent=${agent}` })
  },

  goAccounting() {
    wx.navigateTo({ url: '/pages/accounting/index' })
  }
})

