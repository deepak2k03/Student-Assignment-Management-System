import React, { useState } from 'react';
import AssignmentCard from '../components/AssignmentCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

export default function StudentDashboard({ student, assignments, onConfirmSubmit }) {
    const myAssignments = assignments.filter(a => a.assignedStudentIds.includes(student.id));
    const submittedCount = myAssignments.filter(a => a.submissions[student.id]?.submitted).length;

    const [pendingAsg, setPendingAsg] = useState(null);
    const [stage, setStage] = useState(0); // 0: closed, 1: first confirm, 2: final confirm

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
      if (pendingAsg) onConfirmSubmit(pendingAsg.id);
      cancelConfirm();
    }

    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome, {student.name}</h2>
          <p className="text-sm text-gray-600">Track your assignments and confirm submissions.</p>
        </div>

        <div className="mb-6">
          <ProgressBar current={submittedCount} total={myAssignments.length} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myAssignments.map(asg => {
            const submitted = asg.submissions[student.id]?.submitted;
            const status = submitted ? 'Submitted' : 'Not submitted';
            return (
              <AssignmentCard key={asg.id} assignment={asg}
                footer={
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${submitted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{status}</span>
                    <div className="flex items-center gap-2">
                      <a href={asg.driveLink} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:text-primary-700 underline">Open Drive</a>
                      {!submitted && (
                        <button className="text-sm px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                          onClick={() => startConfirm(asg)}>
                          I have submitted
                        </button>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>

        <ConfirmModal
          open={stage === 1}
          title="Confirm submission"
          message="Please confirm that you have submitted this assignment via the provided Drive link."
          confirmText="Yes, I have submitted"
          cancelText="Cancel"
          onConfirm={confirmFirst}
          onCancel={cancelConfirm}
        />
        <ConfirmModal
          open={stage === 2}
          title="Final confirmation"
          message="This action will mark your assignment as submitted. Proceed?"
          confirmText="Confirm submission"
          cancelText="Go back"
          onConfirm={confirmFinal}
          onCancel={cancelConfirm}
        />
      </section>
    );
}


