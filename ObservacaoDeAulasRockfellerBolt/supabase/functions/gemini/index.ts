import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.2.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const GEMINI_API_KEY = "AIzaSyDfk1MZCgA5ahwDJ1zPfbhnPQu1ccqgLwc";

// Define complete checklist templates
const TEENS_CHECKLIST = {
  vocabulary: [
    { id: 'v1', text: 'Tocar o áudio completo' },
    { id: 'v2', text: 'Repetição em coro (presencial) ou inidivdual (LIVE) após o áudio' },
    { id: 'v3', text: 'Alunos traduzem os itens com livros fechados e com a tradução escondida na tela' }
  ],
  grammar: [
    { id: 'g1', text: 'Um aluno lê a explicação na tela e, se necessário, o professor refoça a explicação' },
    { id: 'g2', text: 'Áudio dos exemplos e alunos repetem em coro (Presencial) ou individualmente (LIVE)' },
    { id: 'g3', text: 'Grammar checking com perguntas ou tradução de frases' }
  ],
  yourTurn: [
    { id: 'yt1', text: 'Explica a atividade para os alunos e estipula um tempo para eles fazerem em seus livros' },
    { id: 'yt2', text: 'Faz a correção da atividade, solicitando que um aluno por vez dê uma resposta' },
    { id: 'yt3', text: 'Respeita o tempo designado à seção' }
  ],
  practice: [
    { id: 'p1', text: 'Tocar o áudio do diálogo' },
    { id: 'p2', text: 'Áudio individual de cada frase e alunos repetem em coro (Presencial)' },
    { id: 'p3', text: 'Dupla 1: Leitura do diálogo com livros abertos' },
    { id: 'p4', text: 'Dupla 2: Tradução do diálogo com livros fechados e diálogo escondido na tela' },
    { id: 'p5', text: 'Dupla 3: Reprodução livre mantendo o contexto original' }
  ],
  reading: [
    { id: 'r1', text: 'Áudio do texto ou a leitura do professor, caso não tenha áudio' },
    { id: 'r2', text: 'Alunos se revezam na leitura do texto' },
    { id: 'r3', text: 'Alunos respondem nos livros as questões de compreensão de texto' },
    { id: 'r4', text: 'Correção: cada aluno lê uma questão e a resposta' }
  ],
  listening: [
    { id: 'l1', text: 'Explicação da atividade' },
    { id: 'l2', text: 'Toca o áudio completo pausando a cada frase' },
    { id: 'l3', text: 'Toca o áudio completo ininterruptamente' },
    { id: 'l4', text: 'Correção: cada aluno lê uma questão e a resposta' }
  ],
  conversation: [
    { id: 'c1', text: 'Toca o áudio de cada pergunta' },
    { id: 'c2', text: 'Todos os alunos respondem à mesma pergunta antes de passar para a próxima' },
    { id: 'c3', text: 'Mantém a conversação de forma livre, acrescentando perguntas extras' }
  ],
  teacher: [
    { id: 't1', text: 'Uniformização (jaleco, crachá e dress code)' },
    { id: 't2', text: 'Bom humor, simpatia e disposição' },
    { id: 't3', text: 'Comunica-se e interage bem com todos (Clima da aula)' },
    { id: 't4', text: 'Evita português (apenas em momentos convenientes)' }
  ],
  students: [
    { id: 's1', text: 'Notas compatíveis com os respectivos desempenhos' },
    { id: 's2', text: 'Fluência da turma está de acordo com o livro' },
    { id: 's3', text: 'Os alunos têm boa interação entre si e aproveitam o tempo de aula' }
  ]
};

const ADULTS_CHECKLIST = {
  // Similar structure for adults checklist
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { action, data } = await req.json();

    switch (action) {
      case "test": {
        const result = await model.generateContent("Connection test");
        const response = await result.response;
        return new Response(
          JSON.stringify({
            success: true,
            message: "Connection test successful",
            response: response.text(),
            availableModels: ["gemini-2.0-flash"],
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      case "analyze": {
        const { video, lessonPlan, metadata } = data;

        const prompt = `You are an expert English teaching evaluator. Analyze this class recording and lesson plan, focusing on the checklist evaluation.

Class Details:
- Method: ${metadata.method}
- Book: ${metadata.book}
- Lesson: ${metadata.lesson}
- Teacher: ${metadata.teacherName}

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON
2. DO NOT include any text before or after the JSON
3. DO NOT use markdown code blocks
4. The response must start with { and end with }

Required JSON structure:
{
  "summary": {
    "teacherTalkTime": number (0-100),
    "studentTalkTime": number (0-100),
    "englishPercentage": number (0-100),
    "portuguesePercentage": number (0-100),
    "grammarPoints": string[],
    "vocabulary": string[],
    "lessonPlanAdherence": string
  },
  "checklist": [
    {
      "id": string,
      "status": "completed" | "partial" | "notDone" | "notApplicable",
      "comment": string
    }
  ],
  "transcription": string (formatted with speaker indicators)
}

For each checklist item, carefully analyze the video and provide:
1. Status:
   - "completed": Task was fully and correctly executed
   - "partial": Task was attempted but not fully/correctly done
   - "notDone": Task was skipped or missing
   - "notApplicable": Task wasn't relevant for this lesson
2. Comment: Brief observation about how the task was performed

Example checklist evaluation:
{
  "id": "v1",
  "status": "completed",
  "comment": "Teacher played the complete audio at 2:15"
}

Checklist sections to evaluate:
1. Vocabulary
   - Audio playback
   - Student repetition
   - Translation practice
2. Grammar
   - Explanation clarity
   - Example usage
   - Comprehension checks
3. Practice/Dialogue
   - Audio usage
   - Student participation
   - Translation activities
4. Teacher Performance
   - English usage
   - Student engagement
   - Classroom management

Format the transcription with:
- Clear speaker indicators (Teacher: or Student:)
- Timestamps in [MM:SS] format
- Blank lines between exchanges

Example transcription format:
[00:00] Teacher: Good morning class!

Student 1: Good morning teacher!

[00:15] Teacher: Today we're going to learn about...`;

        const result = await model.generateContent({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType: video.type,
                  data: video.data
                }
              },
              {
                inlineData: {
                  mimeType: lessonPlan.type,
                  data: lessonPlan.data
                }
              },
              { text: prompt }
            ]
          }]
        });

        const response = await result.response;
        let analysis;
        let rawResponse = response.text();
        
        try {
          // Clean and parse the response
          let cleanedText = rawResponse
            .replace(/```[a-z]*\s*/g, '')
            .replace(/```\s*/g, '')
            .replace(/^\s*```.*$/gm, '')
            .trim();

          const startIndex = cleanedText.indexOf('{');
          const endIndex = cleanedText.lastIndexOf('}');
          
          if (startIndex === -1 || endIndex === -1) {
            throw new Error("Could not find valid JSON structure in response");
          }

          cleanedText = cleanedText.slice(startIndex, endIndex + 1);
          analysis = JSON.parse(cleanedText);

          if (!analysis.summary || !analysis.checklist || !analysis.transcription) {
            throw new Error("Missing required JSON fields");
          }
        } catch (error) {
          console.error("Failed to parse AI response:", error);
          console.error("Raw response:", rawResponse);
          throw new Error(`Failed to parse AI analysis: ${error.message}`);
        }

        // Format transcription
        const formatTranscription = (text: string) => {
          return text
            .split('\n')
            .map(line => {
              if (line.trim() && !line.match(/^\[?\d*:?\d*\]?\s*(Teacher|Student|Student \d+):/)) {
                return `Teacher: ${line}`;
              }
              return line;
            })
            .join('\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/([^\n])\n([^\n])/g, '$1\n\n$2')
            .trim();
        };

        // Get the appropriate checklist template
        const checklistTemplate = metadata.method === 'Teens' ? TEENS_CHECKLIST : ADULTS_CHECKLIST;

        // Map AI analysis to checklist items
        const mapChecklistItems = (aiChecklist: any[], template: any) => {
          const result = [];
          
          for (const [section, items] of Object.entries(template)) {
            for (const item of items) {
              // Find matching AI analysis or create default
              const aiItem = aiChecklist.find(i => i.id === item.id);
              
              // Analyze transcription for evidence of completion
              const transcriptionEvidence = analyzeTranscriptionForItem(
                analysis.transcription,
                item.id,
                item.text
              );
              
              result.push({
                id: item.id,
                text: item.text,
                status: aiItem?.status || transcriptionEvidence.status || 'notDone',
                comment: aiItem?.comment || transcriptionEvidence.comment || ''
              });
            }
          }
          
          return result;
        };

        // Analyze transcription for evidence of checklist item completion
        const analyzeTranscriptionForItem = (transcription: string, itemId: string, itemText: string) => {
          const lines = transcription.toLowerCase().split('\n');
          const itemKeywords = itemText.toLowerCase().split(' ');
          
          // Default result
          const result = {
            status: 'notDone' as const,
            comment: ''
          };

          // Check for evidence in transcription
          const relevantLines = lines.filter(line => 
            itemKeywords.some(keyword => line.includes(keyword))
          );

          if (relevantLines.length > 0) {
            result.status = 'completed';
            result.comment = `Evidence found in transcription: "${relevantLines[0].trim()}"`;
          }

          return result;
        };

        // Create normalized analysis
        const normalizedAnalysis = {
          teacherName: metadata.teacherName,
          bookAndLesson: `${metadata.book} - ${metadata.lesson}`,
          summary: {
            teacherTalkTime: Math.min(100, Math.max(0, analysis.summary?.teacherTalkTime ?? 0)),
            studentTalkTime: Math.min(100, Math.max(0, analysis.summary?.studentTalkTime ?? 0)),
            englishPercentage: Math.min(100, Math.max(0, analysis.summary?.englishPercentage ?? 0)),
            portuguesePercentage: Math.min(100, Math.max(0, analysis.summary?.portuguesePercentage ?? 0)),
            grammarPoints: Array.isArray(analysis.summary?.grammarPoints) 
              ? analysis.summary.grammarPoints 
              : [],
            vocabulary: Array.isArray(analysis.summary?.vocabulary)
              ? analysis.summary.vocabulary
              : [],
            lessonPlanAdherence: analysis.summary?.lessonPlanAdherence || "Analysis failed"
          },
          checklist: mapChecklistItems(analysis.checklist || [], checklistTemplate),
          transcription: formatTranscription(analysis.transcription)
        };

        return new Response(
          JSON.stringify(normalizedAnalysis),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Error in Gemini function:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});