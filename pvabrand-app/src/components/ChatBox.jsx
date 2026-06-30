import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiSend, FiMessageSquare } from 'react-icons/fi'
import { chatService } from '../services/chatService'

/**
 * Two-pane chat used by both customers and vendors.
 * Conversation list (left) + message thread (right). Polls for new messages.
 */
export default function ChatBox() {
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState(null)
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  const { data: convData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    refetchInterval: 10000,
  })
  const conversations = convData?.data || []

  const { data: msgData } = useQuery({
    queryKey: ['messages', activeId],
    queryFn: () => chatService.getMessages(activeId),
    enabled: !!activeId,
    refetchInterval: 4000,
  })
  const messages = msgData?.data || []

  const sendMutation = useMutation({
    mutationFn: (body) => chatService.sendMessage(activeId, body),
    onSuccess: () => {
      setText('')
      queryClient.invalidateQueries({ queryKey: ['messages', activeId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const active = conversations.find((c) => c.id === activeId)

  const handleSend = (e) => {
    e.preventDefault()
    if (text.trim()) sendMutation.mutate(text.trim())
  }

  return (
    <div className="bg-white rounded-lg shadow flex h-[70vh] overflow-hidden">
      {/* Conversation list */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-gray-400">Loading…</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No conversations yet.</p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  activeId === c.id ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {c.other_user?.name || 'Unknown user'}
                  </span>
                  {c.unread_count > 0 && (
                    <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                      {c.unread_count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{c.last_message || 'No messages yet'}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 flex flex-col">
        {!active ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FiMessageSquare size={40} className="mb-3" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200">
              <p className="font-semibold text-gray-900">{active.other_user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{active.other_user?.role}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.is_mine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                      m.is_mine
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.body}</p>
                    <p className={`text-[10px] mt-1 ${m.is_mine ? 'text-orange-100' : 'text-gray-400'}`}>
                      {new Date(m.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="submit"
                disabled={sendMutation.isPending || !text.trim()}
                className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-600 disabled:opacity-50"
              >
                <FiSend size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
