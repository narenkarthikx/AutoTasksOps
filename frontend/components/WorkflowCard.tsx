interface WorkflowCardProps {
  workflow: {
    id: string
    name: string
    description: string
    status: 'ready' | 'running' | 'completed' | 'error'
  }
  onRun: (workflowId: string) => void
  isRunning: boolean
}

export default function WorkflowCard({ workflow, onRun, isRunning }: WorkflowCardProps) {
  const statusColors = {
    ready: 'bg-green-100 text-green-800',
    running: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <div className="border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-400 transition-all bg-gradient-to-br from-white to-purple-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">🤖</span>
            <h3 className="font-bold text-gray-900 text-lg">{workflow.name}</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{workflow.description}</p>
          <div className="flex items-center space-x-2 mt-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColors[workflow.status]}`}>
              {workflow.status === 'ready' ? '✅ Ready' : workflow.status === 'running' ? '⚡ Running' : workflow.status}
            </span>
            <span className="text-xs text-gray-400">• AI-Generated</span>
          </div>
        </div>
        <button
          onClick={() => onRun(workflow.id)}
          disabled={isRunning}
          className="ml-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-bold rounded-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-md"
        >
          {isRunning ? '⚡ Running...' : '▶️ Run'}
        </button>
      </div>
    </div>
  )
}
