import React, { useState } from 'react';
import AssignmentCard from '../components/AssignmentCard.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function AdminDashboard({ admin, students, assignments, onCreateAssignment }) {
    const myAssignments = assignments.filter(a => a.createdByAdminId === admin.id);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', driveLink: '', assigned: new Set(students.map(s => s.id)) });

    function toggleStudent(id) {
      const next = new Set(form.assigned);
      if (next.has(id)) next.delete(id); else next.add(id);
      setForm({ ...form, assigned: next });
    }

    function submit(e) {
      e.preventDefault();
      if (!form.title || !form.dueDate) return;
      onCreateAssignment({
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: new Date(form.dueDate).toISOString(),
        driveLink: form.driveLink.trim(),
        assignedStudentIds: Array.from(form.assigned),
      });
      setForm({ title: '', description: '', dueDate: '', driveLink: '', assigned: new Set(students.map(s => s.id)) });
    }

    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Hello, {admin.name}</h2>
          <p className="text-sm text-gray-600">Create and manage assignments, track student submissions.</p>
        </div>

        <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Create assignment</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Project 1: Sorting" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What should students do?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due date</label>
              <input type="datetime-local" className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Drive link</label>
              <input type="url" className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={form.driveLink} onChange={e => setForm({ ...form, driveLink: e.target.value })} placeholder="https://drive.google.com/..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Assign to students</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {students.map(s => (
                  <label key={s.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-600" checked={form.assigned.has(s.id)} onChange={() => toggleStudent(s.id)} />
                    <span>{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Create</button>
          </div>
        </form>

        <div className="space-y-4">
          {myAssignments.map(asg => {
            const total = asg.assignedStudentIds.length;
            const current = asg.assignedStudentIds.filter(id => asg.submissions[id]?.submitted).length;
            return (
              <AssignmentCard key={asg.id} assignment={asg}
                footer={
                  <div className="space-y-3">
                    <ProgressBar current={current} total={total} />
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {students.filter(s => asg.assignedStudentIds.includes(s.id)).map(s => {
                        const submitted = asg.submissions[s.id]?.submitted;
                        return (
                          <div key={s.id} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm bg-white">
                            <span className="text-gray-700">{s.name}</span>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${submitted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{submitted ? 'Submitted' : 'Not submitted'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                }
              />
            );
          })}
          {myAssignments.length === 0 && (
            <div className="text-sm text-gray-600">No assignments yet. Create one above.</div>
          )}
        </div>
      </section>
    );
}


