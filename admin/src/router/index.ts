import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'DataBoard' },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      { path: 'list', name: 'UserList', component: () => import('@/views/user/list.vue'), meta: { title: '用户列表' } },
      { path: 'detail/:id', name: 'UserDetail', component: () => import('@/views/user/detail.vue'), meta: { title: '用户详情' } },
      { path: 'detail/:id/notes', name: 'UserNotes', component: () => import('@/views/user/user-notes.vue'), meta: { title: '用户笔记' } },
      { path: 'detail/:id/exercises', name: 'UserExercises', component: () => import('@/views/user/user-exercises.vue'), meta: { title: '用户练习' } },
      { path: 'detail/:id/mistakes', name: 'UserMistakes', component: () => import('@/views/user/user-mistakes.vue'), meta: { title: '用户错题' } },
      { path: 'role', name: 'UserRole', component: () => import('@/views/user/role.vue'), meta: { title: '角色权限' } },
    ],
  },
  {
    path: '/notes',
    component: Layout,
    redirect: '/notes/list',
    meta: { title: '笔记管理', icon: 'Notebook' },
    children: [
      { path: 'list', name: 'NotesList', component: () => import('@/views/notes/list.vue'), meta: { title: '笔记列表' } },
      { path: 'detail/:id', name: 'NotesDetail', component: () => import('@/views/notes/detail.vue'), meta: { title: '笔记详情' } },
      { path: 'review', name: 'NotesReview', component: () => import('@/views/notes/review.vue'), meta: { title: '内容审核' } },
      { path: 'review/:id', name: 'ReviewDetail', component: () => import('@/views/notes/review-detail.vue'), meta: { title: '审核详情' } },
      { path: 'category', name: 'NotesCategory', component: () => import('@/views/notes/category.vue'), meta: { title: '分类管理' } },
    ],
  },
  {
    path: '/exercise',
    component: Layout,
    redirect: '/exercise/questions',
    meta: { title: '练习管理', icon: 'EditPen' },
    children: [
      { path: 'questions', name: 'QuestionBank', component: () => import('@/views/exercise/questions.vue'), meta: { title: '题库管理' } },
      { path: 'questions/:id', name: 'QuestionDetail', component: () => import('@/views/exercise/question-detail.vue'), meta: { title: '题目详情' } },
      { path: 'records', name: 'ExerciseRecords', component: () => import('@/views/exercise/records.vue'), meta: { title: '练习记录' } },
      { path: 'records/:id', name: 'ExerciseRecordDetail', component: () => import('@/views/exercise/record-detail.vue'), meta: { title: '练习详情' } },
      { path: 'knowledge', name: 'KnowledgePoints', component: () => import('@/views/exercise/knowledge.vue'), meta: { title: '知识点管理' } },
    ],
  },
  {
    path: '/exam',
    component: Layout,
    redirect: '/exam/config',
    meta: { title: '考试管理', icon: 'Document' },
    children: [
      { path: 'config', name: 'ExamConfig', component: () => import('@/views/exam/config.vue'), meta: { title: '考试配置' } },
      { path: 'config/:id', name: 'ExamConfigDetail', component: () => import('@/views/exam/config-detail.vue'), meta: { title: '配置详情' } },
      { path: 'records', name: 'ExamRecords', component: () => import('@/views/exam/records.vue'), meta: { title: '考试记录' } },
      { path: 'records/:id', name: 'ExamRecordDetail', component: () => import('@/views/exam/record-detail.vue'), meta: { title: '考试详情' } },
      { path: 'analysis', name: 'ExamAnalysis', component: () => import('@/views/exam/analysis.vue'), meta: { title: '成绩分析' } },
    ],
  },
  {
    path: '/mistakes',
    component: Layout,
    redirect: '/mistakes/list',
    meta: { title: '错题管理', icon: 'CloseBold' },
    children: [
      { path: 'list', name: 'MistakesList', component: () => import('@/views/mistakes/list.vue'), meta: { title: '错题列表' } },
      { path: 'detail/:id', name: 'MistakeDetail', component: () => import('@/views/mistakes/detail.vue'), meta: { title: '错题详情' } },
      { path: 'stats', name: 'MistakesStats', component: () => import('@/views/mistakes/stats.vue'), meta: { title: '错题统计' } },
      { path: 'knowledge/:point', name: 'MistakeKnowledge', component: () => import('@/views/mistakes/knowledge-detail.vue'), meta: { title: '知识点错题' } },
    ],
  },
  {
    path: '/oral',
    component: Layout,
    redirect: '/oral/wordbank',
    meta: { title: '口语管理', icon: 'Microphone' },
    children: [
      { path: 'wordbank', name: 'OralWordbank', component: () => import('@/views/oral/wordbank.vue'), meta: { title: '词库管理' } },
      { path: 'course', name: 'OralCourse', component: () => import('@/views/oral/course.vue'), meta: { title: '课程管理' } },
    ],
  },
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/list',
    meta: { title: '教师管理', icon: 'Avatar' },
    children: [
      { path: 'list', name: 'TeacherList', component: () => import('@/views/teacher/list.vue'), meta: { title: '教师列表' } },
      { path: 'detail/:id', name: 'TeacherDetail', component: () => import('@/views/teacher/detail.vue'), meta: { title: '教师详情' } },
    ],
  },
  {
    path: '/class',
    component: Layout,
    redirect: '/class/list',
    meta: { title: '班级管理', icon: 'School' },
    children: [
      { path: 'list', name: 'ClassList', component: () => import('@/views/class/list.vue'), meta: { title: '班级列表' } },
      { path: 'detail/:id', name: 'ClassDetail', component: () => import('@/views/class/detail.vue'), meta: { title: '班级详情' } },
      { path: 'detail/:id/members', name: 'ClassMembers', component: () => import('@/views/class/members.vue'), meta: { title: '成员管理' } },
    ],
  },
  {
    path: '/homework',
    component: Layout,
    redirect: '/homework/list',
    meta: { title: '作业管理', icon: 'Memo' },
    children: [
      { path: 'list', name: 'HomeworkList', component: () => import('@/views/homework/list.vue'), meta: { title: '作业列表' } },
      { path: 'detail/:id', name: 'HomeworkDetail', component: () => import('@/views/homework/detail.vue'), meta: { title: '作业详情' } },
      { path: 'grade-review/:id', name: 'HomeworkGradeReview', component: () => import('@/views/homework/grade-review.vue'), meta: { title: '批改概览' } },
    ],
  },
  {
    path: '/invite',
    component: Layout,
    redirect: '/invite/list',
    meta: { title: '邀请码管理', icon: 'Ticket' },
    children: [
      { path: 'list', name: 'InviteList', component: () => import('@/views/invite/list.vue'), meta: { title: '邀请码列表' } },
      { path: 'stats', name: 'InviteStats', component: () => import('@/views/invite/stats.vue'), meta: { title: '邀请统计' } },
      { path: 'settings', name: 'InviteSettings', component: () => import('@/views/invite/settings.vue'), meta: { title: '邀请设置' } },
    ],
  },
  {
    path: '/exam-gen',
    component: Layout,
    redirect: '/exam-gen/list',
    meta: { title: 'AI出卷管理', icon: 'MagicStick' },
    children: [
      { path: 'list', name: 'ExamGenList', component: () => import('@/views/exam-gen/list.vue'), meta: { title: '出卷列表' } },
      { path: 'detail/:id', name: 'ExamGenDetail', component: () => import('@/views/exam-gen/detail.vue'), meta: { title: '试卷详情' } },
    ],
  },
  {
    path: '/class-mistakes',
    component: Layout,
    redirect: '/class-mistakes/list',
    meta: { title: '班级错题集', icon: 'TrendCharts' },
    children: [
      { path: 'list', name: 'ClassMistakesList', component: () => import('@/views/class-mistakes/list.vue'), meta: { title: '错题集列表' } },
      { path: 'detail/:id', name: 'ClassMistakesDetail', component: () => import('@/views/class-mistakes/detail.vue'), meta: { title: '错题详情' } },
    ],
  },
  {
    path: '/reminders',
    component: Layout,
    redirect: '/reminders/list',
    meta: { title: '催交提醒', icon: 'Bell' },
    children: [
      { path: 'list', name: 'ReminderList', component: () => import('@/views/reminders/list.vue'), meta: { title: '提醒日志' } },
    ],
  },
  {
    path: '/group',
    component: Layout,
    redirect: '/group/list',
    meta: { title: '小组管理', icon: 'Connection' },
    children: [
      { path: 'list', name: 'GroupList', component: () => import('@/views/group/list.vue'), meta: { title: '小组列表' } },
      { path: 'detail/:id', name: 'GroupDetail', component: () => import('@/views/group/detail.vue'), meta: { title: '小组详情' } },
      { path: 'detail/:id/members', name: 'GroupMembers', component: () => import('@/views/group/members.vue'), meta: { title: '成员管理' } },
      { path: 'pk', name: 'GroupPk', component: () => import('@/views/group/pk.vue'), meta: { title: 'PK记录' } },
      { path: 'pk/:id', name: 'PkDetail', component: () => import('@/views/group/pk-detail.vue'), meta: { title: 'PK详情' } },
    ],
  },
  {
    path: '/parent',
    component: Layout,
    redirect: '/parent/control',
    meta: { title: '家长管理', icon: 'House' },
    children: [
      { path: 'control', name: 'ParentControl', component: () => import('@/views/parent/control.vue'), meta: { title: '家长控制' } },
      { path: 'control/:id', name: 'ParentDetail', component: () => import('@/views/parent/control-detail.vue'), meta: { title: '控制详情' } },
      { path: 'reports', name: 'ParentReports', component: () => import('@/views/parent/reports.vue'), meta: { title: '学习报告' } },
      { path: 'reports/:id', name: 'ReportDetail', component: () => import('@/views/parent/report-detail.vue'), meta: { title: '报告详情' } },
    ],
  },
  {
    path: '/website',
    component: Layout,
    redirect: '/website/content',
    meta: { title: '官网管理', icon: 'Monitor' },
    children: [
      { path: 'content', name: 'WebsiteContent', component: () => import('@/views/website/content.vue'), meta: { title: '内容管理' } },
    ],
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/config',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      { path: 'config', name: 'SystemConfig', component: () => import('@/views/system/config.vue'), meta: { title: '系统配置' } },
      { path: 'logs', name: 'SystemLogs', component: () => import('@/views/system/logs.vue'), meta: { title: '操作日志' } },
      { path: 'logs/:id', name: 'LogDetail', component: () => import('@/views/system/log-detail.vue'), meta: { title: '日志详情' } },
      { path: 'backup', name: 'SystemBackup', component: () => import('@/views/system/backup.vue'), meta: { title: '数据备份' } },
      { path: 'notice', name: 'SystemNotice', component: () => import('@/views/system/notice.vue'), meta: { title: '公告管理' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes,
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    document.title = `${to.meta.title || '后台管理'} - 爱辅学管理系统`
    next()
  }
})

export default router
