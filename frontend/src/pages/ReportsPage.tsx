import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { dashboardStats, maintenanceRequests, equipment, teams } from '@/data/mockData';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  // Mock data for charts
  const requestsOverTime = [
    { month: 'Aug', corrective: 12, preventive: 8 },
    { month: 'Sep', corrective: 15, preventive: 10 },
    { month: 'Oct', corrective: 8, preventive: 12 },
    { month: 'Nov', corrective: 10, preventive: 14 },
    { month: 'Dec', corrective: 6, preventive: 16 },
    { month: 'Jan', corrective: 5, preventive: 11 },
  ];

  const equipmentByCategory = equipment.reduce((acc, eq) => {
    const existing = acc.find((item) => item.category === eq.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: eq.category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);

  const requestsByType = [
    { type: 'Corrective', count: maintenanceRequests.filter((r) => r.type === 'corrective').length },
    { type: 'Preventive', count: maintenanceRequests.filter((r) => r.type === 'preventive').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your maintenance operations</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-enterprise p-5">
          <p className="text-sm text-muted-foreground">Total Requests (YTD)</p>
          <p className="text-3xl font-bold text-foreground mt-1">{maintenanceRequests.length}</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
          <p className="text-3xl font-bold text-foreground mt-1">4.2h</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-sm text-muted-foreground">Equipment Uptime</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">94.5%</p>
        </div>
        <div className="card-enterprise p-5">
          <p className="text-sm text-muted-foreground">Cost Savings</p>
          <p className="text-3xl font-bold text-primary mt-1">$24,500</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Over Time */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="corrective"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                  name="Corrective"
                />
                <Line
                  type="monotone"
                  dataKey="preventive"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                  name="Preventive"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Team */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Team</h3>
          <div className="h-72">
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment by Category */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Equipment by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={equipmentByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="category"
                  label={({ category, count }) => `${category}: ${count}`}
                >
                  {equipmentByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  innerRadius={50}
                  outerRadius={80}
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

        {/* Requests by Type */}
        <div className="card-enterprise p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Requests by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill="#ef4444" />
                  <Cell fill="#2563eb" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
