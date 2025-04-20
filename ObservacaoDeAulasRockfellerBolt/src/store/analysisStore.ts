import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EvaluationResult } from '../types';

interface AnalysisState {
  currentAnalysis: EvaluationResult | null;
  analysisHistory: EvaluationResult[];
  analysisProgress: number;
  setCurrentAnalysis: (analysis: EvaluationResult | null) => void;
  setAnalysisProgress: (progress: number) => void;
  addToHistory: (analysis: EvaluationResult) => void;
  clearHistory: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      currentAnalysis: null,
      analysisHistory: [],
      analysisProgress: 0,
      setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setAnalysisProgress: (progress) => set({ analysisProgress: progress }),
      addToHistory: (analysis) =>
        set((state) => ({
          analysisHistory: [analysis, ...state.analysisHistory].slice(0, 10),
        })),
      clearHistory: () => set({ analysisHistory: [] }),
    }),
    {
      name: 'analysis-storage',
    }
  )
);