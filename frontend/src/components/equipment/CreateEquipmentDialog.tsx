import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { users, teams } from '@/data/mockData';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateEquipmentDialogProps {
  onEquipmentCreated?: () => void;
}

const departments = ['Manufacturing', 'IT', 'Facilities', 'Engineering', 'Warehouse'];
const categories = ['Machinery', 'Computers', 'HVAC', 'Vehicles', 'Tools', 'Electronics'];
const locations = ['Building A - Floor 1', 'Building A - Floor 2', 'Building B', 'Warehouse', 'Server Room'];

export function CreateEquipmentDialog({ onEquipmentCreated }: CreateEquipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    department: '',
    category: '',
    location: '',
    assignedEmployee: '',
    maintenanceTeam: '',
    purchaseDate: '',
    warrantyExpiry: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.serialNumber || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate creating equipment
    toast.success(`Equipment "${formData.name}" created successfully`);
    setOpen(false);
    setFormData({
      name: '',
      serialNumber: '',
      department: '',
      category: '',
      location: '',
      assignedEmployee: '',
      maintenanceTeam: '',
      purchaseDate: '',
      warrantyExpiry: '',
      notes: '',
    });
    onEquipmentCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Equipment Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., CNC Machine Pro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">
                Serial Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="serialNumber"
                placeholder="e.g., SN-2024-001"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceTeam">Maintenance Team</Label>
              <Select
                value={formData.maintenanceTeam}
                onValueChange={(value) => setFormData({ ...formData, maintenanceTeam: value })}
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignedEmployee">Assigned Employee</Label>
              <Select
                value={formData.assignedEmployee}
                onValueChange={(value) => setFormData({ ...formData, assignedEmployee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
              {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this equipment..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Equipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
