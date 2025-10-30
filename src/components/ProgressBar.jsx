import React from 'react';

export default function ProgressBar({ current, total, className = '' }) {
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
      <div className={`w-full ${className}`} aria-label="progress">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-xs text-gray-500">{percent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
          <div className="bg-primary-600 h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-1 text-xs text-gray-500">{current} / {total} submitted</div>
      </div>
    );
}


