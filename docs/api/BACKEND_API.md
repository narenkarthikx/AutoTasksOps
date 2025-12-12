# AutoTaskOps Backend

Node.js backend for AutoTaskOps - handles workflow generation, execution, and management.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your API keys (or leave DEMO_MOCK=true for testing).

### Running

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev

# Or directly
node index.js
```

Server will start on `http://localhost:3001`

## 📡 API Endpoints

### POST /api/generate

Generate a workflow from natural language.

**Request:**
```json
{
  "text": "Summarize tech news every morning at 7am"
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "summarize-news",
    "name": "summarize-news",
    "description": "Fetch and summarize news articles",
    "tasks": 3,
    "schedule": "0 7 * * *"
  }
}
```

### GET /api/workflows

List all available workflows.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "workflows": [
    {
      "id": "summarize-news",
      "name": "summarize-news",
      "scripts": 3,
      "lastRun": "2025-12-12T..."
    }
  ]
}
```

### POST /api/run

Execute a workflow.

**Request:**
```json
{
  "workflowId": "summarize-news"
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "summarize-news",
  "duration": 1234,
  "logs": [...],
  "outputs": {
    "summary.txt": "..."
  }
}
```

## 🧪 Testing

### Test Workflow Generation

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"text": "Send me weather updates every hour"}'
```

### Test Workflow Execution

```bash
curl -X POST http://localhost:3001/api/run \
  -H "Content-Type: application/json" \
  -d '{"workflowId": "summarize-news"}'
```

### List Workflows

```bash
curl http://localhost:3001/api/workflows
```

## 🔧 CLI Runner

Run workflows directly without the API:

```bash
node runner.js --workflow ../workflows/summarize-news/summarize-news.yaml
```

This executes all tasks sequentially and saves logs.

## 📁 Project Structure

```
backend/
├── index.js              # Express server
├── runner.js             # Workflow executor
├── routes/
│   ├── generate.js       # POST /api/generate
│   ├── workflows.js      # GET /api/workflows
│   └── run.js           # POST /api/run
├── services/
│   ├── llm.js           # AI generation service
│   └── git-helper.js    # Git operations
└── package.json
```

## 🤖 LLM Integration

The backend uses Google Gemini by default. To use a different LLM:

1. Edit `services/llm.js`
2. Add your LLM client
3. Update `generateWorkflowFromText()` function

Supported modes:
- **Mock mode** (DEMO_MOCK=true): Deterministic responses
- **Real mode**: Actual API calls

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3001) |
| `DEMO_MOCK` | Enable mock mode | No (default: true) |
| `GOOGLE_AI_API_KEY` | Gemini API key | No (for real mode) |
| `OPENAI_API_KEY` | OpenAI alternative | No |
| `NEWS_API_KEY` | NewsAPI key | No |

## 🐛 Troubleshooting

### Port already in use
```bash
PORT=3002 npm start
```

### Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### Git operations failing
Git operations are non-blocking. If they fail, workflow generation continues.

---

*Part of AutoTaskOps Project*
