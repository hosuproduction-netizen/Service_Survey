import React from 'react';
import { AIAnalysisResult } from '../types';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface AnalysisResultProps {
  result: AIAnalysisResult;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-xl p-6 mt-6 md:animate-pulse-slow">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-hipixel-accent" />
        <h3 className="text-xl font-display font-bold text-white">AI Request Analysis</h3>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Clarity Score</span>
          <span className={`text-3xl font-bold ${getScoreColor(result.clarityScore)}`}>
            {result.clarityScore}/100
          </span>
        </div>
        <div className="w-px h-10 bg-white/10"></div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">Tone</span>
          <span className="text-lg text-white capitalize">{result.tone}</span>
        </div>
      </div>

      <div className="space-y-4">
        {result.missingInfo.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-semibold text-yellow-200 mb-2">
              <AlertCircle className="w-4 h-4 mr-2" /> Missing Information
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 ml-1">
              {result.missingInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        )}

        {result.suggestions.length > 0 && (
          <div>
            <h4 className="flex items-center text-sm font-semibold text-blue-200 mb-2">
               Suggestions
            </h4>
             <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 ml-1">
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {result.suggestions.length === 0 && result.missingInfo.length === 0 && (
          <div className="text-green-300 flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2" /> Looks great! Ready to submit.
          </div>
        )}
      </div>
    </div>
  );
};