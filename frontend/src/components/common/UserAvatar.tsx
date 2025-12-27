import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: User;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function UserAvatar({ user, size = 'md', showName = false, className }: UserAvatarProps) {
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar className={sizeClasses[size]}>
        {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && user && (
        <span className="text-sm font-medium text-foreground">{user.name}</span>
      )}
    </div>
  );
}
