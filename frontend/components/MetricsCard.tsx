import React from 'react'

interface MetricCardProps {
  workflows: any[]
  logs: string[]
}

const MetricsCard: React.FC<MetricCardProps> = ({ workflows, logs }) => {
  const totalWorkflows = workflows.length
  const readyWorkflows = workflows.filter(w => w.status === 'ready').length
  const completedWorkflows = workflows.filter(w => w.status === 'completed').length
  const totalRuns = logs.filter(log => log.includes('Running workflow')).length

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">📊</span>
        <h2 className="text-2xl font-bold text-gray-900">Metrics</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="text-3xl font-bold text-indigo-600">{totalWorkflows}</div>
          <div className="text-sm text-gray-600 mt-1">Workflows Generated</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="text-3xl font-bold text-green-600">{readyWorkflows}</div>
          <div className="text-sm text-gray-600 mt-1">Ready to Run</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{totalRuns}</div>
          <div className="text-sm text-gray-600 mt-1">Total Executions</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{completedWorkflows}</div>
          <div className="text-sm text-gray-600 mt-1">Completed</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Success Rate</span>
          <span className="font-bold text-green-600">
            {totalRuns > 0 ? Math.round((completedWorkflows / totalRuns) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default MetricsCard
