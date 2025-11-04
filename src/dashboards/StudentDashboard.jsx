import React, { useState } from 'react';
import AssignmentCard from '../components/AssignmentCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function StudentDashboard({ 
  student, 
  assignments, 
  courses, 
  groups, 
  users,
  onConfirmSubmit,
  onCreateGroup,
  onJoinGroup,
  onLeaveGroup,
}) {
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [pendingAsg, setPendingAsg] = useState(null);
  const [stage, setStage] = useState(0); // 0: closed, 1: first confirm, 2: final confirm
  const [showGroupModal, setShowGroupModal] = useState(null); // { assignmentId, courseId } or null
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupToJoin, setSelectedGroupToJoin] = useState(null);

  const myCourses = courses.filter(c => c.enrolledStudentIds.includes(student.id));
  const selectedCourse = myCourses.find(c => c.id === selectedCourseId);
  const courseAssignments = selectedCourse
    ? assignments.filter(a => a.courseId === selectedCourse.id && a.assignedStudentIds.includes(student.id))
    : [];

  // Get all assignments across all courses for progress calculation
  const allMyAssignments = assignments.filter(a => a.assignedStudentIds.includes(student.id));
  const submittedCount = allMyAssignments.filter(a => a.submissions[student.id]?.submitted).length;

  function startConfirm(asg) {
    setPendingAsg(asg);
    setStage(1);
  }

  function cancelConfirm() {
    setStage(0);
    setPendingAsg(null);
  }

  function confirmFirst() {
    setStage(2);
  }

  function confirmFinal() {
    if (pendingAsg) {
      onConfirmSubmit(pendingAsg.id);
    }
    cancelConfirm();
  }

  function getStudentGroup(courseId) {
    return groups.find(g => g.memberIds.includes(student.id) && g.courseId === courseId) || null;
  }

  function isGroupLeader(courseId) {
    const group = getStudentGroup(courseId);
    return group && group.leaderId === student.id;
  }

  function canSubmitGroupAssignment(assignment) {
    if (assignment.submissionType !== 'group') return true;
    const group = getStudentGroup(assignment.courseId);
    if (!group) return false;
    return group.leaderId === student.id;
  }

  function handleCreateGroup() {
    if (!newGroupName.trim() || !showGroupModal?.courseId) return;
    onCreateGroup({
      name: newGroupName.trim(),
      courseId: showGroupModal.courseId,
    });
    setNewGroupName('');
    setShowGroupModal(null);
  }

  function handleJoinGroup() {
    if (!selectedGroupToJoin) return;
    onJoinGroup({ groupId: selectedGroupToJoin });
    setSelectedGroupToJoin(null);
    setShowGroupModal(null);
  }

  function openGroupModal(assignment) {
    setShowGroupModal({ assignmentId: assignment.id, courseId: assignment.courseId });
    setNewGroupName('');
    setSelectedGroupToJoin(null);
  }

  // Get available groups for a course (groups the student isn't in)
  function getAvailableGroups(courseId) {
    return groups.filter(
      g => g.courseId === courseId && !g.memberIds.includes(student.id)
    );
  }

  // If no course selected, show course list
  if (!selectedCourseId) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {student.name}</h2>
          <p className="text-sm text-gray-600 mt-1">View your courses and track assignment progress</p>
        </div>

        {/* Overall Progress */}
        <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <ProgressBar 
            current={submittedCount} 
            total={allMyAssignments.length} 
            label="Overall Progress"
          />
        </div>

        {/* Course Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCourses.map(course => {
            const courseAsgs = assignments.filter(
              a => a.courseId === course.id && a.assignedStudentIds.includes(student.id)
            );
            const courseSubmitted = courseAsgs.filter(
              a => a.submissions[student.id]?.submitted
            ).length;
            const studentGroup = getStudentGroup(course.id);

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
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {courseSubmitted} / {courseAsgs.length} submitted
                    </span>
                    <span className="text-xs font-semibold text-primary-600">
                      {courseAsgs.length > 0
                        ? Math.round((courseSubmitted / courseAsgs.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  {studentGroup && (
                    <div className="mt-2 text-xs text-purple-600 font-medium">
                      👥 Group: {studentGroup.name}
                      {isGroupLeader(course.id) && ' (Leader)'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {myCourses.length === 0 && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-600">You are not enrolled in any courses yet.</p>
          </div>
        )}
      </section>
    );
  }

  // Course assignments view
  const studentGroup = getStudentGroup(selectedCourse.id);
  const availableGroups = getAvailableGroups(selectedCourse.id);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => setSelectedCourseId(null)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-3 flex items-center gap-2"
        >
          ← Back to Courses
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedCourse?.code} - {selectedCourse?.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{selectedCourse?.semester}</p>
          </div>
          {studentGroup && (
            <div className="text-right">
              <div className="text-sm font-semibold text-purple-700">👥 {studentGroup.name}</div>
              {isGroupLeader(selectedCourse.id) && (
                <div className="text-xs text-purple-600">Group Leader</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Progress */}
      {courseAssignments.length > 0 && (
        <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
          <ProgressBar
            current={courseAssignments.filter(a => a.submissions[student.id]?.submitted).length}
            total={courseAssignments.length}
            label="Course Progress"
          />
        </div>
      )}

      {/* Group Management for Course */}
      {!studentGroup && (
        <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-amber-900 mb-1">Not in a Group</h4>
              <p className="text-xs text-amber-700">
                Form or join a group to submit group assignments for this course.
              </p>
            </div>
            <button
              onClick={() => setShowGroupModal({ assignmentId: null, courseId: selectedCourse.id })}
              className="px-3 py-1.5 text-sm rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-medium"
            >
              Manage Groups
            </button>
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {courseAssignments.map(asg => {
          const submitted = asg.submissions[student.id]?.submitted;
          const canSubmit = asg.submissionType === 'individual' || canSubmitGroupAssignment(asg);
          const needsGroup = asg.submissionType === 'group' && !studentGroup;

          return (
            <AssignmentCard
              key={asg.id}
              assignment={asg}
              footer={
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        submitted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {submitted ? '✓ Acknowledged' : '⏳ Not Acknowledged'}
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={asg.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 font-semibold underline transition-colors"
                      >
                        🔗 OneDrive Link
                      </a>
                      {!submitted && (
                        <>
                          {needsGroup ? (
                            <button
                              className="text-sm px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 font-medium transition-colors"
                              onClick={() => openGroupModal(asg)}
                            >
                              Join/Create Group
                            </button>
                          ) : asg.submissionType === 'group' && !isGroupLeader(selectedCourse.id) ? (
                            <button
                              className="text-sm px-4 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed font-medium"
                              disabled
                            >
                              Only Group Leader Can Submit
                            </button>
                          ) : (
                            <button
                              className="text-sm px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors"
                              onClick={() => startConfirm(asg)}
                            >
                              Yes, I have submitted
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {asg.submissionType === 'group' && studentGroup && !submitted && isGroupLeader(selectedCourse.id) && (
                    <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                      👑 As the group leader, your acknowledgment will mark all group members as submitted.
                    </div>
                  )}
                  {submitted && asg.submissionType === 'group' && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      {asg.submissions[student.id]?.acknowledgedBy === student.id
                        ? '✓ You acknowledged this submission for your group.'
                        : '✓ Your group leader has acknowledged this submission.'}
                    </div>
                  )}
                </div>
              }
            />
          );
        })}
        {courseAssignments.length === 0 && (
          <div className="text-center py-12 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-600">No assignments for this course yet.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        open={stage === 1}
        title="Confirm Submission"
        message="Please confirm that you have submitted this assignment via the provided OneDrive link."
        confirmText="Yes, I have submitted"
        cancelText="Cancel"
        onConfirm={confirmFirst}
        onCancel={cancelConfirm}
      />
      <ConfirmModal
        open={stage === 2}
        title="Final Confirmation"
        message={
          pendingAsg?.submissionType === 'group'
            ? `This action will mark all members of your group as submitted. Proceed?`
            : 'This action will mark your assignment as submitted. Proceed?'
        }
        confirmText="Confirm submission"
        cancelText="Go back"
        onConfirm={confirmFinal}
        onCancel={cancelConfirm}
      />

      {/* Group Management Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowGroupModal(null)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Group Management</h3>

            {/* Create New Group */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Create New Group</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Group name..."
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="flex-1 rounded-lg border-gray-300 focus:ring-primary-600 focus:border-primary-600"
                />
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim()}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>

            {/* Join Existing Group */}
            {availableGroups.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Join Existing Group</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableGroups.map(group => {
                    const members = users.filter(u => group.memberIds.includes(u.id));
                    const leader = users.find(u => u.id === group.leaderId);
                    return (
                      <div
                        key={group.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedGroupToJoin === group.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedGroupToJoin(group.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{group.name}</span>
                          <span className="text-xs text-gray-500">{members.length} members</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Leader: {leader?.name || 'Unknown'}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedGroupToJoin && (
                  <button
                    onClick={handleJoinGroup}
                    className="mt-3 w-full px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium"
                  >
                    Join Selected Group
                  </button>
                )}
              </div>
            )}

            {availableGroups.length === 0 && (
              <p className="text-sm text-gray-500">No available groups to join. Create one above.</p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGroupModal(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


