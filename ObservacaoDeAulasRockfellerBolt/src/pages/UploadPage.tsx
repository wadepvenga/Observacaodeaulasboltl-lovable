import { supabase } from '../lib/supabaseClient'; // Importa o cliente
// Abaixo dos seus outros imports, como useState, useNavigate, etc.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { MetadataForm } from '../components/MetadataForm';
import { ClassMetadata, UploadedFiles } from '../types';
import { analyzeClass } from '../services/gemini';
import { useAnalysisStore } from '../store/analysisStore';
import { FiUpload, FiFileText } from 'react-icons/fi';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentAnalysis, setAnalysisProgress, addToHistory, setCurrentMethod, analysisProgress } = useAnalysisStore();
  
  const [files, setFiles] = useState<UploadedFiles>({
    video: null,
    lessonPlan: null,
    standardProcedures: null,
  });

  const [metadata, setMetadata] = useState<ClassMetadata>({
    method: 'Adults',
    book: '',
    lesson: '',
    teacherName: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (type: keyof UploadedFiles) => (file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setError(null);
  };

  const handleAnalyze = async () => {
    // --- Validações Iniciais ---
    if (!files.video || !files.lessonPlan) {
      setError('Por favor, envie todos os arquivos necessários (Vídeo e Plano de Aula).');
      return;
    }
    if (!metadata.teacherName || !metadata.book || !metadata.lesson) {
      setError('Por favor, preencha todas as informações da aula.');
      return;
    }
    // Verifica se o cliente Supabase está pronto
    if (!supabase) {
       setError('Cliente Supabase não inicializado. Verifique o console e o arquivo .env.');
       console.error('Supabase client is null. Check initialization in src/lib/supabaseClient.ts and .env variables.');
       return;
    }

    // --- Início do Processo ---
    setIsAnalyzing(true); // Mostra "Analisando..."
    setError(null); // Limpa erros anteriores
    setAnalysisProgress(10); // Progresso inicial (upload)
    setCurrentMethod(metadata.method); // Guarda o método no store

    let videoPath: string | null = null;
    let lessonPlanPath: string | null = null;
    const bucketName = 'uploads'; // <-- MUDE AQUI se o nome do seu bucket for diferente!

    try {
      // --- Upload do Vídeo ---
      console.log('Iniciando upload do vídeo...');
      setAnalysisProgress(15); // Atualiza progresso
      const videoFile = files.video!;
      // Cria um nome único para evitar conflitos
      const videoFileName = `videos/${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`; 
      const { data: videoData, error: videoError } = await supabase.storage
        .from(bucketName) // Usa o nome do bucket
        .upload(videoFileName, videoFile, {
          cacheControl: '3600', // Cache por 1 hora
          upsert: false, // Não sobrescrever se já existir
        });

      if (videoError) {
        console.error("Erro no upload do vídeo:", videoError);
        throw new Error(`Falha no upload do vídeo: ${videoError.message}`);
      }
      videoPath = videoData?.path; // Guarda o caminho retornado pelo Supabase
      if (!videoPath) throw new Error("Caminho do vídeo não retornado após upload.");
      console.log('Upload do vídeo concluído:', videoPath);
      setAnalysisProgress(35); // Atualiza progresso

      // --- Upload do Plano de Aula ---
      console.log('Iniciando upload do plano de aula...');
      setAnalysisProgress(40); // Atualiza progresso
      const lessonPlanFile = files.lessonPlan!;
      // Cria um nome único
      const lessonPlanFileName = `lesson_plans/${Date.now()}_${lessonPlanFile.name.replace(/\s+/g, '_')}`;
      const { data: lpData, error: lpError } = await supabase.storage
        .from(bucketName) // Usa o nome do bucket
        .upload(lessonPlanFileName, lessonPlanFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (lpError) {
        console.error("Erro no upload do plano de aula:", lpError);
        throw new Error(`Falha no upload do plano de aula: ${lpError.message}`);
      }
      lessonPlanPath = lpData?.path; // Guarda o caminho retornado
      if (!lessonPlanPath) throw new Error("Caminho do plano de aula não retornado após upload.");
      console.log('Upload do plano de aula concluído:', lessonPlanPath);
      setAnalysisProgress(50); // Atualiza progresso (metade do caminho)

      // --- Chamada para a Função de Análise (Passando os Caminhos) ---
      navigate('/analysis'); // Navega para a página de análise ANTES da chamada longa

      // Simulação de progresso DURANTE a análise (que agora acontece no backend)
      const progressInterval = setInterval(() => {
          const currentProgress = useAnalysisStore.getState().analysisProgress;
          if (currentProgress >= 95) { // Simula até 95%, 100% vem no sucesso
            clearInterval(progressInterval);
          } else {
            setAnalysisProgress(currentProgress + 5); // Incrementa mais rápido
          }
      }, 800); // Intervalo um pouco mais rápido

      console.log('Chamando a função analyzeClass com os caminhos:', { videoPath, lessonPlanPath });
      
      // IMPORTANTE: A função analyzeClass em gemini.ts e a função no Supabase
      // ainda precisam ser ajustadas para TRABALHAR COM os caminhos/URLs em vez de base64.
      // Por enquanto, vamos enviar os caminhos.
      const result = await analyzeClass(
        videoPath,       // Envia o CAMINHO do vídeo no Storage
        lessonPlanPath,  // Envia o CAMINHO do plano de aula no Storage
        metadata
      );

      // --- Sucesso ---
      clearInterval(progressInterval); // Para a simulação
      console.log('Análise retornada com sucesso pela função.');
      setAnalysisProgress(100); // Análise completa
      setCurrentAnalysis(result); // Guarda o resultado no store
      addToHistory(result); // Adiciona ao histórico

      // Opcional: Limpeza dos arquivos após sucesso (descomente se desejar)
      // console.log('Limpando arquivos do storage após análise bem-sucedida...');
      // await supabase.storage.from(bucketName).remove([videoPath, lessonPlanPath]);

    } catch (err) {
      // --- Tratamento de Erro ---
      console.error('Erro durante o processo de upload ou análise:', err);
      const errorMessage = err instanceof Error ? err.message : 'Falha no upload ou análise. Tente novamente.';
      setError(errorMessage); // Mostra erro na UI
      setAnalysisProgress(0); // Reseta progresso
      setIsAnalyzing(false); // Libera o botão
      setCurrentMethod(null); // Limpa método no store
      navigate('/upload'); // Volta para a página de upload

      // Opcional: Tentativa de limpeza em caso de erro (descomente se desejar)
      // const pathsToRemove = [videoPath, lessonPlanPath].filter(p => p !== null) as string[];
      // if (supabase && pathsToRemove.length > 0) {
      //   console.log('Tentando limpar arquivos do storage devido a erro...');
      //   try {
      //      await supabase.storage.from(bucketName).remove(pathsToRemove);
      //      console.log('Arquivos de erro limpos do storage.');
      //   } catch (cleanupError) {
      //      console.error('Erro ao tentar limpar arquivos do storage após falha:', cleanupError);
      //   }
      // }
    }
  };

  const isReadyToAnalyze = 
    files.video && 
    files.lessonPlan && 
    metadata.teacherName && 
    metadata.book && 
    metadata.lesson &&
    !isAnalyzing;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-rockfeller-blue-primary/10 rounded-lg">
                <FiUpload className="w-6 h-6 text-rockfeller-blue-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Upload Files</h2>
            </div>
            <div className="space-y-6">
              <FileUpload
                onFileUpload={handleFileUpload('video')}
                acceptedFileTypes="video/mp4"
                label="Upload Class Video"
                description="Upload your class recording in MP4 format"
                icon="video"
              />
              <FileUpload
                onFileUpload={handleFileUpload('lessonPlan')}
                acceptedFileTypes="application/pdf"
                label="Upload Lesson Plan"
                description="Upload your lesson plan in PDF format"
                icon="file"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-rockfeller-blue-primary/10 rounded-lg">
                <FiFileText className="w-6 h-6 text-rockfeller-blue-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Class Information</h2>
            </div>
            <MetadataForm metadata={metadata} onMetadataChange={setMetadata} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={!isReadyToAnalyze}
            className="button-primary"
          >
            {isAnalyzing ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Analyze Class'
            )}
          </button>
        </div>
      </div>
    </main>
  );
};