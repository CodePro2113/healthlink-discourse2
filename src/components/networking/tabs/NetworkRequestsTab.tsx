
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DoctorCard from '@/components/networking/DoctorCard';
import ConnectionRequest from '@/components/networking/ConnectionRequest';
import { getDoctors, getConnectionStatus, getConnectionRequests } from '@/services/doctorNetworkService';
import { ConnectionRequest as ConnectionRequestType } from '@/types/doctor';

interface NetworkRequestsTabProps {
  onConnect: (doctorId: string) => void;
  onFollowToggle: (doctorId: string, isFollowing: boolean) => void;
  onTabChange: (tab: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  connectionRequests: ConnectionRequestType[];
}

const NetworkRequestsTab = ({
  onConnect,
  onFollowToggle,
  onTabChange,
  onAcceptRequest,
  onRejectRequest,
  connectionRequests
}: NetworkRequestsTabProps) => {
  const doctors = getDoctors();
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Connection Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {connectionRequests.length > 0 ? (
            <div className="space-y-4">
              {connectionRequests.map(request => (
                <ConnectionRequest
                  key={request.id}
                  request={request}
                  onAccept={onAcceptRequest}
                  onReject={onRejectRequest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-6">
              <p className="text-muted-foreground mb-2">You have no pending connection requests</p>
              <Button variant="outline" onClick={() => onTabChange('find')}>
                <Search size={16} className="mr-2" />
                Find Doctors
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors
              .filter(doctor => {
                const status = getConnectionStatus(doctor.id);
                return status.status === 'pending' && !status.isPendingReceived;
              })
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
          
          {doctors.filter(doctor => {
            const status = getConnectionStatus(doctor.id);
            return status.status === 'pending' && !status.isPendingReceived;
          }).length === 0 && (
            <div className="text-center p-6">
              <p className="text-muted-foreground">You haven't sent any connection requests</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkRequestsTab;
