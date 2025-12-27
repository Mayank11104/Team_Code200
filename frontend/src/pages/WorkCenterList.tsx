import { useState } from 'react';
import { WorkCenter } from '@/types';
import { workCenters } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Factory, Activity, AlertTriangle, Users } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function WorkCenterList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [centers] = useState<WorkCenter[]>(workCenters);

    const filteredCenters = centers.filter((center) => {
        const matchesSearch =
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || center.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: centers.length,
        active: centers.filter((c) => c.status === 'active').length,
        maintenance: centers.filter((c) => c.status === 'maintenance').length,
        utilization: '85%', // Mock metric
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card-enterprise p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Centers</p>
                        <h3 className="text-2xl font-bold">{stats.total}</h3>
                    </div>
                </div>
                <div className="card-enterprise p-4 flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Active</p>
                        <h3 className="text-2xl font-bold">{stats.active}</h3>
                    </div>
                </div>
                <div className="card-enterprise p-4 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">In Maintenance</p>
                        <h3 className="text-2xl font-bold">{stats.maintenance}</h3>
                    </div>
                </div>
                <div className="card-enterprise p-4 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Avg Utilization</p>
                        <h3 className="text-2xl font-bold">{stats.utilization}</h3>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search work centers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-card"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px] bg-card">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="default" className="gap-2">
                        <Factory className="w-4 h-4" />
                        Add Center
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                    <div
                        key={center.id}
                        className="card-enterprise group cursor-pointer hover:border-primary/50 transition-all p-0"
                        onClick={() => navigate(`/work/${center.id}`)}
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="p-2 bg-muted rounded-lg">
                                        <Factory className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{center.name}</h3>
                                        <p className="text-sm text-muted-foreground">{center.location}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${center.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                                    center.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                        'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                    {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Department</p>
                                    <p className="text-sm font-medium">{center.department}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Team</p>
                                    <p className="text-sm font-medium">{center.maintenanceTeam.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Capacity</p>
                                    <p className="text-sm font-medium">{center.capacity} Units</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-medium">Open Requests</p>
                                    <p className="text-sm font-medium">{center.openRequestsCount || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-muted/30 border-t flex justify-between items-center text-xs text-muted-foreground">
                            <span>Updated recently</span>
                            <span className="font-medium text-primary group-hover:underline">View Details →</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
