# Student Assignment Dashboard (Vite + React + Tailwind)

A clean, responsive dashboard for a student-assignment management system with role-based views (Student/Admin). No backend is used; all data is simulated and persisted in `localStorage` with a simple client data layer.

- Stack: React 18, Vite, Tailwind CSS
- Data: localStorage with initial seed
- Roles: Student and Admin (Professor)

## Run

1) Install dependencies
```bash
npm install
```
2) Start dev server
```bash
npm run dev
```
3) Open the shown URL (usually `http://localhost:5173`).

## Demo accounts and auth

- Admin: username `ada`, password `admin123`
- Students: username `alice` or `bob`, password `student123`
- You can also Sign up a new account (Student or Admin) on the Sign Up tab.

If you ever want to reset the demo data, clear these localStorage keys and refresh:
`sa_users`, `sa_assignments`, `sa_session`

---

## How it’s implemented

### 1) Data layer: localStorage-backed Storage API

File: `src/state/storage.js`

- Defines storage keys:
  - `sa_users`: array of users `{ id, username, name, role, password }`
  - `sa_assignments`: array of assignments `{ id, title, description, dueDate, driveLink, createdByAdminId, assignedStudentIds, submissions }`
  - `sa_session`: session object `{ currentUserId }`
- Seeding: `seed()` creates one admin (ada) and two students (alice, bob) on first run, plus two sample assignments. Session starts as logged out (`currentUserId: null`).
- Helpers:
  - `getUsers()`, `getAssignments()`, `saveAssignments()` for CRUD-like operations
  - `getSession()`, `setSession()` for session persistence
  - `createAssignment({ ... })` to create a new assignment with per-student submission map
  - `updateSubmission({ assignmentId, studentId, submitted })` to mark a student’s submission with timestamp
  - `login({ username, password })`, `logout()` for auth
  - `registerUser({ username, name, password, role })` with username uniqueness check; auto-logs in on success

This module is imported by `App.jsx`, which calls `Storage.seed()` once on startup and then uses the API to read/write data. All writes immediately persist to `localStorage`.

### 2) Authentication: login, logout, signup

Files: `src/App.jsx`, `src/pages/Login.jsx`, `src/state/storage.js`

- On first render, `Storage.seed()` ensures demo data exists, then state is initialized from storage.
- If `session.currentUserId` is null, `App` renders the `Login` page instead of a dashboard.
- Login:
  - `Login` calls `onSubmit({ username, password })` → `Storage.login()`.
  - On success, `Storage.setSession({ currentUserId: user.id })` is persisted; `App` re-reads session and renders the correct dashboard.
- Logout:
  - Header’s Logout button calls `Storage.logout()` which sets `{ currentUserId: null }`; `App` detects no user and shows `Login` immediately (we explicitly removed any fallback user selection).
- Signup:
  - `Login` toggle provides a Sign Up form (name, username, password, role picker).
  - `Storage.registerUser()` enforces unique username, creates the user, and auto-logs them in (session updated).

Security note: Passwords are stored in plain text purely for demo purposes. In a real application, you’d use a server, hashed passwords (e.g., bcrypt), and proper auth flows.

### 3) Role-gated UI flow and routing

File: `src/App.jsx`

- Determines the current user from `session.currentUserId` and `users`.
- If no user: render `Login`.
- If user is admin: render `AdminDashboard`; otherwise: render `StudentDashboard`.
- Provides callbacks to dashboards to create assignments and confirm submissions, which call into `Storage` and then refresh state from storage.

### 4) Admin dashboard: create/manage assignments and track progress

File: `src/dashboards/AdminDashboard.jsx`

- Shows a Create Assignment form:
  - Fields: title, description, due date, Drive link, and a checkbox list of students to assign.
  - On submit, calls `onCreateAssignment`, which calls `Storage.createAssignment()` with `createdByAdminId` = current admin.
- Displays assignments created by the current admin with:
  - A top-level progress bar (see ProgressBar below) for how many assigned students submitted.
  - A grid of student chips indicating each assigned student’s status: Submitted / Not submitted.

### 5) Student dashboard: list assignments and double-confirm submission

File: `src/dashboards/StudentDashboard.jsx`

- Filters assignments to only those assigned to the logged-in student.
- Calculates the student’s personal progress: count of submitted vs total shown in a progress bar at the top.
- Each assignment card shows Drive link and a call-to-action button “I have submitted”. Clicking it triggers a double confirmation flow:
  1. First modal: “Confirm submission” (acknowledge that you have submitted via Drive)
  2. Second modal: “Final confirmation” (marks as submitted)
- On final confirmation, `onConfirmSubmit(assignmentId)` calls `Storage.updateSubmission()` for that student.

### 6) Progress bar implementation

File: `src/components/ProgressBar.jsx`

- Props: `current` and `total`.
- Computes `percent = total > 0 ? Math.round((current / total) * 100) : 0`.
- Renders a label row with the numeric percent and a Tailwind-styled bar. The inner bar width is set via inline style `width: ${percent}%` and animated with Tailwind’s transitions. An accessible `role="progressbar"` and ARIA attributes are included.
- Used in:
  - Student dashboard: personal submission progress (`submittedCount` / `myAssignments.length`).
  - Admin dashboard: per-assignment progress (number of assigned students who have submitted / total assigned).

### 7) UI components and styling

Files: `src/components/*`

- `Header.jsx`: Shows app title, role pill (Admin/Student), user name, and Logout button.
- `AssignmentCard.jsx`: Reusable card for assignment info (title, description, due date, Drive link) with a footer slot for actions and status chips.
- `ConfirmModal.jsx`: Accessible modal used for the student double-confirmation flow.
- `ProgressBar.jsx`: See above.

Tailwind configuration (`tailwind.config.js`) adds a `primary` color palette used consistently across buttons, chips, and accents. All components are responsive using Tailwind utility classes.

### 8) Responsiveness and accessibility

- Responsive grid layouts in dashboards (`sm:grid-cols-2`, `lg:grid-cols-3`).
- Click targets and spacing use Tailwind scale for tap comfort.
- Color contrast and semantic labels (`role="progressbar"`, ARIA values) are included.
- Focusable controls rely on native focus and Tailwind focus ring utilities.

---

## File layout

```
index.html                 # Vite entry; loads src/main.jsx
postcss.config.js          # Tailwind + autoprefixer
tailwind.config.js         # Tailwind theme and content paths
src/
  index.css               # Tailwind directives and base styles
  state/storage.js        # localStorage data layer, seeding, auth, CRUD helpers
  components/
    Header.jsx            # App header with role badge and Logout
    ProgressBar.jsx       # Reusable progress bar
    ConfirmModal.jsx      # Modal for double-confirm flow
    AssignmentCard.jsx    # Assignment presentation card
  dashboards/
    StudentDashboard.jsx  # Student view (list + double confirm)
    AdminDashboard.jsx    # Admin view (create + per-student status)
  pages/
    Login.jsx             # Sign In / Sign Up toggle page
  App.jsx                 # Role gating and app wiring
  main.jsx                # React root and global CSS import
```

---

## Extending this project

- Real backend: Replace `Storage` calls with API requests; remove plain-text passwords; use JWT sessions.
- More roles: Add TA/Grader, teaching assistants, etc., with tailored dashboards.
- Rich submissions: Attachments, comments, rubric scoring.
- Filters/search: By due date, submitted state, or assignment title.
- Analytics: Charts of completion rates over time.

---

## Troubleshooting

- Blank page or console errors after pulls/edits: stop dev server and restart `npm run dev`, then hard refresh (Ctrl+F5).
- Can’t log in as admin: clear `sa_users`, `sa_assignments`, `sa_session` in localStorage and refresh; try `ada/admin123`.
- Logout doesn’t go to login screen: ensure `src/App.jsx` computes `currentUser` without fallback and calls `Storage.logout()`.

