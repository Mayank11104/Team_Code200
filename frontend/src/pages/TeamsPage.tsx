import { Link } from 'react-router-dom';
import { Plus, Users, Wrench, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTeamsList } from '@/api/hooks/useTeams';

export default function TeamsPage() {
  const { data, isLoading, error } = useTeamsList();

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
        <p className="text-red-600">Error loading teams: {error.message}</p>
      </div>
    );
  }

  const teams = data?.teams || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Teams</h1>
          <p className="text-muted-foreground mt-1">
            Manage your maintenance workforce ({teams.length} teams)
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team: any) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="card-enterprise p-6 hover:shadow-md transition-all group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{team.memberCount || 0} members</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {team.description || 'No description'}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{team.memberCount || 0} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>{team.equipmentCount || 0} equipment</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="card-enterprise p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
          <p className="text-muted-foreground mb-4">Create your first maintenance team to get started</p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Team
          </Button>
        </div>
      )}
    </div>
  );
}
