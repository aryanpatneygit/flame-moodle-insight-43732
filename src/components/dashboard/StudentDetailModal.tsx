import { Student, Activity } from "@/lib/mockData";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { BookOpen, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  const icons = {
    video: <BookOpen className="h-4 w-4" />,
    quiz: <CheckCircle2 className="h-4 w-4" />,
    assignment: <AlertCircle className="h-4 w-4" />,
    discussion: <Clock className="h-4 w-4" />,
    reading: <BookOpen className="h-4 w-4" />
  };
  return icons[type];
};

export const StudentDetailModal = ({ student, isOpen, onClose }: StudentDetailModalProps) => {
  if (!student) return null;

  const handleExportStudent = () => {
    const studentData = {
      name: student.name,
      email: student.email,
      batch: student.batch,
      overallProgress: student.overallProgress,
      status: student.status,
      courses: student.courses.map(course => ({
        name: course.courseName,
        progress: course.progress,
        completedActivities: course.completedActivities,
        totalActivities: course.totalActivities,
        activities: course.activities.map(activity => ({
          name: activity.name,
          type: activity.type,
          completed: activity.completed,
          score: activity.score || 'N/A'
        }))
      }))
    };

    const dataStr = JSON.stringify(studentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${student.name.replace(/\s+/g, '_')}_progress_report.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Student Progress Detail</span>
            <Button onClick={handleExportStudent} size="sm" variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </DialogTitle>
          <DialogDescription>
            Detailed progress breakdown for {student.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">{student.batch}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <div className="flex items-center gap-2">
                    <Progress value={student.overallProgress} className="w-[100px]" />
                    <span className="text-sm font-medium">{student.overallProgress}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <StatusBadge status={student.status} flag={student.flag} />
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Course Progress</h3>
            {student.courses.map((course) => (
              <Card key={course.courseId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{course.courseName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={course.progress} className="w-[100px]" />
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.completedActivities} of {course.totalActivities} activities completed
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.activities.map((activity, index) => (
                      <div key={activity.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${activity.completed ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                              <ActivityIcon type={activity.type} />
                            </div>
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {activity.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Weight: {(activity.weight * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {activity.completed ? (
                              <div>
                                <Badge variant="default" className="bg-success text-success-foreground">
                                  Completed
                                </Badge>
                                {activity.score && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Score: {activity.score}%
                                  </p>
                                )}
                              </div>
                            ) : (
                              <Badge variant="secondary">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index < course.activities.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};