'use client'

import { useState, useEffect } from 'react'

interface LikeButtonProps {
  pollId: string
  totalLikes: number
  onLike: () => void
}

export default function LikeButton({ pollId, totalLikes, onLike }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedLikes, setDisplayedLikes] = useState(totalLikes)

  useEffect(() => {
    setDisplayedLikes(totalLikes)
  }, [totalLikes])

  const handleClick = () => {
    setIsAnimating(true)
    setIsLiked(!isLiked)
    onLike()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${isLiked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
    >
      <span
        className={`text-xl transition-transform duration-200 ${
          isAnimating ? 'scale-125' : 'scale-100'
        }`}
      >
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span className="font-semibold">{displayedLikes}</span>
    </button>
  )
}

