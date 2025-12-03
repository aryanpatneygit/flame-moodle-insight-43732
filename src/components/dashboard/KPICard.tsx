import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export const KPICard = ({ title, value, change, icon, variant = 'default' }: KPICardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'info':
        return 'border-info/20 bg-gradient-to-br from-info/5 to-info/10';
      default:
        return 'border-border bg-gradient-to-br from-card to-accent/20';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-all duration-200 hover:shadow-lg`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-4 w-4 ${getIconColor()}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {change.type === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-success mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive mr-1" />
            )}
            <span className={change.type === 'increase' ? 'text-success' : 'text-destructive'}>
              {change.value}%
            </span>
            <span className="ml-1">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
