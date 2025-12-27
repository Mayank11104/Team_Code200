import { useState } from 'react';
import { Plus, List, LayoutGrid, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { RequestList } from '@/components/maintenance/RequestList';
import { CreateRequestDialog } from '@/components/maintenance/CreateRequestDialog';
import { cn } from '@/lib/utils';
import { useMaintenanceRequests } from '@/api/hooks/useMaintenance';

type ViewMode = 'kanban' | 'list';

export default function MaintenanceRequests() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch maintenance requests from API
  const { data, isLoading, error } = useMaintenanceRequests();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-enterprise p-6 text-center">
        <p className="text-red-600">Error loading requests: {error.message}</p>
      </div>
    );
  }

  const requests = data?.requests || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all maintenance work orders ({requests.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'kanban'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard requests={requests} />
      ) : (
        <RequestList requests={requests} />
      )}

      {/* Create Dialog */}
      <CreateRequestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}

