
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  MoreHorizontal,
  Briefcase,
  MapPin,
  GraduationCap
} from "lucide-react";
import { DoctorProfile, ConnectionStatus } from "@/types/doctor";

interface DoctorCardProps {
  doctor: DoctorProfile;
  connectionStatus: ConnectionStatus;
  onConnect: (doctorId: string) => void;
  onFollowToggle: (doctorId: string, isFollowing: boolean) => void;
  onMessage?: (doctorId: string) => void;
  compact?: boolean;
}

const DoctorCard = ({ 
  doctor, 
  connectionStatus, 
  onConnect, 
  onFollowToggle,
  onMessage,
  compact = false 
}: DoctorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate(`/doctors/${doctor.id}`);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const renderConnectionButton = () => {
    switch(connectionStatus.status) {
      case 'connected':
        return (
          <Button variant="outline" className="text-green-600 border-green-600/30 bg-green-50 hover:bg-green-100">
            <UserCheck size={16} className="mr-1" />
            Connected
          </Button>
        );
      case 'pending':
        return (
          <Button variant="outline" disabled={!connectionStatus.isPendingReceived} className="text-orange-600">
            <Clock size={16} className="mr-1" />
            {connectionStatus.isPendingReceived ? 'Respond' : 'Pending'}
          </Button>
        );
      case 'following':
        return (
          <Button variant="outline" onClick={() => onFollowToggle(doctor.id, false)}>
            Following
          </Button>
        );
      case 'none':
      default:
        return (
          <Button variant="default" onClick={() => onConnect(doctor.id)}>
            <UserPlus size={16} className="mr-1" />
            Connect
          </Button>
        );
    }
  };
  
  if (compact) {
    return (
      <Card 
        className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
        onClick={handleProfileClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={doctor.avatar} alt={doctor.name} />
              <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{doctor.name}</h4>
              <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => {
              e.stopPropagation();
              onConnect(doctor.id);
            }}>
              {connectionStatus.status === 'connected' ? 
                <UserCheck size={16} className="text-green-600" /> : 
                <UserPlus size={16} />
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="h-20 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="px-4 pb-4 relative">
          <Avatar className="h-16 w-16 border-4 border-background absolute -top-8">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
          </Avatar>
          
          <div className="pt-10">
            <div className="flex justify-between items-start">
              <div className="cursor-pointer" onClick={handleProfileClick}>
                <h3 className="font-semibold hover:text-primary">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              </div>
              <div className="flex items-center gap-1">
                {isHovered && (
                  <>
                    {onMessage && connectionStatus.status === 'connected' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onMessage(doctor.id)}
                      >
                        <MessageSquare size={16} />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 my-2">
              {doctor.interests.slice(0, 3).map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{interest}</Badge>
              ))}
              {doctor.interests.length > 3 && (
                <Badge variant="outline" className="text-xs">+{doctor.interests.length - 3}</Badge>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1 mb-3">
              {doctor.hospital && (
                <div className="flex items-center gap-1">
                  <Briefcase size={12} />
                  <span>{doctor.hospital}</span>
                </div>
              )}
              {(doctor.city || doctor.country) && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{[doctor.city, doctor.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <GraduationCap size={12} />
                <span>{doctor.experience} years experience</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{doctor.connections}</span> connections
              </div>
              {renderConnectionButton()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
