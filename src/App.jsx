import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import AdminDashboard from './dashboards/AdminDashboard.jsx';
import StudentDashboard from './dashboards/StudentDashboard.jsx';
import { Storage } from './state/storage.js';
import Login from './pages/Login.jsx';
import { ToastContainer } from './components/Toast.jsx';

// Ensure data exists before the first render
Storage.seed();

export default function App() {
  const [users, setUsers] = useState(() => Storage.getUsers());
  const [session, setSession] = useState(() => Storage.getSession());
  const [assignments, setAssignments] = useState(() => Storage.getAssignments());
  const [courses, setCourses] = useState(() => Storage.getCourses());
  const [groups, setGroups] = useState(() => Storage.getGroups());
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Sync state on mount (in case seed just ran)
    setUsers(Storage.getUsers());
    setSession(Storage.getSession());
    setAssignments(Storage.getAssignments());
    setCourses(Storage.getCourses());
    setGroups(Storage.getGroups());
  }, []);

  function showToast(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  function handleLogin({ username, password }) {
    const user = Storage.login({ username, password });
    if (!user) {
      setLoginError('Invalid username or password');
      showToast('Invalid username or password', 'error');
      return;
    }
    setLoginError('');
    showToast(`Welcome back, ${user.name}!`, 'success');
    setSession(Storage.getSession());
    setUsers(Storage.getUsers());
    setAssignments(Storage.getAssignments());
    setCourses(Storage.getCourses());
    setGroups(Storage.getGroups());
  }

  function handleLogout() {
    Storage.logout();
    setSession(Storage.getSession());
    setLoginError('');
    showToast('Logged out successfully', 'info');
  }

  function handleSignup({ username, name, password, role }) {
    const { user, error } = Storage.registerUser({ username, name, password, role });
    if (error) {
      setSignupError(error);
      showToast(error, 'error');
      return;
    }
    setSignupError('');
    showToast(`Account created! Welcome, ${name}!`, 'success');
    setUsers(Storage.getUsers());
    setSession(Storage.getSession());
    setCourses(Storage.getCourses());
    setGroups(Storage.getGroups());
  }

  const currentUser = users.find(u => u.id === session.currentUserId);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  
  if (!currentUser) {
    return (
      <>
        <Login onSubmit={handleLogin} onSignup={handleSignup} error={loginError} signupError={signupError} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }
  
  const isAdmin = currentUser?.role === 'admin';

  function handleCreateAssignment({ title, description, dueDate, driveLink, courseId, submissionType, assignedStudentIds }) {
    Storage.createAssignment({ 
      title, 
      description, 
      dueDate, 
      driveLink, 
      courseId,
      submissionType,
      createdByAdminId: currentUser.id, 
      assignedStudentIds 
    });
    setAssignments(Storage.getAssignments());
    showToast('Assignment created successfully!', 'success');
  }

  function handleConfirmSubmission(assignmentId) {
    Storage.updateSubmission({ assignmentId, studentId: currentUser.id, submitted: true });
    setAssignments(Storage.getAssignments());
    showToast('Submission acknowledged successfully!', 'success');
  }

  function handleCreateCourse({ name, code, semester, enrolledStudentIds }) {
    Storage.createCourse({ 
      name, 
      code, 
      professorId: currentUser.id, 
      semester, 
      enrolledStudentIds 
    });
    setCourses(Storage.getCourses());
    showToast('Course created successfully!', 'success');
  }

  function handleCreateGroup({ name, courseId }) {
    const group = Storage.createGroup({ 
      name, 
      leaderId: currentUser.id, 
      courseId 
    });
    setGroups(Storage.getGroups());
    showToast('Group created successfully!', 'success');
    return group;
  }

  function handleJoinGroup({ groupId }) {
    const group = Storage.joinGroup({ groupId, studentId: currentUser.id });
    if (group) {
      setGroups(Storage.getGroups());
      showToast('Joined group successfully!', 'success');
    }
    return group;
  }

  function handleLeaveGroup({ groupId }) {
    Storage.leaveGroup({ groupId, studentId: currentUser.id });
    setGroups(Storage.getGroups());
    showToast('Left group successfully', 'info');
  }

  const students = users.filter(u => u.role === 'student');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header user={currentUser} onLogout={handleLogout} />
      <main className="flex-1">
        {isAdmin ? (
          <AdminDashboard 
            admin={currentUser} 
            students={students} 
            assignments={assignments} 
            courses={courses}
            onCreateAssignment={handleCreateAssignment}
            onCreateCourse={handleCreateCourse}
          />
        ) : (
          <StudentDashboard 
            student={currentUser} 
            assignments={assignments} 
            courses={courses}
            groups={groups}
            users={users}
            onConfirmSubmit={handleConfirmSubmission}
            onCreateGroup={handleCreateGroup}
            onJoinGroup={handleJoinGroup}
            onLeaveGroup={handleLeaveGroup}
          />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500">
        Built with React + Tailwind (no backend) · Data stored in your browser
      </footer>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}


