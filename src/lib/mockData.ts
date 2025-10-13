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

export interface Course {
  id: string;
  name: string;
  description: string;
  enrolledStudents: number;
  completedStudents: number;
  inProgressStudents: number;
  notStartedStudents: number;
}

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Academic Writing Fundamentals',
    description: 'Essential writing skills for academic success',
    enrolledStudents: 245,
    completedStudents: 89,
    inProgressStudents: 134,
    notStartedStudents: 22
  },
  {
    id: 'course-2', 
    name: 'Digital Literacy Basics',
    description: 'Introduction to digital tools and platforms',
    enrolledStudents: 198,
    completedStudents: 156,
    inProgressStudents: 35,
    notStartedStudents: 7
  },
  {
    id: 'course-3',
    name: 'Research Methods 101',
    description: 'Basic research methodology and citation',
    enrolledStudents: 167,
    completedStudents: 45,
    inProgressStudents: 98,
    notStartedStudents: 24
  },
  {
    id: 'course-4',
    name: 'Library Navigation',
    description: 'How to effectively use university library resources',
    enrolledStudents: 289,
    completedStudents: 201,
    inProgressStudents: 67,
    notStartedStudents: 21
  },
  {
    id: 'course-5',
    name: 'Time Management Skills',
    description: 'Strategies for effective academic time management',
    enrolledStudents: 223,
    completedStudents: 134,
    inProgressStudents: 78,
    notStartedStudents: 11
  }
];

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@flame.edu.in',
    batch: '2024',
    overallProgress: 85,
    status: 'in-progress',
    flag: 'amber',
    courses: [
      {
        courseId: 'course-1',
        courseName: 'Academic Writing Fundamentals',
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        activities: [
          { id: 'act-1', name: 'Introduction Video', type: 'video', completed: true, weight: 0.1 },
          { id: 'act-2', name: 'Writing Quiz', type: 'quiz', completed: true, weight: 0.3, score: 88 },
          { id: 'act-3', name: 'Essay Assignment', type: 'assignment', completed: true, weight: 0.4, score: 92 },
          { id: 'act-4', name: 'Peer Discussion', type: 'discussion', completed: true, weight: 0.1 },
          { id: 'act-5', name: 'Final Reading', type: 'reading', completed: true, weight: 0.1 }
        ]
      },
      {
        courseId: 'course-2',
        courseName: 'Digital Literacy Basics',
        progress: 70,
        completedActivities: 3,
        totalActivities: 4,
        activities: [
          { id: 'act-6', name: 'Digital Tools Overview', type: 'video', completed: true, weight: 0.2 },
          { id: 'act-7', name: 'Platform Navigation Quiz', type: 'quiz', completed: true, weight: 0.3, score: 76 },
          { id: 'act-8', name: 'Digital Project', type: 'assignment', completed: true, weight: 0.4, score: 84 },
          { id: 'act-9', name: 'Advanced Features', type: 'reading', completed: false, weight: 0.1 }
        ]
      }
    ]
  },
  {
    id: 'student-2',
    name: 'Priya Patel',
    email: 'priya.patel@flame.edu.in',
    batch: '2024',
    overallProgress: 95,
    status: 'completed',
    flag: 'green',
    courses: [
      {
        courseId: 'course-1',
        courseName: 'Academic Writing Fundamentals',
        progress: 100,
        completedActivities: 5,
        totalActivities: 5,
        activities: [
          { id: 'act-1', name: 'Introduction Video', type: 'video', completed: true, weight: 0.1 },
          { id: 'act-2', name: 'Writing Quiz', type: 'quiz', completed: true, weight: 0.3, score: 94 },
          { id: 'act-3', name: 'Essay Assignment', type: 'assignment', completed: true, weight: 0.4, score: 96 },
          { id: 'act-4', name: 'Peer Discussion', type: 'discussion', completed: true, weight: 0.1 },
          { id: 'act-5', name: 'Final Reading', type: 'reading', completed: true, weight: 0.1 }
        ]
      },
      {
        courseId: 'course-2',
        courseName: 'Digital Literacy Basics',
        progress: 100,
        completedActivities: 4,
        totalActivities: 4,
        activities: [
          { id: 'act-6', name: 'Digital Tools Overview', type: 'video', completed: true, weight: 0.2 },
          { id: 'act-7', name: 'Platform Navigation Quiz', type: 'quiz', completed: true, weight: 0.3, score: 89 },
          { id: 'act-8', name: 'Digital Project', type: 'assignment', completed: true, weight: 0.4, score: 91 },
          { id: 'act-9', name: 'Advanced Features', type: 'reading', completed: true, weight: 0.1 }
        ]
      }
    ]
  },
  {
    id: 'student-3',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@flame.edu.in',
    batch: '2023',
    overallProgress: 45,
    status: 'in-progress',
    flag: 'amber',
    courses: [
      {
        courseId: 'course-3',
        courseName: 'Research Methods 101',
        progress: 60,
        completedActivities: 3,
        totalActivities: 5,
        activities: [
          { id: 'act-10', name: 'Research Basics', type: 'video', completed: true, weight: 0.2 },
          { id: 'act-11', name: 'Methodology Quiz', type: 'quiz', completed: true, weight: 0.2, score: 72 },
          { id: 'act-12', name: 'Citation Exercise', type: 'assignment', completed: true, weight: 0.3, score: 68 },
          { id: 'act-13', name: 'Research Proposal', type: 'assignment', completed: false, weight: 0.2 },
          { id: 'act-14', name: 'Final Assessment', type: 'quiz', completed: false, weight: 0.1 }
        ]
      },
      {
        courseId: 'course-4',
        courseName: 'Library Navigation',
        progress: 30,
        completedActivities: 1,
        totalActivities: 3,
        activities: [
          { id: 'act-15', name: 'Library Tour', type: 'video', completed: true, weight: 0.3 },
          { id: 'act-16', name: 'Database Search', type: 'assignment', completed: false, weight: 0.4 },
          { id: 'act-17', name: 'Resource Quiz', type: 'quiz', completed: false, weight: 0.3 }
        ]
      }
    ]
  },
  {
    id: 'student-4',
    name: 'Meera Singh',
    email: 'meera.singh@flame.edu.in',
    batch: '2024',
    overallProgress: 0,
    status: 'not-started',
    flag: 'red',
    courses: [
      {
        courseId: 'course-1',
        courseName: 'Academic Writing Fundamentals',
        progress: 0,
        completedActivities: 0,
        totalActivities: 5,
        activities: [
          { id: 'act-1', name: 'Introduction Video', type: 'video', completed: false, weight: 0.1 },
          { id: 'act-2', name: 'Writing Quiz', type: 'quiz', completed: false, weight: 0.3 },
          { id: 'act-3', name: 'Essay Assignment', type: 'assignment', completed: false, weight: 0.4 },
          { id: 'act-4', name: 'Peer Discussion', type: 'discussion', completed: false, weight: 0.1 },
          { id: 'act-5', name: 'Final Reading', type: 'reading', completed: false, weight: 0.1 }
        ]
      }
    ]
  }
];

export const getOverallStats = () => {
  const totalEnrolled = mockStudents.length;
  const completed = mockStudents.filter(s => s.status === 'completed').length;
  const inProgress = mockStudents.filter(s => s.status === 'in-progress').length;
  const notStarted = mockStudents.filter(s => s.status === 'not-started').length;

  return {
    totalEnrolled,
    completed,
    inProgress,
    notStarted,
    completionRate: Math.round((completed / totalEnrolled) * 100)
  };
};