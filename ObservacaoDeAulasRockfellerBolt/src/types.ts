export type Method = 'Kids' | 'Teens' | 'Adults';

export interface ClassMetadata {
  method: Method;
  book: string;
  lesson: string;
  teacherName: string;
}

export interface UploadedFiles {
  video: File | null;
  lessonPlan: File | null;
  standardProcedures: File | null;
}

export type ChecklistItemStatus = 'completed' | 'partial' | 'notDone' | 'notApplicable';

export interface EvaluationResult {
  teacherName: string;
  bookAndLesson: string;
  summary: {
    teacherTalkTime: number;
    studentTalkTime: number;
    englishPercentage: number;
    portuguesePercentage: number;
    grammarPoints: string[];
    vocabulary: string[];
    lessonPlanAdherence: string;
  };
  checklist: ChecklistItem[];
  transcription: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  status: ChecklistItemStatus;
  comment?: string;
}

export interface TeensChecklist {
  id: string;
  category: string;
  items: {
    id: string;
    text: string;
  }[];
}

export interface AdultsChecklist {
  id: string;
  category: string;
  items: {
    id: string;
    text: string;
  }[];
}

export const ADULTS_CHECKLIST: AdultsChecklist[] = [
  {
    id: 'homework',
    category: 'Homework Checking',
    items: [
      { id: 'hw1', text: 'Confere se os alunos fizeram a tarefa' }
    ]
  },
  {
    id: 'remind',
    category: 'Just to Remind You',
    items: [
      { id: 'r1', text: 'O professor realizou os exercícios presentes na seção' }
    ]
  },
  {
    id: 'introduction-insight',
    category: 'Introduction - INSIGHT',
    items: [
      { id: 'ii1', text: 'Tocar áudio completo' },
      { id: 'ii2', text: 'Repetição em coro (presencial) ou inidivdual (LIVE) após o áudio' },
      { id: 'ii3', text: 'Tradução (livros fechados)' },
      { id: 'ii4', text: 'Correção de pronúncia por repetição em coro (Prersencial) ou individual (LIVE) (se necessário)' }
    ]
  },
  {
    id: 'introduction-connection',
    category: 'Introduction - CONNECTION & UP',
    items: [
      { id: 'ic1', text: 'Toca o áudio completo' },
      { id: 'ic2', text: 'Leitura revezada' },
      { id: 'ic3', text: 'Repetição em coro (presencial) ou inidividual (LIVE) após o áudio' },
      { id: 'ic4', text: 'Correção de pronúncia por repetição em coro (Presencial) ou individual (LIVE) (se necessário)' }
    ]
  },
  {
    id: 'grammar-insight',
    category: 'Inductive Grammar - INSIGHT',
    items: [
      { id: 'gi1', text: 'Toca o áudio individual e repetição em coro (presencial) ou individual (LIVE) após o áudio' },
      { id: 'gi2', text: 'Guia os alunos a entenderem e falarem a regra' },
      { id: 'gi3', text: 'Mostra a regra e faz uma explicaçao rápida' },
      { id: 'gi4', text: 'Confere a compreensão do tópico fazendo perguntas e realizando exercícios de prática' }
    ]
  },
  {
    id: 'grammar-connection',
    category: 'Inductive Grammar - CONNECTION & UP',
    items: [
      { id: 'gc1', text: 'Toca o áudio completo e alunos se revezam na leitura' },
      { id: 'gc2', text: 'Guia os alunos a entenderem e falarem a regra' },
      { id: 'gc3', text: 'Mostra a regra e faz uma explicaçao rápida' },
      { id: 'gc4', text: 'Confere a compreensão do tópico fazendo perguntas e realizando exercícios de prática' }
    ]
  },
  {
    id: 'mind-this',
    category: 'Mind This',
    items: [
      { id: 'mt1', text: 'Áudio completo e leitura revezada' },
      { id: 'mt2', text: 'Explicação rápida (se necessário)' },
      { id: 'mt3', text: 'Correção de pronúncia (se necessário)' }
    ]
  },
  {
    id: 'quick-tips',
    category: 'Quick Tips',
    items: [
      { id: 'qt1', text: 'Áudio completo' },
      { id: 'qt2', text: 'Explicaçao dedutiva, rápida' },
      { id: 'qt3', text: 'Leitura revezada' }
    ]
  },
  {
    id: 'warm-up',
    category: 'Warm Up',
    items: [
      { id: 'wu1', text: 'Áudio completo' },
      { id: 'wu2', text: 'Leitura revezada' },
      { id: 'wu3', text: 'Correção de pronúncia por repetição em coro (Presencial) ou individaul (LIVE) (se necessário)' }
    ]
  },
  {
    id: 'extended-vocabulary',
    category: 'Extended Vocabulary',
    items: [
      { id: 'ev1', text: 'Áudio completo e leitura revezada' },
      { id: 'ev2', text: 'Correção de pronúncia por repetição em coro (Presencial) ou individual (LIVE) (se necessário)' }
    ]
  },
  {
    id: 'practice-insight',
    category: 'Practice - INSIGHT',
    items: [
      { id: 'pi1', text: 'Opção de dinamização (se necessário)' },
      { id: 'pi2', text: 'Áudio completo' },
      { id: 'pi3', text: 'Dupla 1: Repetição após o áudio' },
      { id: 'pi4', text: 'Dupla 2: Tradução sem leitura (livros fechados, diálogo escondido)' },
      { id: 'pi5', text: 'Dupla 3: Reprodução livre' },
      { id: 'pi6', text: 'Extra conversation questions (7-8 alunos ou se necessário)' }
    ]
  },
  {
    id: 'practice-connection',
    category: 'Practice - CONNECTION & UP',
    items: [
      { id: 'pc1', text: 'Áudio completo' },
      { id: 'pc2', text: 'Dupla 1: Leitura' },
      { id: 'pc3', text: 'Dupla 2: Repetição após o áudio com livros fechados' },
      { id: 'pc4', text: 'Dupla 3: Reproduçao livre' },
      { id: 'pc5', text: 'Extra conversation questions (7-8 alunos ou se necessário)' }
    ]
  },
  {
    id: 'reading',
    category: 'Reading',
    items: [
      { id: 'rd1', text: 'Pré-leitura' },
      { id: 'rd2', text: 'Alunos reportam ideia central do texto após ouvir o áudio' },
      { id: 'rd3', text: 'Leitura revezada' },
      { id: 'rd4', text: 'Correçao de pronúncia por repetição em coro (Presencial) ou individual (LIVE) (se necessário)' },
      { id: 'rd5', text: 'Vocabulary (Introduction passos 1-2)' },
      { id: 'rd6', text: 'O professor realiza a correção das questões de compreensão' }
    ]
  },
  {
    id: 'listening',
    category: 'Listening',
    items: [
      { id: 'ls1', text: 'Pre-listening' },
      { id: 'ls2', text: 'Toca o áudio completo' },
      { id: 'ls3', text: 'Alunos reportam ideia central após ouvir o áudio' },
      { id: 'ls4', text: 'Leitura atividade de interpretação' },
      { id: 'ls5', text: 'Áudio completo' },
      { id: 'ls6', text: 'Correção da atividade de interpretação' }
    ]
  },
  {
    id: 'what-about',
    category: 'What About...',
    items: [
      { id: 'wa1', text: 'Alunos respondem às perguntas, em conversação (livros fechados)' }
    ]
  },
  {
    id: 'non-standard',
    category: 'Non-standard Activities',
    items: [
      { id: 'ns1', text: 'Movie Activity' },
      { id: 'ns2', text: "Let's Sing" },
      { id: 'ns3', text: 'Cooking Class' },
      { id: 'ns4', text: 'Extra practice' },
      { id: 'ns5', text: 'Bring it to Mind' }
    ]
  },
  {
    id: 'homework-instructions',
    category: 'Homework Instructions',
    items: [
      { id: 'hi1', text: 'Orienta a ouvir o áudio de toda a lição' },
      { id: 'hi2', text: 'Explica as atividades escritas (get ready/review) com exemplos' }
    ]
  },
  {
    id: 'teacher',
    category: 'Quanto ao Professor',
    items: [
      { id: 't1', text: 'Uniformização (jaleco, crachá e dress code)' },
      { id: 't2', text: 'Bom humor, simpatia e disposição' },
      { id: 't3', text: 'Comunica-se e interage bem com todos (Clima da aula)' },
      { id: 't4', text: 'Evita português (apenas em momentos convenientes)' }
    ]
  },
  {
    id: 'students',
    category: 'Quanto aos Alunos',
    items: [
      { id: 's1', text: 'Notas compatíveis com os respectivos desempenhos' },
      { id: 's2', text: 'Fluência da turma está de acordo com o livro' },
      { id: 's3', text: 'Turma interage bem entre si' }
    ]
  }
];

export const TEENS_CHECKLIST: TeensChecklist[] = [
  {
    id: 'homework',
    category: 'Homework',
    items: [
      { id: 'hw1', text: 'Devolve as tarefas corrigidas e recolhe as feitas' }
    ]
  },
  {
    id: 'vocabulary',
    category: 'Vocabulary',
    items: [
      { id: 'v1', text: 'Tocar o áudio completo' },
      { id: 'v2', text: 'Repetição em coro (presencial) ou inidivdual (LIVE) após o áudio' },
      { id: 'v3', text: 'Alunos traduzem os itens com livros fechados e com a tradução escondida na tela' }
    ]
  },
  {
    id: 'grammar',
    category: 'Grammar – Deductive Method',
    items: [
      { id: 'g1', text: 'Um aluno lê a explicação na tela e, se necessário, o professor refoça a explicação' },
      { id: 'g2', text: 'Áudio dos exemplos e alunos repetem em coro (Presencial) ou individualmente (LIVE)' },
      { id: 'g3', text: 'Grammar checking com perguntas ou tradução de frases' }
    ]
  },
  {
    id: 'yourTurn',
    category: "It's your Turn",
    items: [
      { id: 'yt1', text: 'Explica a atividade para os alunos e estipula um tempo para eles fazerem em seus livros' },
      { id: 'yt2', text: 'Faz a correção da atividade, solicitando que um aluno por vez dê uma resposta' },
      { id: 'yt3', text: 'Respeita o tempo designado à seção' }
    ]
  },
  {
    id: 'practice',
    category: 'Practice (Dialogues)',
    items: [
      { id: 'p1', text: 'Tocar o áudio do diálogo' },
      { id: 'p2', text: 'Áudio individual de cada frase e alunos repetem em coro (Presencial)' },
      { id: 'p3', text: 'Dupla 1: Leitura do diálogo com livros abertos' },
      { id: 'p4', text: 'Dupla 2: Tradução do diálogo com livros fechados e diálogo escondido na tela' },
      { id: 'p5', text: 'Dupla 3: Reprodução livre mantendo o contexto original' }
    ]
  },
  {
    id: 'reading',
    category: 'Reading',
    items: [
      { id: 'r1', text: 'Áudio do texto ou a leitura do professor, caso não tenha áudio' },
      { id: 'r2', text: 'Alunos se revezam na leitura do texto' },
      { id: 'r3', text: 'Alunos respondem nos livros as questões de compreensão de texto' },
      { id: 'r4', text: 'Correção: cada aluno lê uma questão e a resposta' }
    ]
  },
  {
    id: 'listening',
    category: 'Listening',
    items: [
      { id: 'l1', text: 'Explicação da atividade' },
      { id: 'l2', text: 'Toca o áudio completo pausando a cada frase' },
      { id: 'l3', text: 'Toca o áudio completo ininterruptamente' },
      { id: 'l4', text: 'Correção: cada aluno lê uma questão e a resposta' }
    ]
  },
  {
    id: 'conversation',
    category: 'Conversation',
    items: [
      { id: 'c1', text: 'Toca o áudio de cada pergunta' },
      { id: 'c2', text: 'Todos os alunos respondem à mesma pergunta antes de passar para a próxima' },
      { id: 'c3', text: 'Mantém a conversação de forma livre, acrescentando perguntas extras' }
    ]
  },
  {
    id: 'curiosities',
    category: 'Curiosities',
    items: [
      { id: 'cu1', text: 'Toca o áudio completo' },
      { id: 'cu2', text: 'Ajuda os alunos a encontrarem ou entenderem o significado das palavras novas' },
      { id: 'cu3', text: 'Faz perguntas aos alunos usando o vocabulário da seção' }
    ]
  },
  {
    id: 'homework-instructions',
    category: 'Homework Instructions',
    items: [
      { id: 'hi1', text: 'Explica o que eles vão ouvir no áudio e o que devem fazer no exercício de Listening' },
      { id: 'hi2', text: 'Mostra e explica cada enunciado de exercícios escritos' }
    ]
  },
  {
    id: 'teacher',
    category: 'Quanto ao Professor',
    items: [
      { id: 't1', text: 'Uniformização (jaleco, crachá e dress code)' },
      { id: 't2', text: 'Bom humor, simpatia e disposição' },
      { id: 't3', text: 'Comunica-se e interage bem com todos (Clima da aula)' },
      { id: 't4', text: 'Evita português (apenas em momentos convenientes)' }
    ]
  },
  {
    id: 'students',
    category: 'Quanto aos alunos',
    items: [
      { id: 's1', text: 'Notas compatíveis com os respectivos desempenhos' },
      { id: 's2', text: 'Fluência da turma está de acordo com o livro' },
      { id: 's3', text: 'Os alunos têm boa interação entre si e aproveitam o tempo de aula' },
      { id: 's4', text: 'De forma geral, os alunos acham a lição muito fácil' },
      { id: 's5', text: 'De forma geral os alunos são desafiados' }
    ]
  },
  {
    id: 'overview',
    category: 'Visão geral da aula',
    items: [
      { id: 'o1', text: 'Pontualidade no início e término da aula' },
      { id: 'o2', text: 'Uso da TV e de seus recursos interativos e audiovisuais' },
      { id: 'o3', text: 'Preparação da aula (domínio do conteúdo, transição entre sessões, suporte aos alunos)' },
      { id: 'o4', text: 'Incentiva a participação de todos os alunos' }
    ]
  }
];