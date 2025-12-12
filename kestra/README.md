# Kestra Setup

Kestra is an open-source orchestration platform for running workflows.

## 🚀 Quick Start

### Start Kestra with Docker Compose

```bash
cd kestra
docker-compose up -d
```

This will start:
- **Kestra Server** on `http://localhost:8080`
- **PostgreSQL** database for Kestra storage

### Access the UI

Open your browser to: **http://localhost:8080**

The workflows from `../workflows/` are mounted read-only at `/app/workflows`.

### Stop Kestra

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

## 📝 Using Kestra with AutoTaskOps

### 1. Import a Workflow

In the Kestra UI:
1. Go to **Flows**
2. Click **Create**
3. Copy the YAML from `workflows/summarize-news/summarize-news.yaml`
4. Paste and save

### 2. Execute a Workflow

1. Select the workflow
2. Click **Execute**
3. View real-time logs
4. Check outputs

### 3. Schedule Workflows

Workflows with `triggers` defined will run automatically based on their cron schedule.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in this directory:

```bash
# Kestra Configuration
KESTRA_PORT=8080

# Database
POSTGRES_DB=kestra
POSTGRES_USER=kestra
POSTGRES_PASSWORD=k3str4

# Workflow Environment
DEMO_MOCK=true
GOOGLE_AI_API_KEY=your-api-key
NEWS_API_KEY=your-api-key
```

### Custom Storage

Kestra stores workflow data in:
- **Database**: Workflow definitions and execution history
- **Storage**: Task outputs and logs at `/app/storage`

## 🎯 Alternative: Simulated Runner

If you don't want to run full Kestra, use the built-in simulated runner:

```bash
cd backend
node runner.js --workflow ../workflows/summarize-news/summarize-news.yaml
```

This provides:
- Sequential task execution
- Log streaming
- Output capture
- No Docker required

## 📚 Learn More

- [Kestra Documentation](https://kestra.io/docs)
- [Workflow Examples](https://kestra.io/docs/examples)
- [Task Types](https://kestra.io/plugins)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "8090:8080"  # Use 8090 instead
```

### Docker Socket Permission Denied
```bash
# On Linux, add user to docker group
sudo usermod -aG docker $USER
```

### Workflows Not Showing
The workflows folder is mounted read-only. To edit workflows:
1. Edit files in `../workflows/`
2. Reimport in Kestra UI

---

*Part of AutoTaskOps Project*
