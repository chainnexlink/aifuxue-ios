import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AdminUser {
  id: string
  username: string
  name: string
  role: 'super_admin' | 'admin' | 'operator' | 'viewer'
  avatar?: string
}

export const useAdminStore = defineStore('admin', () => {
  const user = ref<AdminUser | null>(null)
  const collapsed = ref(false)

  function login(u: AdminUser, token: string) {
    user.value = u
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_user', JSON.stringify(u))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
  }

  function init() {
    const saved = localStorage.getItem('admin_user')
    if (saved) {
      try { user.value = JSON.parse(saved) } catch {}
    }
  }

  function toggleCollapse() {
    collapsed.value = !collapsed.value
  }

  return { user, collapsed, login, logout, init, toggleCollapse }
})
