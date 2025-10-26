'use client'

import { useState, useEffect } from 'react'
import PollCard from '@/components/PollCard'
import CreatePollModal from '@/components/CreatePollModal'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Poll } from '@/types/poll'

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { connected, lastMessage } = useWebSocket('/api/ws')

  // Fetch polls on mount
  useEffect(() => {
    fetchPolls()
  }, [])

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        console.log('WebSocket message received:', data.type, 'for poll:', data.pollId)
        
        if (data.type === 'vote') {
          setPolls((prevPolls) =>
            prevPolls.map((poll) =>
              poll.id === data.pollId
                ? {
                    ...poll,
                    options: data.data.options,
                    totalVotes: data.data.totalVotes,
                  }
                : poll
            )
          )
        } else if (data.type === 'like') {
          setPolls((prevPolls) =>
            prevPolls.map((poll) =>
              poll.id === data.pollId
                ? { ...poll, totalLikes: data.data.totalLikes }
                : poll
            )
          )
      } else if (data.type === 'new_poll') {
        setPolls((prevPolls) => [data.data, ...prevPolls])
      }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }, [lastMessage])

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls')
      const data = await response.json()
      setPolls(data.polls)
    } catch (error) {
      console.error('Error fetching polls:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePollCreated = () => {
    setIsModalOpen(false)
    fetchPolls()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-primary-700 mb-2">
            QuickPoll
          </h1>
          <p className="text-lg text-gray-600">
            Real-time opinion polling platform
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600">
              {connected ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* Create Poll Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Create New Poll
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No polls yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {polls.map((poll, index) => (
              <PollCard key={poll.id} poll={poll} index={index} />
            ))}
          </div>
        )}

        {/* Create Poll Modal */}
        {isModalOpen && (
          <CreatePollModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPollCreated={handlePollCreated}
          />
        )}
      </div>
    </main>
  )
}

