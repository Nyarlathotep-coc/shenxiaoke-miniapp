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

const courses = [
  { id: 'course_1', day: '周一', start: '08:20', end: '09:55', name: '高等数学', teacher: '王老师', location: '教学楼 A203', week: '1-16周' },
  { id: 'course_2', day: '周一', start: '14:00', end: '15:35', name: '大学英语', teacher: '李老师', location: '教学楼 B105', week: '1-16周' },
  { id: 'course_3', day: '周二', start: '10:10', end: '11:45', name: '程序设计基础', teacher: '赵老师', location: '实验楼 C302', week: '1-16周' },
  { id: 'course_4', day: '周三', start: '08:20', end: '09:55', name: '线性代数', teacher: '孙老师', location: '教学楼 A101', week: '1-16周' },
  { id: 'course_5', day: '周四', start: '14:00', end: '15:35', name: '大学物理', teacher: '陈老师', location: '教学楼 B202', week: '1-16周' },
  { id: 'course_6', day: '周五', start: '10:10', end: '11:45', name: '数据结构', teacher: '周老师', location: '实验楼 C205', week: '1-16周' },
  { id: 'course_7', day: '周五', start: '15:50', end: '17:25', name: '大学体育', teacher: '刘老师', location: '体育馆', week: '1-16周' }
]

const calendar = {
  semester: '2026-2027 学年第一学期',
  currentWeek: 8,
  period: '2026年9月7日 - 2027年1月15日',
  events: [
    { id: 'calendar_1', date: '11月2日', title: '期中教学检查' },
    { id: 'calendar_2', date: '12月26日', title: '期末考试周开始' },
    { id: 'calendar_3', date: '1月16日', title: '寒假开始' }
  ]
}

const initialTodos = [
  { id: 'todo_1', title: '复习高数第三章', done: false, createdAt: '2026-10-20T08:00:00.000Z' },
  { id: 'todo_2', title: '提交英语作业', done: true, createdAt: '2026-10-19T08:00:00.000Z' }
]

const studyPlan = {
  title: '期末复习计划',
  progress: 35,
  note: '本周重点：高等数学与数据结构'
}

const activities = [
  { id: 'activity_1', category: '讲座', title: '人工智能与未来校园讲座', date: '10月23日 18:30', place: '图书馆报告厅', organizer: '信息与控制学院', description: '邀请行业嘉宾分享生成式人工智能的发展、应用与校园实践。', capacity: 180 },
  { id: 'activity_2', category: '体育', title: '校园羽毛球新生赛', date: '10月25日 09:00', place: '校体育馆', organizer: '校学生会体育部', description: '面向全体新生的单打友谊赛，现场签到并分组比赛。', capacity: 96 },
  { id: 'activity_3', category: '社团', title: '秋日摄影采风活动', date: '10月26日 14:00', place: '校园南门集合', organizer: '摄影协会', description: '用镜头记录秋日校园，活动结束后将评选优秀作品。', capacity: 40 },
  { id: 'activity_4', category: '讲座', title: '图书馆读书分享会', date: '10月28日 19:00', place: '图书馆 301', organizer: '校图书馆', description: '本期主题为科技与人文，欢迎携带喜欢的书籍参与交流。', capacity: 60 }
]

const mealRecommendations = [
  { name: '番茄牛腩饭', place: '二食堂一楼', price: '约 15 元', reason: '暖胃、荤素搭配' },
  { name: '鸡丝凉面', place: '一食堂二楼', price: '约 11 元', reason: '清爽、出餐快' },
  { name: '麻辣香锅', place: '风味餐厅', price: '约 18 元', reason: '自由选菜、口味丰富' },
  { name: '菌菇鸡汤面', place: '二食堂二楼', price: '约 13 元', reason: '清淡、适合晚餐' }
]

module.exports = {
  user,
  agentConfigs,
  agentReplyRules,
  courses,
  calendar,
  initialTodos,
  studyPlan,
  activities,
  mealRecommendations
}

