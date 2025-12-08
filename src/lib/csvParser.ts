export interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  courses: CourseProgress[];
  overallProgress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  flag: 'red' | 'amber' | 'green';
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  progress: number;
  completedActivities: number;
  totalActivities: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  type: 'quiz' | 'video' | 'assignment' | 'discussion' | 'reading';
  completed: boolean;
  weight: number;
  score?: number;
}

const ACTIVITY_TYPES = ['video', 'quiz', 'assignment', 'discussion', 'reading'];

function determineStatus(completionRatio: number): 'not-started' | 'in-progress' | 'completed' {
  if (completionRatio === 0) return 'not-started';
  if (completionRatio === 1) return 'completed';
  return 'in-progress';
}

function determineFlag(completionRatio: number): 'red' | 'amber' | 'green' {
  if (completionRatio >= 0.8) return 'green';
  if (completionRatio >= 0.5) return 'amber';
  return 'red';
}

function generateActivities(completionFlags: boolean[]): Activity[] {
  return completionFlags.map((isCompleted, i) => ({
    id: `act-${i + 1}`,
    name: `${ACTIVITY_TYPES[i % ACTIVITY_TYPES.length].charAt(0).toUpperCase()}${ACTIVITY_TYPES[i % ACTIVITY_TYPES.length].slice(1)} ${i + 1}`,
    type: ACTIVITY_TYPES[i % ACTIVITY_TYPES.length] as Activity['type'],
    completed: isCompleted,
    weight: parseFloat((1 / completionFlags.length).toFixed(2)) || 0,
    score: isCompleted ? 85 + (i % 15) : undefined
  }));
}

export interface ParseOptions {
  courseName?: string;
  courseId?: string;
}

export function parseCSV(csvText: string, options?: ParseOptions): Student[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have header and data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim());
  
  // Find column indices
  const idIndex = headers.findIndex(h => h.toLowerCase() === 'id');
  const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
  const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email address' || h.toLowerCase() === 'email');
  const courseNameIndex = headers.findIndex(h => h.toLowerCase() === 'course outline' || h.toLowerCase() === 'course name');
  
  if (idIndex === -1 || nameIndex === -1 || emailIndex === -1) {
    throw new Error('CSV must contain ID, Name, and Email columns');
  }

  // Group activities by course if first activity column is "Course Outline" or similar
  const activityColumns: { index: number; name: string }[] = [];
  let courseGroups: Map<string, { activities: { index: number; name: string }[] }> = new Map();
  
  let currentCourse = options?.courseName || 'General Course';
  let foundCourseHeader = false;

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (
      header !== 'ID' &&
      header !== 'Name' &&
      header !== 'Email address' &&
      !header.includes('Completion date') &&
      header.trim() !== ''
    ) {
      // Detect course name from first activity or header
      if (!foundCourseHeader && (header.toLowerCase().includes('course') || header.toLowerCase().includes('outline'))) {
        currentCourse = options?.courseName || header;
        foundCourseHeader = true;
      }

      if (!courseGroups.has(currentCourse)) {
        courseGroups.set(currentCourse, { activities: [] });
      }
      
      courseGroups.get(currentCourse)!.activities.push({ index: i, name: header });
      activityColumns.push({ index: i, name: header });
    }
  }

  // If no course groups were created, use all activities as one course
  if (courseGroups.size === 0 && activityColumns.length > 0) {
    courseGroups.set(currentCourse, { activities: activityColumns });
  }

  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim());
    
    if (!cells[idIndex]) continue;

    const id = cells[idIndex];
    const name = cells[nameIndex] || `Student ${id}`;
    const email = cells[emailIndex] || `student${id}@flame.demo.in`;

    // Create courses from courseGroups
    const courses: CourseProgress[] = [];
    let totalCompleted = 0;
    let totalActivities = 0;

    courseGroups.forEach((courseData, courseName) => {
      const completionFlags: boolean[] = [];
      let completedCount = 0;

      for (const col of courseData.activities) {
        if (col.index < cells.length) {
          const isCompleted = cells[col.index].toLowerCase() === 'completed';
          completionFlags.push(isCompleted);
          if (isCompleted) completedCount++;
        }
      }

      const courseTotal = completionFlags.length || 1;
      const courseProgress = Math.round((completedCount / courseTotal) * 100);

      courses.push({
        courseId: `course-${courseName.toLowerCase().replace(/\s+/g, '-')}`,
        courseName: courseName,
        progress: courseProgress,
        completedActivities: completedCount,
        totalActivities: courseTotal,
        activities: generateActivities(completionFlags)
      });

      totalCompleted += completedCount;
      totalActivities += courseTotal;
    });

    const overallProgress = totalActivities > 0 ? Math.round((totalCompleted / totalActivities) * 100) : 0;
    const completionRatio = totalActivities > 0 ? totalCompleted / totalActivities : 0;

    students.push({
      id,
      name: name || `Student ${id}`,
      email: email || `student${id}@flame.demo.in`,
      batch: '2024',
      overallProgress,
      status: determineStatus(completionRatio),
      flag: determineFlag(completionRatio),
      courses
    });
  }

  if (students.length === 0) {
    throw new Error('No valid student records found in CSV');
  }

  return students;
}
