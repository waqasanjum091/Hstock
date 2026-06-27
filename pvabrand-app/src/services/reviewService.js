import api from './api'

export const reviewService = {
  getReviews: async (productId, filters = {}) => {
    const response = await api.get(`/products/${productId}/reviews`, { params: filters })
    return response.data
  },

  createReview: async (productId, data) => {
    const response = await api.post(`/products/${productId}/reviews`, data)
    return response.data
  },

  updateReview: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data)
    return response.data
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
}
