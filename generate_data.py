#!/usr/bin/env python3
import csv
import json
from collections import defaultdict
from datetime import datetime

# Indian names and emails
NAMES = [
    ("Aryan Kapoor", "aryan.kapoor"),
    ("Akshat Choudhary", "akshat.choudhary"),
    ("Priya Sharma", "priya.sharma"),
    ("Rahul Gupta", "rahul.gupta"),
    ("Meera Singh", "meera.singh"),
    ("Rohan Patel", "rohan.patel"),
    ("Neha Verma", "neha.verma"),
    ("Aditya Desai", "aditya.desai"),
    ("Zara Khan", "zara.khan"),
    ("Vikram Rao", "vikram.rao"),
    ("Isha Malhotra", "isha.malhotra"),
    ("Karan Nair", "karan.nair"),
    ("Divya Iyer", "divya.iyer"),
    ("Sanjay Kumar", "sanjay.kumar"),
    ("Pooja Reddy", "pooja.reddy"),
    ("Arjun Bhat", "arjun.bhat"),
    ("Samyukta Dasgupta", "samyukta.dasgupta"),
    ("Nikhil Agarwal", "nikhil.agarwal"),
    ("Anjali Dutta", "anjali.dutta"),
    ("Varun Sinha", "varun.sinha"),
    ("Shreya Chopra", "shreya.chopra"),
    ("Harsh Yadav", "harsh.yadav"),
    ("Riya Bhargava", "riya.bhargava"),
    ("Chirag Joshi", "chirag.joshi"),
    ("Avni Saxena", "avni.saxena"),
    ("Rohan Singh", "rohan.singh"),
    ("Diya Menon", "diya.menon"),
    ("Siddharth Roy", "siddharth.roy"),
    ("Tanvi Bansal", "tanvi.bansal"),
    ("Arjun Sharma", "arjun.sharma"),
    ("Kavya Pillai", "kavya.pillai"),
    ("Abhishek Mishra", "abhishek.mishra"),
    ("Sneha Vyas", "sneha.vyas"),
    ("Rohit Pandey", "rohit.pandey"),
    ("Ananya Nambiar", "ananya.nambiar"),
    ("Vedant Kulkarni", "vedant.kulkarni"),
    ("Ishita Bhattacharya", "ishita.bhattacharya"),
    ("Aryan Singh", "aryan.singh"),
    ("Nora Sharma", "nora.sharma"),
    ("Anurag Kapoor", "anurag.kapoor"),
    ("Preeti Bhat", "preeti.bhat"),
    ("Samir Desai", "samir.desai"),
    ("Ritika Saxena", "ritika.saxena"),
    ("Yash Verma", "yash.verma"),
    ("Swati Gupta", "swati.gupta"),
    ("Saurabh Rao", "saurabh.rao"),
    ("Anushka Nair", "anushka.nair"),
    ("Ajay Pandey", "ajay.pandey"),
    ("Manasi Reddy", "manasi.reddy"),
]

# Activity types and weights
ACTIVITY_TYPES = ["video", "quiz", "assignment", "discussion", "reading"]

def parse_csv(filepath):
    """Parse the CSV file and extract student data"""
    students_data = defaultdict(lambda: {
        'id': None,
        'completed_activities': 0,
        'total_activities': 0,
        'activity_completion_flags': []
    })
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        
        # Find which columns are activity completion status columns
        # They follow pattern: "Activity Name" and "Activity Name - Completion date"
        activity_columns = []
        for i, col in enumerate(header):
            if ' - Completion date' not in col and col not in ['ID', 'Name', 'Email address', 'Course  Outline']:
                if i < len(header) - 1 and 'Completion date' in header[i+1]:
                    activity_columns.append((i, col))
        
        total_activities = len(activity_columns)
        
        for row_idx, row in enumerate(reader):
            if not row or not row[0]:  # Skip empty rows
                continue
                
            student_id = row[0]
            students_data[student_id]['id'] = student_id
            students_data[student_id]['total_activities'] = total_activities
            
            # Count completed activities
            completed = 0
            for col_idx, activity_name in activity_columns:
                if col_idx < len(row):
                    status = row[col_idx].strip()
                    if status == 'Completed':
                        completed += 1
                        students_data[student_id]['activity_completion_flags'].append(True)
                    else:
                        students_data[student_id]['activity_completion_flags'].append(False)
            
            students_data[student_id]['completed_activities'] = completed
    
    return dict(students_data)

def determine_status(completion_ratio):
    """Determine status based on completion ratio"""
    if completion_ratio == 0:
        return 'not-started'
    elif completion_ratio == 1.0:
        return 'completed'
    else:
        return 'in-progress'

def determine_flag(completion_ratio):
    """Determine flag color based on completion ratio"""
    if completion_ratio >= 0.8:
        return 'green'
    elif completion_ratio >= 0.5:
        return 'amber'
    else:
        return 'red'

def generate_activities(completion_flags):
    """Generate activity list with completion status"""
    activities = []
    for i, is_completed in enumerate(completion_flags):
        activity_type = ACTIVITY_TYPES[i % len(ACTIVITY_TYPES)]
        activities.append({
            'id': f'act-{i+1}',
            'name': f'{activity_type.capitalize()} {i+1}',
            'type': activity_type,
            'completed': is_completed,
            'weight': round(1.0 / len(completion_flags), 2) if completion_flags else 0,
            'score': 85 + (i % 15) if is_completed else None
        })
    return activities

def generate_ts_code(students_data):
    """Generate TypeScript code for mockData.ts"""
    # Convert students_data to list and sort by ID
    students_list = sorted(students_data.values(), key=lambda x: int(x['id']))
    
    # Calculate course statistics
    course_completed = 0
    course_in_progress = 0
    course_not_started = 0
    
    for idx, student_data in enumerate(students_list):
        if idx >= len(NAMES):
            break
        
        completed = student_data['completed_activities']
        total = student_data['total_activities']
        
        if total == 0:
            continue
        
        completion_ratio = completed / total
        if completion_ratio == 1.0:
            course_completed += 1
        elif completion_ratio == 0:
            course_not_started += 1
        else:
            course_in_progress += 1
    
    ts_code = """export interface Student {
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
    name: 'FLAME Onboarding & Foundation',
    description: 'Essential onboarding program for new students',
    enrolledStudents: """ + str(min(len(students_list), len(NAMES))) + """,
    completedStudents: """ + str(course_completed) + """,
    inProgressStudents: """ + str(course_in_progress) + """,
    notStartedStudents: """ + str(course_not_started) + """
  }
];

export const mockStudents: Student[] = [
"""
    
    student_objects = []
    for idx, student_data in enumerate(students_list):
        if idx >= len(NAMES):
            break
        
        student_id = student_data['id']
        name, email_prefix = NAMES[idx]
        email = f"{email_prefix}@flame.demo.in"
        
        completed = student_data['completed_activities']
        total = student_data['total_activities']
        
        progress = round((completed / total * 100) if total > 0 else 0)
        completion_ratio = completed / total if total > 0 else 0
        status = determine_status(completion_ratio)
        flag = determine_flag(completion_ratio)
        
        activities = generate_activities(student_data['activity_completion_flags'])
        
        # Format activities for TypeScript
        activities_list = []
        for act in activities:
            score_str = f", score: {act['score']}" if act['score'] else ""
            act_str = f"{{ id: '{act['id']}', name: '{act['name']}', type: '{act['type']}', completed: {str(act['completed']).lower()}, weight: {act['weight']}{score_str} }}"
            activities_list.append(act_str)
        activities_str = ",\n          ".join(activities_list)
        
        student_obj = f"""  {{
    id: '{student_id}',
    name: '{name}',
    email: '{email}',
    batch: '2024',
    overallProgress: {progress},
    status: '{status}',
    flag: '{flag}',
    courses: [
      {{
        courseId: 'course-1',
        courseName: 'FLAME Onboarding & Foundation',
        progress: {progress},
        completedActivities: {completed},
        totalActivities: {total},
        activities: [
          {activities_str}
        ]
      }}
    ]
  }}"""
        student_objects.append(student_obj)
    
    ts_code += ",\n".join(student_objects)
    
    ts_code += "\n];\n\n"
    
    # Add getOverallStats function
    ts_code += """export const getOverallStats = () => {
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
"""
    
    return ts_code

if __name__ == '__main__':
    csv_path = '/Users/aryanpatney/Desktop/flame-moodle-insight-43732/Sample File-pop001-20251208_0907-comma_separated.csv'
    
    print("Parsing CSV...")
    students_data = parse_csv(csv_path)
    
    print(f"Found {len(students_data)} students")
    
    print("Generating TypeScript code...")
    ts_code = generate_ts_code(students_data)
    
    # Save to file
    output_path = '/Users/aryanpatney/Desktop/flame-moodle-insight-43732/mockData_generated.ts'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_code)
    
    print(f"Generated code saved to {output_path}")
