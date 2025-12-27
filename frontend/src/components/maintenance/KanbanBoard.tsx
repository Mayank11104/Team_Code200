import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUpdateRequestStatus } from '@/api/hooks/useMaintenance';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface KanbanBoardProps {
  requests: any[];
}

const columns = [
  { id: 'new', title: 'New', color: 'border-t-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-t-amber-500' },
  { id: 'repaired', title: 'Repaired', color: 'border-t-emerald-500' },
  { id: 'scrap', title: 'Scrap', color: 'border-t-red-500' },
];

export function KanbanBoard({ requests }: KanbanBoardProps) {
  const { toast } = useToast();
  const updateStatusMutation = useUpdateRequestStatus();

  const [scrapConfirm, setScrapConfirm] = useState<{ open: boolean; requestId: number | null }>({
    open: false,
    requestId: null,
  });

  const getRequestsByStatus = (status: string) => {
    return requests.filter((r: any) => r.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Check if moving to scrap
    if (newStatus === 'scrap') {
      setScrapConfirm({ open: true, requestId: parseInt(draggableId) });
      return;
    }

    // Update status via API
    updateStatusMutation.mutate(
      { id: parseInt(draggableId), status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: 'Status Updated',
            description: `Request moved to ${newStatus.replace('_', ' ')}`,
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.detail || 'Failed to update status',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const confirmScrap = () => {
    if (scrapConfirm.requestId) {
      updateStatusMutation.mutate(
        { id: scrapConfirm.requestId, status: 'scrap' },
        {
          onSuccess: () => {
            toast({
              title: 'Status Updated',
              description: 'Request marked as scrapped',
            });
          },
        }
      );
    }
    setScrapConfirm({ open: false, requestId: null });
  };

  const isOverdue = (scheduledDate?: string) => {
    if (!scheduledDate) return false;
    return new Date(scheduledDate) < new Date();
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.id} className={cn('kanban-column border-t-4', column.color)}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  {getRequestsByStatus(column.id).length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'space-y-3 min-h-[400px] transition-colors rounded-lg p-2 -m-2',
                      snapshot.isDraggingOver && 'bg-primary/5'
                    )}
                  >
                    {getRequestsByStatus(column.id).map((request: any, index: number) => (
                      <Draggable key={request.id} draggableId={request.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              'kanban-card',
                              snapshot.isDragging && 'shadow-lg rotate-2',
                              isOverdue(request.scheduledDate) &&
                              request.status !== 'repaired' &&
                              request.status !== 'scrap' &&
                              'border-l-4 border-l-red-500'
                            )}
                          >
                            {/* Subject */}
                            <h4 className="font-medium text-foreground text-sm mb-2 line-clamp-2">
                              {request.subject}
                            </h4>

                            {/* Equipment */}
                            <p className="text-xs text-muted-foreground mb-3">
                              {request.equipmentName || 'Unknown Equipment'}
                            </p>

                            {/* Type badge */}
                            <div className="mb-3">
                              <span
                                className={cn(
                                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                  request.requestType === 'corrective'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-blue-100 text-blue-700'
                                )}
                              >
                                {request.requestType === 'corrective' ? 'Corrective' : 'Preventive'}
                              </span>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-border">
                              {request.technicianName ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                      {request.technicianName.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                                    {request.technicianName}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Unassigned</span>
                              )}

                              {request.scheduledDate && (
                                <div
                                  className={cn(
                                    'flex items-center gap-1 text-xs',
                                    isOverdue(request.scheduledDate) &&
                                      request.status !== 'repaired' &&
                                      request.status !== 'scrap'
                                      ? 'text-red-600'
                                      : 'text-muted-foreground'
                                  )}
                                >
                                  {isOverdue(request.scheduledDate) &&
                                    request.status !== 'repaired' &&
                                    request.status !== 'scrap' ? (
                                    <Clock className="w-3 h-3" />
                                  ) : (
                                    <Calendar className="w-3 h-3" />
                                  )}
                                  {new Date(request.scheduledDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Scrap Confirmation Dialog */}
      <AlertDialog open={scrapConfirm.open} onOpenChange={(open) => setScrapConfirm({ open, requestId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Scrap
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this request as scrapped? This typically means the
              equipment cannot be repaired and will be decommissioned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmScrap}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Scrap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
