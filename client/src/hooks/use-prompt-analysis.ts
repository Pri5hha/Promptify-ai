import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { AnalysisResult } from '@shared/schema';

interface AnalysisResponse {
  promptId: number;
  analysis: AnalysisResult;
}

export function usePromptAnalysis() {
  const [content, setContent] = useState('');
  const [promptType, setPromptType] = useState<'creative' | 'analytical' | 'instructional'>('creative');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [promptId, setPromptId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();

  const analyzePrompt = useMutation({
    mutationFn: async ({ content, type }: { content: string; type: string }) => {
      const response = await apiRequest('POST', '/api/prompts/analyze', { content, type });
      return response.json() as Promise<AnalysisResponse>;
    },
    onSuccess: (data) => {
      setCurrentAnalysis(data.analysis);
      setPromptId(data.promptId);
    },
  });

  const generateVariations = useMutation({
    mutationFn: async ({ content, count }: { content: string; count?: number }) => {
      const response = await apiRequest('POST', '/api/prompts/variations', { content, count });
      return response.json() as Promise<{ variations: string[] }>;
    },
  });

  const applySuggestion = useMutation({
    mutationFn: async (suggestionId: number) => {
      const response = await apiRequest('POST', `/api/suggestions/${suggestionId}/apply`);
      return response.json();
    },
    onSuccess: () => {
      // Refresh the current analysis
      if (content && promptType) {
        analyzePrompt.mutate({ content, type: promptType });
      }
    },
  });

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    
    // Debounce analysis
    const timer = setTimeout(() => {
      if (newContent.trim() && newContent.length > 10) {
        analyzePrompt.mutate({ content: newContent, type: promptType });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [promptType, analyzePrompt]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, []);

  return {
    content,
    setContent: handleContentChange,
    promptType,
    setPromptType,
    currentAnalysis,
    promptId,
    analyzePrompt,
    generateVariations,
    applySuggestion,
    copyToClipboard,
    isAnalyzing: analyzePrompt.isPending,
    isGeneratingVariations: generateVariations.isPending,
  };
}
