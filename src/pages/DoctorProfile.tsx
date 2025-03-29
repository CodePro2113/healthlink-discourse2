
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainLayout from '@/components/layout/MainLayout';
import DoctorProfileHeader from '@/components/doctor/DoctorProfileHeader';
import DoctorAbout from '@/components/doctor/DoctorAbout';
import DoctorTabs from '@/components/doctor/DoctorTabs';
import ConnectionDialog from '@/components/networking/ConnectionDialog';
import { 
  getDoctorById, 
  getConnectionStatus, 
  sendConnectionRequest,
  toggleFollow,
  getRecommendedDoctors
} from '@/services/doctorNetworkService';

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>({ status: 'none' });
  const [similarDoctors, setSimilarDoctors] = useState<any[]>([]);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      // Load doctor data
      const doctorData = getDoctorById(id);
      if (doctorData) {
        setDoctor(doctorData);
        setConnectionStatus(getConnectionStatus(id));
        
        // Get similar doctors (same specialty)
        setSimilarDoctors(getRecommendedDoctors(doctorData.specialty, 3));
      }
    }
  }, [id]);
  
  if (!doctor) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8 text-center">
          <p>Loading doctor profile...</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleConnect = () => {
    setIsConnectDialogOpen(true);
  };
  
  const handleSendConnectionRequest = async () => {
    setIsSubmitting(true);
    try {
      await sendConnectionRequest(id!, connectionMessage);
      setConnectionStatus({ status: 'pending', isPendingReceived: false });
      
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
  
  const handleFollowToggle = async (isFollowing: boolean) => {
    try {
      await toggleFollow(doctor.id, isFollowing);
      setConnectionStatus(prev => ({ 
        ...prev, 
        status: isFollowing ? 'following' : 'none' 
      }));
      
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
  
  const handleConnectToast = (doctorId: string) => {
    toast({
      title: "Feature under development",
      description: "This functionality will be available soon."
    });
  };
  
  const handleFollowToggleToast = (doctorId: string, isFollowing: boolean) => {
    toast({
      title: "Feature under development",
      description: "This functionality will be available soon."
    });
  };
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/network">
              <ArrowLeft size={16} className="mr-1" />
              Back to Network
            </Link>
          </Button>
        </div>
        
        <Card className="overflow-hidden glass-card">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/30"></div>
          
          <CardContent className="p-0">
            <DoctorProfileHeader 
              doctor={doctor}
              connectionStatus={connectionStatus}
              onConnect={handleConnect}
              onFollowToggle={handleFollowToggle}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DoctorAbout 
              doctor={doctor}
              similarDoctors={similarDoctors}
              getConnectionStatus={getConnectionStatus}
              onConnect={handleConnectToast}
              onFollowToggle={handleFollowToggleToast}
            />
          </div>
          
          <div className="md:col-span-2">
            <DoctorTabs doctor={doctor} />
          </div>
        </div>
      </div>
      
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

export default DoctorProfile;
