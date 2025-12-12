import React, { useState, useEffect } from 'react'

interface YamlPreviewProps {
  workflowId: string
  isOpen: boolean
  onClose: () => void
}

interface WorkflowDetails {
  yaml: string
  explanation: string
  tasks: Array<{
    id: string
    name: string
    description: string
  }>
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ workflowId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState<WorkflowDetails | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (isOpen && workflowId) {
      fetchWorkflowDetails()
    }
  }, [isOpen, workflowId])

  const fetchWorkflowDetails = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}/details`)
      const data = await response.json()
      
      if (data.success) {
        setDetails(data.details)
      } else {
        setError(data.error || 'Failed to load workflow details')
      }
    } catch (err) {
      setError('Error fetching workflow details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📋</span>
              <div>
                <h2 className="text-2xl font-bold">Workflow Preview</h2>
                <p className="text-indigo-100 text-sm mt-1">{workflowId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading workflow details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
              <span className="text-xl mr-2">❌</span>
              {error}
            </div>
          )}

          {details && (
            <>
              {/* AI Explanation */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">🤖</span>
                  <h3 className="text-lg font-bold text-gray-900">AI Explanation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{details.explanation}</p>
              </div>

              {/* Tasks Breakdown */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">⚙️</span>
                  <h3 className="text-lg font-bold text-gray-900">Tasks</h3>
                </div>
                <div className="space-y-3">
                  {details.tasks.map((task, index) => (
                    <div key={task.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                      <div className="flex items-start space-x-3">
                        <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{task.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block text-gray-700">
                            {task.id}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* YAML Content */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">📄</span>
                  <h3 className="text-lg font-bold text-gray-900">YAML Configuration</h3>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">{details.yaml}</pre>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YamlPreview
