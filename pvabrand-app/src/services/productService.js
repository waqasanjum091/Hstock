import api from './api'

export const productService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/products', { params: filters })
    return response.data
  },

  getFeatured: async () => {
    const response = await api.get('/products/featured')
    return response.data
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/products', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  addImages: async (productId, images) => {
    const response = await api.post(`/products/${productId}/images`, { images })
    return response.data
  },

  deleteImage: async (productId, imageId) => {
    const response = await api.delete(`/products/${productId}/images/${imageId}`)
    return response.data
  },

  vendorProducts: async (filters = {}) => {
    const response = await api.get('/vendor/products', { params: filters })
    return response.data
  },

  adminProducts: async (filters = {}) => {
    const response = await api.get('/admin/all-products', { params: filters })
    return response.data
  },

  toggleActive: async (id) => {
    const response = await api.patch(`/admin/products/${id}/toggle-active`)
    return response.data
  },
}
