# AutoTaskOps Backend

Node.js Express API server and workflow runner.

## 🚀 Quick Start

```powershell
npm install
npm start
```

Server runs on **http://localhost:3001**

## 📚 Documentation

**Full documentation:** [Backend API Reference](../docs/api/BACKEND_API.md)

## 🔗 Key Files

- `index.js` - Express server
- `runner.js` - Workflow executor
- `routes/` - API endpoints
- `services/` - LLM and Git services

## 🌍 Environment

Copy `.env.example` to `.env` and configure:

```bash
DEMO_MOCK=true
PORT=3001
GOOGLE_AI_API_KEY=your-key
```

---

**For complete API documentation, testing guides, and examples, see [../docs/api/BACKEND_API.md](../docs/api/BACKEND_API.md)**
