
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Clock
} from "lucide-react";
import { DoctorProfile as DoctorProfileType } from "@/types/doctor";
import { ConnectionStatus } from "@/types/doctor";

interface DoctorProfileHeaderProps {
  doctor: DoctorProfileType;
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onFollowToggle: (isFollowing: boolean) => void;
}

const DoctorProfileHeader = ({
  doctor,
  connectionStatus,
  onConnect,
  onFollowToggle
}: DoctorProfileHeaderProps) => {
  
  const renderConnectionButton = () => {
    switch(connectionStatus.status) {
      case 'connected':
        return (
          <Button variant="outline" className="text-green-600 border-green-600/30 bg-green-50 hover:bg-green-100">
            <UserPlus size={16} className="mr-1" />
            Connected
          </Button>
        );
      case 'pending':
        return (
          <Button variant="outline" disabled={!connectionStatus.isPendingReceived}>
            <Clock size={16} className="mr-1" />
            {connectionStatus.isPendingReceived ? 'Respond' : 'Pending'}
          </Button>
        );
      case 'following':
        return (
          <Button variant="outline" onClick={() => onFollowToggle(false)}>
            Following
          </Button>
        );
      case 'none':
      default:
        return (
          <Button variant="default" onClick={onConnect}>
            <UserPlus size={16} className="mr-1" />
            Connect
          </Button>
        );
    }
  };

  return (
    <div className="relative px-6 pb-6">
      <Avatar className="absolute -top-16 border-4 border-background w-32 h-32">
        <AvatarImage src={doctor.avatar} alt={doctor.name} />
        <AvatarFallback>
          {doctor.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="ml-36 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            <Badge className="bg-primary text-primary-foreground">Verified</Badge>
          </div>
          <p className="text-muted-foreground">{doctor.specialty} | MBBS, MD</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
            {doctor.city && doctor.country && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{`${doctor.city}, ${doctor.country}`}</span>
              </div>
            )}
            {doctor.hospital && (
              <div className="flex items-center gap-1">
                <Briefcase size={14} />
                <span>{doctor.hospital}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <GraduationCap size={14} />
              <span>{doctor.experience} years experience</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {renderConnectionButton()}
          
          {connectionStatus.status === 'connected' && (
            <Button variant="outline">
              <MessageSquare size={16} className="mr-1" />
              Message
            </Button>
          )}
          
          {connectionStatus.status !== 'following' && connectionStatus.status !== 'connected' && connectionStatus.status !== 'pending' && (
            <Button 
              variant="outline" 
              onClick={() => onFollowToggle(true)}
            >
              <Star size={16} className="mr-1" />
              Follow
            </Button>
          )}
          
          <Button variant="outline" size="icon">
            <Share2 size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileHeader;
