// Simple localStorage-backed data layer with seeding (ESM)
const STORAGE_KEYS = {
  users: 'sa_users',
  assignments: 'sa_assignments',
  session: 'sa_session',
  courses: 'sa_courses',
  groups: 'sa_groups',
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

    // Initialize courses
    if (!getLocal(STORAGE_KEYS.courses)) {
      const users = getLocal(STORAGE_KEYS.users, []);
      const adminId = users.find(u => u.role === 'admin')?.id || 'admin_1';
      const studentIds = users.filter(u => u.role === 'student').map(u => u.id);
      
      const course1 = {
        id: uid('course'),
        name: 'CS101 - Introduction to Computer Science',
        code: 'CS101',
        professorId: adminId,
        semester: 'Fall 2024',
        enrolledStudentIds: studentIds,
      };
      const course2 = {
        id: uid('course'),
        name: 'CS201 - Data Structures',
        code: 'CS201',
        professorId: adminId,
        semester: 'Fall 2024',
        enrolledStudentIds: studentIds,
      };
      setLocal(STORAGE_KEYS.courses, [course1, course2]);
    }

    // Initialize groups (empty initially)
    if (!getLocal(STORAGE_KEYS.groups)) {
      setLocal(STORAGE_KEYS.groups, []);
    }

    if (!getLocal(STORAGE_KEYS.assignments)) {
      const users = getLocal(STORAGE_KEYS.users, []);
      const courses = getLocal(STORAGE_KEYS.courses, []);
      const adminId = users.find(u => u.role === 'admin')?.id || 'admin_1';
      const studentIds = users.filter(u => u.role === 'student').map(u => u.id);
      const courseId = courses.length > 0 ? courses[0].id : null;
      
      const now = new Date();
      const due1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const due2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const a1 = {
        id: uid('asg'),
        title: 'Intro to Algorithms Essay',
        description: 'Write a short essay on divide-and-conquer.',
        dueDate: due1,
        driveLink: 'https://drive.google.com',
        courseId: courseId,
        createdByAdminId: adminId,
        submissionType: 'individual', // 'individual' or 'group'
        assignedStudentIds: studentIds,
        submissions: Object.fromEntries(studentIds.map(sid => [sid, { submitted: false, confirmedAt: null }]))
      };
      const a2 = {
        id: uid('asg'),
        title: 'Data Structures Group Project',
        description: 'Complete exercises on trees and graphs as a team.',
        dueDate: due2,
        driveLink: 'https://drive.google.com',
        courseId: courseId,
        createdByAdminId: adminId,
        submissionType: 'group', // 'individual' or 'group'
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

  function getCourses() {
    return getLocal(STORAGE_KEYS.courses, []);
  }

  function saveCourses(courses) {
    setLocal(STORAGE_KEYS.courses, courses);
  }

  function createCourse({ name, code, professorId, semester, enrolledStudentIds }) {
    const courses = getCourses();
    const newCourse = {
      id: uid('course'),
      name,
      code,
      professorId,
      semester,
      enrolledStudentIds: enrolledStudentIds || [],
    };
    const next = [...courses, newCourse];
    saveCourses(next);
    return newCourse;
  }

  function getGroups() {
    return getLocal(STORAGE_KEYS.groups, []);
  }

  function saveGroups(groups) {
    setLocal(STORAGE_KEYS.groups, groups);
  }

  function createGroup({ name, leaderId, memberIds, courseId }) {
    const groups = getGroups();
    const newGroup = {
      id: uid('group'),
      name,
      leaderId,
      memberIds: memberIds || [leaderId],
      courseId,
      createdAt: new Date().toISOString(),
    };
    const next = [...groups, newGroup];
    saveGroups(next);
    return newGroup;
  }

  function joinGroup({ groupId, studentId }) {
    const groups = getGroups();
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx === -1) return null;
    const group = groups[idx];
    if (!group.memberIds.includes(studentId)) {
      group.memberIds = [...group.memberIds, studentId];
      groups[idx] = { ...group };
      saveGroups(groups);
    }
    return group;
  }

  function leaveGroup({ groupId, studentId }) {
    const groups = getGroups();
    const idx = groups.findIndex(g => g.id === groupId);
    if (idx === -1) return null;
    const group = groups[idx];
    group.memberIds = group.memberIds.filter(id => id !== studentId);
    // If leader leaves, assign new leader
    if (group.leaderId === studentId && group.memberIds.length > 0) {
      group.leaderId = group.memberIds[0];
    }
    // If no members left, delete group
    if (group.memberIds.length === 0) {
      groups.splice(idx, 1);
    } else {
      groups[idx] = { ...group };
    }
    saveGroups(groups);
    return group;
  }

  function getStudentGroup(studentId, courseId) {
    const groups = getGroups();
    return groups.find(g => g.memberIds.includes(studentId) && g.courseId === courseId) || null;
  }

  function createAssignment({ title, description, dueDate, driveLink, courseId, createdByAdminId, submissionType = 'individual', assignedStudentIds }) {
    const assignments = getAssignments();
    const submissions = Object.fromEntries(assignedStudentIds.map(sid => [sid, { submitted: false, confirmedAt: null }]));
    const newAsg = {
      id: uid('asg'),
      title,
      description,
      dueDate,
      driveLink,
      courseId,
      createdByAdminId,
      submissionType, // 'individual' or 'group'
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
    
    // For group assignments, when leader acknowledges, all group members are marked
    if (a.submissionType === 'group') {
      const groups = getGroups();
      const studentGroup = groups.find(g => g.memberIds.includes(studentId) && g.courseId === a.courseId);
      
      if (studentGroup && studentGroup.leaderId === studentId) {
        // Leader acknowledges - mark all group members
        studentGroup.memberIds.forEach(memberId => {
          if (a.assignedStudentIds.includes(memberId)) {
            a.submissions[memberId] = { 
              submitted, 
              confirmedAt: submitted ? new Date().toISOString() : null,
              acknowledgedBy: studentId
            };
          }
        });
      } else if (studentGroup && studentGroup.leaderId !== studentId) {
        // Non-leader trying to submit - ignore (shouldn't happen in UI but handle gracefully)
        return;
      } else {
        // Student not in any group - can't submit group assignment
        return;
      }
    } else {
      // Individual assignment
      a.submissions[studentId] = { 
        submitted, 
        confirmedAt: submitted ? new Date().toISOString() : null 
      };
    }
    
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
  getCourses,
  saveCourses,
  createCourse,
  getGroups,
  saveGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  getStudentGroup,
};


