const accountingService = require('../../services/accountingService')

Page({
  data: { entries: [], editingId: '' },
  onShow() { this.setData({ entries: accountingService.listEntries() }) },
  edit(event) { const entry = this.data.entries.find(item => item.id === event.currentTarget.dataset.id); wx.showModal({ title: '修改金额', editable: true, content: String(entry.amount), success: result => { if (!result.confirm) return; const amount = Number(result.content); try { accountingService.updateEntry(Object.assign({}, entry, { amount })); this.setData({ entries: accountingService.listEntries() }) } catch (error) { wx.showToast({ title: error.message, icon: 'none' }) } } }) },
  remove(event) { wx.showModal({ title: '删除账单', content: '删除后无法恢复，确认删除？', confirmColor: '#c83b3b', success: result => { if (!result.confirm) return; accountingService.deleteEntry(event.currentTarget.dataset.id); this.setData({ entries: accountingService.listEntries() }) } }) }
})

