#!/usr/bin/env python3
"""
Summarize news articles using AI
Environment: DEMO_MOCK=true for deterministic output
"""
import os
import json
import sys
from datetime import datetime

DEMO_MOCK = os.getenv('DEMO_MOCK', 'true').lower() == 'true'

def summarize_with_ai(articles):
    """
    Generate summary using AI
    In mock mode: returns deterministic summary
    In real mode: calls actual LLM API
    """
    if DEMO_MOCK:
        print("[MOCK] Running in MOCK mode (deterministic)")
        
        # Generate deterministic summary based on input
        summary_text = """📰 Daily News Summary
Generated: December 12, 2025

🔹 AI & Technology
Major breakthrough in natural language processing shows promising results for future applications. 
Researchers demonstrate better understanding of context and nuance in human communication.

🔹 Climate & Environment  
Historic climate agreement reached with concrete carbon reduction targets. World leaders commit 
to net-zero emissions by 2050 with detailed action plans.

🔹 Space Exploration
Successful satellite launch expands Earth observation capabilities. New technology expected to 
provide unprecedented data on climate patterns and environmental changes.

---
Key Takeaways:
• Significant progress in AI language understanding
• Global commitment to climate action intensifies
• Advanced space technology enhances Earth monitoring

Total articles analyzed: 3
"""
        return summary_text
    
    # Real AI mode
    print("[REAL] Running in REAL AI mode")
    api_key = os.getenv('GOOGLE_AI_API_KEY') or os.getenv('OPENAI_API_KEY')
    
    if not api_key:
        print("⚠️  No AI API key set, falling back to mock summary")
        return summarize_with_ai(articles)
    
    # TODO: Implement real LLM integration
    # Example with Google Gemini:
    # import google.generativeai as genai
    # genai.configure(api_key=api_key)
    # model = genai.GenerativeModel('gemini-pro')
    # 
    # articles_text = "\n\n".join([
    #     f"Title: {a['title']}\nContent: {a['content']}"
    #     for a in articles
    # ])
    # 
    # prompt = f"Summarize these news articles in 3 concise bullet points:\n\n{articles_text}"
    # response = model.generate_content(prompt)
    # return response.text
    
    print("⚠️  Real AI not implemented yet, using mock summary")
    return summarize_with_ai(articles)

def main():
    """Main execution"""
    print("\n" + "="*50)
    print("AI News Summarizer")
    print("="*50 + "\n")
    
    try:
        # Read input data
        input_path = os.path.join('output', 'news_raw.json')
        
        if not os.path.exists(input_path):
            print(f"❌ Input file not found: {input_path}")
            print("   Run fetch_news.py first!")
            return 1
        
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        articles = data.get('articles', [])
        print(f"Loaded {len(articles)} articles")
        
        # Generate summary
        print("\nGenerating summary...")
        summary = summarize_with_ai(articles)
        
        # Save summary
        output_path = os.path.join('output', 'summary.txt')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(summary)
        
        print(f"\n✓ Summary saved to {output_path}")
        
        # Display summary
        print("\n" + "="*50)
        print("SUMMARY")
        print("="*50)
        print(summary)
        print("="*50 + "\n")
        
        # Save metadata
        metadata = {
            'summarized_at': datetime.now().isoformat(),
            'articles_count': len(articles),
            'summary_length': len(summary),
            'mode': 'mock' if DEMO_MOCK else 'real'
        }
        
        metadata_path = os.path.join('output', 'metadata.json')
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        
        print("✓ Summarization completed successfully\n")
        return 0
        
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    sys.exit(main())
