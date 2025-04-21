import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EvaluationResult, Method } from '../types';

interface AnalysisState {
  currentAnalysis: EvaluationResult | null;
  currentMethod: Method | null;
  analysisHistory: EvaluationResult[];
  analysisProgress: number;
  setCurrentAnalysis: (analysis: EvaluationResult | null) => void;
  setCurrentMethod: (method: Method | null) => void;
  setAnalysisProgress: (progress: number) => void;
  addToHistory: (analysis: EvaluationResult) => void;
  clearHistory: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      currentAnalysis: null,
      currentMethod: null,
      analysisHistory: [],
      analysisProgress: 0,
      setCurrentAnalysis: (analysis) => set({
        currentAnalysis: analysis,
      }),
      setCurrentMethod: (method) => set({ currentMethod: method }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
      addToHistory: (analysis) =>
        set((state) => ({
          analysisHistory: [analysis, ...state.analysisHistory].slice(0, 10),
        })),
      clearHistory: () => set({
        analysisHistory: [], 
        currentAnalysis: null, 
        currentMethod: null,
        analysisProgress: 0 
      }),
    }),
    {
      name: 'analysis-storage',
    }
  )
);