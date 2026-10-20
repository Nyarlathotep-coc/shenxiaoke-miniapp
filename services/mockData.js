const user = {
  id: 'student_20260001',
  nickname: '小科同学',
  studentNumber: '20260001',
  college: '信息与控制学院'
}

const agentConfigs = {
  study: {
    name: '学习助手',
    mark: '学',
    systemPrompt: '仅使用当前学习会话和课程、校历、学习任务数据提供帮助。',
    permissions: ['courses:read', 'calendar:read', 'todos:read', 'todos:write'],
    suggestions: ['今天有什么课？', '这周五有课吗？', '帮我制定期末复习计划', '帮我创建一个学习任务']
  },
  life: {
    name: '生活助手',
    mark: '生',
    systemPrompt: '仅使用当前生活会话和活动、请假、校园服务数据提供帮助。',
    permissions: ['activities:read', 'leave:read', 'leave:write', 'campus-services:read'],
    suggestions: ['今天吃什么？', '最近有什么校园活动？', '帮我写一份请假说明']
  },
  accounting: {
    name: '记账助手',
    mark: '账',
    systemPrompt: '仅使用当前记账会话和账单数据提供帮助，账单必须经用户确认后保存。',
    permissions: ['ledger:read', 'ledger:write-after-confirmation'],
    suggestions: ['午饭10元', '昨天打车23.5元', '早餐6元，午饭12元']
  }
}

const agentReplyRules = {
  study: [
    { keywords: ['今天', '课'], reply: '今天有高等数学和大学英语。高等数学 08:20 在 A203，大学英语 14:00 在 B105。' },
    { keywords: ['周五'], reply: '本周五安排了两节课：10:10 数据结构、15:50 大学体育。具体教室可在本周课表中查看。' },
    { keywords: ['复习计划', '期末'], reply: '建议按“梳理范围、分模块复习、真题检测、错题回顾”四步推进。我可以根据你的考试日期继续拆成每日任务。' },
    { keywords: ['创建', '任务'], reply: '可以。请告诉我任务名称和截止时间；也可以直接在学习页的待办区域新增。' }
  ],
  life: [
    { keywords: ['吃什么', '午饭', '晚饭'], reply: '今天推荐二食堂的番茄牛腩饭，搭配一份时蔬。想换口味的话，也可以试试一食堂的鸡丝凉面。' },
    { keywords: ['活动'], reply: '近期有校园科技文化节、羽毛球新生赛和图书馆读书分享会，可以在生活页按分类筛选。' },
    { keywords: ['请假'], reply: '请在请假申请页填写原因、开始时间和结束时间，我会先生成文本，只有你确认后才会保存。' }
  ],
  accounting: [
    { keywords: ['元'], reply: '我可以识别这笔消费。请前往 AI 记账页查看待确认账单，确认后才会正式入账。' },
    { keywords: ['统计'], reply: '你可以在收支统计页查看本月收入、支出、余额和分类占比。' }
  ]
}

module.exports = {
  user,
  agentConfigs,
  agentReplyRules
}

