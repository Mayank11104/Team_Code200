import { MaintenanceStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: MaintenanceStatus;
  className?: string;
}

const statusConfig: Record<MaintenanceStatus, { label: string; className: string }> = {
  'new': { label: 'New', className: 'status-new' },
  'in_progress': { label: 'In Progress', className: 'status-in-progress' },
  'repaired': { label: 'Repaired', className: 'status-repaired' },
  'scrap': { label: 'Scrap', className: 'status-scrap' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
