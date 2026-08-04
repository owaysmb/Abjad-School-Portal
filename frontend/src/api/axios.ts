import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || ''
const baseURL = rawUrl.endsWith('/api') ? rawUrl : rawUrl.replace(/\/+$/, '') + '/api'

const api = axios.create({
  baseURL,
  withCredentials: true 
})

api.interceptors.response.use(
  response => response,
  error => {
    const isAuthMe = error.config?.url?.includes('/auth/me')
    if (error.response?.status === 401 && !isAuthMe) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)



export default api