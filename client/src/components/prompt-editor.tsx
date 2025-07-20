import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, CheckCircle, XCircle } from 'lucide-react';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';
import { useToast } from '@/hooks/use-toast';

export function PromptEditor() {
  const { toast } = useToast();
  const {
    content,
    setContent,
    promptType,
    setPromptType,
    currentAnalysis,
    copyToClipboard,
    isAnalyzing,
  } = usePromptAnalysis();

  const handleCopy = async () => {
    const textToCopy = currentAnalysis?.optimizedContent || content;
    const success = await copyToClipboard(textToCopy);
    
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "The optimized prompt has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Editor Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">Prompt Editor</h2>
            <Select value={promptType} onValueChange={(value: any) => setPromptType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="analytical">Analytical</SelectItem>
                <SelectItem value="instructional">Instructional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            {currentAnalysis && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Score:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(currentAnalysis.score)}`}
                      style={{ width: `${currentAnalysis.score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getScoreColor(currentAnalysis.score)}`}>
                    {currentAnalysis.score}
                  </span>
                </div>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your ChatGPT prompt here..."
            className="min-h-64 resize-none text-gray-800 leading-relaxed"
          />
          
          {isAnalyzing && (
            <div className="absolute top-4 right-4">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>{currentAnalysis?.characterCount || content.length} characters</span>
            <span>{currentAnalysis?.wordCount || content.split(' ').filter(w => w).length} words</span>
            <span>Clarity: {currentAnalysis?.clarity || 'Not analyzed'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {currentAnalysis?.suggestions.length || 0} suggestions
            </span>
            {isAnalyzing && (
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      {currentAnalysis && currentAnalysis.optimizedContent !== content && (
        <div className="border-t border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <XCircle className="w-4 h-4 text-red-600 mr-2" />
                Original
              </h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-gray-700 leading-relaxed">
                {content}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Optimized
              </h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-gray-700 leading-relaxed">
                {currentAnalysis.optimizedContent}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => setContent(currentAnalysis.optimizedContent)}
              className="bg-green-700 hover:bg-green-800"
            >
              Apply Optimization
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
