import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GeminiService } from './src/api/gemini.service';
import type { LandingGenerationResult } from './src/shared/types/landing';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const geminiService = new GeminiService(GEMINI_API_KEY);

const generateHandler: RequestHandler = (req, res) => {
  console.log('Received request:', req.body);
  const { description } = req.body;

  if (!description) {
    console.log('Error: No description provided');
    res.status(400).json({
      code: 'INVALID_PROMPT',
      message: 'Description is required',
    });
    return;
  }

  console.log('Generating landing page for:', description);
  geminiService.generateLanding({
    description,
    timestamp: Date.now(),
  })
    .then(result => {
      if ('code' in result) {
        console.log('Generation error:', result);
        res.status(400).json(result);
        return;
      }

      console.log('Generation successful');
      const generationResult: LandingGenerationResult = {
        content: result,
        prompt: {
          description,
          timestamp: Date.now(),
        },
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      res.json(generationResult);
    })
    .catch(error => {
      console.error('Error generating landing page:', error);
      res.status(500).json({
        code: 'GENERATION_ERROR',
        message: 'Failed to generate landing page',
        details: error,
      });
    });
};

app.post('/api/generate', generateHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 