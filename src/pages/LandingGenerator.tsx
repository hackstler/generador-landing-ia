import { useState } from 'react';
import { ArrowPathIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import type { LandingGenerationResult, LandingGenerationError } from '@/shared/types/landing';

export const LandingGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LandingGenerationResult | null>(null);
  const [error, setError] = useState<LandingGenerationError | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate landing page');
      }

      setResult(data);
    } catch (err) {
      setError({
        code: 'GENERATION_ERROR',
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.content.html) return;
    navigator.clipboard.writeText(result.content.html);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Landing Page Generator
          </h1>
          <p className="text-lg text-gray-600">
            Describe your landing page and let AI create it for you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="Describe your landing page (e.g., 'A modern landing page for a JavaScript course with a focus on practical examples')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="flex justify-end space-x-4">
              <button
                className="btn-primary flex items-center space-x-2"
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Generate Landing Page</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Preview
              </h2>
              <button
                className="btn-primary flex items-center space-x-2"
                onClick={handleCopy}
              >
                <DocumentDuplicateIcon className="w-5 h-5" />
                <span>Copy HTML</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div
                className="p-6"
                dangerouslySetInnerHTML={{ __html: result.content.html }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 