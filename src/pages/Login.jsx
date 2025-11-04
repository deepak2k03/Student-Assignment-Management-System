import React, { useState, useEffect } from 'react';

export default function Login({ onSubmit, onSignup, error, signupError }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [show, setShow] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Clear errors when switching modes
    setValidationErrors({});
  }, [mode]);

  function validateForm(isSignup) {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }
    if (isSignup) {
      if (!name.trim()) {
        errors.name = 'Name is required';
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSignin(e) {
    e.preventDefault();
    if (!validateForm(false)) return;
    onSubmit({ username: username.trim(), password });
  }

  function handleSignup(e) {
    e.preventDefault();
    if (!validateForm(true)) return;
    onSignup({ username: username.trim(), name: name.trim(), password, role });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-xl animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white grid place-items-center font-bold text-lg shadow-lg">
            SA
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Student Assignment</div>
            <div className="text-xl font-bold text-gray-900">{mode === 'signin' ? 'Sign in' : 'Create account'}</div>
          </div>
        </div>

        <div className="mt-6 inline-flex rounded-lg bg-gray-100 p-1 text-sm font-medium">
          <button
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              mode === 'signin'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => {
              setMode('signin');
              setValidationErrors({});
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-all duration-200 ${
              mode === 'signup'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => {
              setMode('signup');
              setValidationErrors({});
            }}
            type="button"
          >
            Sign up
          </button>
        </div>

        {mode === 'signin' ? (
          <form className="mt-6 space-y-5" onSubmit={handleSignin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                className={`w-full rounded-lg border-2 px-4 py-2.5 transition-colors ${
                  validationErrors.username || error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-600 focus:ring-primary-600'
                } focus:ring-2 focus:outline-none`}
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors({ ...validationErrors, username: null });
                  }
                }}
                placeholder="e.g., ada, alice, bob"
                required
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div
                className={`flex rounded-lg border-2 overflow-hidden transition-colors ${
                  validationErrors.password || error
                    ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500'
                    : 'border-gray-300 focus-within:border-primary-600 focus-within:ring-primary-600'
                } focus-within:ring-2`}
              >
                <input
                  type={show ? 'text' : 'password'}
                  className="flex-1 px-4 py-2.5 outline-none"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: null });
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="px-4 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setShow(!show)}
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 animate-fade-in">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Sign in
            </button>
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
              Demo accounts — Admin: <span className="font-semibold">ada/admin123</span> · Students: <span className="font-semibold">alice/student123</span>, <span className="font-semibold">bob/student123</span>
            </div>
          </form>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                className={`w-full rounded-lg border-2 px-4 py-2.5 transition-colors ${
                  validationErrors.name || signupError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-600 focus:ring-primary-600'
                } focus:ring-2 focus:outline-none`}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: null });
                  }
                }}
                placeholder="Your full name"
                required
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
              <input
                className={`w-full rounded-lg border-2 px-4 py-2.5 transition-colors ${
                  validationErrors.username || signupError
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-600 focus:ring-primary-600'
                } focus:ring-2 focus:outline-none`}
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  if (validationErrors.username) {
                    setValidationErrors({ ...validationErrors, username: null });
                  }
                }}
                placeholder="Choose a username"
                required
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div
                className={`flex rounded-lg border-2 overflow-hidden transition-colors ${
                  validationErrors.password || signupError
                    ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500'
                    : 'border-gray-300 focus-within:border-primary-600 focus-within:ring-primary-600'
                } focus-within:ring-2`}
              >
                <input
                  type={show ? 'text' : 'password'}
                  className="flex-1 px-4 py-2.5 outline-none"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors({ ...validationErrors, password: null });
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="px-4 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  onClick={() => setShow(!show)}
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
              <select
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:border-primary-600 focus:ring-2 focus:ring-primary-600 focus:outline-none transition-colors"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="student">👤 Student</option>
                <option value="admin">👨‍🏫 Admin (Professor)</option>
              </select>
            </div>
            {signupError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 animate-fade-in">
                {signupError}
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Create account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


