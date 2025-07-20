import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  optimizedContent: text("optimized_content"),
  type: text("type").notNull(), // 'creative', 'analytical', 'instructional'
  score: integer("score").default(0),
  wordCount: integer("word_count").default(0),
  characterCount: integer("character_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").references(() => prompts.id),
  type: text("type").notNull(), // 'specificity', 'clarity', 'context'
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // 'high', 'medium', 'low'
  points: integer("points").default(0),
  applied: integer("applied").default(0), // 0 or 1 (boolean)
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // 'creative', 'analytical', 'educational'
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  rating: integer("rating").default(5),
  usageCount: integer("usage_count").default(0),
});

// Insert schemas
export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

// Types
export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

// Analysis result type
export const analysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  suggestions: z.array(z.object({
    type: z.enum(['specificity', 'clarity', 'context']),
    title: z.string(),
    description: z.string(),
    impact: z.enum(['high', 'medium', 'low']),
    points: z.number(),
  })),
  optimizedContent: z.string(),
  wordCount: z.number(),
  characterCount: z.number(),
  clarity: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;
