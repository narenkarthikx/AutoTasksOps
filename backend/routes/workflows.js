import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GET /api/workflows
 * List all available workflows
 */
export async function listWorkflows(req, res) {
  try {
    const workflowsDir = path.join(__dirname, '../../workflows');
    
    // Read workflows directory
    const entries = await fs.readdir(workflowsDir, { withFileTypes: true });
    
    // Filter for directories only
    const workflowDirs = entries.filter(entry => entry.isDirectory());
    
    // Get details for each workflow
    const workflows = await Promise.all(
      workflowDirs.map(async (dir) => {
        const workflowId = dir.name;
        const workflowPath = path.join(workflowsDir, workflowId);
        
        try {
          // Look for YAML file
          const files = await fs.readdir(workflowPath);
          const yamlFile = files.find(f => f.endsWith('.yaml') || f.endsWith('.yml'));
          
          // Check for scripts
          const scriptsPath = path.join(workflowPath, 'scripts');
          let scripts = [];
          try {
            scripts = await fs.readdir(scriptsPath);
          } catch (e) {
            // No scripts directory
          }
          
          // Check for README
          let description = '';
          const readmePath = path.join(workflowPath, 'README.md');
          try {
            const readme = await fs.readFile(readmePath, 'utf8');
            // Extract first line or description
            const lines = readme.split('\n').filter(l => l.trim());
            description = lines[1] || lines[0] || '';
            description = description.replace(/^#+\s*/, '').trim();
          } catch (e) {
            // No README
          }
          
          // Check for recent runs
          const runsPath = path.join(workflowPath, 'runs');
          let lastRun = null;
          try {
            const runs = await fs.readdir(runsPath);
            if (runs.length > 0) {
              runs.sort().reverse();
              lastRun = runs[0];
            }
          } catch (e) {
            // No runs
          }
          
          return {
            id: workflowId,
            name: workflowId,
            description,
            yamlFile,
            scripts: scripts.length,
            lastRun,
            path: `/workflows/${workflowId}`
          };
        } catch (error) {
          console.error(`Error reading workflow ${workflowId}:`, error);
          return {
            id: workflowId,
            name: workflowId,
            error: 'Failed to read workflow details'
          };
        }
      })
    );
    
    res.json({
      success: true,
      count: workflows.length,
      workflows: workflows.sort((a, b) => a.name.localeCompare(b.name))
    });
    
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export default listWorkflows;
