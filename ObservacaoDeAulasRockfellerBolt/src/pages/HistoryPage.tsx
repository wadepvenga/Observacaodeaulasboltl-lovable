import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysisStore } from '../store/analysisStore';
import { FiClock, FiArrowRight } from 'react-icons/fi';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { analysisHistory, setCurrentAnalysis } = useAnalysisStore();

  const handleViewAnalysis = (index: number) => {
    setCurrentAnalysis(analysisHistory[index]);
    navigate('/analysis');
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-rockfeller-blue-primary/10 rounded-lg">
            <FiClock className="w-6 h-6 text-rockfeller-blue-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Analysis History</h2>
        </div>

        {analysisHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No analysis history available
          </div>
        ) : (
          <div className="space-y-4">
            {analysisHistory.map((analysis, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-rockfeller-blue-primary transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {analysis.teacherName}
                  </h3>
                  <p className="text-sm text-gray-500">{analysis.bookAndLesson}</p>
                </div>
                <button
                  onClick={() => handleViewAnalysis(index)}
                  className="flex items-center space-x-2 text-rockfeller-blue-primary hover:text-rockfeller-blue-secondary transition-colors"
                >
                  <span>View Analysis</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};