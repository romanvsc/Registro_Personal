import { readonly, ref } from 'vue'
import { authApi } from '../infrastructure/authApi'

const user = ref(null)
let checked = false

async function restore() {
  if (checked) return user.value
  try { user.value = (await authApi.current()).user }
  catch (error) { if (error.status !== 401) throw error; user.value = null }
  finally { checked = true }
  return user.value
}

async function login(email, password) {
  user.value = (await authApi.login(email, password)).user
  checked = true
  return user.value
}

async function register(registration) {
  user.value = (await authApi.register(registration)).user
  checked = true
  return user.value
}

async function updateProfile(profile) {
  user.value = (await authApi.updateProfile(profile)).user
  checked = true
  return user.value
}

async function logout() {
  try { await authApi.logout() } finally { user.value = null; checked = true }
}

export const sessionStore = { user: readonly(user), restore, login, register, updateProfile, logout }
