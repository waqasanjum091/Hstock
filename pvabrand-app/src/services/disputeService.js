import api from './api'

export const disputeService = {
  // Customer
  create: async (data) => {
    const response = await api.post('/disputes', data)
    return response.data
  },
  getMine: async () => {
    const response = await api.get('/disputes/my')
    return response.data
  },

  // Vendor
  getForVendor: async () => {
    const response = await api.get('/disputes/vendor')
    return response.data
  },
  respond: async (id, data) => {
    const response = await api.patch(`/disputes/${id}/respond`, data)
    return response.data
  },

  // Admin
  getAll: async (filters = {}) => {
    const response = await api.get('/admin/disputes', { params: filters })
    return response.data
  },
}

export const DISPUTE_TYPES = [
  { value: 'wrong_account', label: 'Received wrong account' },
  { value: 'not_working', label: 'Account not working' },
  { value: 'not_delivered', label: 'Order not delivered' },
  { value: 'other', label: 'Other issue' },
]

export const DISPUTE_STATUS_STYLES = {
  open: 'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-600',
}
