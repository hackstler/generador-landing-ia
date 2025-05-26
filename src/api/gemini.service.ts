import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { LandingPrompt, LandingContent, LandingGenerationError } from '@/shared/types/landing';

export class GeminiService {
  private readonly model: GenerativeModel;
  private readonly generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  };

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: this.generationConfig
    });
  }

  private buildPrompt(prompt: LandingPrompt): string {
    return `Eres un experto en frontend y diseño minimalista. Genera solo el HTML de una landing page moderna y atractiva, usando exclusivamente clases de TailwindCSS (no uses estilos inline ni <style> ni CSS).
      La estructura debe incluir:
      - Un hero con título y subtítulo centrados
      - Sección de features en tarjetas responsivas
      - Llamada a la acción clara y visible
      - Buen espaciado, jerarquía visual y uso de colores neutros y acentos
      - No incluyas explicaciones, solo el HTML

      Descripción: ${prompt.description}`;
  }

  async generateLanding(prompt: LandingPrompt): Promise<LandingContent | LandingGenerationError> {
    try {
      const result = await this.model.generateContent(this.buildPrompt(prompt));
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('No content generated');
      }

      return {
        html: text,
        metadata: {
          title: 'Generated Landing Page',
          description: prompt.description,
          keywords: ['landing page', 'generated', 'modern', 'minimalist'],
        },
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        code: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate landing page',
        details: error,
      };
    }
  }
} 