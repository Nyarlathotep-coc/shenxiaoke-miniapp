const storageService = require('./storageService')

const ENTRY_KEY = 'accounting.entries'
const CATEGORY_KEYWORDS = {
  餐饮: ['饭', '餐', '早餐', '午餐', '晚餐', '奶茶', '咖啡', '水果', '外卖', '食堂', '吃'],
  交通: ['打车', '出租', '地铁', '公交', '车票', '高铁', '火车', '交通'],
  学习: ['书', '课程', '学费', '文具', '打印', '资料', '考试'],
  娱乐: ['电影', '游戏', '演唱会', '娱乐', '门票'],
  购物: ['购物', '衣服', '鞋', '网购', '淘宝', '京东'],
  住宿: ['房租', '住宿', '宿舍', '水费', '电费'],
  工资: ['工资', '薪资', '奖金', '补贴'],
  其他: []
}

const VALID_CATEGORIES = Object.keys(CATEGORY_KEYWORDS)

function clone(value) { return JSON.parse(JSON.stringify(value)) }
function createId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }
function normalizeChineseNumber(value) {
  if (/^\d+(\.\d+)?$/.test(value)) return Number(value)
  const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 }
  if (value.includes('点')) {
    const parts = value.split('点')
    return normalizeChineseNumber(parts[0]) + Number(`0.${parts[1].split('').map(item => digits[item] === undefined ? item : digits[item]).join('')}`)
  }
  let total = 0
  let section = 0
  let number = 0
  value.split('').forEach(char => {
    if (digits[char] !== undefined) number = digits[char]
    else if (char === '十') { section += (number || 1) * 10; number = 0 }
    else if (char === '百') { section += (number || 1) * 100; number = 0 }
    else if (char === '千') { section += (number || 1) * 1000; number = 0 }
    else if (char === '万') { total += (section + number || 1) * 10000; section = 0; number = 0 }
  })
  return total + section + number
}

function parseDate(text) {
  const now = new Date()
  if (text.includes('昨天')) now.setDate(now.getDate() - 1)
  if (text.includes('前天')) now.setDate(now.getDate() - 2)
  return now.toISOString().slice(0, 10)
}

function formatDateLabel(date) {
  const today = new Date().toISOString().slice(0, 10)
  if (date === today) return '今天'
  return date.slice(5).replace('-', '月') + '日'
}

function detectType(text) { return /工资|薪资|奖金|收入|到账|补贴/.test(text) ? 'income' : 'expense' }
function detectCategory(text, type) { if (type === 'income') return '工资'; return VALID_CATEGORIES.find(category => CATEGORY_KEYWORDS[category].some(keyword => text.includes(keyword))) || '其他' }
function extractDescription(text, type) { return text.replace(/昨天|前天|今天|花了|购买|买了|到账|收入|支出|工资|薪资|奖金|补贴/g, '').replace(/\d+(\.\d+)?\s*(元|块|块钱)?/g, '').replace(/[，,、;；]/g, '').trim() || (type === 'income' ? '收入' : '消费') }

function splitItems(text) {
  return text.replace(/，/g, ',').replace(/、/g, ',').replace(/；/g, ',').split(/[,\n]/).map(item => item.trim()).filter(Boolean)
}

function parseOne(text, source = 'text') {
  const amountMatches = text.match(/(\d+(?:\.\d+)?|[零一二两三四五六七八九十百千万点]+)\s*(?:元|块钱?|块)?/g) || []
  const amountValues = amountMatches.map(item => normalizeChineseNumber(item.replace(/\s*(元|块钱?|块)$/g, ''))).filter(Number.isFinite)
  const type = detectType(text)
  const occurredAt = parseDate(text)
  return {
    id: createId('pending'),
    userId: 'student_20260001',
    amount: amountValues.length === 1 ? Number(amountValues[0].toFixed(2)) : null,
    amountCandidates: amountValues,
    type,
    category: detectCategory(text, type),
    description: extractDescription(text, type),
    occurredAt,
    occurredAtLabel: formatDateLabel(occurredAt),
    paymentMethod: '未填写',
    source,
    status: 'pending',
    rawText: text,
    createdAt: new Date().toISOString(),
    needsAmount: amountValues.length === 0,
    ambiguousAmount: amountValues.length > 1
  }
}

function parseText(text, source = 'text') {
  const normalized = (text || '').trim()
  if (!normalized) throw new Error('请输入账单内容')
  return splitItems(normalized).map(item => parseOne(item, source))
}

function listEntries() { return clone(storageService.read(ENTRY_KEY, [])) }
function saveEntries(entries) { storageService.write(ENTRY_KEY, entries); return entries }
function validateEntry(entry) {
  if (!entry.amount || Number(entry.amount) <= 0 || Number.isNaN(Number(entry.amount))) throw new Error('请补充有效金额')
  if (!VALID_CATEGORIES.includes(entry.category)) throw new Error('请选择有效分类')
}
function confirmEntry(entry) {
  validateEntry(entry)
  const confirmed = Object.assign({}, entry, { id: entry.id || createId('ledger'), amount: Number(Number(entry.amount).toFixed(2)), status: 'confirmed', confirmedAt: new Date().toISOString() })
  saveEntries([confirmed].concat(listEntries()))
  return confirmed
}
function updateEntry(entry) {
  validateEntry(entry)
  const corrected = Object.assign({}, entry, { amount: Number(Number(entry.amount).toFixed(2)), status: 'corrected', updatedAt: new Date().toISOString() })
  saveEntries(listEntries().map(item => item.id === corrected.id ? corrected : item))
  return corrected
}
function deleteEntry(entryId) { saveEntries(listEntries().filter(item => item.id !== entryId)) }
function getSummary() {
  const entries = listEntries().filter(item => item.status === 'confirmed' || item.status === 'corrected')
  const income = entries.filter(item => item.type === 'income').reduce((total, item) => total + item.amount, 0)
  const expense = entries.filter(item => item.type === 'expense').reduce((total, item) => total + item.amount, 0)
  const categories = VALID_CATEGORIES.map(category => ({ category, amount: entries.filter(item => item.category === category && item.type === 'expense').reduce((total, item) => total + item.amount, 0) })).filter(item => item.amount > 0)
  return { income: Number(income.toFixed(2)), expense: Number(expense.toFixed(2)), balance: Number((income - expense).toFixed(2)), categories }
}

module.exports = { VALID_CATEGORIES, parseText, listEntries, confirmEntry, updateEntry, deleteEntry, getSummary, formatDateLabel }
