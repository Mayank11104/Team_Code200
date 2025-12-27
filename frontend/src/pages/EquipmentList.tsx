import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Cog, MapPin, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CreateEquipmentDialog } from '@/components/equipment/CreateEquipmentDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserAvatar } from '@/components/common/UserAvatar';
import { cn } from '@/lib/utils';
import { useEquipmentList } from '@/api/hooks/useEquipment';

export default function EquipmentList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [groupBy, setGroupBy] = useState<'none' | 'department' | 'employee'>('none');

  // Fetch equipment from API
  const { data, isLoading, error } = useEquipmentList();

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
        <p className="text-red-600">Error loading equipment: {error.message}</p>
      </div>
    );
  }

  const equipment = data?.equipment || [];

  // Extract unique departments from equipment
  const departments = [...new Set(equipment.map((e: any) => e.department).filter(Boolean))];

  const filteredEquipment = equipment.filter((eq: any) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || eq.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const groupedEquipment = () => {
    if (groupBy === 'none') return { 'All Equipment': filteredEquipment };
    if (groupBy === 'department') {
      return filteredEquipment.reduce((acc: any, eq: any) => {
        const key = eq.department || 'Unassigned';
        if (!acc[key]) acc[key] = [];
        acc[key].push(eq);
        return acc;
      }, {});
    }
    if (groupBy === 'employee') {
      return filteredEquipment.reduce((acc: any, eq: any) => {
        const key = eq.technicianName || 'Unassigned';
        if (!acc[key]) acc[key] = [];
        acc[key].push(eq);
        return acc;
      }, {});
    }
    return { 'All Equipment': filteredEquipment };
  };

  const groups = groupedEquipment();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Equipment</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your equipment assets ({equipment.length} total)
          </p>
        </div>
        <CreateEquipmentDialog />
      </div>

      {/* Filters */}
      <div className="card-enterprise p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept: string) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as typeof groupBy)}>
            <SelectTrigger className="w-full sm:w-48">
              <Users className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="department">By Department</SelectItem>
              <SelectItem value="employee">By Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {Object.entries(groups).map(([groupName, items]: [string, any]) => (
        <div key={groupName} className="card-enterprise overflow-hidden">
          {groupBy !== 'none' && (
            <div className="px-6 py-3 bg-muted/50 border-b border-border">
              <h3 className="font-medium text-foreground">{groupName} ({items.length})</h3>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No equipment found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((eq: any) => {
                  const warrantyDate = eq.warrantyExpiry ? new Date(eq.warrantyExpiry) : null;
                  const isWarrantyExpired = warrantyDate && warrantyDate < new Date();
                  const isWarrantySoon =
                    warrantyDate &&
                    !isWarrantyExpired &&
                    warrantyDate < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

                  return (
                    <TableRow
                      key={eq.id}
                      className={cn(
                        'cursor-pointer hover:bg-muted/50 transition-colors',
                        eq.isScrapped && 'opacity-60'
                      )}
                    >
                      <TableCell>
                        <Link to={`/equipment/${eq.id}`} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Cog className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium text-foreground hover:text-primary transition-colors">
                            {eq.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {eq.serialNumber}
                      </TableCell>
                      <TableCell>{eq.department || '-'}</TableCell>
                      <TableCell>
                        {eq.technicianName ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {eq.technicianName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm">{eq.technicianName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{eq.teamName || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {eq.location || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {warrantyDate ? (
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-sm',
                              isWarrantyExpired
                                ? 'text-red-600'
                                : isWarrantySoon
                                  ? 'text-amber-600'
                                  : 'text-muted-foreground'
                            )}
                          >
                            {isWarrantyExpired && <AlertTriangle className="w-3 h-3" />}
                            {warrantyDate.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            eq.isScrapped
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          )}
                        >
                          {eq.isScrapped ? 'Scrapped' : 'Operational'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
