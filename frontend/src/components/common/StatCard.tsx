import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/5 border-primary/20',
  warning: 'bg-amber-50 border-amber-200',
  success: 'bg-emerald-50 border-emerald-200',
  danger: 'bg-red-50 border-red-200',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn('card-enterprise p-5', variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-sm font-medium',
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
