import { MaintenanceRequest } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AlertTriangle, Calendar, Clock, Star } from 'lucide-react';

interface RequestListProps {
  requests: MaintenanceRequest[];
}

export function RequestList({ requests }: RequestListProps) {
  const isOverdue = (scheduledDate?: string, status?: string) => {
    if (!scheduledDate || status === 'repaired' || status === 'scrap') return false;
    return new Date(scheduledDate) < new Date();
  };

  return (
    <div className="card-enterprise overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Equipment / Work Center</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow
              key={request.id}
              className={cn(
                'cursor-pointer hover:bg-muted/50 transition-colors',
                isOverdue(request.scheduledDate, request.status) && 'bg-red-50'
              )}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{request.subject}</span>
                </div>
              </TableCell>
              <TableCell>
                {request.createdBy ? (
                  <UserAvatar user={request.createdBy} size="sm" showName />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {request.equipment?.name || request.workCenter?.name || '-'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    request.type === 'corrective'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  )}
                >
                  {request.type === 'corrective' ? 'Corrective' : 'Preventive'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {request.maintenanceTeam?.name || '-'}
              </TableCell>
              <TableCell>
                <UserAvatar user={request.assignedTechnician} size="sm" showName />
              </TableCell>
              <TableCell>
                {request.scheduledDate ? (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm',
                      isOverdue(request.scheduledDate, request.status)
                        ? 'text-red-600 font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="w-3 h-3" />
                    {new Date(request.scheduledDate).toLocaleDateString()}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {request.duration ? (
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3" />
                    {request.duration} hrs
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {request.priority && (
                  <div className="flex items-center gap-1">
                    {[...Array(request.priority === 'high' ? 3 : request.priority === 'medium' ? 2 : 1)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  );
}
