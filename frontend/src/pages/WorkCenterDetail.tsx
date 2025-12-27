import { useParams, useNavigate } from 'react-router-dom';
import { workCenters } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Factory, MapPin, Users, Activity } from 'lucide-react';
import { RequestList } from '@/components/maintenance/RequestList';
import { maintenanceRequests } from '@/data/mockData';

export default function WorkCenterDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const center = workCenters.find((c) => c.id === id);
    const centerRequests = maintenanceRequests.filter((r) => r.workCenter?.id === id);

    if (!center) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <h2 className="text-2xl font-bold">Work Center Not Found</h2>
                <Button onClick={() => navigate('/work')}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/work')}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight">{center.name}</h1>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${center.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                                center.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                            {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Center
                </Button>
                <Button className="gap-2">
                    <Activity className="w-4 h-4" />
                    Request Maintenance
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-enterprise p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Location</span>
                            </div>
                            <p className="font-semibold">{center.location}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Factory className="w-4 h-4" />
                                <span className="text-sm font-medium">Department</span>
                            </div>
                            <p className="font-semibold">{center.department}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Team</span>
                            </div>
                            <p className="font-semibold">{center.maintenanceTeam.name}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Activity className="w-4 h-4" />
                                <span className="text-sm font-medium">Capacity</span>
                            </div>
                            <p className="font-semibold">{center.capacity} Units/Hr</p>
                        </div>
                    </div>

                    <Tabs defaultValue="requests" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                            <TabsTrigger
                                value="requests"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                            >
                                Maintenance Requests
                            </TabsTrigger>
                            <TabsTrigger
                                value="schedule"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                            >
                                Schedule
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                            >
                                History
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="requests" className="mt-6">
                            <RequestList requests={centerRequests} />
                        </TabsContent>
                        <TabsContent value="schedule" className="mt-6">
                            <div className="card-enterprise p-12 text-center text-muted-foreground">
                                Schedule view coming soon
                            </div>
                        </TabsContent>
                        <TabsContent value="history" className="mt-6">
                            <div className="card-enterprise p-12 text-center text-muted-foreground">
                                History view coming soon
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <div className="card-enterprise p-6 space-y-4">
                        <h3 className="font-semibold text-lg">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Utilization</span>
                                <span className="font-medium">88%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }} />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm text-muted-foreground">Efficiency</span>
                                <span className="font-medium">92%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                            </div>
                        </div>
                    </div>

                    <div className="card-enterprise p-6">
                        <h3 className="font-semibold text-lg mb-4">Maintenance Team</h3>
                        <div className="flex items-center gap-3 mb-4">
                            {/* Ideally UserAvatars here */}
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {center.maintenanceTeam.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">{center.maintenanceTeam.name}</p>
                                <p className="text-xs text-muted-foreground">Primary Support</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full">Contact Team</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
