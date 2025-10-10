import ChatInterface from '@/components/chat-interface'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-2 md:p-4">
      <div className="container mx-auto h-screen py-2 md:py-4 flex items-center">
        <ChatInterface />
      </div>
    </div>
  )
}