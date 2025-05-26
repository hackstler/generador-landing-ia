export type LandingPrompt = {
  description: string;
  timestamp: number;
};

export type LandingContent = {
  html: string;
  css?: string;
  metadata?: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export type LandingGenerationResult = {
  content: LandingContent;
  prompt: LandingPrompt;
  id: string;
  createdAt: number;
};

export type LandingGenerationError = {
  code: 'INVALID_PROMPT' | 'API_ERROR' | 'GENERATION_ERROR';
  message: string;
  details?: unknown;
}; 