import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Equipment, MaintenanceTeam, User, MaintenanceRequest, RequestType } from '@/types';

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (request: MaintenanceRequest) => void;
  equipment: Equipment[];
  teams: MaintenanceTeam[];
  users: User[];
}

export function CreateRequestDialog({
  open,
  onOpenChange,
  onSubmit,
  equipment,
  teams,
  users,
}: CreateRequestDialogProps) {
  // Mock Work Centers (ideally passed as props)
  const workCenters: import('@/types').WorkCenter[] = [ // Minimal cast to avoid full mock in dialog
    { id: '1', name: 'Assembly Line A', department: 'Production', location: 'Building A' } as any,
    { id: '2', name: 'Packaging Zone', department: 'Warehouse', location: 'Warehouse B' } as any,
  ];

  const [formData, setFormData] = useState({
    subject: '',
    maintenanceFor: 'equipment' as 'equipment' | 'workCenter',
    type: 'corrective' as RequestType,
    equipmentId: '',
    workCenterId: '',
    technicianId: '',
    teamId: '',
    scheduledDate: '',
    duration: '2',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  // Auto-fill when equipment is selected
  useEffect(() => {
    if (formData.maintenanceFor === 'equipment' && formData.equipmentId) {
      const selectedEquipment = equipment.find((e) => e.id === formData.equipmentId);
      if (selectedEquipment) {
        setFormData((prev) => ({
          ...prev,
          teamId: selectedEquipment.maintenanceTeam?.id || '',
          technicianId: selectedEquipment.defaultTechnician?.id || '',
        }));
      }
    }
  }, [formData.equipmentId, formData.maintenanceFor, equipment]);

  const selectedTeam = teams.find((t) => t.id === formData.teamId)!; // Safe assertion if form logic is correct, but ideally checks needed
  const availableTechnicians = selectedTeam?.members || users.filter((u) => u.role === 'technician');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEquipment = formData.maintenanceFor === 'equipment' ? equipment.find((e) => e.id === formData.equipmentId) : undefined;
    const selectedWorkCenter = formData.maintenanceFor === 'workCenter' ? workCenters.find((w) => w.id === formData.workCenterId) : undefined;
    const selectedTechnician = users.find((u) => u.id === formData.technicianId);
    const selectedTeamData = teams.find((t) => t.id === formData.teamId)!;

    const newRequest: MaintenanceRequest = {
      id: `${Date.now()}`,
      subject: formData.subject,
      type: formData.type,
      equipment: selectedEquipment,
      workCenter: selectedWorkCenter,
      status: 'new',
      assignedTechnician: selectedTechnician,
      maintenanceTeam: selectedTeamData,
      scheduledDate: formData.scheduledDate || undefined,
      duration: formData.duration,
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0],
      priority: formData.priority,
      createdBy: users[0], // Mocking current user
    };

    onSubmit(newRequest);
    setFormData({
      subject: '',
      maintenanceFor: 'equipment',
      type: 'corrective',
      equipmentId: '',
      workCenterId: '',
      technicianId: '',
      teamId: '',
      scheduledDate: '',
      duration: '2',
      description: '',
      priority: 'medium',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-4">

          {/* Row 1: Subject (8) + Priority (4) */}
          <div className="col-span-12 md:col-span-8 space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Enter request subject"
              required
            />
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(v) => setFormData({ ...formData, priority: v as 'low' | 'medium' | 'high' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: Maintenance For (Radios) + Target Selection */}
          <div className="col-span-12 md:col-span-12 p-3 bg-muted/30 rounded-lg border grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 md:col-span-4 flex flex-col gap-2">
              <Label>Maintenance For</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input
                    type="radio"
                    name="maintenanceFor"
                    checked={formData.maintenanceFor === 'equipment'}
                    onChange={() => setFormData({ ...formData, maintenanceFor: 'equipment', workCenterId: '' })}
                    className="accent-primary"
                  />
                  Equipment
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input
                    type="radio"
                    name="maintenanceFor"
                    checked={formData.maintenanceFor === 'workCenter'}
                    onChange={() => setFormData({ ...formData, maintenanceFor: 'workCenter', equipmentId: '' })}
                    className="accent-primary"
                  />
                  Work Center
                </label>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8">
              {formData.maintenanceFor === 'equipment' ? (
                <Select
                  value={formData.equipmentId}
                  onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Equipment..." />
                  </SelectTrigger>
                  <SelectContent>
                    {equipment
                      .filter((e) => !e.isScrapped)
                      .map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={formData.workCenterId}
                  onValueChange={(v) => setFormData({ ...formData, workCenterId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Work Center..." />
                  </SelectTrigger>
                  <SelectContent>
                    {workCenters.map((wc) => (
                      <SelectItem key={wc.id} value={wc.id}>
                        {wc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Row 3: Type (4) + Date (4) + Duration (4) */}
          <div className="col-span-12 md:col-span-4 space-y-1.5">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as RequestType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrective">Corrective</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1.5">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            />
          </div>

          <div className="col-span-12 md:col-span-4 space-y-1.5">
            <Label htmlFor="duration">Duration (hrs)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          {/* Row 4: Team (6) + Technician (6) */}
          <div className="col-span-12 md:col-span-6 space-y-1.5">
            <Label htmlFor="team">Maintenance Team</Label>
            <Select
              value={formData.teamId}
              onValueChange={(v) => setFormData({ ...formData, teamId: v, technicianId: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1.5">
            <Label htmlFor="technician">Technician</Label>
            <Select
              value={formData.technicianId}
              onValueChange={(v) => setFormData({ ...formData, technicianId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Technician" />
              </SelectTrigger>
              <SelectContent>
                {availableTechnicians.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 5: Description */}
          <div className="col-span-12 space-y-1.5">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Details..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter className="col-span-12 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.subject || (!formData.equipmentId && !formData.workCenterId)}>
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
