import { runWorkflow as executeWorkflow } from '../runner.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * POST /api/run
 * Execute a workflow and stream logs
 */
export async function runWorkflow(req, res) {
  try {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({
        success: false,
        error: 'workflowId is required'
      });
    }

    console.log(`\n🚀 Running workflow: ${workflowId}\n`);

    // Find workflow directory
    const workflowDir = path.join(__dirname, '../../workflows', workflowId);
    
    // Check if workflow exists
    try {
      await fs.access(workflowDir);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: `Workflow not found: ${workflowId}`
      });
    }

    // Find YAML file
    const files = await fs.readdir(workflowDir);
    const yamlFile = files.find(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    if (!yamlFile) {
      return res.status(400).json({
        success: false,
        error: 'No workflow YAML file found'
      });
    }

    const workflowPath = path.join(workflowDir, yamlFile);

    // Execute workflow
    const result = await executeWorkflow(workflowPath);

    // Read output files if available
    const outputDir = path.join(workflowDir, 'output');
    let outputs = {};
    
    try {
      const outputFiles = await fs.readdir(outputDir);
      for (const file of outputFiles) {
        try {
          const content = await fs.readFile(path.join(outputDir, file), 'utf8');
          outputs[file] = content;
        } catch (e) {
          // Skip files that can't be read
        }
      }
    } catch (e) {
      // No output directory
    }

    // Return results
    res.json({
      success: result.success,
      workflowId,
      duration: result.duration,
      logs: result.logs,
      outputs,
      error: result.error
    });

  } catch (error) {
    console.error('Error running workflow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export default runWorkflow;
