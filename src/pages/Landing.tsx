import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, BarChart3, Users, TrendingUp, ArrowRight, Shield, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor student progress and engagement metrics in real-time with comprehensive data visualization"
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Track individual and cohort performance with RAG flag system for at-risk student identification"
    },
    {
      icon: TrendingUp,
      title: "Weighted Progress",
      description: "Customizable activity weights for accurate progress calculation and performance assessment"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure access control with admin, academic head, coordinator, and viewer role permissions"
    },
    {
      icon: Clock,
      title: "Automated Sync",
      description: "Scheduled synchronization with Moodle for up-to-date enrollment and completion data"
    },
    {
      icon: FileText,
      title: "Export Reports",
      description: "Generate comprehensive Excel and CSV reports for stakeholders and administrative review"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-12 max-w-6xl mx-auto">
          {/* Header */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Digital Learning Centre
              </h1>
              <p className="text-2xl text-muted-foreground">
                FLAME University - Admin Analytics Dashboard
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive analytics and insights for pre-orientation course management, 
                replacing manual Excel workflows with intelligent automation
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 animate-fade-in">
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-lg px-8">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 animate-fade-in">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">Real-Time</div>
              <p className="text-muted-foreground mt-2">Data Synchronization</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">4 Roles</div>
              <p className="text-muted-foreground mt-2">Access Levels</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">RAG</div>
              <p className="text-muted-foreground mt-2">Risk Assessment</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Powered by Lovable Cloud • Built for FLAME University DLC
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
