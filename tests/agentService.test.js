const assert = require('node:assert/strict')

const memory = {}
global.wx = {
  getStorageSync(key) {
    return memory[key] === undefined ? '' : memory[key]
  },
  setStorageSync(key, value) {
    memory[key] = value
  },
  removeStorageSync(key) {
    delete memory[key]
  }
}

const storageService = require('../services/storageService')
const agentService = require('../services/agentService')

const study = agentService.createSession('study')
const life = agentService.createSession('life')
const accounting = agentService.createSession('accounting')

agentService.sendMessage('study', study.id, '今天有什么课？')
agentService.sendMessage('life', life.id, '今天吃什么？')

assert.equal(agentService.listMessages('study', study.id).length, 2)
assert.equal(agentService.listMessages('life', life.id).length, 2)
assert.throws(() => agentService.listMessages('life', study.id), /无权访问/)

storageService.write('ledger.entries', [{ id: 'ledger_keep' }])
agentService.deleteSession('accounting', accounting.id)
assert.equal(storageService.read('ledger.entries', []).length, 1)

console.log('Agent isolation, history, and ledger independence passed')
