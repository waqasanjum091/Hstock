import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pvabrand_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pvabrand_token')
      localStorage.removeItem('pvabrand_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
