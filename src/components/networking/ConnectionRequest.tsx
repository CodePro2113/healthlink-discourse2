
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { formatTimeAgo } from "@/components/feed/comments/timeUtils";
import { ConnectionRequest as ConnectionRequestType } from "@/types/doctor";

interface ConnectionRequestProps {
  request: ConnectionRequestType;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const ConnectionRequest = ({ request, onAccept, onReject }: ConnectionRequestProps) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={request.senderAvatar} alt={request.senderName} />
            <AvatarFallback>
              {request.senderName.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <h4 className="font-medium">{request.senderName}</h4>
                {request.senderSpecialty && (
                  <p className="text-sm text-muted-foreground">{request.senderSpecialty}</p>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock size={12} className="mr-1" />
                <span>{formatTimeAgo(request.createdAt)}</span>
              </div>
            </div>
            
            {request.message && (
              <p className="text-sm mt-2 px-3 py-2 bg-muted rounded-md">{request.message}</p>
            )}
            
            <div className="flex items-center justify-end gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive hover:bg-destructive/10"
                onClick={() => onReject(request.id)}
              >
                <XCircle size={16} className="mr-1" />
                Decline
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onAccept(request.id)}
              >
                <CheckCircle size={16} className="mr-1" />
                Accept
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionRequest;
