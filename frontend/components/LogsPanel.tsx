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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Execution Logs</h2>
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet. Generate or run a workflow to see logs.</p>
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
