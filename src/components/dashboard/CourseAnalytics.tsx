import { Course } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, BookOpen, TrendingUp, Download } from "lucide-react";

interface CourseAnalyticsProps {
  courses: Course[];
}

export const CourseAnalytics = ({ courses }: CourseAnalyticsProps) => {
  // Prepare data for charts
  const pieData = courses.map(course => ({
    name: course.name,
    completed: course.completedStudents,
    inProgress: course.inProgressStudents,
    notStarted: course.notStartedStudents,
    total: course.enrolledStudents
  }));

  const COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  const getCompletionRate = (course: Course) => {
    return Math.round((course.completedStudents / course.enrolledStudents) * 100);
  };

  const handleExportCourseData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Course Name,Enrolled Students,Completed,In Progress,Not Started,Completion Rate\n"
      + courses.map(course => 
          `${course.name},${course.enrolledStudents},${course.completedStudents},${course.inProgressStudents},${course.notStartedStudents},${getCompletionRate(course)}%`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "course_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Course Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive overview of all pre-orientation courses
          </p>
        </div>
        <Button onClick={handleExportCourseData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Analytics
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active pre-orientation courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(courses.reduce((sum, course) => sum + getCompletionRate(course), 0) / courses.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {courses.reduce((prev, current) => 
                prev.enrolledStudents > current.enrolledStudents ? prev : current
              ).name.split(' ').slice(0, 2).join(' ')}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest enrollment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Distribution</CardTitle>
            <CardDescription>
              Total enrolled students per course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="total" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Status Overview</CardTitle>
            <CardDescription>
              Student status distribution across courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="hsl(var(--success))" name="Completed" />
                <Bar dataKey="inProgress" stackId="a" fill="hsl(var(--warning))" name="In Progress" />
                <Bar dataKey="notStarted" stackId="a" fill="hsl(var(--destructive))" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Performance Details</CardTitle>
          <CardDescription>
            Detailed breakdown of each course's performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {course.enrolledStudents} enrolled
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-success/5 rounded-lg border border-success/20">
                    <div className="text-2xl font-bold text-success">{course.completedStudents}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <div className="text-2xl font-bold text-warning">{course.inProgressStudents}</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div className="text-2xl font-bold text-destructive">{course.notStartedStudents}</div>
                    <div className="text-xs text-muted-foreground">Not Started</div>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-2xl font-bold text-primary">{getCompletionRate(course)}%</div>
                    <div className="text-xs text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{getCompletionRate(course)}%</span>
                  </div>
                  <Progress value={getCompletionRate(course)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};