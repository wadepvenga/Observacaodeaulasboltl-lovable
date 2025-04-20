import React, { useState } from 'react';
import { EvaluationResult, ADULTS_CHECKLIST, TEENS_CHECKLIST, Method, ChecklistItemStatus } from '../types';
import { FiCheck, FiX, FiAward, FiMinus, FiAlertTriangle, FiFileText, FiList } from 'react-icons/fi';

interface EvaluationResultsProps {
  result: EvaluationResult;
  onChecklistItemToggle: (itemId: string) => void;
  method: Method;
}

const getStatusIcon = (status: ChecklistItemStatus) => {
  switch (status) {
    case 'completed':
      return <FiCheck className="w-4 h-4 text-white" />;
    case 'partial':
      return <FiAlertTriangle className="w-4 h-4 text-white" />;
    case 'notDone':
      return <FiX className="w-4 h-4 text-white" />;
    case 'notApplicable':
      return <FiMinus className="w-4 h-4 text-white" />;
  }
};

const getStatusColors = (status: ChecklistItemStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 group-hover:bg-green-600';
    case 'partial':
      return 'bg-yellow-500 group-hover:bg-yellow-600';
    case 'notDone':
      return 'bg-red-500 group-hover:bg-red-600';
    case 'notApplicable':
      return 'bg-gray-400 group-hover:bg-gray-500';
  }
};

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({
  result,
  onChecklistItemToggle,
  method,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'checklist' | 'transcription'>('summary');
  const checklist = method === 'Adults' ? ADULTS_CHECKLIST : TEENS_CHECKLIST;

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FiAward },
    { id: 'checklist', label: 'Checklist', icon: FiList },
    { id: 'transcription', label: 'Transcription', icon: FiFileText },
  ];

  return (
    <div className="card space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">{result.teacherName}</h2>
          <p className="text-gray-600">{result.bookAndLesson}</p>
        </div>
        <div className="badge badge-success flex items-center space-x-2">
          <FiAward className="w-4 h-4" />
          <span>Evaluation Complete</span>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === id
                  ? 'border-rockfeller-blue-primary text-rockfeller-blue-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'summary' && (
          <div className="space-y-8">
            {result.summary && (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Speaking Time Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Teacher Talk Time</span>
                          <span>{result.summary.teacherTalkTime}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rockfeller-blue-primary"
                            style={{ width: `${result.summary.teacherTalkTime}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Student Talk Time</span>
                          <span>{result.summary.studentTalkTime}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rockfeller-yellow"
                            style={{ width: `${result.summary.studentTalkTime}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Language Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>English</span>
                          <span>{result.summary.englishPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${result.summary.englishPercentage}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Portuguese</span>
                          <span>{result.summary.portuguesePercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500"
                            style={{ width: `${result.summary.portuguesePercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Grammar Points</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {result.summary.grammarPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Vocabulary</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {result.summary.vocabulary.map((word, index) => (
                        <li key={index} className="text-gray-700">{word}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Lesson Plan Adherence</h3>
                  <p className="text-gray-700">{result.summary.lessonPlanAdherence}</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-8">
            {checklist.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-semibold">{section.category}</h3>
                <div className="space-y-3">
                  {section.items.map((item) => {
                    const checklistItem = result.checklist.find(i => i.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className="group flex items-start p-4 rounded-xl transition-all duration-300
                          bg-white hover:bg-gray-50 border border-gray-200"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors mt-0.5
                          ${getStatusColors(checklistItem?.status || 'notDone')}`}
                        >
                          {getStatusIcon(checklistItem?.status || 'notDone')}
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-700">{item.text}</p>
                          {checklistItem?.comment && (
                            <p className="mt-1 text-sm text-gray-500">{checklistItem.comment}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transcription' && (
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {result.transcription}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};