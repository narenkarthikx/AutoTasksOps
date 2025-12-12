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
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
          <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColors[workflow.status]}`}>
            {workflow.status}
          </span>
        </div>
        <button
          onClick={() => onRun(workflow.id)}
          disabled={isRunning}
          className="ml-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>
    </div>
  )
}
