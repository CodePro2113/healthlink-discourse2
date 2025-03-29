
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DoctorProfile as DoctorProfileType } from "@/types/doctor";
import { FileText, Mail, Link as LinkIcon } from "lucide-react";
import DoctorCard from '@/components/networking/DoctorCard';
import { ConnectionStatus } from "@/types/doctor";

interface DoctorAboutProps {
  doctor: DoctorProfileType;
  similarDoctors: DoctorProfileType[];
  getConnectionStatus: (id: string) => ConnectionStatus;
  onConnect: (id: string) => void;
  onFollowToggle: (id: string, isFollowing: boolean) => void;
}

const DoctorAbout = ({
  doctor,
  similarDoctors,
  getConnectionStatus,
  onConnect,
  onFollowToggle
}: DoctorAboutProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          {doctor.bio && (
            <p className="text-muted-foreground mb-6">{doctor.bio}</p>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Specialty</p>
                <p className="font-medium">{doctor.specialty}</p>
              </div>
              {doctor.subSpecialty && (
                <div>
                  <p className="text-muted-foreground">Sub-specialty</p>
                  <p className="font-medium">{doctor.subSpecialty}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{doctor.experience} years</p>
              </div>
              {doctor.hospital && (
                <div>
                  <p className="text-muted-foreground">Hospital</p>
                  <p className="font-medium">{doctor.hospital}</p>
                </div>
              )}
            </div>
            
            {(doctor.email || doctor.website) && (
              <>
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{doctor.email}</span>
                      </div>
                    )}
                    {doctor.website && (
                      <div className="flex items-center gap-2">
                        <LinkIcon size={14} />
                        <a href="#" className="text-primary">{doctor.website}</a>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {doctor.interests && doctor.interests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.interests.map((interest: string, i: number) => (
                <Badge key={i} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {doctor.publications && doctor.publications.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Publications</h3>
            <ul className="space-y-3">
              {doctor.publications.map((publication: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <FileText size={16} className="mt-1 text-primary" />
                  <span>{publication}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      {similarDoctors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Similar Specialists</h3>
            <div className="space-y-3">
              {similarDoctors
                .filter(d => d.id !== doctor.id)
                .slice(0, 3)
                .map(doc => (
                  <DoctorCard
                    key={doc.id}
                    doctor={doc}
                    connectionStatus={getConnectionStatus(doc.id)}
                    onConnect={onConnect}
                    onFollowToggle={onFollowToggle}
                    compact
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorAbout;
