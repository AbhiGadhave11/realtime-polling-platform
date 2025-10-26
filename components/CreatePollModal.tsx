'use client'

import { useState } from 'react'
import { CreatePollData } from '@/types/poll'

interface CreatePollModalProps {
  isOpen: boolean
  onClose: () => void
  onPollCreated: () => void
}

export default function CreatePollModal({
  isOpen,
  onClose,
  onPollCreated,
}: CreatePollModalProps) {
  const [formData, setFormData] = useState<CreatePollData>({
    title: '',
    description: '',
    options: ['', ''],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.title.trim()) {
      setError('Please enter a title for your poll')
      return
    }

    const validOptions = formData.options.filter((opt) => opt.trim())
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || undefined,
          options: validOptions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create poll')
        return
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        options: ['', ''],
      })
      setError('')
      onPollCreated()
    } catch (error) {
      console.error('Error creating poll:', error)
      setError('An error occurred while creating the poll')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({
        ...formData,
        options: [...formData.options, ''],
      })
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      })
    }
  }

  const updateOption = (index: number, value: string) => {
    setFormData({
      ...formData,
      options: formData.options.map((opt, i) => (i === index ? value : opt)),
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Poll</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Poll Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="What's your favorite programming language?"
                maxLength={200}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Add more context about your poll..."
                rows={3}
                maxLength={1000}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Options * (2-10 options)
              </label>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
                      placeholder={`Option ${index + 1}`}
                      maxLength={100}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formData.options.length < 10 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Add Option
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Poll'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

