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
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useEquipmentList } from '@/api/hooks/useEquipment';
import { useTeamsList } from '@/api/hooks/useTeams';
import { useCreateRequest } from '@/api/hooks/useMaintenance';

interface CreateRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRequestDialog({ open, onOpenChange }: CreateRequestDialogProps) {
  const { toast } = useToast();

  // Fetch equipment and teams from API
  const { data: equipmentData } = useEquipmentList();
  const { data: teamsData } = useTeamsList();
  const createRequestMutation = useCreateRequest();

  const equipment = equipmentData?.equipment || [];
  const teams = teamsData?.teams || [];

  // Mock Work Centers (not in database yet)
  const workCenters = [
    { id: '1', name: 'Assembly Line A', department: 'Production', location: 'Building A' },
    { id: '2', name: 'Packaging Zone', department: 'Warehouse', location: 'Warehouse B' },
  ];

  const [formData, setFormData] = useState({
    subject: '',
    maintenanceFor: 'equipment' as 'equipment' | 'workCenter',
    type: 'corrective' as 'corrective' | 'preventive',
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
      const selectedEquipment = equipment.find((e: any) => e.id === parseInt(formData.equipmentId));
      if (selectedEquipment?.maintenanceTeamId) {
        setFormData((prev) => ({
          ...prev,
          teamId: selectedEquipment.maintenanceTeamId.toString(),
          technicianId: selectedEquipment.defaultTechnicianId?.toString() || '',
        }));
      }
    }
  }, [formData.equipmentId, formData.maintenanceFor, equipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only submit equipment-based requests for now (work centers not in backend yet)
    if (formData.maintenanceFor === 'workCenter') {
      toast({
        title: 'Not Supported',
        description: 'Work Center maintenance is not yet implemented in the backend',
        variant: 'destructive',
      });
      return;
    }

    const requestData = {
      subject: formData.subject,
      description: formData.description || undefined,
      requestType: formData.type,
      equipmentId: parseInt(formData.equipmentId),
      maintenanceTeamId: parseInt(formData.teamId),
      assignedTechnicianId: formData.technicianId ? parseInt(formData.technicianId) : undefined,
      scheduledDate: formData.scheduledDate || undefined,
    };

    try {
      await createRequestMutation.mutateAsync(requestData as any);

      toast({
        title: 'Success!',
        description: 'Maintenance request created successfully',
      });

      // Reset form
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

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create request',
        variant: 'destructive',
      });
    }
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
                      .filter((e: any) => !e.isScrapped)
                      .map((eq: any) => (
                        <SelectItem key={eq.id} value={eq.id.toString()}>
                          {eq.name} ({eq.serialNumber})
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
              onValueChange={(v) => setFormData({ ...formData, type: v as 'corrective' | 'preventive' })}
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
                {teams.map((team: any) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-1.5">
            <Label htmlFor="technician">Technician (Optional)</Label>
            <Input
              id="technician"
              type="number"
              value={formData.technicianId}
              onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
              placeholder="Enter technician ID (3, 4, 5, or 6)"
            />
            <p className="text-xs text-muted-foreground">
              3=John, 4=Alice, 5=Emma, 6=Lisa
            </p>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createRequestMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.subject ||
                (!formData.equipmentId && !formData.workCenterId) ||
                (formData.maintenanceFor === 'equipment' && !formData.teamId) ||
                createRequestMutation.isPending
              }
            >
              {createRequestMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
