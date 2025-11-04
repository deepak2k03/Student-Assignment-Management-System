import React, { useState } from 'react';
import AssignmentCard from '../components/AssignmentCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function AdminDashboard({ admin, students, assignments, courses, onCreateAssignment, onCreateCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'submitted', 'pending'
  
  const myCourses = courses.filter(c => c.professorId === admin.id);
  const selectedCourse = myCourses.find(c => c.id === selectedCourseId);
  const courseAssignments = selectedCourse 
    ? assignments.filter(a => a.courseId === selectedCourse.id && a.createdByAdminId === admin.id)
    : [];
  
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    driveLink: '',
    submissionType: 'individual',
    assigned: new Set(selectedCourse?.enrolledStudentIds || []),
  });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    semester: 'Fall 2024',
    enrolled: new Set(students.map(s => s.id)),
  });

  // Filter and search assignments
  const filteredAssignments = courseAssignments.filter(asg => {
    const matchesSearch = asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asg.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const submittedCount = asg.assignedStudentIds.filter(id => asg.submissions[id]?.submitted).length;
    const totalCount = asg.assignedStudentIds.length;
    const allSubmitted = submittedCount === totalCount && totalCount > 0;
    
    if (filterStatus === 'submitted') return matchesSearch && allSubmitted;
    if (filterStatus === 'pending') return matchesSearch && !allSubmitted;
    
    return matchesSearch;
  });

  function toggleStudent(id) {
    const next = new Set(assignmentForm.assigned);
    if (next.has(id)) next.delete(id); else next.add(id);
    setAssignmentForm({ ...assignmentForm, assigned: next });
  }

  function toggleStudentCourse(id) {
    const next = new Set(courseForm.enrolled);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCourseForm({ ...courseForm, enrolled: next });
  }

  function submitAssignment(e) {
    e.preventDefault();
    if (!assignmentForm.title || !assignmentForm.dueDate || !selectedCourseId) return;
    onCreateAssignment({
      title: assignmentForm.title.trim(),
      description: assignmentForm.description.trim(),
      dueDate: new Date(assignmentForm.dueDate).toISOString(),
      driveLink: assignmentForm.driveLink.trim(),
      courseId: selectedCourseId,
      submissionType: assignmentForm.submissionType,
      assignedStudentIds: Array.from(assignmentForm.assigned),
    });
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      driveLink: '',
      submissionType: 'individual',
      assigned: new Set(selectedCourse?.enrolledStudentIds || []),
    });
    setShowAssignmentForm(false);
  }

  function submitCourse(e) {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code) return;
    onCreateCourse({
      name: courseForm.name.trim(),
      code: courseForm.code.trim(),
      semester: courseForm.semester.trim(),
      enrolledStudentIds: Array.from(courseForm.enrolled),
    });
    setCourseForm({
      name: '',
      code: '',
      semester: 'Fall 2024',
      enrolled: new Set(students.map(s => s.id)),
    });
    setShowCourseForm(false);
  }

  // If no course selected, show course list
  if (!selectedCourseId) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hello, {admin.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your courses and assignments</p>
          </div>
          <button
            onClick={() => setShowCourseForm(true)}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-sm transition-colors"
          >
            + Create Course
          </button>
        </div>

        {showCourseForm && (
          <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Course</h3>
            <form onSubmit={submitCourse} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code</label>
                  <input
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                    value={courseForm.code}
                    onChange={e => setCourseForm({ ...courseForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <input
                    className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                    value={courseForm.semester}
                    onChange={e => setCourseForm({ ...courseForm, semester: e.target.value })}
                    placeholder="Fall 2024"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name</label>
                <input
                  className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                  value={courseForm.name}
                  onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enroll Students</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                  {students.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        checked={courseForm.enrolled.has(s.id)}
                        onChange={() => toggleStudentCourse(s.id)}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCourseForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map(course => {
            const courseAsgs = assignments.filter(a => a.courseId === course.id);
            const totalStudents = course.enrolledStudentIds.length;
            return (
              <div
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-primary-300 cursor-pointer transition-all animate-slide-up"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{course.semester}</p>
                  </div>
                  <span className="text-2xl">📚</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{courseAsgs.length} {courseAsgs.length === 1 ? 'assignment' : 'assignments'}</span>
                    <span className="text-gray-600">{totalStudents} {totalStudents === 1 ? 'student' : 'students'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {myCourses.length === 0 && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-600">No courses yet. Create your first course to get started!</p>
          </div>
        )}
      </section>
    );
  }

  // Course assignments view
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => {
              setSelectedCourseId(null);
              setShowAssignmentForm(false);
            }}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2 flex items-center gap-2"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{selectedCourse?.code} - {selectedCourse?.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{selectedCourse?.semester}</p>
        </div>
        <button
          onClick={() => setShowAssignmentForm(!showAssignmentForm)}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium shadow-sm transition-colors"
        >
          {showAssignmentForm ? '−' : '+'} {showAssignmentForm ? 'Cancel' : 'New Assignment'}
        </button>
      </div>

      {showAssignmentForm && (
        <form onSubmit={submitAssignment} className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Assignment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                value={assignmentForm.title}
                onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                placeholder="e.g., Project 1: Sorting"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                rows={3}
                value={assignmentForm.description}
                onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                placeholder="What should students do?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date & Time</label>
              <input
                type="datetime-local"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                value={assignmentForm.dueDate}
                onChange={e => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Submission Type</label>
              <select
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                value={assignmentForm.submissionType}
                onChange={e => setAssignmentForm({ ...assignmentForm, submissionType: e.target.value })}
              >
                <option value="individual">👤 Individual</option>
                <option value="group">👥 Group</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">OneDrive Link</label>
              <input
                type="url"
                className="mt-1 w-full rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                value={assignmentForm.driveLink}
                onChange={e => setAssignmentForm({ ...assignmentForm, driveLink: e.target.value })}
                placeholder="https://onedrive.live.com/..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Students</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                {students
                  .filter(s => selectedCourse?.enrolledStudentIds.includes(s.id))
                  .map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        checked={assignmentForm.assigned.has(s.id)}
                        onChange={() => toggleStudent(s.id)}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAssignmentForm(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
            >
              Create Assignment
            </button>
          </div>
        </form>
      )}

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
        >
          <option value="all">All Assignments</option>
          <option value="pending">Pending Submissions</option>
          <option value="submitted">All Submitted</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredAssignments.map(asg => {
          const total = asg.assignedStudentIds.length;
          const current = asg.assignedStudentIds.filter(id => asg.submissions[id]?.submitted).length;
          return (
            <AssignmentCard
              key={asg.id}
              assignment={asg}
              footer={
                <div className="space-y-4">
                  <ProgressBar current={current} total={total} label="Submission Progress" />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">Student Status</h5>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {students
                        .filter(s => asg.assignedStudentIds.includes(s.id))
                        .map(s => {
                          const submitted = asg.submissions[s.id]?.submitted;
                          return (
                            <div
                              key={s.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-gray-700 font-medium">{s.name}</span>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  submitted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {submitted ? '✓ Submitted' : '⏳ Pending'}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              }
            />
          );
        })}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-600">
              {courseAssignments.length === 0
                ? 'No assignments yet. Create your first assignment!'
                : 'No assignments match your search criteria.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


