import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Wrench, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/UserAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { teams, maintenanceRequests } from '@/data/mockData';

export default function TeamDetail() {
  const { id } = useParams();
  const team = teams.find((t) => t.id === id);

  if (!team) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    );
  }

  const teamRequests = maintenanceRequests.filter((r) => r.maintenanceTeam?.id === team.id);
  const activeRequests = teamRequests.filter(
    (r) => r.status !== 'repaired' && r.status !== 'scrap'
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/teams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{team.name}</h1>
              <p className="text-muted-foreground">{team.category}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Team
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <div className="lg:col-span-2">
          <div className="card-enterprise p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
              <Button variant="outline" size="sm">
                Add Member
              </Button>
            </div>
            <div className="space-y-3">
              {team.members.map((member) => {
                const memberRequests = activeRequests.filter(
                  (r) => r.assignedTechnician?.id === member.id
                );

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar user={member} size="lg" />
                      <div>
                        <p className="font-medium text-foreground">{member.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {memberRequests.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                          <Wrench className="w-3 h-3" />
                          {memberRequests.length} tasks
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {member.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Info */}
          <div className="card-enterprise p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
            <p className="text-muted-foreground text-sm">{team.description}</p>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Members</span>
                <span className="font-medium text-foreground">{team.members.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Active Requests</span>
                <span className="font-medium text-foreground">{activeRequests.length}</span>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="card-enterprise p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Requests</h3>
            {activeRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No active requests
              </p>
            ) : (
              <div className="space-y-3">
                {activeRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground truncate">
                      {request.subject}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {request.equipment.name}
                      </span>
                      <StatusBadge status={request.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
