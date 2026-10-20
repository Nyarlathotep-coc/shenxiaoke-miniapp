const campusService = require('../../services/campusService')

Page({
  data: {
    scheduleMode: 'today',
    todayCourses: [],
    weekSchedule: [],
    calendar: null,
    studyPlan: null,
    todos: [],
    todoInput: ''
  },

  onLoad() {
    this.setData({
      todayCourses: campusService.getTodayCourses(),
      weekSchedule: campusService.getWeekSchedule(),
      calendar: campusService.getCalendar(),
      studyPlan: campusService.getStudyPlan()
    })
  },

  onShow() {
    this.loadTodos()
  },

  loadTodos() {
    this.setData({ todos: campusService.listTodos() })
  },

  setScheduleMode(event) { this.setData({ scheduleMode: event.currentTarget.dataset.mode }) },
  onTodoInput(event) { this.setData({ todoInput: event.detail.value }) },
  addTodo() {
    try {
      campusService.addTodo(this.data.todoInput)
      this.setData({ todoInput: '' })
      this.loadTodos()
    } catch (error) {
      wx.showToast({ title: error.message, icon: 'none' })
    }
  },
  toggleTodo(event) {
    campusService.toggleTodo(event.currentTarget.dataset.id)
    this.loadTodos()
  },
  deleteTodo(event) {
    campusService.deleteTodo(event.currentTarget.dataset.id)
    this.loadTodos()
  },
  goChat() { wx.navigateTo({ url: '/pages/chat/index?agent=study' }) },
  goSessions() { wx.navigateTo({ url: '/pages/sessions/index?agent=study' }) }
})

