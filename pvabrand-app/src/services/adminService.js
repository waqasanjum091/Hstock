import api from './api'

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  getUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters })
    return response.data
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  getVendors: async (filters = {}) => {
    const response = await api.get('/admin/vendors', { params: filters })
    return response.data
  },

  approveVendor: async (id) => {
    const response = await api.patch(`/admin/vendors/${id}/approve`)
    return response.data
  },

  banVendor: async (id) => {
    const response = await api.patch(`/admin/vendors/${id}/ban`)
    return response.data
  },

  getBanners: async (filters = {}) => {
    const response = await api.get('/admin/banners', { params: filters })
    return response.data
  },

  createBanner: async (data) => {
    const response = await api.post('/admin/banners', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateBanner: async (id, data) => {
    const response = await api.put(`/admin/banners/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteBanner: async (id) => {
    const response = await api.delete(`/admin/banners/${id}`)
    return response.data
  },

  getSettings: async () => {
    const response = await api.get('/admin/settings')
    return response.data
  },

  updateSettings: async (data) => {
    const response = await api.post('/admin/settings', data)
    return response.data
  },

  getContactInquiries: async (filters = {}) => {
    const response = await api.get('/admin/contact-inquiries', { params: filters })
    return response.data
  },

  resolveInquiry: async (id) => {
    const response = await api.patch(`/admin/contact-inquiries/${id}/resolve`)
    return response.data
  },

  getActivityLogs: async (filters = {}) => {
    const response = await api.get('/admin/activity-logs', { params: filters })
    return response.data
  },

  submitContact: async (data) => {
    const response = await api.post('/contact', data)
    return response.data
  },
}
