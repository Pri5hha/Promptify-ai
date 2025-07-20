import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePrompt, generatePromptVariations } from "./services/openai";
import { insertPromptSchema, insertSuggestionSchema, analysisResultSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze prompt
  app.post("/api/prompts/analyze", async (req, res) => {
    try {
      const { content, type } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Content is required and must be a string" });
      }

      const analysisResult = await analyzePrompt(content, type || 'creative');
      
      // Store the prompt
      const prompt = await storage.createPrompt({
        content,
        optimizedContent: analysisResult.optimizedContent,
        type: type || 'creative',
        score: analysisResult.score,
        wordCount: analysisResult.wordCount,
        characterCount: analysisResult.characterCount,
      });

      // Store suggestions
      for (const suggestion of analysisResult.suggestions) {
        await storage.createSuggestion({
          promptId: prompt.id,
          type: suggestion.type,
          title: suggestion.title,
          description: suggestion.description,
          impact: suggestion.impact,
          points: suggestion.points,
          applied: 0,
        });
      }

      res.json({
        promptId: prompt.id,
        analysis: analysisResult,
      });
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      res.status(500).json({ message: "Failed to analyze prompt" });
    }
  });

  // Get prompt with suggestions
  app.get("/api/prompts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const prompt = await storage.getPrompt(id);
      
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      const suggestions = await storage.getSuggestionsByPromptId(id);
      
      res.json({
        prompt,
        suggestions,
      });
    } catch (error) {
      console.error('Error fetching prompt:', error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  // Apply suggestion
  app.post("/api/suggestions/:id/apply", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const suggestion = await storage.updateSuggestion(id, { applied: 1 });
      
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" });
      }

      res.json({ success: true, suggestion });
    } catch (error) {
      console.error('Error applying suggestion:', error);
      res.status(500).json({ message: "Failed to apply suggestion" });
    }
  });

  // Generate prompt variations
  app.post("/api/prompts/variations", async (req, res) => {
    try {
      const { content, count } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Content is required and must be a string" });
      }

      const variations = await generatePromptVariations(content, count || 3);
      
      res.json({ variations });
    } catch (error) {
      console.error('Error generating variations:', error);
      res.status(500).json({ message: "Failed to generate variations" });
    }
  });

  // Get templates
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;
      
      const templates = category 
        ? await storage.getTemplatesByCategory(category as string)
        : await storage.getAllTemplates();
      
      res.json({ templates });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Use template (increment usage counter)
  app.post("/api/templates/:id/use", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementTemplateUsage(id);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error using template:', error);
      res.status(500).json({ message: "Failed to use template" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
