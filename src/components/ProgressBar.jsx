import React from 'react';

export default function ProgressBar({ current, total, className = '', label = 'Progress' }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  const isComplete = percent === 100;
  
  return (
    <div className={`w-full ${className}`} aria-label="progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
          {percent}%
        </span>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner" 
        role="progressbar" 
        aria-valuenow={percent} 
        aria-valuemin="0" 
        aria-valuemax="100"
      >
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500 font-medium">
        {current} / {total} {total === 1 ? 'submission' : 'submissions'}
      </div>
    </div>
  );
}


