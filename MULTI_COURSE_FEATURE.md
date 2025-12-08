# Multi-Course Support & Course-Wise Drill-Down Implementation

## Overview
Successfully implemented support for multiple courses and comprehensive course-wise analytics with detailed drill-down capabilities.

## Features Added

### 1. **Multi-Course CSV Support**
Enhanced the CSV parser to handle multiple courses:
- **Auto-detection** of courses from CSV headers (detects "Course Outline", "Course Name", etc.)
- **Course grouping** of activities based on CSV structure
- **Per-course tracking** for each student's progress
- **Support for mixed courses** in single CSV upload

**Example CSV Structure:**
```
ID,Name,Email,Course1-Activity1,Course1-Activity1-Completion Date,...,Course2-Activity1,...
1,John Doe,john@example.com,Completed,DD-MM-YYYY,...,Completed,...
```

### 2. **Course Detail Modal** (`CourseDetailModal.tsx`)
New component providing comprehensive course-wise analytics:

**Three tabs for detailed insights:**

#### Overview Tab
- Course enrollment statistics
- Completion counts and percentages
- Average student progress
- Status breakdown visualization (Not Started/In Progress/Completed)
- Visual progress indicators

#### Students Tab
- List of all students in the course
- Individual progress percentages with bars
- Student status badges
- Color-coded progress indicators (red/amber/green flags)
- Sortable by progress percentage

#### Activities Tab
- All course activities listed with details
- Completion count per activity (e.g., "15/49 students")
- Percentage of students who completed each activity
- Visual completion bars for each activity
- Activity type indicators (Video, Quiz, Assignment, etc.)

### 3. **Enhanced Course Analytics** (`CourseAnalytics.tsx`)
Updated with drill-down capabilities:

**Features:**
- All existing course performance visualizations
- "View Detailed Analytics" button on each course card
- Dynamic course listing from uploaded student data
- Completion rate calculations
- Quick statistics display
- Export functionality for course data

**Visual Enhancements:**
- Hover states for course cards
- Interactive buttons to open course details
- Progress bars for quick visual assessment
- Status breakdown charts

### 4. **Multi-Course CSV Parser** (`csvParser.ts`)
Enhanced parser with:

**Capabilities:**
- `ParseOptions` interface for custom course naming
- Auto-detection of course columns
- Grouping activities by course
- Per-course progress calculation
- Overall progress aggregation across all courses
- Flexible column detection

**Example Usage:**
```typescript
const students = parseCSV(csvText, {
  courseName: "Custom Course Name",
  courseId: "custom-course-id"
});
```

## How It Works

### Uploading Multi-Course Data

1. **Upload CSV** with multiple course activities
2. **Parser auto-detects** course boundaries
3. **Student data** is enriched with multiple course enrollments
4. **Dashboard automatically updates** with all courses

### Course-Wise Drill-Down

1. **Navigate to "Courses"** tab
2. **See all courses** with overview statistics
3. **Click "View Detailed Analytics"** on any course
4. **Explore course details:**
   - Overview: Statistics and progress
   - Students: List with individual progress
   - Activities: Activity completion rates

### Example Data Flow

**Input CSV:**
```
ID,Name,Email,Python101,Python101 Completion,JavaScript101,JavaScript101 Completion
1,Alice,alice@example.com,Completed,01-12-2025,Completed,01-12-2025
2,Bob,bob@example.com,Completed,02-12-2025,In Progress,
```

**System Creates:**
- Student 1 (Alice) with 2 courses:
  - Python101: 100% progress (1/1 activity)
  - JavaScript101: 100% progress (1/1 activity)
- Student 2 (Bob) with 2 courses:
  - Python101: 100% progress (1/1 activity)
  - JavaScript101: 0% progress (0/1 activity)

## UI Components

### Course Detail Modal
- **Dialog-based** full-screen experience
- **Responsive** grid layouts
- **Tabbed interface** for organization
- **Real-time calculations** of statistics
- **Color-coded** status indicators

### Course List
- **Card-based layout** for each course
- **Quick statistics** overview
- **Progress bars** for visual representation
- **Drill-down buttons** to open detailed view
- **All available courses** displayed with student counts

## Data Structure

**Student now includes:**
```typescript
{
  id: string;
  name: string;
  email: string;
  batch: string;
  courses: CourseProgress[]; // Array of courses
  overallProgress: number; // Aggregated across all courses
  status: 'not-started' | 'in-progress' | 'completed';
  flag: 'red' | 'amber' | 'green';
}

CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedActivities: number;
  totalActivities: number;
  activities: Activity[];
}
```

## Navigation

**Updated Navigation:**
- Dashboard
- Students (existing)
- **Courses** (enhanced with drill-down)
- Upload (existing)
- Settings

## Benefits

1. **Multi-Course Management**: Support unlimited courses per upload
2. **Detailed Analytics**: Drill down to see exactly what's happening in each course
3. **Activity Tracking**: View which specific activities are challenging for students
4. **Flexible CSV Format**: Auto-detects course structure
5. **Student Insights**: See student progress across multiple courses
6. **Course Insights**: See overall course performance and activity completion rates

## Example Usage Scenarios

### Scenario 1: Onboarding Multiple Cohorts
Upload CSV with multiple onboarding courses, each cohort gets their own course tracking.

### Scenario 2: Multi-Semester Courses
Upload data spanning multiple courses/semesters and drill down to see performance per course.

### Scenario 3: Activity Analysis
Open course detail → Activities tab to identify which activities students struggle with most.

### Scenario 4: Course Performance Comparison
View all courses side-by-side and compare completion rates and student progress.
