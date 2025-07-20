import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, PenTool, BarChart3, GraduationCap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis';
import type { Template } from '@shared/schema';

const categoryIcons = {
  creative: PenTool,
  analytical: BarChart3,
  educational: GraduationCap,
};

const categoryColors = {
  creative: 'from-purple-500 to-purple-600',
  analytical: 'from-blue-500 to-blue-600',
  educational: 'from-green-500 to-green-600',
};

export function TemplateLibrary() {
  const { setContent } = usePromptAnalysis();
  const queryClient = useQueryClient();

  const { data: templatesData, isLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  const useTemplate = useMutation({
    mutationFn: async (templateId: number) => {
      const response = await apiRequest('POST', `/api/templates/${templateId}/use`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
  });

  const handleUseTemplate = (template: Template) => {
    setContent(template.content);
    useTemplate.mutate(template.id);
  };

  const templates = templatesData?.templates || [];

  if (isLoading) {
    return (
      <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Template Library</h3>
          <p className="text-sm text-gray-500 mt-1">Start with proven prompt templates</p>
        </div>
        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || PenTool;
          const gradientClass = categoryColors[template.category as keyof typeof categoryColors] || categoryColors.creative;
          
          return (
            <div 
              key={template.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 capitalize">
                  {template.category}
                </Badge>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{(template.rating / 5 * 5).toFixed(1)}</span>
                  <span>({template.usageCount} uses)</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleUseTemplate(template)}
                  className="text-blue-600 group-hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Use Template
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
