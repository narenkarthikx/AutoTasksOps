import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simulated Workflow Runner
 * Executes workflow tasks sequentially and captures logs
 * 
 * Usage: node runner.js --workflow workflows/my-workflow/workflow.yaml
 */

class WorkflowRunner {
  constructor(workflowPath) {
    this.workflowPath = path.resolve(workflowPath);
    this.workflowDir = path.dirname(this.workflowPath);
    this.logs = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Add log entry
   */
  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    };
    this.logs.push(entry);
    
    const emoji = { info: 'ℹ️', success: '✓', error: '❌', warning: '⚠️' }[level] || '•';
    console.log(`[${entry.timestamp}] ${emoji} ${message}`);
  }

  /**
   * Parse workflow YAML file
   */
  async parseWorkflow() {
    try {
      const content = await fs.readFile(this.workflowPath, 'utf8');
      return yaml.load(content);
    } catch (error) {
      throw new Error(`Failed to parse workflow: ${error.message}`);
    }
  }

  /**
   * Execute a single script
   */
  async executeScript(scriptPath, taskName) {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(this.workflowDir, scriptPath);
      const ext = path.extname(scriptPath);
      
      // Determine interpreter
      let command, args;
      if (ext === '.py') {
        command = 'python';
        args = [fullPath];
      } else if (ext === '.sh' || ext === '.bat') {
        // Use .bat on Windows, .sh on Unix
        if (process.platform === 'win32' && ext === '.sh') {
          // Try to use .bat equivalent on Windows
          const batPath = fullPath.replace(/\.sh$/, '.bat');
          try {
            require('fs').accessSync(batPath);
            command = batPath;
            args = [];
          } catch {
            // Fall back to bash if no .bat exists
            command = 'bash';
            args = [fullPath];
          }
        } else if (ext === '.bat') {
          command = fullPath;
          args = [];
        } else {
          command = 'bash';
          args = [fullPath];
        }
      } else {
        command = fullPath;
        args = [];
      }

      this.log('info', `Executing: ${scriptPath}`, { task: taskName });

      const proc = spawn(command, args, {
        cwd: this.workflowDir,
        env: { 
          ...process.env, 
          DEMO_MOCK: process.env.DEMO_MOCK || 'true',
          PYTHONIOENCODING: 'utf-8'
        },
        shell: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        const text = data.toString();
        stdout += text;
        console.log(text.trim());
      });

      proc.stderr.on('data', (data) => {
        const text = data.toString();
        stderr += text;
        console.error(text.trim());
      });

      proc.on('close', (code) => {
        if (code === 0) {
          this.log('success', `Task completed: ${taskName}`, { 
            script: scriptPath, 
            exitCode: code 
          });
          resolve({ stdout, stderr, exitCode: code });
        } else {
          this.log('error', `Task failed: ${taskName}`, { 
            script: scriptPath, 
            exitCode: code,
            stderr 
          });
          reject(new Error(`Script exited with code ${code}`));
        }
      });

      proc.on('error', (error) => {
        this.log('error', `Failed to execute: ${scriptPath}`, { 
          error: error.message 
        });
        reject(error);
      });
    });
  }

  /**
   * Run the complete workflow
   */
  async run() {
    this.startTime = new Date();
    this.log('info', `Starting workflow execution`, { 
      workflow: this.workflowPath 
    });

    try {
      // Parse workflow
      const workflow = await this.parseWorkflow();
      this.log('info', `Loaded workflow: ${workflow.id || 'unnamed'}`, {
        description: workflow.description,
        taskCount: workflow.tasks?.length || 0
      });

      // Execute tasks sequentially
      const tasks = workflow.tasks || [];
      const results = [];

      for (const task of tasks) {
        // Support multiple formats: script, scriptPath, or commands array (Kestra format)
        let scriptPath = task.script || task.scriptPath;
        
        // Parse Kestra commands format
        if (!scriptPath && task.commands && Array.isArray(task.commands)) {
          // Extract script path from commands like "python scripts/script.py" or "bash scripts/script.sh"
          const command = task.commands[0]; // Get first command
          if (command) {
            // Match: python/bash/node followed by script path
            const match = command.match(/(?:python|python3|bash|sh|node)\s+(.+)/);
            if (match) {
              scriptPath = match[1].trim();
            }
          }
        }
        
        if (!scriptPath) {
          this.log('warning', `Task has no script defined`, { 
            task: task.id,
            commands: task.commands 
          });
          continue;
        }

        try {
          const result = await this.executeScript(scriptPath, task.id || task.name);
          results.push({
            task: task.id || task.name,
            success: true,
            ...result
          });
        } catch (error) {
          results.push({
            task: task.id || task.name,
            success: false,
            error: error.message
          });
          
          // Stop on error unless configured otherwise
          if (!workflow.continueOnError) {
            throw error;
          }
        }
      }

      this.endTime = new Date();
      const duration = this.endTime - this.startTime;

      this.log('success', `Workflow completed`, {
        duration: `${duration}ms`,
        tasks: results.length,
        successful: results.filter(r => r.success).length
      });

      // Save run logs
      await this.saveRunLogs();

      return {
        success: true,
        duration,
        results,
        logs: this.logs
      };

    } catch (error) {
      this.endTime = new Date();
      this.log('error', `Workflow failed: ${error.message}`);
      
      await this.saveRunLogs();

      return {
        success: false,
        error: error.message,
        logs: this.logs
      };
    }
  }

  /**
   * Save execution logs to file
   */
  async saveRunLogs() {
    try {
      const runsDir = path.join(this.workflowDir, 'runs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const runDir = path.join(runsDir, timestamp);
      
      await fs.mkdir(runDir, { recursive: true });

      // Save logs as JSON
      const logPath = path.join(runDir, 'log.json');
      await fs.writeFile(logPath, JSON.stringify(this.logs, null, 2));

      // Save logs as text
      const textLogPath = path.join(runDir, 'log.txt');
      const textLogs = this.logs.map(l => 
        `[${l.timestamp}] ${l.level.toUpperCase()}: ${l.message}`
      ).join('\n');
      await fs.writeFile(textLogPath, textLogs);

      this.log('info', `Logs saved to ${runDir}`);
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }
}

/**
 * Run workflow from file path
 */
export async function runWorkflow(workflowPath) {
  const runner = new WorkflowRunner(workflowPath);
  return await runner.run();
}

/**
 * CLI entry point
 */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const workflowIndex = args.indexOf('--workflow');
  
  if (workflowIndex === -1 || !args[workflowIndex + 1]) {
    console.error('Usage: node runner.js --workflow <path-to-workflow.yaml>');
    process.exit(1);
  }

  const workflowPath = args[workflowIndex + 1];
  
  runWorkflow(workflowPath)
    .then((result) => {
      console.log('\n' + '='.repeat(50));
      console.log('Workflow execution completed');
      console.log('='.repeat(50));
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default { runWorkflow, WorkflowRunner };
