const storageService = require('./storageService')
const mockData = require('./mockData')

const TODO_KEY = 'study.todos'
const LEAVE_KEY = 'life.leave-records'
const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getUser() {
  return clone(mockData.user)
}

function getTodayCourses() {
  const currentDay = WEEK_DAYS[new Date().getDay()]
  const current = mockData.courses.filter(item => item.day === currentDay)
  return clone(current.length ? current : mockData.courses.filter(item => item.day === '周一'))
}

function getWeekSchedule() {
  return ['周一', '周二', '周三', '周四', '周五'].map(day => ({
    day,
    courses: clone(mockData.courses.filter(item => item.day === day))
  }))
}

function getCalendar() {
  return clone(mockData.calendar)
}

function getStudyPlan() {
  return clone(mockData.studyPlan)
}

function listTodos() {
  const stored = storageService.read(TODO_KEY, null)
  if (stored) return stored
  return storageService.write(TODO_KEY, clone(mockData.initialTodos))
}

function addTodo(title) {
  const normalized = title.trim()
  if (!normalized) throw new Error('请输入待办内容')
  const todo = { id: createId('todo'), title: normalized, done: false, createdAt: new Date().toISOString() }
  storageService.write(TODO_KEY, [todo].concat(listTodos()))
  return todo
}

function toggleTodo(todoId) {
  let found = false
  const todos = listTodos().map(todo => {
    if (todo.id !== todoId) return todo
    found = true
    return Object.assign({}, todo, { done: !todo.done })
  })
  if (!found) throw new Error('待办不存在')
  storageService.write(TODO_KEY, todos)
}

function deleteTodo(todoId) {
  const todos = listTodos()
  const next = todos.filter(todo => todo.id !== todoId)
  if (next.length === todos.length) throw new Error('待办不存在')
  storageService.write(TODO_KEY, next)
}

function listActivities(options = {}) {
  const category = options.category || '全部'
  const keyword = (options.keyword || '').trim().toLowerCase()
  return clone(mockData.activities.filter(item => {
    const categoryMatched = category === '全部' || item.category === category
    const searchMatched = !keyword || `${item.title}${item.place}${item.organizer}`.toLowerCase().includes(keyword)
    return categoryMatched && searchMatched
  }))
}

function getActivity(activityId) {
  const activity = mockData.activities.find(item => item.id === activityId)
  if (!activity) throw new Error('活动不存在')
  return clone(activity)
}

function getMealRecommendation() {
  const index = Math.floor(Math.random() * mockData.mealRecommendations.length)
  return clone(mockData.mealRecommendations[index])
}

function generateLeaveText(form) {
  const reason = (form.reason || '').trim()
  if (!reason) throw new Error('请填写请假原因')
  if (!form.startDate || !form.endDate) throw new Error('请选择请假日期')
  if (form.endDate < form.startDate) throw new Error('结束日期不能早于开始日期')
  return `尊敬的老师：您好！我是${mockData.user.college}学生${mockData.user.nickname}（学号${mockData.user.studentNumber}）。因${reason}，申请于${form.startDate}至${form.endDate}请假。我会提前安排好学习任务，并在返校后及时补上相关课程。恳请批准。`
}

function saveLeaveRecord(draft, confirmed) {
  if (!confirmed) throw new Error('请先确认请假文本')
  if (!draft || !draft.text) throw new Error('请先生成请假文本')
  const record = Object.assign({}, draft, {
    id: createId('leave'),
    status: 'confirmed',
    createdAt: new Date().toISOString()
  })
  storageService.write(LEAVE_KEY, [record].concat(listLeaveRecords()))
  return record
}

function listLeaveRecords() {
  return storageService.read(LEAVE_KEY, [])
}

module.exports = {
  getUser,
  getTodayCourses,
  getWeekSchedule,
  getCalendar,
  getStudyPlan,
  listTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  listActivities,
  getActivity,
  getMealRecommendation,
  generateLeaveText,
  saveLeaveRecord,
  listLeaveRecords
}
