import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressChartProps {
  data: {
    name: string;
    enrolled: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  }[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Course Enrollment Overview</CardTitle>
        <CardDescription>
          Student progress across all pre-orientation courses
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Course
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-1 mt-2">
                        {payload.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm">
                              {item.dataKey}: {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="completed" 
              stackId="a" 
              fill="hsl(var(--success))" 
              name="Completed"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="inProgress" 
              stackId="a" 
              fill="hsl(var(--warning))" 
              name="In Progress"
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="notStarted" 
              stackId="a" 
              fill="hsl(var(--destructive))" 
              name="Not Started"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};