# FLAME University Digital Learning Centre - Software Architecture

## Project Overview
The FLAME Moodle Insight project is a React-based admin analytics dashboard designed for FLAME University's Centre for Digital Learning. It enables tracking of student progress and engagement in pre-orientation courses, replacing manual Excel workflows with intelligent automation.

## Tech Stack

### Frontend Framework
- **React 18+** - UI library with functional components and hooks
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** - Modern build tool and development server (port 8080)
- **React Router DOM** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality React component library built on Radix UI
- **Radix UI** - Unstyled accessible components (accordion, dialog, dropdown, etc.)
- **Lucide React** - Icon library

### Data & State Management
- **React Query (@tanstack/react-query)** - Server state management and caching
- **React Hooks (useState, useCallback)** - Local state management
- **React Form Hooks** - Form state management
- **Sonner + React Toaster** - Toast notification system

### Utilities & Libraries
- **React Day Picker** - Calendar component
- **Class Variance Authority** - CSS class composition
- **date-fns** - Date manipulation
- **Supabase** - Backend database integration (configured but not actively used)

## Project Structure

```
flame-moodle-insight/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard with view routing
│   │   ├── Landing.tsx             # Marketing landing page
│   │   ├── Index.tsx               # App entry point
│   │   └── NotFound.tsx            # 404 error page
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Navigation.tsx       # Top navigation bar (clickable logo, nav items)
│   │   │   ├── KPICard.tsx          # Key performance indicator cards
│   │   │   ├── ProgressChart.tsx    # Bar charts for progress visualization
│   │   │   ├── StudentsTable.tsx    # Searchable/filterable student list
│   │   │   ├── StudentDetailModal.tsx # Modal with student details and courses
│   │   │   ├── CourseDetailModal.tsx  # Modal with course breakdown & filtering
│   │   │   ├── CourseAnalytics.tsx   # Course statistics display
│   │   │   ├── CSVUploader.tsx       # Drag-and-drop CSV upload component
│   │   │   └── StatusBadge.tsx       # Status indicator badges
│   │   │
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── select.tsx
│   │       ├── slider.tsx
│   │       ├── progress.tsx
│   │       ├── input.tsx
│   │       ├── pagination.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── avatar.tsx
│   │       ├── calendar.tsx
│   │       ├── chart.tsx (Recharts wrapper)
│   │       └── [other components...]
│   │
│   ├── lib/
│   │   ├── csvParser.ts            # CSV parsing with quoted field support
│   │   ├── mockData.ts             # Mock student/course data
│   │   └── utils.ts                # Utility functions
│   │
│   ├── hooks/
│   │   ├── use-toast.ts            # Toast notification hook
│   │   └── use-mobile.tsx          # Responsive design hook
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts           # Supabase client config
│   │       └── types.ts            # Type definitions
│   │
│   ├── App.tsx                      # Router setup
│   ├── main.tsx                     # App entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts               # Vite type definitions
│
├── public/
│   ├── robots.txt
│   └── placeholder.svg
│
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Build configuration
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind configuration
├── eslint.config.js                # Code linting rules
├── index.html                      # HTML entry point
└── components.json                 # Shadcn/ui component registry
```

## Core Data Models

### Student Interface
```typescript
interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  courses: CourseProgress[];
  overallProgress: number;      // 0-100 percentage
  status: 'not-started' | 'in-progress' | 'completed';
  flag: 'red' | 'amber' | 'green';
}
```

### CourseProgress Interface
```typescript
interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;             // 0-100 percentage
  completedActivities: number;
  totalActivities: number;
  activities: Activity[];
}
```

### Activity Interface
```typescript
interface Activity {
  id: string;
  name: string;
  type: string;
  completed: boolean;
  weight: number;
  score?: number;
}
```

## Key Components & Features

### 1. Navigation (Top Bar)
- **Location**: `src/components/dashboard/Navigation.tsx`
- **Features**:
  - Clickable logo/title that navigates to dashboard
  - Four main navigation tabs: Dashboard, Students, Courses, Upload
  - User avatar dropdown menu
  - Responsive design with mobile support

### 2. Dashboard View
- **Location**: `src/pages/Dashboard.tsx`
- **Features**:
  - KPI cards (Total Enrolled, Completed, In Progress, Not Started)
  - Progress distribution chart (Pie/Bar chart)
  - Recent students list with status badges
  - Quick action buttons for navigation
  - View routing between Dashboard/Students/Courses/Upload

### 3. Students View
- **Location**: `src/components/dashboard/StudentsTable.tsx`
- **Features**:
  - Searchable by name/email
  - Status filtering (All/Completed/In Progress/Not Started)
  - Sortable columns
  - Click to open student detail modal
  - Overall progress display per student

### 4. Student Detail Modal
- **Location**: `src/components/dashboard/StudentDetailModal.tsx`
- **Features**:
  - Overall student statistics
  - List of enrolled courses with individual progress
  - Click to open course detail modal for deeper analysis

### 5. Course Detail Modal
- **Location**: `src/components/dashboard/CourseDetailModal.tsx`
- **Features**:
  - **Overview Tab**: Course statistics and status breakdown
  - **Students Tab**: 
    - Status filter dropdown
    - Progress range slider (0-100%)
    - CSV export of filtered students
  - **Activities Tab**: List of course activities with completion counts
  - Dynamic filtering and export functionality

### 6. Courses View
- **Location**: `src/components/dashboard/CourseAnalytics.tsx`
- **Features**:
  - Course cards showing statistics
  - Status breakdown charts per course
  - Navigation to course detail modal

### 7. CSV Upload
- **Location**: `src/components/dashboard/CSVUploader.tsx`
- **Features**:
  - Drag-and-drop file upload
  - CSV file parsing with proper quoted field handling
  - Automatic student/course data extraction
  - Activity detection and progress calculation
  - Error handling and validation
  - Toast notifications for success/failure

### 8. CSV Parser
- **Location**: `src/lib/csvParser.ts`
- **Features**:
  - Proper CSV parsing that handles quoted fields with commas
  - Dynamic column filtering (skips metadata columns)
  - Multi-course support
  - Activity detection by column headers
  - Completion percentage calculation
  - Excluded columns:
    - ID, Name, Email
    - "Completion date" columns
    - "Course complete" metadata
    - "Course outline" metadata
    - Empty columns

## Data Flow Architecture

### CSV Import Flow
1. User uploads CSV via CSVUploader component
2. File content read and passed to `parseCSV()` function
3. CSV parser:
   - Parses CSV with proper quoted field handling
   - Identifies activity columns by excluding metadata
   - Groups activities by course
   - Calculates completion percentages
4. Student data stored in component state via `setStudents()`
5. UI updates to display imported data
6. Toast notification confirms success

### Dashboard Data Flow
1. Dashboard component initializes with mock data (`mockStudents`)
2. Data stored in React state: `const [students, setStudents] = useState(mockStudents)`
3. Navigation changes `activeView` state
4. Different views render based on `activeView`:
   - Dashboard: Shows KPIs and charts
   - Students: Shows filterable table
   - Courses: Shows course analytics
   - Upload: Shows CSV upload form
5. Modal components open/close based on state flags
6. Selected student/course data passed to modals

### Filter & Export Flow
1. User adjusts filters (status, progress range)
2. `filteredStudents` computed from:
   - Original course students
   - Filtered by status
   - Filtered by progress range
3. Export button generates CSV:
   - Columns: Name, Email, Progress %, Status, Flag
   - Only includes filtered students
   - Downloaded as CSV file

## Styling Architecture

- **Utility-first CSS**: Tailwind CSS classes applied directly to components
- **Dark Mode**: Automatic support through Shadcn/ui and Tailwind config
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints (sm, md, lg)
- **Color System**: CSS custom properties for primary, secondary, accent colors
- **Component Variants**: Shadcn/ui components with variant props (e.g., "default", "outline", "ghost")

## State Management Strategy

### Component-Level State
- **Local State**: React `useState()` for UI state (modals, filters, search)
- **Props Drilling**: Passing callbacks and data through component hierarchy
- **Context**: `useToast()` hook for toast notifications across app

### Global Patterns
- No centralized state management (Redux/Zustand)
- React Query used only for setup infrastructure
- Parent component (Dashboard) manages most app state
- Child components receive props and callbacks

## File Upload & Parsing

### CSV Format Expected
```
ID, Name, Email address, Activity1, Activity1 - Completion date, Activity2, ...
10, Ishaan Patel, ishaan.patel@flame.edu.in, Completed, 07-08-2025 00:06, Completed, ...
```

### Parsing Logic
1. Split CSV by newlines into rows
2. Parse header row with proper quoted field support
3. Identify indices of ID, Name, Email columns
4. Filter out metadata columns (dates, metadata)
5. Remaining columns = activities
6. For each data row:
   - Count "Completed" values
   - Calculate: progress = (completed / total) × 100
   - Derive status: 100% = completed, 0% = not-started, 1-99% = in-progress

## Validation & Error Handling

- **CSV Validation**:
  - Checks for required columns (ID, Name, Email)
  - Validates minimum rows (header + data)
  - Cell bounds checking

- **UI Error Handling**:
  - Toast notifications for errors
  - Try-catch blocks in CSV parsing
  - Fallback UI for missing data

- **Type Safety**:
  - TypeScript interfaces for all data structures
  - Type checking at compile time

## Performance Considerations

- **Re-renders**: Minimized through proper state management
- **CSV Parsing**: Efficient string splitting and column detection
- **Large Datasets**: Mock data limited to ~45 students (scalable with pagination)
- **Search/Filter**: Computed within component (could use React Query for server-side)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript features used
- Responsive design for mobile/tablet/desktop

## Development Workflow

### Build & Run
```bash
npm install          # Install dependencies
npm run dev         # Start Vite dev server (http://localhost:8080)
npm run build       # Production build
npm run lint        # Code quality checks
```

### Development Server
- **Hot Module Replacement**: Changes reflect instantly
- **Type Checking**: TypeScript catches errors during development
- **CSS Compilation**: Tailwind CSS JIT compiler

## Security Considerations

- **CSV Upload**: No backend validation (client-side only)
- **XSS Protection**: React auto-escapes user input
- **Data Privacy**: All data stays in browser (localStorage possible)
- **CORS**: Supabase integration configured but not used

## Future Enhancement Areas

1. **Backend Integration**: Replace mock data with Supabase
2. **Authentication**: Role-based access (Admin, Academic Head, Coordinator, Viewer)
3. **Real-time Sync**: Auto-sync with Moodle API
4. **Pagination**: Handle 1000+ students efficiently
5. **Advanced Analytics**: Trend analysis, predictive insights
6. **Export Formats**: Excel, PDF reports
7. **Multi-course Management**: Better course selection UI
8. **Data Persistence**: Save imported data to backend

## Key Files Summary

| File | Purpose |
|------|---------|
| `Dashboard.tsx` | Main app container, view routing, state management |
| `Navigation.tsx` | Top bar with clickable logo and nav items |
| `csvParser.ts` | CSV parsing with quoted field support |
| `StudentsTable.tsx` | Searchable/filterable student list |
| `CourseDetailModal.tsx` | Course drill-down with filtering/export |
| `mockData.ts` | Sample student/course data |
| `App.tsx` | Router configuration |

---

**Current Status**: Fully functional dashboard with CSV import, student/course filtering, and export capabilities. Proper CSV parsing handles quoted fields correctly. All 33 activities from Ishaan Patel's CSV parse to 100% completion.
