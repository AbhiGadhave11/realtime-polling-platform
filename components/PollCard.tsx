'use client'

import { useState } from 'react'
import { Poll } from '@/types/poll'
import { nanoid } from 'nanoid'
import ProgressBar from './ProgressBar'
import VoteButton from './VoteButton'
import LikeButton from './LikeButton'

interface PollCardProps {
  poll: Poll
  index: number
}

export default function PollCard({ poll, index }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [votedOption, setVotedOption] = useState<string | null>(null)

  const userId = useState(() => {
    // Get or create user ID from localStorage
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userId')
      if (!id) {
        id = nanoid()
        localStorage.setItem('userId', id)
      }
      return id
    }
    return null
  })[0]

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    setSelectedOption(optionId)

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll.id,
          optionId,
          userId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setHasVoted(true)
        setVotedOption(optionId)
      } else {
        console.error('Voting failed:', data.error)
        alert(data.error || 'Failed to vote')
        setSelectedOption(null)
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('An error occurred while voting')
      setSelectedOption(null)
    } finally {
      setIsVoting(false)
    }
  }

  const handleLike = async () => {
    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll.id,
          userId,
        }),
      })
    } catch (error) {
      console.error('Error liking:', error)
    }
  }

  // Calculate the leader (option with most votes)
  const leader = poll.options.reduce(
    (max, option) => (option.votes > max.votes ? option : max),
    poll.options[0]
  )

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {poll.title}
          </h2>
          {poll.description && (
            <p className="text-gray-600 mb-4">{poll.description}</p>
          )}
        </div>
        <LikeButton pollId={poll.id} totalLikes={poll.totalLikes} onLike={handleLike} />
      </div>

      <div className="space-y-3 mb-4">
        {poll.options.map((option) => {
          const isSelected = selectedOption === option.id
          const isVoted = votedOption === option.id
          const isLeader = leader.id === option.id && poll.totalVotes > 0

          return (
            <div key={option.id} className="relative">
              <VoteButton
                option={option}
                onVote={() => handleVote(option.id)}
                disabled={hasVoted || isVoting}
                isSelected={isSelected}
                isVoted={isVoted}
                isLeader={isLeader}
                hasVoted={hasVoted}
              />
              <ProgressBar percentage={option.percentage} />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
        <span>{poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}</span>
        <span className="text-xs text-gray-400">
          {new Date(poll.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}

