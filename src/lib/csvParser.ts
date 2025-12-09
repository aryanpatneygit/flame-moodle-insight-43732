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

// Simple CSV parser that handles quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Comma outside quotes - field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
}

export function parseCSV(csvText: string, options?: ParseOptions): Student[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have header and data rows');
  }

  const headers = parseCSVLine(lines[0]);
  
  // Find column indices
  const idIndex = headers.findIndex(h => h.toLowerCase() === 'id');
  const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
  const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email address' || h.toLowerCase() === 'email');
  const courseNameIndex = headers.findIndex(h => h.toLowerCase() === 'course outline' || h.toLowerCase() === 'course name');
  
  if (idIndex === -1 || nameIndex === -1 || emailIndex === -1) {
    throw new Error('CSV must contain ID, Name, and Email columns');
  }

  // Group activities by course - filter out metadata columns
  const activityColumns: { index: number; name: string }[] = [];
  let courseGroups: Map<string, { activities: { index: number; name: string }[] }> = new Map();
  
  let currentCourse = options?.courseName || 'FLAME Onboarding & Foundation';
  let foundCourseHeader = false;

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].trim();
    
    // Skip these columns: ID, Name, Email, metadata with "date", "course complete", "course outline"
    if (
      header.toLowerCase() === 'id' ||
      header.toLowerCase() === 'name' ||
      header.toLowerCase() === 'email address' ||
      header.toLowerCase() === 'email' ||
      header.toLowerCase().includes('completion date') ||
      header.toLowerCase() === 'course complete' ||
      header.toLowerCase() === 'course outline' ||
      header === ''
    ) {
      continue;
    }

    // This is an activity column
    if (!courseGroups.has(currentCourse)) {
      courseGroups.set(currentCourse, { activities: [] });
    }
    
    courseGroups.get(currentCourse)!.activities.push({ index: i, name: header });
    activityColumns.push({ index: i, name: header });
  }

  // If no course groups were created, throw error
  if (courseGroups.size === 0 || activityColumns.length === 0) {
    throw new Error('CSV must contain activity columns with completion data');
  }
  
  console.log(`[DEBUG] Header analysis: ${headers.length} total headers`);
  console.log(`[DEBUG] Activity columns found: ${activityColumns.length}`);
  console.log(`[DEBUG] Activities by course:`, Array.from(courseGroups.entries()).map(([name, data]) => `${name}: ${data.activities.length}`));

  const students: Student[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    
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
        // Check if cell exists and has content
        const cellValue = col.index < cells.length ? cells[col.index]?.toLowerCase() : '';
        const isCompleted = cellValue === 'completed';
        completionFlags.push(isCompleted);
        if (isCompleted) completedCount++;
      }

      const courseTotal = courseData.activities.length || 1;
      const courseProgress = Math.round((completedCount / courseTotal) * 100);
      
      // Debug logging for ID 10
      if (id === '10') {
        console.log(`[DEBUG] Student ${name} (ID ${id})`);
        console.log(`  Course: ${courseName}`);
        console.log(`  Activities in courseData.activities: ${courseData.activities.length}`);
        console.log(`  Completed: ${completedCount}`);
        console.log(`  Total: ${courseTotal}`);
        console.log(`  Progress: ${courseProgress}%`);
      }

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
