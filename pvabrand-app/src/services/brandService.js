import api from './api'

export const brandService = {
  getAll: async () => {
    const response = await api.get('/brands')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/brands/${id}`)
    return response.data
  },
}
