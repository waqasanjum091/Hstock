import api from './api'

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/conversations')
    return response.data
  },

  // Accepts a user id (string) or an options object: { participant_id } | { vendor_id }
  startConversation: async (target) => {
    const payload = typeof target === 'object' ? target : { participant_id: target }
    const response = await api.post('/conversations', payload)
    return response.data
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`)
    return response.data
  },

  sendMessage: async (conversationId, message) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, { message })
    return response.data
  },
}
