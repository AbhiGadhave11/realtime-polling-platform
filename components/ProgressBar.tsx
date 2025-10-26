'use client'

interface ProgressBarProps {
  percentage: number
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  if (percentage === 0) return null

  return (
    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

