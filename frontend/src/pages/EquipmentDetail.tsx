import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cog, MapPin, Calendar, Shield, Users, Wrench, AlertTriangle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/common/UserAvatar';
import { equipment, maintenanceRequests } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function EquipmentDetail() {
  const { id } = useParams();
  const eq = equipment.find((e) => e.id === id);

  if (!eq) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Equipment not found</p>
      </div>
    );
  }

  const relatedRequests = maintenanceRequests.filter((r) => r.equipment.id === eq.id);
  const openRequests = relatedRequests.filter((r) => r.status !== 'repaired' && r.status !== 'scrap');
  const isWarrantyExpired = new Date(eq.warrantyExpiry) < new Date();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scrap Warning Banner */}
      {eq.isScrapped && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-red-800">This equipment has been scrapped</p>
            <p className="text-sm text-red-600">All maintenance actions are disabled</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/equipment">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Cog className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{eq.name}</h1>
              <p className="text-muted-foreground font-mono">{eq.serialNumber}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Smart Button - Maintenance */}
          <Link to={`/requests?equipment=${eq.id}`}>
            <button
              className={cn(
                'smart-button',
                eq.isScrapped && 'opacity-50 pointer-events-none'
              )}
              disabled={eq.isScrapped}
            >
              <Wrench className="w-4 h-4 text-primary" />
              <span className="font-medium">Maintenance</span>
              {openRequests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {openRequests.length}
                </span>
              )}
            </button>
          </Link>
          <Button variant="outline" className="gap-2" disabled={eq.isScrapped}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="card-enterprise p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Equipment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Equipment Name</label>
                <p className="font-medium text-foreground mt-1">{eq.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Serial Number</label>
                <p className="font-mono text-foreground mt-1">{eq.serialNumber}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Category</label>
                <p className="font-medium text-foreground mt-1">{eq.category}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Department</label>
                <p className="font-medium text-foreground mt-1">{eq.department}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">{eq.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p className="mt-1">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      eq.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : eq.status === 'under-maintenance'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                    )}
                  >
                    {eq.status === 'operational'
                      ? 'Operational'
                      : eq.status === 'under-maintenance'
                        ? 'Under Maintenance'
                        : 'Scrapped'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Maintenance Requests */}
          <div className="card-enterprise p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Maintenance History</h2>
              <span className="text-sm text-muted-foreground">
                {relatedRequests.length} total requests
              </span>
            </div>
            {relatedRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No maintenance requests</p>
            ) : (
              <div className="space-y-3">
                {relatedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          request.type === 'corrective' ? 'bg-red-500' : 'bg-blue-500'
                        )}
                      />
                      <div>
                        <p className="font-medium text-foreground">{request.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.type === 'corrective' ? 'Corrective' : 'Preventive'} •{' '}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Warranty Info */}
          <div className="card-enterprise p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Warranty & Purchase
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Purchase Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    {new Date(eq.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Warranty Expiry</label>
                <div className="flex items-center gap-2 mt-1">
                  {isWarrantyExpired && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  <p
                    className={cn(
                      'font-medium',
                      isWarrantyExpired ? 'text-red-600' : 'text-foreground'
                    )}
                  >
                    {new Date(eq.warrantyExpiry).toLocaleDateString()}
                    {isWarrantyExpired && ' (Expired)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Personnel */}
          <div className="card-enterprise p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Assigned Personnel
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Assigned Technician</label>
                <div className="mt-2">
                  {eq.defaultTechnician ? (
                    <UserAvatar user={eq.defaultTechnician} showName size="md" />
                  ) : (
                    <p className="text-muted-foreground">Not assigned</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Maintenance Team</label>
                <p className="font-medium text-foreground mt-1">
                  {eq.maintenanceTeam?.name || 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
