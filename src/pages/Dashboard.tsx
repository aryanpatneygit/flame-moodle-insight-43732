import { useState } from "react";
import { Navigation } from "@/components/dashboard/Navigation";
import { KPICard } from "@/components/dashboard/KPICard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { StudentsTable } from "@/components/dashboard/StudentsTable";
import { StudentDetailModal } from "@/components/dashboard/StudentDetailModal";
import { CourseAnalytics } from "@/components/dashboard/CourseAnalytics";
import { mockStudents, mockCourses, getOverallStats, Student } from "@/lib/mockData";
import { Users, GraduationCap, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'courses' | 'settings'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const { toast } = useToast();

  const stats = getOverallStats();

  // Prepare chart data
  const chartData = mockCourses.map(course => ({
    name: course.name.split(' ').slice(0, 2).join(' '), // Shorten names for display
    enrolled: course.enrolledStudents,
    completed: course.completedStudents,
    inProgress: course.inProgressStudents,
    notStarted: course.notStartedStudents
  }));

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleSync = async () => {
    toast({
      title: "Sync Started",
      description: "Fetching latest data from Moodle...",
    });
    
    // Mock sync process
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with Moodle database.",
      });
    }, 2000);
  };

  const renderDashboardView = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Enrolled"
          value={stats.totalEnrolled}
          icon={<Users className="h-4 w-4" />}
          change={{ value: 12, type: 'increase' }}
          variant="info"
        />
        <KPICard
          title="Completed"
          value={stats.completed}
          icon={<GraduationCap className="h-4 w-4" />}
          change={{ value: 8, type: 'increase' }}
          variant="success"
        />
        <KPICard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock className="h-4 w-4" />}
          change={{ value: 5, type: 'decrease' }}
          variant="warning"
        />
        <KPICard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          change={{ value: 3, type: 'increase' }}
          variant="success"
        />
      </div>

      {/* Chart and Top Courses */}
      <div className="grid gap-4 md:grid-cols-7">
        <ProgressChart data={chartData} />
        <div className="md:col-span-3">
          <div className="grid gap-4">
            {/* Top Performing Courses */}
            <div className="bg-gradient-to-br from-card to-accent/20 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Courses</h3>
              <div className="space-y-3">
                {mockCourses
                  .sort((a, b) => (b.completedStudents / b.enrolledStudents) - (a.completedStudents / a.enrolledStudents))
                  .slice(0, 3)
                  .map((course, index) => (
                    <div key={course.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.enrolledStudents} enrolled</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {Math.round((course.completedStudents / course.enrolledStudents) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">completion</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary/5 to-info/10 border border-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveView('students')}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <p className="font-medium text-sm">View All Students</p>
                  <p className="text-xs text-muted-foreground">Detailed student progress</p>
                </button>
                <button
                  onClick={() => setActiveView('courses')}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <p className="font-medium text-sm">Course Analytics</p>
                  <p className="text-xs text-muted-foreground">Performance metrics</p>
                </button>
                <button
                  onClick={handleSync}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                  <p className="font-medium text-sm">Sync with Moodle</p>
                  <p className="text-xs text-muted-foreground">Update latest data</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <StudentsTable 
        students={mockStudents} 
        onStudentSelect={handleStudentSelect}
      />
    </div>
  );

  const renderStudentsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Management</h2>
        <p className="text-muted-foreground">
          Comprehensive view of all student progress and detailed analytics
        </p>
      </div>
      <StudentsTable 
        students={mockStudents} 
        onStudentSelect={handleStudentSelect}
      />
    </div>
  );

  const renderCoursesView = () => (
    <CourseAnalytics courses={mockCourses} />
  );

  const renderSettingsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure Moodle integration and system preferences
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Moodle Integration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Moodle URL</label>
              <input 
                type="text" 
                className="w-full mt-1 px-3 py-2 border rounded-md" 
                placeholder="https://moodle.flame.edu.in"
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">API Token</label>
              <input 
                type="password" 
                className="w-full mt-1 px-3 py-2 border rounded-md" 
                placeholder="••••••••••••••••"
                disabled
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Connect to Supabase to enable Moodle integration settings
            </p>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Sync Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Auto-sync Interval</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md" disabled>
                <option>Every 6 hours</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Last Sync</label>
              <p className="text-sm text-muted-foreground mt-1">
                2024-01-15 14:30:00 UTC
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navigation 
        activeView={activeView} 
        onViewChange={setActiveView}
        onSync={handleSync}
      />
      
      <main className="container mx-auto px-4 py-8">
        {activeView === 'dashboard' && renderDashboardView()}
        {activeView === 'students' && renderStudentsView()}
        {activeView === 'courses' && renderCoursesView()}
        {activeView === 'settings' && renderSettingsView()}
      </main>

      <StudentDetailModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
};

export default Dashboard;