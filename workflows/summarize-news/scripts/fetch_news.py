#!/usr/bin/env python3
"""
Fetch news articles - Mock mode supported
Environment: DEMO_MOCK=true for deterministic output
"""
import os
import json
import sys
from datetime import datetime

DEMO_MOCK = os.getenv('DEMO_MOCK', 'true').lower() == 'true'

def fetch_news():
    """
    Fetch news from various sources
    In mock mode: returns deterministic sample data
    In real mode: integrate with NewsAPI or RSS feeds
    """
    if DEMO_MOCK:
        print("[MOCK] Running in MOCK mode (deterministic)")
        # Deterministic mock data
        return [
            {
                "title": "AI Breakthrough in Natural Language Processing",
                "content": "Researchers announce significant improvements in language models, "
                          "demonstrating better understanding of context and nuance in human communication.",
                "source": "Tech News Daily",
                "url": "https://example.com/ai-breakthrough",
                "published": "2025-12-12T08:00:00Z"
            },
            {
                "title": "Climate Summit Reaches Historic Agreement",
                "content": "World leaders agree on new carbon reduction targets, committing to "
                          "net-zero emissions by 2050 with concrete action plans.",
                "source": "Global Times",
                "url": "https://example.com/climate-summit",
                "published": "2025-12-12T07:30:00Z"
            },
            {
                "title": "Space Mission Successfully Launches",
                "content": "New satellite deployed for Earth observation, expected to provide "
                          "unprecedented data on climate patterns and environmental changes.",
                "source": "Space Journal",
                "url": "https://example.com/space-launch",
                "published": "2025-12-12T06:45:00Z"
            }
        ]
    
    # Real API mode
    print("[REAL] Running in REAL mode")
    api_key = os.getenv('NEWS_API_KEY')
    
    if not api_key:
        print("⚠️  NEWS_API_KEY not set, falling back to mock data")
        return fetch_news()  # Recursive call will hit mock mode
    
    # TODO: Implement real NewsAPI integration
    # Example:
    # import requests
    # url = f"https://newsapi.org/v2/top-headlines?apiKey={api_key}&category=technology"
    # response = requests.get(url)
    # return response.json()['articles']
    
    print("⚠️  Real API not implemented yet, using mock data")
    # Fall back to mock mode
    os.environ['DEMO_MOCK'] = 'true'
    return fetch_news()

def main():
    """Main execution"""
    print("\n" + "="*50)
    print("News Fetcher")
    print("="*50 + "\n")
    
    try:
        # Fetch articles
        articles = fetch_news()
        print(f"\n✓ Fetched {len(articles)} articles")
        
        # Create output directory
        output_dir = 'output'
        os.makedirs(output_dir, exist_ok=True)
        
        # Save raw data
        output_path = os.path.join(output_dir, 'news_raw.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'fetched_at': datetime.now().isoformat(),
                'count': len(articles),
                'articles': articles
            }, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved to {output_path}")
        
        # Print preview
        print("\nPreview:")
        for i, article in enumerate(articles, 1):
            print(f"\n{i}. {article['title']}")
            print(f"   Source: {article['source']}")
            print(f"   {article['content'][:100]}...")
        
        print("\n" + "="*50)
        print("✓ Fetch completed successfully")
        print("="*50 + "\n")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        return 1

if __name__ == '__main__':
    sys.exit(main())
