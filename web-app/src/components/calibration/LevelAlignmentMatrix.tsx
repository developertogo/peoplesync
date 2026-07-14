import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Metric {
  name: string;
  actual: number;
  expected: number;
}

interface AlignmentData {
  targetRole: string;
  metrics: Metric[];
  recommendation: string;
}

interface LevelAlignmentMatrixProps {
  alignmentData: AlignmentData;
  candidateName: string;
  isDarkMode: boolean;
  cardClass: string;
  isResponsiveMode: boolean;
}

export const LevelAlignmentMatrix: React.FC<LevelAlignmentMatrixProps> = ({
  alignmentData,
  candidateName,
  isDarkMode,
  cardClass,
  isResponsiveMode
}) => {
  return (
    <div className={`flex-1 space-y-6 ${cardClass} ${isResponsiveMode ? 'w-full h-auto overflow-visible' : 'overflow-y-auto min-h-0 pr-3'}`}>
      <div>
        <h3 className="font-display font-semibold text-base mb-1">Level Alignment Matrix</h3>
        <span className={`text-xs ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>
          {candidateName} vs <strong>{alignmentData.targetRole}</strong> expectations
        </span>
      </div>

      <div className="space-y-4">
        {alignmentData.metrics.map((metric) => (
          <div key={metric.name} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{metric.name}</span>
              <span className="text-primary font-semibold">{metric.actual}% / {metric.expected}%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border relative ${isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-slate-150 border-slate-250'}`}>
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" 
                style={{ left: `${metric.expected}%` }}
                title={`Expected: ${metric.expected}%`}
              />
              <div 
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500" 
                style={{ width: `${metric.actual}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-xl p-4 border text-xs leading-relaxed space-y-2 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-slate-50 border-slate-202 text-slate-606'}`}>
        <div className={`font-semibold flex items-center space-x-1.5 ${isDarkMode ? 'text-white' : 'text-slate-905'}`}>
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>Promotion Recommendation</span>
        </div>
        <p>
          {alignmentData.recommendation}
        </p>
      </div>
    </div>
  );
};
