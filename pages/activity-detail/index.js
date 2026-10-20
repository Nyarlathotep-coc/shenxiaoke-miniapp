const campusService = require('../../services/campusService')

Page({
  data: { activity: null, loading: true },
  onLoad(options) {
    try { this.setData({ activity: campusService.getActivity(options.id), loading: false }) } catch (error) { this.setData({ loading: false }); wx.showToast({ title: error.message, icon: 'none' }) }
  },
  noop() {}
})

