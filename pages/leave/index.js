const campusService = require('../../services/campusService')

Page({
  data: { reason: '', startDate: '', endDate: '', generatedText: '', confirmed: false, records: [] },
  onLoad() { this.setData({ records: campusService.listLeaveRecords() }) },
  onInput(event) { this.setData({ reason: event.detail.value, generatedText: '', confirmed: false }) },
  onStartDate(event) { this.setData({ startDate: event.detail.value, generatedText: '', confirmed: false }) },
  onEndDate(event) { this.setData({ endDate: event.detail.value, generatedText: '', confirmed: false }) },
  generate() { try { this.setData({ generatedText: campusService.generateLeaveText(this.data), confirmed: false }) } catch (error) { wx.showToast({ title: error.message, icon: 'none' }) } },
  confirmText() { this.setData({ confirmed: true }) },
  save() { try { const record = campusService.saveLeaveRecord({ reason: this.data.reason, startDate: this.data.startDate, endDate: this.data.endDate, text: this.data.generatedText }, this.data.confirmed); this.setData({ records: [record].concat(this.data.records), generatedText: '' }); wx.showToast({ title: '请假记录已保存', icon: 'success' }) } catch (error) { wx.showToast({ title: error.message, icon: 'none' }) } }
})

