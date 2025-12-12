# AutoTaskOps

> **Convert plain English into runnable Kestra workflows with AI**

AutoTaskOps is an intelligent workflow automation platform that transforms natural language descriptions into executable Kestra workflows. Simply describe what you want to automate in plain English, and let AI generate the complete workflow with scripts, configurations, and execution logic.

## 🚀 Features

- **Natural Language to Workflow**: Describe your automation task in plain English
- **AI-Powered Generation**: Uses Google Gemini 2.5 Flash to generate Kestra YAML and scripts
- **Simulated Runner**: Execute workflows locally with real-time log streaming
- **Git Integration**: Auto-commit generated workflows to separate branches
- **Demo Mode**: Deterministic execution with mock responses for demos
- **Web Interface**: Clean, intuitive UI built with Next.js and Tailwind CSS

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

1. **Open the Web UI**: Navigate to `http://localhost:3000`
2. **Describe Your Task**: Enter a plain English description (e.g., "Fetch latest tech news, summarize it, and send via email")
3. **Generate Workflow**: Click "Generate Workflow" to create the automation
4. **Review & Run**: See the generated workflow and scripts, then click "Run" to execute
5. **Monitor Logs**: Watch real-time execution logs in the logs panel

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
