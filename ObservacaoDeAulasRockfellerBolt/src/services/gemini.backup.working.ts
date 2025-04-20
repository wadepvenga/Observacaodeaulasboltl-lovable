import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger';

let userProvidedApiKey: string | null = null;

export function setApiKey(apiKey: string) {
  userProvidedApiKey = apiKey;
  logger.info('API key set');
}

export async function testConnection() {
  logger.info('Testing connection to Google AI Studio');
  
  const apiKey = userProvidedApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    logger.error('Invalid or missing API key');
    throw new Error('Please provide a valid Gemini API key either through the API Key input form or by setting VITE_GEMINI_API_KEY in your .env file');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  logger.info('Initialized Google Generative AI client');

  try {
    logger.info('Testing model: gemini-2.0-flash');
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Hello, this is a test message. Please respond with 'Connection successful' if you receive this.";
    
    logger.info('Sending test request to Gemini API');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    logger.info('Test response received', { response: text });
    
    const availableModels = [
      'gemini-2.0-flash'
    ];
    
    return {
      success: true,
      message: 'Connection test successful',
      response: text,
      availableModels: availableModels
    };
  } catch (error) {
    logger.error('Connection test failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('api_key_invalid') || errorMessage.includes('api key expired')) {
        throw new Error('Your API key has expired. Please renew your API key from the Google AI Studio.');
      }
      if (errorMessage.includes('api key')) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      }
      if (errorMessage.includes('model not found') || errorMessage.includes('not supported')) {
        throw new Error('The specified model is not available. Please check your API access permissions in the Google AI Studio and ensure you have access to the Gemini models.');
      }
    }
    
    throw new Error('Failed to connect to Gemini API. Please check your API key and try again.');
  }
}

export async function analyzeClass(
  video: File,
  lessonPlan: File,
  metadata: {
    method: string;
    book: string;
    lesson: string;
    teacherName: string;
  }
) {
  logger.info('Starting class analysis', { metadata });
  
  const apiKey = userProvidedApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    logger.error('Invalid or missing API key');
    throw new Error('Please provide a valid Gemini API key either through the API Key input form or by setting VITE_GEMINI_API_KEY in your .env file');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  logger.info('Initialized Google Generative AI client');

  try {
    logger.info('Using model: gemini-2.0-flash');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash"
    });

    logger.debug('Converting video to base64', { 
      videoSize: video.size,
      videoType: video.type 
    });
    const videoBase64 = await fileToBase64(video);
    
    logger.debug('Converting lesson plan to base64', {
      lessonPlanSize: lessonPlan.size,
      lessonPlanType: lessonPlan.type
    });
    const lessonPlanBase64 = await fileToBase64(lessonPlan);
    
    logger.info('Files converted successfully, preparing prompt');

    const prompt = `Faça a transcrição e análise dessa aula:

Detalhes da aula:
- Método: ${metadata.method}
- Livro: ${metadata.book}
- Aula: ${metadata.lesson}
- Professor: ${metadata.teacherName}

Objetivo da Avaliação:
1. Cumprimento dos passos técnicos do SPS
2. Qualidade do ensino e interação
3. Uso adequado do inglês vs português
4. Comportamento do professor e dos alunos
5. Cumprimento dos conteúdos pedagógicos da aula`;

    logger.info('Sending request to Gemini API');
    const result = await model.generateContent({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: video.type,
              data: videoBase64
            }
          },
          {
            inlineData: {
              mimeType: lessonPlan.type,
              data: lessonPlanBase64
            }
          },
          { text: prompt }
        ]
      }]
    });

    const response = await result.response;
    const text = response.text();

    logger.info('Analysis completed successfully');
    return {
      teacherName: metadata.teacherName,
      bookAndLesson: `${metadata.book} - ${metadata.lesson}`,
      checklist: [
        { id: '1', text: 'SPS Steps Followed', completed: true },
        { id: '2', text: 'Quality Teaching', completed: true },
        { id: '3', text: 'Proper Language Usage', completed: true },
        { id: '4', text: 'Classroom Management', completed: true },
        { id: '5', text: 'Content Coverage', completed: true },
      ],
      aiComments: text,
    };
  } catch (error) {
    logger.error('Error analyzing class', { error: error instanceof Error ? error.message : 'Unknown error' });
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('api_key_invalid') || errorMessage.includes('api key expired')) {
        throw new Error('Your API key has expired. Please renew your API key from the Google AI Studio.');
      }
      if (errorMessage.includes('api key')) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      }
      if (errorMessage.includes('model not found') || errorMessage.includes('not supported')) {
        throw new Error('The specified model is not available. Please check your API access permissions in the Google AI Studio and ensure you have access to the Gemini models.');
      }
    }
    throw new Error('Failed to analyze class. Please check your API key and try again.');
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}