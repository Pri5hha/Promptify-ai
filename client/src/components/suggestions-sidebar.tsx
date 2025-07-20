import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Wand2, Copy, Plus, Edit, Lightbulb, ChevronRight } from 'lucide-react';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';
import { useQuery } from '@tanstack/react-query';

const suggestionIcons = {
  specificity: Plus,
  clarity: Edit,
  context: Lightbulb,
};

const impactColors = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

export function SuggestionsSidebar() {
  const {
    currentAnalysis,
    content,
    applySuggestion,
    generateVariations,
    isGeneratingVariations,
  } = usePromptAnalysis();

  const { data: templatesData } = useQuery({
    queryKey: ['/api/templates'],
  });

  const handleAutoOptimize = () => {
    if (currentAnalysis?.optimizedContent) {
      // This would be handled by the parent component
      console.log('Auto-optimizing...');
    }
  };

  const handleGenerateVariations = () => {
    if (content) {
      generateVariations.mutate({ content, count: 3 });
    }
  };

  const suggestions = currentAnalysis?.suggestions || [];
  const templates = templatesData?.templates?.slice(0, 3) || [];

  return (
    <aside className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Sidebar Header */}
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800">Suggestions</h3>
        <p className="text-sm text-gray-500 mt-1">Real-time optimization recommendations</p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {/* Suggestions List */}
        <div className="p-4 space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Start typing to get suggestions</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => {
              const IconComponent = suggestionIcons[suggestion.type as keyof typeof suggestionIcons] || Plus;
              return (
                <div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <IconComponent className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{suggestion.title}</span>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${impactColors[suggestion.impact as keyof typeof impactColors]}`}>
                      +{suggestion.points} points
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{suggestion.impact} Impact</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => applySuggestion.mutate(index)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-3"
              onClick={handleAutoOptimize}
              disabled={!currentAnalysis}
            >
              <Wand2 className="w-4 h-4 text-green-600 mr-3" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">Auto-optimize</div>
                <div className="text-xs text-gray-500">Apply all suggestions</div>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-auto p-3"
              onClick={handleGenerateVariations}
              disabled={!content || isGeneratingVariations}
            >
              <Copy className="w-4 h-4 text-blue-600 mr-3" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">Generate variations</div>
                <div className="text-xs text-gray-500">Create 3 different versions</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Popular Templates */}
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Templates</h4>
          <div className="space-y-2">
            {templates.map((template) => (
              <Button 
                key={template.id}
                variant="ghost" 
                className="w-full justify-between h-auto p-3"
              >
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">{template.name}</div>
                  <div className="text-xs text-gray-500">{template.description.substring(0, 30)}...</div>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
