import React, { useState } from 'react';

export default function Login({ onSubmit, onSignup, error, signupError }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [show, setShow] = useState(false);

  function handleSignin(e) {
    e.preventDefault();
    onSubmit({ username: username.trim(), password });
  }

  function handleSignup(e) {
    e.preventDefault();
    if (!username.trim() || !name.trim() || !password) return;
    onSignup({ username: username.trim(), name: name.trim(), password, role });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-600 text-white grid place-items-center font-bold">SA</div>
          <div>
            <div className="text-sm text-gray-500">Student Assignment</div>
            <div className="text-lg font-semibold text-gray-900">{mode === 'signin' ? 'Sign in' : 'Create account'}</div>
          </div>
        </div>

        <div className="mt-4 inline-flex rounded-md bg-gray-100 p-1 text-sm">
          <button className={`px-3 py-1.5 rounded ${mode === 'signin' ? 'bg-white shadow-sm' : ''}`} onClick={() => setMode('signin')} type="button">Sign in</button>
          <button className={`px-3 py-1.5 rounded ${mode === 'signup' ? 'bg-white shadow-sm' : ''}`} onClick={() => setMode('signup')} type="button">Sign up</button>
        </div>

        {mode === 'signin' ? (
          <form className="mt-6 space-y-4" onSubmit={handleSignin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g., ada, alice, bob" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex rounded-md border border-gray-300 focus-within:ring-1 focus-within:ring-primary-600 focus-within:border-primary-600 overflow-hidden">
                <input type={show ? 'text' : 'password'} className="w-full px-3 py-2 outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="px-3 text-sm text-gray-600 hover:text-gray-800" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Sign in</button>
            <div className="text-xs text-gray-500">
              Demo — Admin: ada/admin123 · Students: alice/student123, bob/student123
            </div>
          </form>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex rounded-md border border-gray-300 focus-within:ring-1 focus-within:ring-primary-600 focus-within:border-primary-600 overflow-hidden">
                <input type={show ? 'text' : 'password'} className="w-full px-3 py-2 outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" className="px-3 text-sm text-gray-600 hover:text-gray-800" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select className="mt-1 w-full rounded-md border-gray-300 focus:ring-primary-600 focus:border-primary-600" value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {signupError && <div className="text-sm text-red-600">{signupError}</div>}
            <button type="submit" className="w-full px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">Create account</button>
          </form>
        )}
      </div>
    </div>
  );
}


