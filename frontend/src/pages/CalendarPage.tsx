import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { maintenanceRequests } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/common/UserAvatar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const preventiveRequests = maintenanceRequests.filter((r) => r.type === 'preventive');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getRequestsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return preventiveRequests.filter((r) => r.scheduledDate === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-border bg-muted/30" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const requests = getRequestsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={cn(
            'h-32 border border-border p-2 hover:bg-muted/30 transition-colors cursor-pointer',
            isToday && 'bg-primary/5 border-primary'
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={cn(
                'w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium',
                isToday && 'bg-primary text-primary-foreground'
              )}
            >
              {day}
            </span>
            {requests.length > 0 && (
              <span className="text-xs text-muted-foreground">{requests.length} tasks</span>
            )}
          </div>
          <div className="space-y-1 overflow-hidden">
            {requests.slice(0, 2).map((request) => (
              <div
                key={request.id}
                className={cn(
                  'text-xs p-1.5 rounded truncate',
                  request.status === 'new'
                    ? 'bg-blue-100 text-blue-800'
                    : request.status === 'in-progress'
                    ? 'bg-amber-100 text-amber-800'
                    : request.status === 'repaired'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                )}
              >
                {request.subject}
              </div>
            ))}
            {requests.length > 2 && (
              <div className="text-xs text-muted-foreground px-1">
                +{requests.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Calendar</h1>
          <p className="text-muted-foreground mt-1">Schedule and view preventive maintenance</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'month'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'week'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Week
            </button>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="card-enterprise overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-muted-foreground bg-muted/50"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">{renderCalendarDays()}</div>
      </div>

      {/* Upcoming Preventive Maintenance */}
      <div className="card-enterprise p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Upcoming Preventive Maintenance
        </h3>
        <div className="space-y-3">
          {preventiveRequests
            .filter((r) => r.scheduledDate && new Date(r.scheduledDate) >= new Date())
            .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
            .slice(0, 5)
            .map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {new Date(request.scheduledDate!).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {MONTHS[new Date(request.scheduledDate!).getMonth()].slice(0, 3)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{request.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.equipment.name} • {request.duration}h
                    </p>
                  </div>
                </div>
                <UserAvatar user={request.assignedTechnician} size="sm" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
