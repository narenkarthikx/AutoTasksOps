# 🚀 AutoTaskOps - Quick Start Guide

## What You Have Now

A complete AI-powered workflow automation platform with:
- ✅ Working backend API
- ✅ Working frontend UI  
- ✅ Example workflow tested successfully
- ✅ Full documentation
- ✅ CI/CD pipeline
- ✅ Kestra integration ready

---

## ⚡ Start Using in 3 Steps

### Step 1: Start Backend (5 seconds)
```powershell
cd backend
npm start
```
Server will run on **http://localhost:3001**

### Step 2: Start Frontend (5 seconds)
Open a new terminal:
```powershell
cd frontend
npm run dev
```
UI will open on **http://localhost:3000**

### Step 3: Create Your First Workflow
1. Open http://localhost:3000 in your browser
2. Type: `"Send me weather updates every hour"`
3. Click "Generate Workflow"
4. Click "Run" to execute it
5. See real-time logs and outputs!

---

## 🎯 What Can You Do?

### Try These Examples:

```
"Summarize tech news every morning at 7am"
"Check GitHub stars for my repo daily"
"Monitor server health every 5 minutes"
"Generate weekly report on Fridays"
"Fetch crypto prices every hour"
```

---

## 📁 Project Structure

```
AutoTaskOps/
├── backend/          ← API server (Port 3001)
│   ├── index.js      ← Express server
│   ├── runner.js     ← Workflow executor
│   └── routes/       ← API endpoints
├── frontend/         ← Next.js UI (Port 3000)
│   ├── pages/        ← Web pages
│   └── components/   ← React components
├── workflows/        ← Generated workflows
│   └── summarize-news/  ← Example (already working!)
└── kestra/           ← Optional orchestration
```

---

## 🧪 Test the Example Workflow

The `summarize-news` workflow is already tested and working!

### Run it:
```powershell
cd backend
node runner.js --workflow ../workflows/summarize-news/summarize-news.yaml
```

### What it does:
1. ✅ Fetches 3 news articles (mock data)
2. ✅ Generates AI summary
3. ✅ Saves output to files
4. ✅ Shows real-time logs

### Check outputs:
```powershell
cat ../workflows/summarize-news/output/summary.txt
```

---

## 🔐 Environment Setup

### Current Config (Mock Mode - No API Keys Needed!)
File: `backend/.env`
```
DEMO_MOCK=true
PORT=3001
```

This runs everything with deterministic mock data - perfect for demos!

### Want Real APIs? (Optional)
Add to `backend/.env`:
```
DEMO_MOCK=false
GOOGLE_AI_API_KEY=your-gemini-api-key
NEWS_API_KEY=your-newsapi-key
```

Get keys:
- Gemini: https://makersuite.google.com/app/apikey
- NewsAPI: https://newsapi.org/

---

## 🐳 Optional: Kestra Orchestration

For production orchestration:
```powershell
cd kestra
docker-compose up -d
```
Access Kestra UI: http://localhost:8080

---

## 📊 API Endpoints

### Generate Workflow
```powershell
curl -X POST http://localhost:3001/api/generate `
  -H "Content-Type: application/json" `
  -d '{"text": "Your task description"}'
```

### List Workflows
```powershell
curl http://localhost:3001/api/workflows
```

### Run Workflow
```powershell
curl -X POST http://localhost:3001/api/run `
  -H "Content-Type: application/json" `
  -d '{"workflowId": "summarize-news"}'
```

---

## 🎬 Demo Flow

Perfect for showing to judges/investors:

1. **Open browser to localhost:3000**
2. **Type natural language**: "Fetch top news and email summary"
3. **Watch AI generate**: Complete YAML + Python + Batch scripts
4. **Click Run**: See real-time execution
5. **View outputs**: Logs, files, results

**Time**: < 30 seconds from idea to execution!

---

## 🐛 Troubleshooting

### Port already in use?
```powershell
# Change backend port
$env:PORT = "3002"; npm start

# Or kill the process
netstat -ano | findstr :3001
taskkill /PID <pid> /F
```

### Dependencies not found?
```powershell
# Reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Workflow fails?
Check `workflows/*/runs/*/log.txt` for detailed errors.

---

## 📚 Documentation

- **Complete Guide**: [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)
- **Main README**: [README.md](README.md)
- **Backend Docs**: [backend/README.md](backend/README.md)
- **Frontend Docs**: [frontend/README.md](frontend/README.md)
- **Kestra Setup**: [kestra/README.md](kestra/README.md)

---

## 🎯 Next Actions

### For Demo:
1. Start backend and frontend
2. Practice the demo flow
3. Prepare 2-3 example prompts
4. Show real-time execution

### For Development:
1. Explore the code
2. Try creating custom workflows
3. Add new workflow templates
4. Integrate your own APIs

### For Deployment:
1. Push code to GitHub
2. Deploy frontend to Vercel
3. Deploy backend to Vercel Functions
4. Add production API keys

---

## ✅ Success Indicators

You know it's working when:
- ✅ Backend starts without errors
- ✅ Frontend loads in browser
- ✅ Example workflow completes successfully
- ✅ You can generate new workflows
- ✅ Logs appear in real-time
- ✅ Output files are created

---

## 🎉 You're Ready!

Everything is set up and tested. Just run the commands above and start creating workflows!

**Questions?** Check the detailed docs or run the test workflow to see it in action.

---

**Built with**: Next.js, Node.js, Python, Google Gemini, Kestra
**Status**: ✅ Fully Functional
**Last Tested**: December 12, 2025
