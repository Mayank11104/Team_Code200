import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Wrench, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/UserAvatar';
import { teams, maintenanceRequests } from '@/data/mockData';

export default function TeamsPage() {
  const getTeamRequestsCount = (teamId: string) => {
    return maintenanceRequests.filter(
      (r) => r.maintenanceTeam?.id === teamId && r.status !== 'repaired' && r.status !== 'scrap'
    ).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance Teams</h1>
          <p className="text-muted-foreground mt-1">Manage your maintenance workforce</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const activeRequests = getTeamRequestsCount(team.id);

          return (
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
                    <p className="text-sm text-muted-foreground">{team.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">{team.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{team.members.length} members</span>
                </div>
                {activeRequests > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-600">{activeRequests} active</span>
                  </div>
                )}
              </div>

              {/* Members Preview */}
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {team.members.slice(0, 4).map((member) => (
                    <UserAvatar key={member.id} user={member} size="sm" />
                  ))}
                </div>
                {team.members.length > 4 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    +{team.members.length - 4} more
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
