
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DoctorCard from '@/components/networking/DoctorCard';
import { DoctorProfile } from '@/types/doctor';
import { getDoctors, getConnectionStatus } from '@/services/doctorNetworkService';

interface NetworkConnectionsTabProps {
  onConnect: (doctorId: string) => void;
  onFollowToggle: (doctorId: string, isFollowing: boolean) => void;
  onMessage: (doctorId: string) => void;
  onTabChange: (tab: string) => void;
}

const NetworkConnectionsTab = ({
  onConnect,
  onFollowToggle,
  onMessage,
  onTabChange
}: NetworkConnectionsTabProps) => {
  const doctors = getDoctors();
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Manage your professional connections and collaborations</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors
                .filter(doctor => getConnectionStatus(doctor.id).status === 'connected')
                .map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    connectionStatus={getConnectionStatus(doctor.id)}
                    onConnect={onConnect}
                    onFollowToggle={onFollowToggle}
                    onMessage={onMessage}
                    compact
                  />
                ))}
            </div>
            
            {doctors.filter(doctor => getConnectionStatus(doctor.id).status === 'connected').length === 0 && (
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">You haven't connected with any doctors yet</p>
                <Button onClick={() => onTabChange('find')}>
                  <Search size={16} className="mr-2" />
                  Find Doctors to Connect
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Doctors I Follow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">Doctors whose updates appear in your feed</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors
                .filter(doctor => getConnectionStatus(doctor.id).status === 'following')
                .map(doctor => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    connectionStatus={getConnectionStatus(doctor.id)}
                    onConnect={onConnect}
                    onFollowToggle={onFollowToggle}
                    compact
                  />
                ))}
            </div>
            
            {doctors.filter(doctor => getConnectionStatus(doctor.id).status === 'following').length === 0 && (
              <div className="text-center p-6">
                <p className="text-muted-foreground">You're not following any doctors yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkConnectionsTab;
