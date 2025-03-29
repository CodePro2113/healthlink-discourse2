
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import { 
  getConnectionRequests, 
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  toggleFollow,
  getSpecialties,
  getCities
} from '@/services/doctorNetworkService';
import { ConnectionRequest as ConnectionRequestType } from '@/types/doctor';
import NetworkFindTab from '@/components/networking/tabs/NetworkFindTab';
import NetworkConnectionsTab from '@/components/networking/tabs/NetworkConnectionsTab';
import NetworkRequestsTab from '@/components/networking/tabs/NetworkRequestsTab';
import ConnectionDialog from '@/components/networking/ConnectionDialog';

const Network = () => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestType[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('find');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load initial data
    setConnectionRequests(getConnectionRequests());
    setSpecialties(getSpecialties());
    setCities(getCities());
  }, []);
  
  const handleConnect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsConnectDialogOpen(true);
  };
  
  const handleSendConnectionRequest = async () => {
    if (!selectedDoctorId) return;
    
    setIsSubmitting(true);
    try {
      await sendConnectionRequest(selectedDoctorId, connectionMessage);
      
      toast({
        title: "Connection request sent",
        description: "They will be notified of your request",
      });
      
      setIsConnectDialogOpen(false);
      setConnectionMessage('');
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptConnectionRequest(requestId);
      
      // Update the UI
      setConnectionRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );
      
      toast({
        title: "Connection accepted",
        description: "You are now connected",
      });
    } catch (error) {
      toast({
        title: "Failed to accept request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectConnectionRequest(requestId);
      
      // Update the UI
      setConnectionRequests(prev => 
        prev.filter(req => req.id !== requestId)
      );
      
      toast({
        title: "Connection declined",
        description: "The request has been declined",
      });
    } catch (error) {
      toast({
        title: "Failed to decline request",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleFollowToggle = async (doctorId: string, isFollowing: boolean) => {
    try {
      await toggleFollow(doctorId, isFollowing);
      
      // Update the UI
      toast({
        title: isFollowing ? "Following" : "Unfollowed",
        description: isFollowing 
          ? "You will now see their updates in your feed" 
          : "You will no longer see their updates in your feed",
      });
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  const handleMessageDoctor = (doctorId: string) => {
    // In a real app, this would open a chat or redirect to messaging
    toast({
      title: "Messaging coming soon",
      description: "This feature is under development",
    });
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Doctor Network</h1>
          <Button onClick={() => navigate('/profile')} variant="outline">
            <UserCheck size={16} className="mr-2" />
            My Profile
          </Button>
        </div>
        
        <Tabs defaultValue="find" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="find">
              <Search size={16} className="mr-2" />
              Find Doctors
            </TabsTrigger>
            <TabsTrigger value="connections" className="relative">
              <Users size={16} className="mr-2" />
              My Network
            </TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              <UserPlus size={16} className="mr-2" />
              Requests
              {connectionRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {connectionRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find" className="mt-6">
            <NetworkFindTab 
              onConnect={handleConnect}
              onFollowToggle={handleFollowToggle}
              onMessage={handleMessageDoctor}
              specialties={specialties}
              cities={cities}
            />
          </TabsContent>
          
          <TabsContent value="connections" className="mt-6">
            <NetworkConnectionsTab 
              onConnect={handleConnect}
              onFollowToggle={handleFollowToggle}
              onMessage={handleMessageDoctor}
              onTabChange={setActiveTab}
            />
          </TabsContent>
          
          <TabsContent value="requests" className="mt-6">
            <NetworkRequestsTab 
              onConnect={handleConnect}
              onFollowToggle={handleFollowToggle}
              onTabChange={setActiveTab}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              connectionRequests={connectionRequests}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Connection Request Dialog */}
      <ConnectionDialog 
        isOpen={isConnectDialogOpen}
        onOpenChange={setIsConnectDialogOpen}
        connectionMessage={connectionMessage}
        setConnectionMessage={setConnectionMessage}
        onSendRequest={handleSendConnectionRequest}
        isSubmitting={isSubmitting}
      />
    </MainLayout>
  );
};

export default Network;
