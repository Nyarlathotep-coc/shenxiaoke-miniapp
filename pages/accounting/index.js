const accountingService = require('../../services/accountingService')
const speechService = require('../../services/speechToTextService')

Page({
  data: { input: '', pendingEntries: [], entries: [], summary: { income: 0, expense: 0, balance: 0, incomeText: '0.00', expenseText: '0.00', balanceText: '0.00' }, recording: false, recordingHint: '', editingIndex: -1 },
  onShow() { this.refresh() },
  refresh() { const summary = accountingService.getSummary(); this.setData({ entries: accountingService.listEntries().slice(0, 5), summary: Object.assign({}, summary, { incomeText: summary.income.toFixed(2), expenseText: summary.expense.toFixed(2), balanceText: summary.balance.toFixed(2) }) }) },
  onInput(event) { this.setData({ input: event.detail.value }) },
  parse() { try { this.setData({ pendingEntries: accountingService.parseText(this.data.input), editingIndex: -1 }) } catch (error) { wx.showToast({ title: error.message, icon: 'none' }) } },
  startVoice() { try { this.setData({ recording: true, recordingHint: '正在录音，完成后点击结束' }); wx.showToast({ title: '正在录音，再点一次结束', icon: 'none' }); wx.getRecorderManager().start({ duration: 60000, sampleRate: 16000, numberOfChannels: 1, format: 'aac' }) } catch (error) { this.setData({ recording: false, recordingHint: '' }); wx.showToast({ title: '录音不可用，请直接输入文字', icon: 'none' }) } },
  stopVoice() { try { wx.getRecorderManager().stop() } catch (error) {} this.setData({ recording: false, recordingHint: 'Mock 转写完成，可编辑后再识别' }); speechService.transcribe().then(result => this.setData({ input: result.text }, () => this.parse())) },
  voiceInput() { if (this.data.recording) this.stopVoice(); else this.startVoice() },
  confirmPending(event) { const index = event.currentTarget.dataset.index; const entry = this.data.pendingEntries[index]; try { const confirmed = accountingService.confirmEntry(entry); const remaining = this.data.pendingEntries.filter((item, itemIndex) => itemIndex !== Number(index)); this.setData({ pendingEntries: remaining, input: '' }, () => this.refresh()); wx.showToast({ title: `已确认 ${confirmed.amount} 元`, icon: 'success' }) } catch (error) { wx.showToast({ title: error.message, icon: 'none' }) } },
  cancelPending(event) { this.setData({ pendingEntries: this.data.pendingEntries.filter((item, index) => index !== Number(event.currentTarget.dataset.index)) }) },
  editPending(event) { const index = Number(event.currentTarget.dataset.index); const entry = this.data.pendingEntries[index]; wx.showModal({ title: '修改金额', editable: true, content: entry.amount ? String(entry.amount) : '', placeholderText: '请输入金额', success: result => { if (!result.confirm) return; const amount = Number(result.content); if (!amount || amount <= 0) return wx.showToast({ title: '请输入有效金额', icon: 'none' }); const pendingEntries = this.data.pendingEntries.slice(); pendingEntries[index] = Object.assign({}, entry, { amount, needsAmount: false, ambiguousAmount: false }); this.setData({ pendingEntries }) } }) },
  goLedger() { wx.navigateTo({ url: '/pages/accounting/ledger' }) },
  goStats() { wx.navigateTo({ url: '/pages/accounting/stats' }) }
})

