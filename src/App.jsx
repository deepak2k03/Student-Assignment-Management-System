import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import AdminDashboard from './dashboards/AdminDashboard.jsx';
import StudentDashboard from './dashboards/StudentDashboard.jsx';
import { Storage } from './state/storage.js';
import Login from './pages/Login.jsx';

// Ensure data exists before the first render
Storage.seed();

export default function App() {
  const [users, setUsers] = useState(() => Storage.getUsers());
  const [session, setSession] = useState(() => Storage.getSession());
  const [assignments, setAssignments] = useState(() => Storage.getAssignments());

  useEffect(() => {
    // Sync state on mount (in case seed just ran)
    setUsers(Storage.getUsers());
    setSession(Storage.getSession());
    setAssignments(Storage.getAssignments());
  }, []);

  function handleLogin({ username, password }) {
    const user = Storage.login({ username, password });
    if (!user) {
      setLoginError('Invalid username or password');
      return;
    }
    setLoginError('');
    setSession(Storage.getSession());
    // ensure users and assignments refresh (e.g., after first login)
    setUsers(Storage.getUsers());
    setAssignments(Storage.getAssignments());
  }

  function handleLogout() {
    Storage.logout();
    setSession(Storage.getSession());
    // optional: also clear any login error messages
    setLoginError('');
  }

  function handleSignup({ username, name, password, role }) {
    const { user, error } = Storage.registerUser({ username, name, password, role });
    if (error) {
      setSignupError(error);
      return;
    }
    setSignupError('');
    // refresh state to reflect new user and session
    setUsers(Storage.getUsers());
    setSession(Storage.getSession());
  }

  const currentUser = users.find(u => u.id === session.currentUserId);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  if (!currentUser) {
    return <Login onSubmit={handleLogin} onSignup={handleSignup} error={loginError} signupError={signupError} />;
  }
  const isAdmin = currentUser?.role === 'admin';

  function handleCreateAssignment({ title, description, dueDate, driveLink, assignedStudentIds }) {
    Storage.createAssignment({ title, description, dueDate, driveLink, createdByAdminId: currentUser.id, assignedStudentIds });
    setAssignments(Storage.getAssignments());
  }

  function handleConfirmSubmission(assignmentId) {
    Storage.updateSubmission({ assignmentId, studentId: currentUser.id, submitted: true });
    setAssignments(Storage.getAssignments());
  }

  const students = users.filter(u => u.role === 'student');

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="flex-1">
        {isAdmin ? (
          <AdminDashboard admin={currentUser} students={students} assignments={assignments} onCreateAssignment={handleCreateAssignment} />
        ) : (
          <StudentDashboard student={currentUser} assignments={assignments} onConfirmSubmit={handleConfirmSubmission} />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500">
        Built with React + Tailwind (no backend) · Data stored in your browser
      </footer>
    </div>
  );
}


