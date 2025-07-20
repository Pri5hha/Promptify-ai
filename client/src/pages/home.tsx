import { Header } from '@/components/header';
import { PromptEditor } from '@/components/prompt-editor';
import { SuggestionsSidebar } from '@/components/suggestions-sidebar';
import { TemplateLibrary } from '@/components/template-library';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wand2, Sparkles, Target, TrendingUp, BookOpen } from 'lucide-react';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';

export default function Home() {
  const { currentAnalysis } = usePromptAnalysis();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      {/* Welcome Section */}
      <div className="relative bg-white border-b border-gray-200 shadow-sm overflow-hidden">
        {/* Radial background for welcome section */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-purple-100 rounded-full blur-2xl opacity-25"></div>
          <div className="absolute bottom-0 left-1/2 w-56 h-56 bg-beige-100 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute top-1/4 right-1/6 w-32 h-32 bg-gray-100 rounded-full blur-xl opacity-35"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Welcome to Promptify
              </h1>
              <p className="text-gray-600 mt-1">Optimize your AI prompts with intelligent suggestions and analysis</p>
            </div>
            {currentAnalysis && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{currentAnalysis.score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{currentAnalysis.suggestions.length}</div>
                  <div className="text-xs text-gray-500">Suggestions</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700">{currentAnalysis.clarity}</div>
                  <div className="text-xs text-gray-500">Clarity</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Accuracy</div>
                <div className="text-xs opacity-90">Real-time analysis</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Optimization</div>
                <div className="text-xs opacity-90">AI-powered suggestions</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Templates</div>
                <div className="text-xs opacity-90">Professional prompts</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wand2 className="w-5 h-5" />
              <div>
                <div className="text-sm font-medium">Magic</div>
                <div className="text-xs opacity-90">Instant improvements</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <PromptEditor />
          </div>
          <div className="lg:w-80">
            <SuggestionsSidebar />
          </div>
        </div>
        
        <TemplateLibrary />
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button 
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg"
        >
          <Wand2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Radial Blur Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-beige-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-beige-200 rounded-full blur-3xl opacity-35"></div>
        <div className="absolute bottom-0 right-1/3 w-88 h-88 bg-gray-100 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-beige-50 rounded-full blur-2xl opacity-20"></div>
        <div className="absolute top-1/3 left-1/6 w-56 h-56 bg-gray-50 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/6 w-60 h-60 bg-beige-300 rounded-full blur-3xl opacity-25"></div>
      </div>
    </div>
  );
}
