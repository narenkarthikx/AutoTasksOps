import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * LLM Service - handles AI generation with mock mode support
 * 
 * Environment variables:
 * - GOOGLE_AI_API_KEY: API key for Google Gemini
 * - DEMO_MOCK: Set to 'true' for deterministic mock responses
 */

const DEMO_MOCK = process.env.DEMO_MOCK === 'true';

// Initialize Gemini AI client
let genAI = null;
let model = null;

if (!DEMO_MOCK && process.env.GOOGLE_AI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

/**
 * Generate a workflow from natural language input
 * @param {string} userInput - Natural language description
 * @returns {Promise<Object>} Generated workflow structure
 */
export async function generateWorkflowFromText(userInput) {
  if (DEMO_MOCK || !model) {
    return getMockWorkflow(userInput);
  }

  try {
    const prompt = `You are an automation workflow generator. Convert the following natural language request into a structured workflow.

User Request: "${userInput}"

Generate a JSON response with this exact structure:
{
  "workflowName": "descriptive-name",
  "description": "Brief description",
  "schedule": "cron expression or null",
  "tasks": [
    {
      "id": "task1",
      "name": "Task Name",
      "type": "python|bash|email|http",
      "scriptName": "script_name.py",
      "description": "What this task does"
    }
  ],
  "scripts": {
    "script_name.py": "#!/usr/bin/env python3\\n# Script content here"
  }
}

Rules:
1. Keep it simple and runnable
2. Use realistic file names
3. Include error handling in scripts
4. Add comments to explain logic
5. Support mock mode with DEMO_MOCK env var`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('LLM generation error:', error);
    // Fallback to mock on error
    return getMockWorkflow(userInput);
  }
}

/**
 * Summarize text using LLM
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} Summary
 */
export async function summarizeText(text) {
  if (DEMO_MOCK || !model) {
    return getMockSummary(text);
  }

  try {
    const prompt = `Summarize the following text in 3 bullet points:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Summarization error:', error);
    return getMockSummary(text);
  }
}

/**
 * Generate a mock workflow for deterministic demos
 */
function getMockWorkflow(userInput) {
  const lower = userInput.toLowerCase();
  
  // Detect workflow type from input
  if (lower.includes('news') || lower.includes('summarize')) {
    return {
      workflowName: 'summarize-news',
      description: 'Fetch and summarize news articles',
      schedule: lower.includes('daily') || lower.includes('every day') ? '0 7 * * *' : null,
      tasks: [
        {
          id: 'fetch',
          name: 'Fetch News',
          type: 'python',
          scriptName: 'fetch_news.py',
          description: 'Fetch latest news articles'
        },
        {
          id: 'summarize',
          name: 'Summarize Content',
          type: 'python',
          scriptName: 'summarize.py',
          description: 'Generate AI summary'
        },
        {
          id: 'output',
          name: 'Save Output',
          type: 'bash',
          scriptName: 'send_email.sh',
          description: 'Save summary to file'
        }
      ],
      scripts: {
        'fetch_news.py': `#!/usr/bin/env python3
"""
Fetch news articles - Mock mode supported
"""
import os
import json
from datetime import datetime

DEMO_MOCK = os.getenv('DEMO_MOCK', 'false').lower() == 'true'

def fetch_news():
    if DEMO_MOCK:
        # Deterministic mock data
        return [
            {
                "title": "AI Breakthrough in Natural Language Processing",
                "content": "Researchers announce significant improvements in language models...",
                "source": "Tech News Daily"
            },
            {
                "title": "Climate Summit Reaches Historic Agreement",
                "content": "World leaders agree on new carbon reduction targets...",
                "source": "Global Times"
            },
            {
                "title": "Space Mission Successfully Launches",
                "content": "New satellite deployed for Earth observation...",
                "source": "Space Journal"
            }
        ]
    
    # TODO: Add real news API integration here
    # Example: NewsAPI, RSS feeds, etc.
    print("⚠️  Real API mode - add your API key")
    return fetch_news()  # Fallback to mock

if __name__ == '__main__':
    articles = fetch_news()
    output_path = os.path.join('output', 'news_raw.json')
    os.makedirs('output', exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(articles, f, indent=2)
    
    print(f"✓ Fetched {len(articles)} articles")
    print(f"✓ Saved to {output_path}")
`,
        'summarize.py': `#!/usr/bin/env python3
"""
Summarize news articles - Mock mode supported
"""
import os
import json

DEMO_MOCK = os.getenv('DEMO_MOCK', 'false').lower() == 'true'

def summarize_articles(articles):
    if DEMO_MOCK:
        return """📰 Daily News Summary

• AI & Technology: Major breakthrough in natural language processing shows promising results for future applications
• Climate & Environment: Historic climate agreement reached with concrete carbon reduction targets
• Space Exploration: Successful satellite launch expands Earth observation capabilities

Generated: """ + json.dumps({"timestamp": "2025-12-12"})
    
    # TODO: Add real LLM summarization here
    print("⚠️  Real LLM mode - add your API key")
    return summarize_articles(articles)

if __name__ == '__main__':
    input_path = os.path.join('output', 'news_raw.json')
    
    with open(input_path, 'r') as f:
        articles = json.load(f)
    
    summary = summarize_articles(articles)
    
    output_path = os.path.join('output', 'summary.txt')
    with open(output_path, 'w') as f:
        f.write(summary)
    
    print(f"✓ Summary generated")
    print(f"✓ Saved to {output_path}")
    print("\\n" + summary)
`,
        'send_email.sh': `#!/bin/bash
# Save output (email placeholder)

SUMMARY_FILE="output/summary.txt"
OUTPUT_DIR="output"

if [ ! -f "$SUMMARY_FILE" ]; then
    echo "❌ Summary file not found: $SUMMARY_FILE"
    exit 1
fi

echo "📧 Email Mode: Mock (saving to file)"
echo "✓ Summary available at: $SUMMARY_FILE"

# TODO: Add real email sending here
# Example using sendmail or SMTP
# if [ ! -z "$SMTP_HOST" ]; then
#   # Send actual email
# fi

cp "$SUMMARY_FILE" "$OUTPUT_DIR/latest_summary.txt"
echo "✓ Output copied to $OUTPUT_DIR/latest_summary.txt"
`
      }
    };
  }
  
  // Generic workflow template
  return {
    workflowName: 'custom-workflow',
    description: `Workflow for: ${userInput}`,
    schedule: null,
    tasks: [
      {
        id: 'task1',
        name: 'Execute Task',
        type: 'bash',
        scriptName: 'execute.sh',
        description: 'Execute the requested automation'
      }
    ],
    scripts: {
      'execute.sh': `#!/bin/bash
echo "Executing workflow: ${userInput}"
echo "✓ Task completed"
`
    }
  };
}

/**
 * Mock summarization for deterministic output
 */
function getMockSummary(text) {
  return `• Summary point 1: Key information extracted
• Summary point 2: Important details highlighted  
• Summary point 3: Conclusion and next steps`;
}

export default {
  generateWorkflowFromText,
  summarizeText
};
