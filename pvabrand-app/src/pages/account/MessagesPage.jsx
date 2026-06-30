import ChatBox from '../../components/ChatBox'

export default function CustomerMessagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Messages</h1>
      <p className="text-gray-500 mb-6">Chat with vendors about your purchases.</p>
      <ChatBox />
    </div>
  )
}
