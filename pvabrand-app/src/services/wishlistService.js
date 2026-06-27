import api from './api'

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist')
    return response.data
  },

  addItem: async (productId) => {
    const response = await api.post('/wishlist', { product_id: productId })
    return response.data
  },

  removeItem: async (id) => {
    const response = await api.delete(`/wishlist/${id}`)
    return response.data
  },
}
