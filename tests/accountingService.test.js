const assert = require('node:assert/strict')
const memory = {}
global.wx = { getStorageSync: key => memory[key] === undefined ? '' : memory[key], setStorageSync: (key, value) => { memory[key] = value }, removeStorageSync: key => { delete memory[key] } }
const service = require('../services/accountingService')
const one = service.parseText('午饭10元')[0]
assert.equal(one.type, 'expense'); assert.equal(one.amount, 10); assert.equal(one.category, '餐饮'); assert.equal(one.status, 'pending')
const multi = service.parseText('早餐6元，午饭12元'); assert.equal(multi.length, 2); assert.equal(multi[1].amount, 12)
const income = service.parseText('工资到账5000元')[0]; assert.equal(income.type, 'income'); assert.equal(income.category, '工资')
assert.throws(() => service.confirmEntry(service.parseText('午饭')[0]), /金额/)
service.confirmEntry(one); service.confirmEntry(multi[0]); service.confirmEntry(income)
assert.deepEqual(service.getSummary(), { income: 5000, expense: 16, balance: 4984, categories: [{ category: '餐饮', amount: 16 }] })
console.log('Accounting parser and confirmation tests passed')
