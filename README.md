# Student Assignment Dashboard

A beautiful, intuitive, and responsive frontend application for managing student assignments with role-based workflows. Built with React.js and Tailwind CSS, featuring course management, group assignments, and real-time progress tracking.

## ✨ Features

### 🎓 Course Management
- **Professors** can create and manage multiple courses
- **Students** see all enrolled courses on their dashboard
- Course-based assignment organization
- Semester tracking and student enrollment

### 📝 Assignment Management
- **Create Assignments** with:
  - Title and description
  - Deadline (date + time)
  - OneDrive submission link
  - Submission type (Individual or Group)
  - Student assignment per course
- **Track Progress** with:
  - Visual progress bars
  - Submission status per student
  - Analytics and summary counts
- **Search & Filter** assignments by:
  - Title/description
  - Submission status (All/Pending/Submitted)

### 👥 Group Management
- Students can **create groups** for specific courses
- Students can **join existing groups**
- **Group leader system**:
  - Only group leaders can acknowledge group assignments
  - When leader acknowledges, all group members are marked as submitted
- Visual indicators for group membership and leader status

### 📊 Progress Visualization
- **Overall progress** tracking for students
- **Per-course progress** bars
- **Per-assignment analytics** for professors
- Color-coded status indicators (submitted/pending)
- Animated progress bars with completion states

### 🎨 Beautiful UI/UX
- **Smooth animations** and transitions
- **Toast notifications** for user feedback
- **Responsive design** for all screen sizes
- **Form validation** with real-time feedback
- **Modern card-based** layouts
- **Hover effects** and visual feedback
- **Accessible** components with ARIA labels

### 🔐 Authentication
- Secure login/logout flow
- User registration with role selection
- Form validation and error handling
- Smooth transitions between sign in/sign up
- Role-based redirect after login

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **localStorage** - Client-side data persistence (demo backend)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open in browser**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)
   - Open the URL in your browser

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 👤 Demo Accounts

The application comes with pre-seeded demo accounts:

### Admin (Professor)
- **Username:** `ada`
- **Password:** `admin123`
- Can create courses, manage assignments, and track student progress

### Students
- **Username:** `alice` or `bob`
- **Password:** `student123`
- Can view courses, submit assignments, and manage groups

### Create New Account
You can also create new accounts by:
1. Clicking "Sign up" on the login page
2. Entering name, username, password
3. Selecting role (Student or Admin)

> **Note:** All data is stored in browser localStorage. To reset demo data, clear these keys in browser DevTools: `sa_users`, `sa_assignments`, `sa_courses`, `sa_groups`, `sa_session`

## 📖 User Flows

### 👨‍🏫 Professor Flow

1. **Login** → Redirected to Professor Dashboard

2. **Dashboard View**
   - See all courses you teach
   - Each course card shows:
     - Course code and name
     - Semester
     - Number of assignments
     - Number of enrolled students

3. **Create Course** (optional)
   - Click "+ Create Course"
   - Enter course code, name, semester
   - Select students to enroll
   - Click "Create Course"

4. **View Course Assignments**
   - Click on a course card
   - See all assignments for that course

5. **Create Assignment**
   - Click "+ New Assignment"
   - Fill in:
     - Title and description
     - Due date & time
     - OneDrive link
     - Submission type (Individual/Group)
     - Select students to assign
   - Click "Create Assignment"

6. **Track Submissions**
   - View progress bars showing submission status
   - See individual student status (Submitted/Pending)
   - Filter assignments by status
   - Search assignments by title/description

### 👨‍🎓 Student Flow

1. **Login** → Redirected to Student Dashboard

2. **Dashboard View**
   - See all enrolled courses for current semester
   - View overall progress across all courses
   - Each course card shows:
     - Course code and name
     - Progress (submitted/total)
     - Group membership (if in a group)

3. **View Course Assignments**
   - Click on a course card
   - See all assignments for that course
   - View course-specific progress

4. **Group Management** (for group assignments)
   - If not in a group, see prompt to form/join one
   - Click "Manage Groups" or "Join/Create Group"
   - **Create Group:**
     - Enter group name
     - Click "Create"
     - You become the group leader
   - **Join Group:**
     - Browse available groups
     - Select a group
     - Click "Join Selected Group"

5. **Submit Assignment**
   - For **Individual Assignments:**
     - Every student must acknowledge submission
     - Click "Yes, I have submitted"
     - Confirm in modal
   - For **Group Assignments:**
     - **If you're the group leader:**
       - Click "Yes, I have submitted"
       - Your acknowledgment marks all group members as submitted
     - **If you're not the leader:**
       - Button shows "Only Group Leader Can Submit" (disabled)
     - **If not in any group:**
       - Button shows "Join/Create Group"
       - Must join/create a group before submitting

6. **View Submission Status**
   - See acknowledgment status (Acknowledged/Not Acknowledged)
   - For group assignments, see if you or your leader acknowledged
   - View OneDrive link to access submission folder

## 🏗️ Project Structure

```
├── index.html                 # Vite entry point
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite configuration
│
└── src/
    ├── main.jsx               # React root entry
    ├── index.css              # Global styles and animations
    │
    ├── App.jsx                # Main app component (routing, state management)
    │
    ├── state/
    │   └── storage.js         # localStorage data layer
    │                          # - User management
    │                          # - Course management
    │                          # - Assignment CRUD
    │                          # - Group management
    │                          # - Authentication
    │
    ├── pages/
    │   └── Login.jsx          # Authentication page (Sign in/Sign up)
    │
    ├── dashboards/
    │   ├── AdminDashboard.jsx # Professor dashboard
    │   │                      # - Course list view
    │   │                      # - Course assignments view
    │   │                      # - Assignment creation
    │   │                      # - Progress tracking
    │   │
    │   └── StudentDashboard.jsx # Student dashboard
    │                            # - Course list view
    │                            # - Course assignments view
    │                            # - Group management
    │                            # - Assignment submission
    │
    └── components/
        ├── Header.jsx         # App header (logo, user info, logout)
        ├── AssignmentCard.jsx # Reusable assignment card component
        ├── ProgressBar.jsx    # Animated progress bar with labels
        ├── ConfirmModal.jsx   # Modal for confirmation dialogs
        └── Toast.jsx          # Toast notification component
```

## 🔧 Key Implementation Details

### Data Model

#### Users
```javascript
{
  id: string,
  username: string,
  name: string,
  role: 'student' | 'admin',
  password: string // Plain text for demo only
}
```

#### Courses
```javascript
{
  id: string,
  code: string,              // e.g., "CS101"
  name: string,              // e.g., "Introduction to Computer Science"
  professorId: string,
  semester: string,          // e.g., "Fall 2024"
  enrolledStudentIds: string[]
}
```

#### Assignments
```javascript
{
  id: string,
  title: string,
  description: string,
  dueDate: string,           // ISO date string
  driveLink: string,         // OneDrive URL
  courseId: string,
  createdByAdminId: string,
  submissionType: 'individual' | 'group',
  assignedStudentIds: string[],
  submissions: {
    [studentId]: {
      submitted: boolean,
      confirmedAt: string | null,
      acknowledgedBy?: string  // For group assignments
    }
  }
}
```

#### Groups
```javascript
{
  id: string,
  name: string,
  leaderId: string,
  memberIds: string[],
  courseId: string,
  createdAt: string
}
```

### Storage API

The `Storage` module (`src/state/storage.js`) provides:

#### User Management
- `login({ username, password })` - Authenticate user
- `logout()` - Clear session
- `registerUser({ username, name, password, role })` - Create new user
- `getUsers()` - Get all users

#### Course Management
- `getCourses()` - Get all courses
- `createCourse({ name, code, professorId, semester, enrolledStudentIds })` - Create course
- `saveCourses(courses)` - Save courses array

#### Assignment Management
- `getAssignments()` - Get all assignments
- `createAssignment({ title, description, dueDate, driveLink, courseId, submissionType, assignedStudentIds })` - Create assignment
- `updateSubmission({ assignmentId, studentId, submitted })` - Update submission status (handles group logic)

#### Group Management
- `getGroups()` - Get all groups
- `createGroup({ name, leaderId, courseId })` - Create group
- `joinGroup({ groupId, studentId })` - Add student to group
- `leaveGroup({ groupId, studentId })` - Remove student from group
- `getStudentGroup(studentId, courseId)` - Get student's group for a course

### Group Assignment Logic

When a **group leader** acknowledges a group assignment:
1. System finds the student's group for that course
2. Verifies the student is the leader
3. Marks **all group members** as submitted
4. Stores `acknowledgedBy` field with leader's ID

Non-leaders cannot acknowledge group assignments (UI prevents this).

### Toast Notifications

The app uses a toast notification system for user feedback:
- **Success** (green) - Successful operations
- **Error** (red) - Error messages
- **Info** (blue) - Informational messages
- **Warning** (amber) - Warning messages

Toasts auto-dismiss after 3 seconds and can be manually closed.

## 🎨 Styling & Design

### Color Palette
- **Primary**: Indigo shades (`primary-600`, `primary-700`)
- **Success**: Green shades (for submitted/completed states)
- **Warning**: Amber/Yellow shades (for pending states)
- **Error**: Red shades (for errors)
- **Group**: Purple shades (for group-related UI)

### Animations
- **Fade in**: Page loads, modals
- **Slide up**: Cards, forms
- **Slide in**: Toast notifications
- **Smooth transitions**: Hover effects, state changes

### Responsive Breakpoints
- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `lg:` (≥ 1024px)

## 🔐 Security Notes

⚠️ **This is a demo application with client-side-only storage.**

- Passwords are stored in **plain text** (NOT secure)
- All data is stored in **browser localStorage**
- No backend validation or authentication
- No data encryption

**For production use:**
- Implement a proper backend API
- Use password hashing (bcrypt, Argon2)
- Implement JWT or session-based authentication
- Add server-side validation
- Use a real database
- Implement proper authorization checks

## 🐛 Troubleshooting

### Can't log in
- Check username/password (case-sensitive)
- Clear localStorage and refresh
- Try demo accounts: `ada/admin123` or `alice/student123`

### Data not saving
- Check browser console for errors
- Verify localStorage is enabled in browser
- Clear localStorage and refresh to reseed data

### Blank page
- Stop dev server (Ctrl+C)
- Restart with `npm run dev`
- Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)

### Groups not working
- Ensure you're in a group for the course
- Verify you're the group leader for group assignments
- Check browser console for errors

### Reset everything
Clear these localStorage keys:
```javascript
localStorage.removeItem('sa_users');
localStorage.removeItem('sa_assignments');
localStorage.removeItem('sa_courses');
localStorage.removeItem('sa_groups');
localStorage.removeItem('sa_session');
```
Then refresh the page.

## 🚧 Future Enhancements

### Potential Features
- **Real Backend**: Replace localStorage with REST API or GraphQL
- **File Uploads**: Allow students to upload files directly
- **Comments/Feedback**: Professors can provide feedback on submissions
- **Grading System**: Assign grades and rubric scoring
- **Notifications**: Email/push notifications for deadlines
- **Calendar View**: Visual calendar of assignment deadlines
- **Statistics Dashboard**: Charts and analytics for professors
- **Team Collaboration**: In-app chat for group members
- **Multi-semester Support**: Historical course data
- **Bulk Operations**: Bulk create assignments, bulk enroll students
- **Export Data**: Export grades/reports to CSV/PDF
- **Dark Mode**: Theme toggle for dark/light modes
- **Internationalization**: Multi-language support

### Technical Improvements
- **State Management**: Redux or Zustand for complex state
- **API Integration**: Axios/Fetch wrapper for API calls
- **Testing**: Unit tests (Jest) and E2E tests (Cypress/Playwright)
- **Type Safety**: Migrate to TypeScript
- **Performance**: Code splitting, lazy loading
- **PWA**: Make it a Progressive Web App

## 📝 License

This project is created for educational/demonstration purposes.

## 👨‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind utility classes
- Keep components small and focused
- Add comments for complex logic

---

**Built with ❤️ using React + Tailwind CSS**

