import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/LoginView.vue'
import Register from '../views/RegisterView.vue'
import Dashboard from '../views/DashboardView.vue'
import Tasks from '../views/TaskListView.vue'
import TaskDetail from '../views/TaskDetailView.vue'
import TaskAdminListView from '../views/TaskAdminListView.vue'
import UserList from '../views/UserListView.vue'
import UserTaskList from '../views/UserTaskListView.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/all-tasks',
    name: 'AllTasks',
    component: TaskAdminListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/all-tasks/:userId',
    name: 'AllTasksByUser',
    component: TaskAdminListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/tasks/:id',
    name: 'TaskDetail',
    component: TaskDetail,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/users',
    component: UserList,
    meta: { requiresAuth: true },
  },
  {
    path: '/user/tasks/:userId',
    component: UserTaskList,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
