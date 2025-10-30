import React from 'react';

function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

export default function AssignmentCard({ assignment, footer, children }) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{assignment.title}</h4>
            {assignment.description && (
              <p className="mt-1 text-sm text-gray-600">{assignment.description}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1"><span className="font-medium text-gray-700">Due:</span> {formatDate(assignment.dueDate)}</span>
              {assignment.driveLink && (
                <a className="text-primary-600 hover:text-primary-700 underline" href={assignment.driveLink} target="_blank" rel="noreferrer">Drive link</a>
              )}
            </div>
          </div>
          {children && <div className="w-full md:w-auto">{children}</div>}
        </div>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    );
}


