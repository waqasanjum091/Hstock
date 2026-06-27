import api from './api'

export const orderService = {
  checkout: async (data) => {
    const response = await api.post('/checkout', data)
    return response.data
  },

  getMyOrders: async (filters = {}) => {
    const response = await api.get('/orders', { params: filters })
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status })
    return response.data
  },

  updatePaymentStatus: async (id, paymentStatus, transactionId = null) => {
    const response = await api.patch(`/orders/${id}/payment-status`, {
      payment_status: paymentStatus,
      transaction_id: transactionId,
    })
    return response.data
  },

  updateTracking: async (id, trackingNumber) => {
    const response = await api.patch(`/orders/${id}/tracking`, { tracking_number: trackingNumber })
    return response.data
  },

  getVendorOrders: async (filters = {}) => {
    const response = await api.get('/vendor/orders', { params: filters })
    return response.data
  },

  getAllOrders: async (filters = {}) => {
    const response = await api.get('/admin/all-orders', { params: filters })
    return response.data
  },
}
