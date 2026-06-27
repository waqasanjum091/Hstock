import api from './api'

export const vendorService = {
  createProfile: async (data) => {
    const response = await api.post('/vendor-profile', data)
    return response.data
  },

  updateProfile: async (data) => {
    const response = await api.put('/vendor-profile', data)
    return response.data
  },

  getStore: async (slug) => {
    const response = await api.get(`/vendors/${slug}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/vendor/stats')
    return response.data
  },
}
