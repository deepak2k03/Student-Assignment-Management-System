// Simple localStorage-backed data layer with seeding (ESM)
const STORAGE_KEYS = {
  users: 'sa_users',
  assignments: 'sa_assignments',
  session: 'sa_session',
};

  function getLocal(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function setLocal(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function seed() {
    if (!getLocal(STORAGE_KEYS.users)) {
      // Demo credentials (do NOT use in production)
      const admin = { id: 'admin_1', username: 'ada', name: 'Prof. Ada', role: 'admin', password: 'admin123' };
      const s1 = { id: 'student_1', username: 'alice', name: 'Alice', role: 'student', password: 'student123' };
      const s2 = { id: 'student_2', username: 'bob', name: 'Bob', role: 'student', password: 'student123' };
      setLocal(STORAGE_KEYS.users, [admin, s1, s2]);
    }

    if (!getLocal(STORAGE_KEYS.assignments)) {
      const users = getLocal(STORAGE_KEYS.users, []);
      const adminId = users.find(u => u.role === 'admin')?.id || 'admin_1';
      const studentIds = users.filter(u => u.role === 'student').map(u => u.id);
      const now = new Date();
      const due1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const due2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const a1 = {
        id: uid('asg'),
        title: 'Intro to Algorithms Essay',
        description: 'Write a short essay on divide-and-conquer.',
        dueDate: due1,
        driveLink: 'https://drive.google.com',
        createdByAdminId: adminId,
        assignedStudentIds: studentIds,
        submissions: Object.fromEntries(studentIds.map(sid => [sid, { submitted: false, confirmedAt: null }]))
      };
      const a2 = {
        id: uid('asg'),
        title: 'Data Structures Worksheet',
        description: 'Complete exercises on trees and graphs.',
        dueDate: due2,
        driveLink: 'https://drive.google.com',
        createdByAdminId: adminId,
        assignedStudentIds: studentIds,
        submissions: Object.fromEntries(studentIds.map(sid => [sid, { submitted: false, confirmedAt: null }]))
      };
      setLocal(STORAGE_KEYS.assignments, [a1, a2]);
    }

    if (!getLocal(STORAGE_KEYS.session)) {
      setLocal(STORAGE_KEYS.session, { currentUserId: null });
    }
  }

  function getUsers() {
    return getLocal(STORAGE_KEYS.users, []);
  }

  function getSession() {
    return getLocal(STORAGE_KEYS.session, { currentUserId: null });
  }

  function setSession(session) {
    setLocal(STORAGE_KEYS.session, session);
  }

  function login({ username, password }) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return null;
    setSession({ currentUserId: user.id });
    return user;
  }

  function logout() {
    setSession({ currentUserId: null });
  }

  function getAssignments() {
    return getLocal(STORAGE_KEYS.assignments, []);
  }

  function saveAssignments(assignments) {
    setLocal(STORAGE_KEYS.assignments, assignments);
  }

  function registerUser({ username, name, password, role = 'student' }) {
    const users = getUsers();
    if (users.some(u => u.username === username)) {
      return { error: 'Username already exists' };
    }
    const newUser = { id: uid(role), username, name, role, password };
    const nextUsers = [...users, newUser];
    setLocal(STORAGE_KEYS.users, nextUsers);
    // keep existing assignments; only new ones will include new student if assigned later
    setSession({ currentUserId: newUser.id });
    return { user: newUser };
  }

  function createAssignment({ title, description, dueDate, driveLink, createdByAdminId, assignedStudentIds }) {
    const assignments = getAssignments();
    const submissions = Object.fromEntries(assignedStudentIds.map(sid => [sid, { submitted: false, confirmedAt: null }]));
    const newAsg = {
      id: uid('asg'),
      title,
      description,
      dueDate,
      driveLink,
      createdByAdminId,
      assignedStudentIds,
      submissions,
    };
    const next = [newAsg, ...assignments];
    saveAssignments(next);
    return newAsg;
  }

  function updateSubmission({ assignmentId, studentId, submitted }) {
    const list = getAssignments();
    const idx = list.findIndex(a => a.id === assignmentId);
    if (idx === -1) return;
    const a = list[idx];
    a.submissions[studentId] = { submitted, confirmedAt: submitted ? new Date().toISOString() : null };
    list[idx] = { ...a };
    saveAssignments(list);
  }

export const Storage = {
  seed,
  getUsers,
  getSession,
  setSession,
  login,
  logout,
  registerUser,
  getAssignments,
  saveAssignments,
  createAssignment,
  updateSubmission,
};


