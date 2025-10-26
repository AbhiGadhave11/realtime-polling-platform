'use client'

interface VoteButtonProps {
  option: {
    id: string
    text: string
    votes: number
    percentage: number
  }
  onVote: () => void
  disabled: boolean
  isSelected: boolean
  isVoted: boolean
  isLeader: boolean
  hasVoted: boolean
}

export default function VoteButton({
  option,
  onVote,
  disabled,
  isSelected,
  isVoted,
  isLeader,
  hasVoted,
}: VoteButtonProps) {
  const getButtonClass = () => {
    if (disabled && hasVoted) {
      if (isVoted) {
        return 'bg-primary-600 text-white border-primary-700'
      }
      return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
    }

    if (isSelected) {
      return 'bg-primary-500 text-white border-primary-600 hover:bg-primary-600'
    }

    return 'bg-white text-gray-800 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
  }

  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
        ${getButtonClass()}
        ${disabled && !hasVoted ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${isLeader && hasVoted ? 'ring-2 ring-primary-400' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="flex-1">{option.text}</span>
        {hasVoted && (
          <div className="flex items-center gap-2 ml-3">
            <span className="text-sm font-bold">{option.percentage}%</span>
            {isVoted && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                Your vote
              </span>
            )}
            {isLeader && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center">
                🏆
                <span className="ml-1">Leader</span>
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

