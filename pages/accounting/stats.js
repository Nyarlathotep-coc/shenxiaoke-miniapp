const accountingService = require('../../services/accountingService')
Page({ data: { summary: null }, onShow() { const summary = accountingService.getSummary(); this.setData({ summary: Object.assign({}, summary, { incomeText: summary.income.toFixed(2), expenseText: summary.expense.toFixed(2), balanceText: summary.balance.toFixed(2), categories: summary.categories.map(item => Object.assign({}, item, { amountText: item.amount.toFixed(2), ratio: summary.expense ? item.amount / summary.expense * 100 : 0 })) }) }) } })

