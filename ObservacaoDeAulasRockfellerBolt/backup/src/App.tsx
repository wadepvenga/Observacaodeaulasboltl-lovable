import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { MetadataForm } from './components/MetadataForm';
import { EvaluationResults } from './components/EvaluationResults';
import { ClassMetadata, UploadedFiles, EvaluationResult, ADULTS_CHECKLIST, TEENS_CHECKLIST } from './types';
import { analyzeClass } from './services/gemini';
import { FiUpload, FiFileText, FiCheckCircle } from 'react-icons/fi';

function App() {
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

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (type: keyof UploadedFiles) => (file: File) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!files.video || !files.lessonPlan) {
      setError('Please upload all required files');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeClass(
        files.video,
        files.lessonPlan,
        metadata
      );

      setEvaluationResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze class. Please try again.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChecklistItemToggle = (itemId: string) => {
    if (!evaluationResult) return;

    setEvaluationResult({
      ...evaluationResult,
      checklist: evaluationResult.checklist.map((item) =>
        item.id === itemId ? {
          ...item,
          status: item.status === 'completed' ? 'notDone' : 'completed'
        } : item
      ),
    });
  };

  const isReadyToAnalyze = files.video && files.lessonPlan && metadata.teacherName && metadata.book && metadata.lesson;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="bg-rockfeller-yellow shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/rockfeller-icon.svg" alt="Rockfeller" className="h-10 w-auto" />
              <div className="h-8 w-px bg-white/20" />
              <span className="text-xl font-bold text-white">
                Observação de aulas Rockfeller
              </span>
            </div>
          </div>
        </div>
      </nav>

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
            <div className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={!isReadyToAnalyze || isAnalyzing}
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

          {evaluationResult && (
            <EvaluationResults
              result={evaluationResult}
              onChecklistItemToggle={handleChecklistItemToggle}
              method={metadata.method}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;