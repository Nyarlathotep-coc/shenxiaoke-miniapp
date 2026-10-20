const campusService = require('../../services/campusService')

Page({
  data: { categories: ['全部', '讲座', '体育', '社团'], category: '全部', keyword: '', activities: [], meal: null },
  onLoad() { this.loadActivities(); this.recommendMeal() },
  loadActivities() { this.setData({ activities: campusService.listActivities({ category: this.data.category, keyword: this.data.keyword }) }) },
  selectCategory(event) { this.setData({ category: event.currentTarget.dataset.category }, () => this.loadActivities()) },
  onSearch(event) { this.setData({ keyword: event.detail.value }, () => this.loadActivities()) },
  recommendMeal() { this.setData({ meal: campusService.getMealRecommendation() }) },
  openActivity(event) { wx.navigateTo({ url: `/pages/activity-detail/index?id=${event.currentTarget.dataset.id}` }) },
  goChat() { wx.navigateTo({ url: '/pages/chat/index?agent=life' }) },
  goSessions() { wx.navigateTo({ url: '/pages/sessions/index?agent=life' }) },
  goLeave() { wx.navigateTo({ url: '/pages/leave/index' }) },
  goAccounting() { wx.navigateTo({ url: '/pages/accounting/index' }) }
})

