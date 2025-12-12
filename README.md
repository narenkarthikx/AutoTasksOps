# AutoTaskOps

> **Turn English into Automation.**

Tell AutoTaskOps what you want in plain English — the agent generates, commits, and runs a complete automation pipeline for you.

## 🎯 What Makes This Different

**You type one sentence. The AI builds a complete automation.**

- 🤖 **AI Agent Creates Everything** - Not just templates. Real Python/Bash scripts, YAML workflows, and git commits.
- 🔍 **Full Audit Trail** - See every LLM prompt, file created, commit hash, and execution log.
- 🚀 **One-Click Execution** - Generated workflows run immediately with real-time logs.
- 🎭 **Demo Mode** - Deterministic, canned responses so demos never fail.
- ⚡ **Unique Workflows** - Each generation creates properly named, customized automation (not generic templates).
- 🔄 **Git Integration** - Auto-commits to `autogen/<workflow-id>` branches with proper PR flow.

## ✨ Unique Features (Hackathon-Ready)

✅ **Agent Timeline** - Visual evidence of AI actions (prompts → files → commits → runs)  
✅ **YAML Explain** - Human-readable breakdown of generated workflows  
✅ **Smart Runner** - Parses Kestra YAML and executes scripts with output capture  
✅ **Safety First** - Confirmation modals for destructive operations  
✅ **Metrics Dashboard** - Track generated workflows, run success rates, and performance  
✅ **Template Marketplace** - Save and reuse successful workflows (coming soon)

## 📋 Project Structure

```
AutoTaskOps/
├── frontend/          # Next.js TypeScript UI
├── backend/           # Node.js Express API + Runner
├── workflows/         # Generated and example workflows
├── kestra/            # Kestra Docker setup
├── .github/workflows/ # CI/CD pipelines
└── README.md          # This file
```

## 🛠️ Environment Variables

### Backend (.env in backend/)
```env
# Required for workflow generation
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Optional: Enable mock mode for deterministic demos
DEMO_MOCK=true

# Optional: Kestra API (if using real Kestra instance)
KESTRA_API_URL=http://localhost:8080
KESTRA_API_KEY=your_kestra_api_key
```

### Frontend (.env.local in frontend/)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚦 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/narenkarthikx/AutoTasksOps.git
cd AutoTaskOps
```

### 2. Set Up Backend
```bash
cd backend
npm install
# Create .env file with your API keys
node index.js
```

Backend will run on `http://localhost:3001`

### 3. Set Up Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Run Example Workflow
```bash
cd backend
node runner.js --workflow ../workflows/summarize-news/summarize-news.yaml
```

## 📖 Usage

### Basic Workflow

1. **Open the Web UI**: Navigate to `http://localhost:3000` (or `3002` if 3000 is in use)
2. **Enable Demo Mode** (Optional): Toggle "🎭 Demo Mode" for deterministic, canned responses perfect for demos
3. **Describe Your Automation**: Enter plain English in the text area:
   - "Get Bitcoin price every hour"
   - "Fetch latest tech news and email me daily"
   - "Get current time in Tokyo and save to file"
4. **Build Automation**: Click "🚀 Build Automation" button
5. **Watch the Magic**: 
   - See **Agent Timeline** showing AI actions (prompts → files → commits)
   - Check **Metrics** dashboard for success rates
   - View generated files in real-time
6. **Preview YAML**: Click "📋 Details" on any workflow to see:
   - AI-generated explanation
   - Task breakdown
   - Complete YAML configuration
7. **Run Workflow**: Click "▶️ Run" and monitor execution logs
8. **Check Outputs**: Results saved to `workflows/<workflow-id>/output/`

### Example Prompts

```
✅ "Fetch current weather for New York and save to file"
✅ "Get Bitcoin price and log to console"  
✅ "Summarize top news articles and email me"
✅ "Fetch GitHub trending repos and save as JSON"
✅ "Get current time in multiple timezones"
```

## 🐳 Running with Kestra

To use real Kestra instead of the simulated runner:

```bash
cd kestra
docker-compose up -d
```

Access Kestra UI at `http://localhost:8080`

## 🔧 Development

### Backend Endpoints

- `POST /api/generate` - Generate workflow from natural language
  ```json
  { "text": "Summarize news and send email" }
  ```

- `GET /api/workflows` - List all workflows
  
- `POST /api/run` - Execute a workflow
  ```json
  { "workflowId": "summarize-news" }
  ```

### CLI Runner

Run workflows directly from command line:
```bash
node backend/runner.js --workflow workflows/your-workflow/workflow.yaml
```

## 🧪 Demo Mode

Enable `DEMO_MOCK=true` in your environment to run without external API calls. The system will use cached/mock responses for:
- LLM workflow generation
- News fetching
- Email sending

Perfect for demos, testing, and CI/CD!

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with TypeScript
- **Tailwind CSS** - Utility-first styling with magical gradients
- **Components**: AgentTimeline, YamlPreview, LogsPanel, MetricsCard

### Backend
- **Node.js + Express** - REST API server
- **Google Gemini 2.5 Flash** - LLM for workflow generation
- **simple-git** - Automatic git commits and branches
- **js-yaml** - YAML parsing for workflows

### Workflow Runner
- **Simulated Runner** - Executes scripts locally with output capture
- **Kestra** (Optional) - Production workflow orchestration
- **Cross-platform** - Supports Windows (.bat) and Unix (.sh)

### CI/CD
- **GitHub Actions** - Automated testing and deployment
- **CodeRabbit** (Optional) - AI code reviews on PRs
- **Vercel** - Frontend deployment

## 🎯 Architecture Flow

```
User Input (UI)
    ↓
Backend API (/api/generate)
    ↓
Google Gemini AI (prompt → structured JSON)
    ↓
File Generation (YAML + Python/Bash scripts)
    ↓
Git Commit (autogen/<workflow-id> branch)
    ↓
Runner Execution (parse YAML → run scripts)
    ↓
Output Capture (logs + results)
    ↓
UI Display (timeline + logs + metrics)
```

## 📊 Key Metrics

- ⚡ **Generation Speed**: ~2-5 seconds per workflow
- 🎯 **Success Rate**: Tracked in real-time metrics dashboard
- 📝 **Lines of Code**: Generated automatically (50-200 lines per workflow)
- 🔄 **Git Integration**: Auto-commit with proper branch naming

## ✅ Production Checklist

- [x] Natural language to workflow conversion
- [x] AI-powered script generation
- [x] Agent Timeline with audit trail
- [x] YAML Preview with AI explanations
- [x] Demo Mode for deterministic testing
- [x] Metrics dashboard
- [x] Real-time log streaming
- [x] Git auto-commit and branching
- [x] Cross-platform runner
- [x] Environment-based configuration
- [x] Error handling and fallbacks
- [x] CI/CD pipeline

## 📚 Documentation

**[→ View Complete Documentation](docs/README.md)**

Quick Links:
- **[Quick Start Guide](docs/guides/QUICK_START.md)** - Get running in 5 minutes
- **[Backend API Reference](docs/api/BACKEND_API.md)** - Complete API docs
- **[Frontend Guide](docs/guides/FRONTEND_GUIDE.md)** - UI documentation
- **[Kestra Setup](docs/guides/KESTRA_SETUP.md)** - Orchestration setup
- **[Example Workflow](docs/workflows/SUMMARIZE_NEWS.md)** - Workflow guide
- **[Project Status](docs/PROJECT_COMPLETE.md)** - Completion checklist

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT

## 🔗 Demo Link

🚧 **Coming Soon** - Live demo will be deployed on Vercel

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, Node.js, Kestra, and Google Gemini AI**
