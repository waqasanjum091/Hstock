import api from './api'

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/conversations')
    return response.data
  },

  startConversation: async (participantId) => {
    const response = await api.post('/conversations', { participant_id: participantId })
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
