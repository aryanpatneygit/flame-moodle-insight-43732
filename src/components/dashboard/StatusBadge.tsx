import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'not-started' | 'in-progress' | 'completed';
  flag: 'red' | 'amber' | 'green';
}

export const StatusBadge = ({ status, flag }: StatusBadgeProps) => {
  const getStatusText = () => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  const getStatusVariant = () => {
    switch (flag) {
      case 'red':
        return 'destructive';
      case 'amber':
        return 'secondary';
      case 'green':
        return 'default';
    }
  };

  const getFlagColor = () => {
    switch (flag) {
      case 'red':
        return 'bg-destructive';
      case 'amber':
        return 'bg-warning';
      case 'green':
        return 'bg-success';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getFlagColor()}`} />
      <Badge variant={getStatusVariant()} className="text-xs">
        {getStatusText()}
      </Badge>
    </div>
  );
};