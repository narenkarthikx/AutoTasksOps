import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Import routes
import { generateWorkflow } from './routes/generate.js';
import { listWorkflows } from './routes/workflows.js';
import { runWorkflow } from './routes/run.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.post('/api/generate', generateWorkflow);
app.get('/api/workflows', listWorkflows);
app.post('/api/run', runWorkflow);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AutoTaskOps API',
    version: '1.0.0',
    endpoints: {
      generate: 'POST /api/generate - Generate workflow from natural language',
      workflows: 'GET /api/workflows - List all workflows',
      run: 'POST /api/run - Execute a workflow'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 AutoTaskOps Backend Server`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}\n`);
  console.log(`Environment:`);
  console.log(`  - DEMO_MOCK: ${process.env.DEMO_MOCK || 'false'}`);
  console.log(`  - GOOGLE_AI_API_KEY: ${process.env.GOOGLE_AI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log('');
});

export default app;
