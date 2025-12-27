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
  const recentEquipment = equipment.filter(e => e.status !== 'scrapped').slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your maintenance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Equipment"
          value={dashboardStats.totalEquipment}
          icon={Cog}
          variant="primary"
        />
        <StatCard
          title="Active Requests"
          value={dashboardStats.activeRequests}
          icon={Wrench}
          variant="warning"
        />
        <StatCard
          title="Completed This Month"
          value={dashboardStats.completedThisMonth}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Overdue Requests"
          value={dashboardStats.overdueRequests}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests by Status */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardStats.requestsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="status"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {dashboardStats.requestsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Team */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Team</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardStats.requestsByTeam} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" />
                <YAxis dataKey="team" type="category" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      eq.status === 'operational'
                        ? 'bg-emerald-100 text-emerald-800'
                        : eq.status === 'under-maintenance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {eq.status === 'operational' ? 'Operational' : eq.status === 'under-maintenance' ? 'Maintenance' : 'Scrapped'}
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
