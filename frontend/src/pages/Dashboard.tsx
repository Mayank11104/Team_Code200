import { Cog, Wrench, CheckCircle, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { dashboardStats, maintenanceRequests, equipment } from '@/data/mockData';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444'];

export default function Dashboard() {
  const recentRequests = maintenanceRequests.slice(0, 5);
  const recentEquipment = equipment.filter(e => !e.isScrapped).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Equipment */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm border-red-200 bg-red-50/50">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h3 className="text-lg font-medium text-red-900">Critical Equipment</h3>
            <div className="text-3xl font-bold text-red-700">5 Units</div>
            <p className="text-sm font-medium text-red-800/80">(Health &lt; 30%)</p>
          </div>
        </div>

        {/* Technician Load */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm border-blue-200 bg-blue-50/50">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h3 className="text-lg font-medium text-blue-900">Technician Load</h3>
            <div className="text-3xl font-bold text-blue-700">85% Utilized</div>
            <p className="text-sm font-medium text-blue-800/80">(Assign Carefully)</p>
          </div>
        </div>

        {/* Open Requests */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm border-emerald-200 bg-emerald-50/50">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h3 className="text-lg font-medium text-emerald-900">Open Requests</h3>
            <div className="flex flex-col gap-1 items-center">
              <div className="text-2xl font-bold text-emerald-700">
                {dashboardStats.activeRequests} Pending
              </div>
              <div className="text-lg font-semibold text-emerald-800/80">
                {dashboardStats.overdueRequests} Overdue
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="card-enterprise p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Requests</h3>
            <Link to="/requests" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={request.assignedTechnician} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{request.subject}</p>
                    <p className="text-xs text-muted-foreground">{request.equipment.name}</p>
                  </div>
                </div>
                <StatusBadge status={request.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="card-enterprise p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Equipment Overview</h3>
            <Link to="/equipment" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentEquipment.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cog className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {eq.openRequestsCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Clock className="w-3 h-3" />
                      {eq.openRequestsCount}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${eq.isScrapped
                        ? 'bg-red-100 text-red-800'
                        : eq.openRequestsCount > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                  >
                    {eq.isScrapped ? 'Scrapped' : eq.openRequestsCount > 0 ? 'Maintenance' : 'Operational'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
