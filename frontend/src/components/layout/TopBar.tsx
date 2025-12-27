import { Bell, Search, User, LayoutDashboard, Cog, Wrench, Calendar, Users, FileText, MonitorPlay, Factory } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Requests', path: '/requests', icon: FileText },
  { label: 'Equipment', path: '/equipment', icon: MonitorPlay },
  { label: 'Work Centers', path: '/work', icon: Factory },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export function TopBar({ title }: TopBarProps) {
  const location = useLocation();

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Cog className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground hidden md:block">GearGuard</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>



        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
