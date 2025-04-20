import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EvaluationResults } from '../components/EvaluationResults';
import { useAnalysisStore } from '../store/analysisStore';
import { FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentAnalysis, analysisProgress } = useAnalysisStore();

  const handleExport = () => {
    if (!currentAnalysis) return;

    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper functions
    const addTitle = (text: string) => {
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin, yPos);
      yPos += 10;
    };

    const addSubtitle = (text: string) => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(text, margin, yPos);
      yPos += 10;
    };

    const addText = (text: string) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(text, margin, yPos);
      yPos += 7;
    };

    const addProgressBar = (label: string, percentage: number) => {
      // Label and percentage
      doc.setFontSize(10);
      doc.text(`${label}: ${percentage}%`, margin, yPos);
      yPos += 5;

      // Bar background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, contentWidth, 3, 'F');

      // Bar progress
      doc.setFillColor(11, 51, 222); // rockfeller-blue-primary
      doc.rect(margin, yPos, (contentWidth * percentage) / 100, 3, 'F');
      yPos += 10;
    };

    const checkPageSpace = (neededSpace: number) => {
      if (yPos + neededSpace > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    // Title
    addTitle(`Class Analysis Report - ${currentAnalysis.teacherName}`);
    addText(`${currentAnalysis.bookAndLesson}`);
    yPos += 10;

    // Summary Section
    addSubtitle('Summary');
    yPos += 5;

    // Speaking Time Analysis
    addText('Speaking Time Analysis');
    addProgressBar('Teacher Talk Time', currentAnalysis.summary.teacherTalkTime);
    addProgressBar('Student Talk Time', currentAnalysis.summary.studentTalkTime);

    // Language Usage
    checkPageSpace(40);
    addText('Language Usage');
    addProgressBar('English', currentAnalysis.summary.englishPercentage);
    addProgressBar('Portuguese', currentAnalysis.summary.portuguesePercentage);

    // Grammar Points
    checkPageSpace(40);
    addText('Grammar Points');
    currentAnalysis.summary.grammarPoints.forEach(point => {
      checkPageSpace(10);
      addText(`• ${point}`);
    });

    // Vocabulary
    checkPageSpace(40);
    addText('Vocabulary');
    currentAnalysis.summary.vocabulary.forEach(word => {
      checkPageSpace(10);
      addText(`• ${word}`);
    });

    // Lesson Plan Adherence
    checkPageSpace(40);
    addText('Lesson Plan Adherence');
    const adherenceLines = doc.splitTextToSize(
      currentAnalysis.summary.lessonPlanAdherence,
      contentWidth
    );
    adherenceLines.forEach(line => {
      checkPageSpace(10);
      addText(line);
    });

    // Checklist Section
    checkPageSpace(60);
    doc.addPage();
    yPos = margin;
    addSubtitle('Checklist Evaluation');
    yPos += 5;

    currentAnalysis.checklist.forEach(item => {
      checkPageSpace(20);
      
      // Item text
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(item.text, margin, yPos);
      yPos += 7;

      // Status and comment
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Status: ${item.status}`, margin + 5, yPos);
      yPos += 5;

      if (item.comment) {
        const commentLines = doc.splitTextToSize(item.comment, contentWidth - 10);
        commentLines.forEach(line => {
          checkPageSpace(10);
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
      }
      yPos += 5;
    });

    // Transcription Section
    checkPageSpace(60);
    doc.addPage();
    yPos = margin;
    addSubtitle('Class Transcription');
    yPos += 10;

    const transcriptionLines = doc.splitTextToSize(
      currentAnalysis.transcription,
      contentWidth
    );
    transcriptionLines.forEach(line => {
      checkPageSpace(10);
      doc.setFontSize(10);
      doc.text(line, margin, yPos);
      yPos += 5;
    });

    // Save the PDF
    doc.save(`class-analysis-${currentAnalysis.teacherName}.pdf`);
  };

  if (analysisProgress < 100) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="card">
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 mx-auto">
              <svg className="animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-xl font-semibold">Analyzing class...</div>
              <div className="text-gray-500">This may take a few minutes</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-rockfeller-blue-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              {analysisProgress}% complete
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    navigate('/upload');
    return null;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-rockfeller-blue-primary text-white rounded-lg hover:bg-rockfeller-blue-secondary transition-colors"
        >
          <FiDownload className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>
      <EvaluationResults
        result={currentAnalysis}
        onChecklistItemToggle={() => {}}
        method={currentAnalysis.method}
      />
    </main>
  );
};