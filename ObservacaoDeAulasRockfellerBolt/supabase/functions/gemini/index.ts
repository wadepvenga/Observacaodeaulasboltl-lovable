/// <reference types="https://deno.land/x/deno/cli/types/v1.45.0/index.d.ts" /> 

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
        // Fix extraction to match frontend data structure (videoPath, lessonPlanPath, metadata)
        // Remove checklistItemsToEvaluate from here, as it's derived from metadata later
        const { videoPath, lessonPlanPath, metadata } = data;

        // Update validation: Remove checklist requirement
        if (!videoPath || typeof videoPath !== 'string' || 
            !lessonPlanPath || typeof lessonPlanPath !== 'string' || 
            !metadata || typeof metadata !== 'object') { // Removed checklist check
          console.error("FN ERROR: Missing or invalid data for analysis (Expecting paths, metadata):", // Updated error message
            { 
              hasVideoPath: !!videoPath && typeof videoPath === 'string',
              hasPlanPath: !!lessonPlanPath && typeof lessonPlanPath === 'string',
              hasMeta: !!metadata && typeof metadata === 'object'
              // Removed checklist check from log
            }
          );
          return new Response(JSON.stringify({ error: "Missing or invalid required data (paths, metadata)" }), { // Updated error message
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        
        console.log("FN LOG: Received valid data for analysis:", { videoPath, lessonPlanPath, metadata }); // Log metadata too

        // --- CRITICAL: Gemini API call logic still needs rewrite --- 
        // (Rest of the comments about needing to download from Storage remain valid)
        
        // Placeholder comment for the required rewrite:
        /*
        // 1. Derive checklist items from metadata
        const checklistDefinition = metadata.method === 'Adults' ? ADULTS_CHECKLIST 
                                 : metadata.method === 'Teens' ? TEENS_CHECKLIST
                                 : [];
        const itemsToEvaluate = checklistDefinition.flatMap(category => 
             category.items.map(item => ({ id: `${category.id}-${item.id}`, text: item.text }))
        );

        // 2. Download files from Storage
        // ... (download logic using videoPath, lessonPlanPath)
        
        // 3. Prepare prompt and API call with file contents
        // ... (pass itemsToEvaluate to buildPrompt or use directly in prompt)
        // ... (generateContent call with file buffers)
        
        // 4. Process response
        // ...
        */
       
       // --- TEMPORARY RESPONSE FOR TESTING --- 
       console.warn("FN WARN: Gemini API call logic needs rework to handle file paths from Storage. Returning dummy response.");
       return new Response(JSON.stringify({ 
         message: "Data received (paths, metadata), but analysis logic needs update.", // Updated dummy message
         receivedData: { videoPath, lessonPlanPath, metadata } // Removed checklist from dummy response
        }), { 
         headers: { ...corsHeaders, "Content-Type": "application/json" },
         status: 200 // Indicate success for now
       });
       // --- END TEMPORARY RESPONSE ---

       /* --- ORIGINAL CODE (commented out, needs rewrite) ---
       // ... (original code remains commented) ... 
       */
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