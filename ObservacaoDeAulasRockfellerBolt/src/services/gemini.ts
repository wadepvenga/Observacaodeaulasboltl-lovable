import { ClassMetadata } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function testConnection() {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action: 'test'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to connect to Gemini API');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Connection test error:', error);
    throw new Error('Failed to connect to Gemini API. Please try again later.');
  }
}

export async function analyzeClass(
  video: File,
  lessonPlan: File,
  metadata: ClassMetadata
) {
  try {
    const videoBase64 = await fileToBase64(video);
    const lessonPlanBase64 = await fileToBase64(lessonPlan);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action: 'analyze',
        data: {
          video: {
            type: video.type,
            data: videoBase64
          },
          lessonPlan: {
            type: lessonPlan.type,
            data: lessonPlanBase64
          },
          metadata
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze class');
    }

    const result = await response.json();
    if (!result || !result.summary || !result.checklist || !result.transcription) {
      throw new Error('Invalid analysis result received');
    }

    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze class. Please try again later.');
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