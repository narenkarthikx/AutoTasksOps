import { useEffect, useRef } from 'react'

interface LogsPanelProps {
  logs: string[]
  onClear: () => void
}

export default function LogsPanel({ logs, onClear }: LogsPanelProps) {
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-2xl font-bold text-gray-900">Your Agent is Working...</h2>
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-800 border-2 border-purple-200 hover:border-purple-400 rounded-lg transition-all"
        >
          Clear
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-5 h-[500px] overflow-y-auto font-mono text-sm shadow-inner">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-4xl mb-3">🧠</p>
            <p className="font-semibold">Waiting for your command...</p>
            <p className="text-xs mt-1">Create an automation to see live execution</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('✓') || log.includes('success')
                    ? 'text-green-400'
                    : log.includes('✗') || log.includes('Error') || log.includes('failed')
                    ? 'text-red-400'
                    : 'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
