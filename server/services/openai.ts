import OpenAI from "openai";
import { AnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function analyzePrompt(content: string, type: string): Promise<AnalysisResult> {
  try {
    const systemPrompt = `You are an expert AI prompt optimizer. Analyze the given prompt and provide optimization suggestions. Consider the prompt type: ${type}.

Evaluate the prompt on:
1. Specificity - How clear and specific are the requirements?
2. Clarity - How easy is it to understand what's being asked?
3. Context - How much helpful context is provided?
4. Structure - How well-organized is the prompt?
5. Actionability - How clear are the expected outputs?

Provide a score from 0-100, specific suggestions for improvement, and an optimized version of the prompt.

Respond with JSON in this exact format:
{
  "score": number,
  "suggestions": [
    {
      "type": "specificity|clarity|context",
      "title": "Brief title",
      "description": "Detailed explanation",
      "impact": "high|medium|low",
      "points": number
    }
  ],
  "optimizedContent": "Improved version of the prompt",
  "wordCount": number,
  "characterCount": number,
  "clarity": "Excellent|Good|Fair|Poor"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analyze this prompt: "${content}"` }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure all required fields are present with defaults
    return {
      score: Math.max(0, Math.min(100, result.score || 0)),
      suggestions: result.suggestions || [],
      optimizedContent: result.optimizedContent || content,
      wordCount: result.wordCount || content.split(' ').length,
      characterCount: result.characterCount || content.length,
      clarity: result.clarity || 'Fair',
    };
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    
    // Return fallback analysis
    const words = content.split(' ').length;
    const chars = content.length;
    
    return {
      score: Math.min(80, Math.max(20, chars / 10)), // Basic scoring
      suggestions: [
        {
          type: 'specificity',
          title: 'Add More Details',
          description: 'Consider adding specific requirements, constraints, or examples to improve clarity.',
          impact: 'medium',
          points: 10,
        }
      ],
      optimizedContent: content,
      wordCount: words,
      characterCount: chars,
      clarity: words > 20 ? 'Good' : 'Fair',
    };
  }
}

export async function generatePromptVariations(content: string, count: number = 3): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate ${count} different variations of the given prompt while maintaining the core intent. Each variation should approach the same goal from a different angle or with different phrasing. Respond with JSON in this format: { "variations": ["variation1", "variation2", "variation3"] }`
        },
        { role: "user", content: content }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.variations || [content];
  } catch (error) {
    console.error('Error generating variations:', error);
    return [content];
  }
}
