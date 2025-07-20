import { 
  prompts, 
  suggestions, 
  templates, 
  type Prompt, 
  type InsertPrompt,
  type Suggestion,
  type InsertSuggestion,
  type Template,
  type InsertTemplate 
} from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Prompts
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  updatePrompt(id: number, updates: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  
  // Suggestions
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  getSuggestionsByPromptId(promptId: number): Promise<Suggestion[]>;
  updateSuggestion(id: number, updates: Partial<InsertSuggestion>): Promise<Suggestion | undefined>;
  
  // Templates
  createTemplate(template: InsertTemplate): Promise<Template>;
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  incrementTemplateUsage(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private prompts: Map<number, Prompt>;
  private suggestions: Map<number, Suggestion>;
  private templates: Map<number, Template>;
  private currentPromptId: number;
  private currentSuggestionId: number;
  private currentTemplateId: number;

  constructor() {
    this.prompts = new Map();
    this.suggestions = new Map();
    this.templates = new Map();
    this.currentPromptId = 1;
    this.currentSuggestionId = 1;
    this.currentTemplateId = 1;
    
    // Initialize with default templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const defaultTemplates: InsertTemplate[] = [
      {
        name: "Content Creator",
        description: "Generate engaging blog posts, social media content, and marketing copy with optimized prompts.",
        category: "creative",
        content: "Write a comprehensive [WORD_COUNT]-word [CONTENT_TYPE] about [TOPIC] that [TARGET_AUDIENCE] can easily [ACTION]. Include [NUMBER] actionable [DELIVERABLE] with specific examples, [ADDITIONAL_REQUIREMENTS], and measurable outcomes for each suggestion. Use a [TONE] tone and structure the content as [FORMAT].",
        icon: "fas fa-pen-fancy",
        rating: 5,
        usageCount: 124,
      },
      {
        name: "Data Analyst",
        description: "Analyze data patterns, create reports, and generate insights with structured analytical prompts.",
        category: "analytical",
        content: "Analyze the [DATA_TYPE] data for [SUBJECT] and provide insights on [SPECIFIC_METRICS]. Create a detailed report that includes: 1) Key findings and patterns, 2) Statistical significance of trends, 3) Actionable recommendations, 4) Potential risks or opportunities, 5) Supporting visualizations or charts. Present the analysis in [FORMAT] suitable for [AUDIENCE] with [TECHNICAL_LEVEL] detail.",
        icon: "fas fa-chart-line",
        rating: 5,
        usageCount: 89,
      },
      {
        name: "Learning Coach",
        description: "Create lesson plans, explanations, and educational content with pedagogically sound prompts.",
        category: "educational",
        content: "Create a comprehensive lesson plan for [SUBJECT] targeting [GRADE_LEVEL] students. The lesson should cover [LEARNING_OBJECTIVES], include [DURATION] of instruction, and incorporate [TEACHING_METHODS]. Structure the plan with: 1) Learning objectives, 2) Prerequisites, 3) Step-by-step activities, 4) Assessment methods, 5) Extension activities, 6) Resources needed. Ensure the content is engaging and appropriate for [LEARNING_STYLE] learners.",
        icon: "fas fa-graduation-cap",
        rating: 5,
        usageCount: 156,
      },
    ];

    defaultTemplates.forEach(template => {
      this.createTemplate(template);
    });
  }

  // Prompts
  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.currentPromptId++;
    const prompt: Prompt = {
      ...insertPrompt,
      id,
      createdAt: new Date(),
      score: insertPrompt.score ?? 0,
      wordCount: insertPrompt.wordCount ?? 0,
      characterCount: insertPrompt.characterCount ?? 0,
      optimizedContent: insertPrompt.optimizedContent ?? null,
    };
    this.prompts.set(id, prompt);
    return prompt;
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.prompts.get(id);
  }

  async updatePrompt(id: number, updates: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const prompt = this.prompts.get(id);
    if (!prompt) return undefined;
    
    const updatedPrompt = { ...prompt, ...updates };
    this.prompts.set(id, updatedPrompt);
    return updatedPrompt;
  }

  // Suggestions
  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const id = this.currentSuggestionId++;
    const suggestion: Suggestion = {
      ...insertSuggestion,
      id,
      points: insertSuggestion.points ?? 0,
      applied: insertSuggestion.applied ?? 0,
      promptId: insertSuggestion.promptId ?? null,
    };
    this.suggestions.set(id, suggestion);
    return suggestion;
  }

  async getSuggestionsByPromptId(promptId: number): Promise<Suggestion[]> {
    return Array.from(this.suggestions.values()).filter(
      suggestion => suggestion.promptId === promptId
    );
  }

  async updateSuggestion(id: number, updates: Partial<InsertSuggestion>): Promise<Suggestion | undefined> {
    const suggestion = this.suggestions.get(id);
    if (!suggestion) return undefined;
    
    const updatedSuggestion = { ...suggestion, ...updates };
    this.suggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }

  // Templates
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const template: Template = {
      ...insertTemplate,
      id,
      rating: insertTemplate.rating ?? 5,
      usageCount: insertTemplate.usageCount ?? 0,
    };
    this.templates.set(id, template);
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      template => template.category === category
    );
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.usageCount = (template.usageCount || 0) + 1;
      this.templates.set(id, template);
    }
  }
}

export class DatabaseStorage implements IStorage {
  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db
      .insert(prompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }

  async updatePrompt(id: number, updates: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const [prompt] = await db
      .update(prompts)
      .set(updates)
      .where(eq(prompts.id, id))
      .returning();
    return prompt || undefined;
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const [suggestion] = await db
      .insert(suggestions)
      .values(insertSuggestion)
      .returning();
    return suggestion;
  }

  async getSuggestionsByPromptId(promptId: number): Promise<Suggestion[]> {
    return await db.select().from(suggestions).where(eq(suggestions.promptId, promptId));
  }

  async updateSuggestion(id: number, updates: Partial<InsertSuggestion>): Promise<Suggestion | undefined> {
    const [suggestion] = await db
      .update(suggestions)
      .set(updates)
      .where(eq(suggestions.id, id))
      .returning();
    return suggestion || undefined;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.category, category));
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    await db
      .update(templates)
      .set({ usageCount: sql`${templates.usageCount} + 1` })
      .where(eq(templates.id, id));
  }
}

// Initialize with database
const initializeDatabase = async () => {
  try {
    // Check if templates exist, if not, seed them
    const existingTemplates = await db.select().from(templates);
    
    if (existingTemplates.length === 0) {
      const defaultTemplates: InsertTemplate[] = [
        {
          name: "Content Creator",
          description: "Generate engaging blog posts, social media content, and marketing copy with optimized prompts.",
          category: "creative",
          content: "Write a comprehensive [WORD_COUNT]-word [CONTENT_TYPE] about [TOPIC] that [TARGET_AUDIENCE] can easily [ACTION]. Include [NUMBER] actionable [DELIVERABLE] with specific examples, [ADDITIONAL_REQUIREMENTS], and measurable outcomes for each suggestion. Use a [TONE] tone and structure the content as [FORMAT].",
          icon: "fas fa-pen-fancy",
          rating: 5,
          usageCount: 124,
        },
        {
          name: "Data Analyst",
          description: "Analyze data patterns, create reports, and generate insights with structured analytical prompts.",
          category: "analytical",
          content: "Analyze the [DATA_TYPE] data for [SUBJECT] and provide insights on [SPECIFIC_METRICS]. Create a detailed report that includes: 1) Key findings and patterns, 2) Statistical significance of trends, 3) Actionable recommendations, 4) Potential risks or opportunities, 5) Supporting visualizations or charts. Present the analysis in [FORMAT] suitable for [AUDIENCE] with [TECHNICAL_LEVEL] detail.",
          icon: "fas fa-chart-line",
          rating: 5,
          usageCount: 89,
        },
        {
          name: "Learning Coach",
          description: "Create lesson plans, explanations, and educational content with pedagogically sound prompts.",
          category: "educational",
          content: "Create a comprehensive lesson plan for [SUBJECT] targeting [GRADE_LEVEL] students. The lesson should cover [LEARNING_OBJECTIVES], include [DURATION] of instruction, and incorporate [TEACHING_METHODS]. Structure the plan with: 1) Learning objectives, 2) Prerequisites, 3) Step-by-step activities, 4) Assessment methods, 5) Extension activities, 6) Resources needed. Ensure the content is engaging and appropriate for [LEARNING_STYLE] learners.",
          icon: "fas fa-graduation-cap",
          rating: 5,
          usageCount: 156,
        },
      ];

      await db.insert(templates).values(defaultTemplates);
      console.log('Database seeded with default templates');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const storage = new DatabaseStorage();

// Initialize the database
initializeDatabase().catch(console.error);
