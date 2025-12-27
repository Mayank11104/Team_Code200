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
  const [formData, setFormData] = useState({
    subject: '',
    type: 'corrective' as RequestType,
    equipmentId: '',
    technicianId: '',
    teamId: '',
    scheduledDate: '',
    duration: '2',
    description: '',
  });

  // Auto-fill when equipment is selected
  useEffect(() => {
    if (formData.equipmentId) {
      const selectedEquipment = equipment.find((e) => e.id === formData.equipmentId);
      if (selectedEquipment) {
        setFormData((prev) => ({
          ...prev,
          teamId: selectedEquipment.maintenanceTeam?.id || '',
          technicianId: selectedEquipment.assignedEmployee?.id || '',
        }));
      }
    }
  }, [formData.equipmentId, equipment]);

  const selectedTeam = teams.find((t) => t.id === formData.teamId);
  const availableTechnicians = selectedTeam?.members || users.filter((u) => u.role === 'technician');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEquipment = equipment.find((e) => e.id === formData.equipmentId)!;
    const selectedTechnician = users.find((u) => u.id === formData.technicianId);
    const selectedTeamData = teams.find((t) => t.id === formData.teamId);

    const newRequest: MaintenanceRequest = {
      id: `${Date.now()}`,
      subject: formData.subject,
      type: formData.type,
      equipment: selectedEquipment,
      status: 'new',
      assignedTechnician: selectedTechnician,
      maintenanceTeam: selectedTeamData,
      scheduledDate: formData.scheduledDate || undefined,
      duration: parseInt(formData.duration),
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0],
      priority: 'medium',
    };

    onSubmit(newRequest);
    setFormData({
      subject: '',
      type: 'corrective',
      equipmentId: '',
      technicianId: '',
      teamId: '',
      scheduledDate: '',
      duration: '2',
      description: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Enter request subject"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Request Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as RequestType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">Corrective (Breakdown)</SelectItem>
                  <SelectItem value="preventive">Preventive (Routine)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment</Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(v) => setFormData({ ...formData, equipmentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment
                    .filter((e) => e.status !== 'scrapped')
                    .map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team">Maintenance Team</Label>
              <Select
                value={formData.teamId}
                onValueChange={(v) => setFormData({ ...formData, teamId: v, technicianId: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
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

            <div className="space-y-2">
              <Label htmlFor="technician">Assigned Technician</Label>
              <Select
                value={formData.technicianId}
                onValueChange={(v) => setFormData({ ...formData, technicianId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the maintenance work required..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.subject || !formData.equipmentId}>
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
