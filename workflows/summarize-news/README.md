# Summarize News Workflow

Example workflow that fetches and summarizes news articles.

## 🚀 Quick Run

```powershell
cd ../../backend
node runner.js --workflow ../workflows/summarize-news/summarize-news.yaml
```

## 📚 Documentation

**Full documentation:** [Summarize News Workflow Guide](../../docs/workflows/SUMMARIZE_NEWS.md)

## 📁 Files

- `summarize-news.yaml` - Workflow definition
- `scripts/fetch_news.py` - Fetch articles
- `scripts/summarize.py` - AI summarization
- `scripts/send_email.bat` - Output handler

## 📊 Output

Results saved to:
- `output/summary.txt`
- `runs/<timestamp>/log.txt`

---

**For complete documentation, configuration, and customization, see [../../docs/workflows/SUMMARIZE_NEWS.md](../../docs/workflows/SUMMARIZE_NEWS.md)**
