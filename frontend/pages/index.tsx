import { useState, useEffect } from 'react'
import WorkflowCard from '../components/WorkflowCard'
import LogsPanel from '../components/LogsPanel'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'ready' | 'running' | 'completed' | 'error'
}

export default function Home() {
  const [nlInput, setNlInput] = useState('')
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [runningWorkflow, setRunningWorkflow] = useState<string | null>(null)

  // Fetch workflows on mount
  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows')
      const data = await response.json()
      setWorkflows(data.workflows || [])
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
      addLog('Error: Failed to fetch workflows')
    }
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleGenerate = async () => {
    if (!nlInput.trim()) {
      addLog('Error: Please enter a workflow description')
      return
    }

    setGenerating(true)
    addLog(`Generating workflow from: "${nlInput}"`)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: nlInput }),
      })

      const data = await response.json()

      if (data.success) {
        addLog(`✓ Workflow generated: ${data.workflowId}`)
        addLog(`✓ Branch created: ${data.branch}`)
        setNlInput('')
        fetchWorkflows()
      } else {
        addLog(`✗ Generation failed: ${data.error}`)
      }
    } catch (error) {
      addLog(`✗ Error: ${error}`)
    } finally {
      setGenerating(false)
    }
  }

  const handleRun = async (workflowId: string) => {
    setRunningWorkflow(workflowId)
    addLog(`Starting workflow: ${workflowId}`)

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })

      const data = await response.json()

      if (data.success) {
        // Stream logs if available
        if (data.logs && Array.isArray(data.logs)) {
          data.logs.forEach((log: string) => addLog(log))
        }
        addLog(`✓ Workflow completed successfully`)
        addLog(`Output: ${data.outputPath || 'N/A'}`)
      } else {
        addLog(`✗ Workflow failed: ${data.error}`)
      }
    } catch (error) {
      addLog(`✗ Error: ${error}`)
    } finally {
      setRunningWorkflow(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            AutoTaskOps
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Convert plain English into runnable Kestra workflows with AI
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Input & Workflows */}
          <div className="space-y-6">
            {/* Natural Language Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Describe Your Workflow
              </h2>
              <textarea
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="Example: Fetch latest tech news, summarize it with AI, and send via email"
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={generating}
              />
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="mt-4 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {generating ? 'Generating...' : 'Generate Workflow'}
              </button>
            </div>

            {/* Workflows List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Workflows
              </h2>
              <div className="space-y-3">
                {workflows.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No workflows yet. Generate one above!
                  </p>
                ) : (
                  workflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onRun={handleRun}
                      isRunning={runningWorkflow === workflow.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Logs */}
          <div className="lg:sticky lg:top-8 h-fit">
            <LogsPanel logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>
      </main>
    </div>
  )
}
