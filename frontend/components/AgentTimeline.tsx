import React from 'react'

export interface TimelineEvent {
  id: string
  timestamp: string
  type: 'prompt' | 'files' | 'commit' | 'run' | 'output'
  title: string
  details?: string
  status: 'pending' | 'success' | 'error'
  metadata?: {
    filesCreated?: string[]
    commitHash?: string
    branch?: string
    outputPath?: string
    duration?: number
  }
}

interface AgentTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const AgentTimeline: React.FC<AgentTimelineProps> = ({ events, className = '' }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'prompt': return '🤖'
      case 'files': return '📝'
      case 'commit': return '🔀'
      case 'run': return '⚡'
      case 'output': return '✅'
      default: return '•'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 border-green-300 text-green-800'
      case 'error': return 'bg-red-100 border-red-300 text-red-800'
      case 'pending': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  if (events.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">📋</span>
          <h2 className="text-2xl font-bold text-gray-900">Agent Timeline</h2>
        </div>
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl block mb-3">🧠</span>
          <p>No agent activity yet. Build an automation to see the magic happen!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">📋</span>
          <h2 className="text-2xl font-bold text-gray-900">Agent Timeline</h2>
        </div>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
          {events.length} Events
        </span>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={event.id}
            className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${getStatusColor(event.status)}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{getIcon(event.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{event.title}</h3>
                  <span className="text-xs opacity-75">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {event.details && (
                  <p className="text-sm mt-1 opacity-90">{event.details}</p>
                )}

                {event.metadata && (
                  <div className="mt-2 space-y-1 text-xs">
                    {event.metadata.filesCreated && (
                      <div>
                        <span className="font-semibold">Files: </span>
                        {event.metadata.filesCreated.join(', ')}
                      </div>
                    )}
                    {event.metadata.commitHash && (
                      <div>
                        <span className="font-semibold">Commit: </span>
                        <code className="bg-black/10 px-1 rounded">{event.metadata.commitHash.substring(0, 7)}</code>
                      </div>
                    )}
                    {event.metadata.branch && (
                      <div>
                        <span className="font-semibold">Branch: </span>
                        <code className="bg-black/10 px-1 rounded">{event.metadata.branch}</code>
                      </div>
                    )}
                    {event.metadata.outputPath && (
                      <div>
                        <span className="font-semibold">Output: </span>
                        {event.metadata.outputPath}
                      </div>
                    )}
                    {event.metadata.duration && (
                      <div>
                        <span className="font-semibold">Duration: </span>
                        {event.metadata.duration}ms
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AgentTimeline
