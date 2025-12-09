import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { GraduationCap, Users, TrendingUp, Download } from "lucide-react";
import { useState } from "react";
import type { Student } from "@/lib/mockData";

interface CourseDetailModalProps {
  courseName: string;
  students: Student[];
  isOpen: boolean;
  onClose: () => void;
}

export const CourseDetailModal = ({
  courseName,
  students,
  isOpen,
  onClose,
}: CourseDetailModalProps) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [progressRange, setProgressRange] = useState<[number, number]>([0, 100]);
  // Filter students with this course
  const courseStudents = students
    .map(student => {
      const courseData = student.courses.find(c => c.courseName === courseName);
      return courseData ? { ...student, courseData } : null;
    })
    .filter((s): s is any => s !== null)
    .sort((a, b) => b.courseData.progress - a.courseData.progress);

  // Calculate course statistics
  const totalEnrolled = courseStudents.length;
  const completed = courseStudents.filter(s => s.courseData.progress === 100).length;
  const inProgress = courseStudents.filter(s => s.courseData.progress > 0 && s.courseData.progress < 100).length;
  const notStarted = courseStudents.filter(s => s.courseData.progress === 0).length;
  const avgProgress = totalEnrolled > 0 
    ? Math.round(courseStudents.reduce((sum, s) => sum + s.courseData.progress, 0) / totalEnrolled)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusFromProgress = (progress: number) => {
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case 'green':
        return 'bg-green-500';
      case 'amber':
        return 'bg-amber-500';
      default:
        return 'bg-red-500';
    }
  };

  // Filter students based on status and progress range
  const filteredStudents = courseStudents.filter(student => {
    const studentStatus = getStatusFromProgress(student.courseData.progress);
    const matchesStatus = statusFilter === "all" || studentStatus === statusFilter;
    const matchesProgress = student.courseData.progress >= progressRange[0] && student.courseData.progress <= progressRange[1];
    return matchesStatus && matchesProgress;
  });

  // Export filtered students
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Name,Email,Progress,Status,Flag\n"
      + filteredStudents.map(s => 
          `${s.name},${s.email},${s.courseData.progress}%,${getStatusFromProgress(s.courseData.progress)},${s.flag}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${courseName}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{courseName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-info" />
                  <p className="text-sm text-muted-foreground">Total Enrolled</p>
                </div>
                <p className="text-2xl font-bold">{totalEnrolled}</p>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-4 w-4 text-success" />
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <p className="text-2xl font-bold">{completed}</p>
                <p className="text-xs text-muted-foreground">
                  {totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0}%
                </p>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-warning" />
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
                <p className="text-2xl font-bold">{inProgress}</p>
                <p className="text-xs text-muted-foreground">
                  {totalEnrolled > 0 ? Math.round((inProgress / totalEnrolled) * 100) : 0}%
                </p>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
                <p className="text-2xl font-bold">{avgProgress}%</p>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Course Completion Progress</p>
                <span className="text-sm text-muted-foreground">{avgProgress}%</span>
              </div>
              <Progress value={avgProgress} className="h-2" />
            </div>

            {/* Status Breakdown */}
            <div className="space-y-3">
              <p className="font-semibold">Status Breakdown</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Not Started</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-red-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${totalEnrolled > 0 ? (notStarted / totalEnrolled) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-semibold w-8">{notStarted}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${totalEnrolled > 0 ? (inProgress / totalEnrolled) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-semibold w-8">{inProgress}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-green-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${totalEnrolled > 0 ? (completed / totalEnrolled) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="font-semibold w-8">{completed}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            {/* Filter Controls */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Progress Range: {progressRange[0]}% - {progressRange[1]}%</label>
                <Slider
                  value={[progressRange[0], progressRange[1]]}
                  onValueChange={(value) => setProgressRange([value[0], value[1]])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <Button onClick={handleExport} size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Students List */}
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-card border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{student.courseData.progress}%</p>
                      <Progress value={student.courseData.progress} className="h-1 w-24 mt-1" />
                    </div>

                    <Badge className={getStatusColor(getStatusFromProgress(student.courseData.progress))}>
                      {getStatusFromProgress(student.courseData.progress)}
                    </Badge>

                    <div
                      className={`h-3 w-3 rounded-full ${getFlagColor(student.flag)}`}
                      title={student.flag}
                    />
                  </div>
                </div>
              ))}

              {courseStudents.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No students enrolled in this course
                </p>
              )}
            </div>
            
            {filteredStudents.length === 0 && courseStudents.length > 0 && (
              <p className="text-center text-muted-foreground py-8">
                No students match the selected filters
              </p>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-3">
              {courseStudents.length > 0 && courseStudents[0].courseData.activities.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Course contains {courseStudents[0].courseData.activities.length} activities
                  </p>
                  <div className="space-y-2">
                    {courseStudents[0].courseData.activities.map((activity) => {
                      const completedBy = courseStudents.filter(s =>
                        s.courseData.activities.find(a => a.id === activity.id && a.completed)
                      ).length;

                      return (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-3 bg-card border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{activity.type}</p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-sm">{completedBy}/{courseStudents.length}</p>
                              <p className="text-xs text-muted-foreground">
                                {totalEnrolled > 0 ? Math.round((completedBy / courseStudents.length) * 100) : 0}%
                              </p>
                            </div>

                            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${totalEnrolled > 0 ? (completedBy / courseStudents.length) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No activities found
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
