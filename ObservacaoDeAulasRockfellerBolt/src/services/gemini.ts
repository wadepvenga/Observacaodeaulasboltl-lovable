import { ClassMetadata, ADULTS_CHECKLIST, TEENS_CHECKLIST, EvaluationResult } from '../types';

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
  videoPath: string,
  lessonPlanPath: string,
  metadata: ClassMetadata
): Promise<EvaluationResult> {
  let response: Response | undefined;
  try {
    const checklistDefinition = metadata.method === 'Adults' ? ADULTS_CHECKLIST 
                             : metadata.method === 'Teens' ? TEENS_CHECKLIST
                             : [];

    const itemsToEvaluate = checklistDefinition.flatMap(category => 
        category.items.map(item => ({ id: `${category.id}-${item.id}`, text: item.text }))
    );

    console.log("Frontend: Enviando requisição para analyzeClass com:", { videoPath, lessonPlanPath, metadata, itemsToEvaluate });

    response = await fetch(`${SUPABASE_URL}/functions/v1/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        action: 'analyze',
        data: {
          videoPath: videoPath,
          lessonPlanPath: lessonPlanPath,
          metadata: metadata,
          checklistItemsToEvaluate: itemsToEvaluate 
        }
      })
    });

    if (!response.ok) {
      let errorDetails = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
      } catch (jsonError) {
        try {
          errorDetails = await response.text();
        } catch (textError) {
          errorDetails = `Could not parse error response body. Status: ${response.status} ${response.statusText}`;
        }
      }
      console.error("Frontend: Erro recebido da função Supabase:", errorDetails);
      throw new Error(`Analysis failed: ${errorDetails}`);
    }

    const result = await response.json();
    if (!result || !result.summary || !result.checklist || !result.transcription) {
      console.error("Frontend: Estrutura inválida recebida da função Supabase", result);
      throw new Error('Invalid analysis result structure received from Supabase function');
    }

    console.log("Frontend: Resultado da análise recebido e validado.");
    return result as EvaluationResult;
  } catch (error) {
    console.error('Frontend: Erro no bloco catch de analyzeClass:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error) || 'Unknown error occurred during analysis');
  }
}