import { useState, useEffect } from 'react'
import WorkflowCard from '../components/WorkflowCard'
import LogsPanel from '../components/LogsPanel'
import AgentTimeline, { TimelineEvent } from '../components/AgentTimeline'
import YamlPreview from '../components/YamlPreview'
import MetricsCard from '../components/MetricsCard'

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
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [generating, setGenerating] = useState(false)
  const [runningWorkflow, setRunningWorkflow] = useState<string | null>(null)
  const [previewWorkflow, setPreviewWorkflow] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

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
        body: JSON.stringify({ text: nlInput, demoMode }),
      })

      const data = await response.json()

      if (data.success) {
        addLog(`✓ Workflow generated: ${data.workflow?.id || data.workflow?.name || 'unknown'}`)
        if (data.git?.branch) {
          addLog(`✓ Branch created: ${data.git.branch}`)
        }
        if (data.workflow?.tasks) {
          addLog(`✓ Created ${data.workflow.tasks} task(s)`)
        }
        if (data.workflow?.scripts) {
          addLog(`✓ Generated ${data.workflow.scripts.length} script(s)`)
        }
        
        // Update timeline with events from backend
        if (data.timeline) {
          setTimeline(data.timeline)
        }
        
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
        let hasOutput = false;
        if (data.logs && Array.isArray(data.logs)) {
          data.logs.forEach((log: any) => {
            // Format log objects properly
            if (typeof log === 'object') {
              addLog(`[${log.timestamp || ''}] ${log.level?.toUpperCase() || 'INFO'}: ${log.message || ''}`)
              // Display output from successful tasks
              if (log.level === 'success' && log.output) {
                addLog(`\n📤 Output:\n${log.output}`)
                hasOutput = true;
              }
            } else {
              addLog(String(log))
            }
          })
        }
        addLog(`✓ Workflow completed successfully`)
        
        // Display outputs from files
        if (data.outputs && Object.keys(data.outputs).length > 0) {
          addLog(`\n=== Output Files ===`)
          Object.entries(data.outputs).forEach(([filename, content]) => {
            addLog(`📄 ${filename}:`)
            addLog(`${String(content).substring(0, 500)}...`)
          })
        } else if (!hasOutput) {
          addLog(`Output: ${data.outputPath || 'N/A'}`)
        }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AutoTaskOps
              </h1>
              <p className="mt-2 text-lg text-gray-700 font-medium">
                Turn English into Automation. No code. No YAML. Just one sentence.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-700">🎭 Demo Mode</span>
              </label>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">✨ AI-Powered</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">🚀 Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Input & Workflows */}
          <div className="space-y-6">
            {/* Natural Language Input */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🤖</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  What should your AI agent do?
                </h2>
              </div>
              <textarea
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="Try: 'Get weather for Tokyo and email me daily' or 'Fetch Bitcoin price every hour'..."
                className="w-full h-36 px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 resize-none text-lg"
                disabled={generating}
              />
              <button
                onClick={handleGenerate}
                disabled={generating || !nlInput.trim()}
                className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
              >
                {generating ? '✨ Building Your Automation...' : '🚀 Build Automation'}
              </button>
            </div>

            {/* Workflows List */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  🎯 Your AI Automations
                </h2>
                <span className="text-sm text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
                  {workflows.length} active
                </span>
              </div>
              <div className="space-y-3">
                {workflows.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-2xl mb-2">🎨</p>
                    <p className="text-gray-600 font-medium">Your AI agent is waiting...</p>
                    <p className="text-gray-400 text-sm mt-1">Describe what you need above!</p>
                  </div>
                ) : (
                  workflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      onRun={handleRun}
                      onViewDetails={(id) => setPreviewWorkflow(id)}
                      isRunning={runningWorkflow === workflow.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Metrics, Timeline & Logs */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <MetricsCard workflows={workflows} logs={logs} />
            <AgentTimeline events={timeline} />
            <LogsPanel logs={logs} onClear={() => setLogs([])} />
          </div>
        </div>
      </main>

      {/* YAML Preview Modal */}
      {previewWorkflow && (
        <YamlPreview
          workflowId={previewWorkflow}
          isOpen={!!previewWorkflow}
          onClose={() => setPreviewWorkflow(null)}
        />
      )}
    </div>
  )
}
