import React from 'react';

function formatDate(iso) {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue (${date.toLocaleDateString()})`;
    } else if (diffDays === 0) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch {
    return iso;
  }
}

export default function AssignmentCard({ assignment, footer, children }) {
  const isOverdue = new Date(assignment.dueDate) < new Date();
  const submissionTypeBadge = assignment.submissionType === 'group' 
    ? 'bg-purple-100 text-purple-700' 
    : 'bg-blue-100 text-blue-700';

  return (
    <div className={`rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
      isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'
    } p-6`}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-lg font-bold text-gray-900">{assignment.title}</h4>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${submissionTypeBadge}`}>
              {assignment.submissionType === 'group' ? '👥 Group' : '👤 Individual'}
            </span>
          </div>
          {assignment.description && (
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{assignment.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <span className={`inline-flex items-center gap-2 font-medium ${
              isOverdue ? 'text-red-600' : 'text-gray-700'
            }`}>
              <span className="text-base">📅</span>
              <span>{formatDate(assignment.dueDate)}</span>
            </span>
            {assignment.driveLink && (
              <a 
                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold underline transition-colors" 
                href={assignment.driveLink} 
                target="_blank" 
                rel="noreferrer"
              >
                <span>🔗</span>
                <span>OneDrive Link</span>
              </a>
            )}
          </div>
        </div>
        {children && <div className="w-full md:w-auto">{children}</div>}
      </div>
      {footer && <div className="mt-5 pt-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
}


