import React from 'react';

export default function Header({ user, onLogout }) {
    const isAdmin = user?.role === 'admin';
    return (
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary-600 text-white grid place-items-center font-bold">SA</div>
            <div>
              <div className="text-sm text-gray-500">Student Assignment</div>
              <div className="text-base font-semibold text-gray-900">Dashboard</div>
            </div>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{isAdmin ? 'Admin' : 'Student'}</span>
              <div className="text-sm text-gray-700 font-medium">{user.name}</div>
              <button className="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
    );
}


