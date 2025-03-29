
export interface DoctorProfile {
  id: string;
  name: string;
  avatar?: string;
  specialty: string;
  subSpecialty?: string;
  experience: number; // years
  hospital?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  website?: string;
  bio?: string;
  interests: string[];
  isPublic: boolean;
  publications?: string[];
  education?: EducationItem[];
  connections: number;
  followers: number;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  isOngoing?: boolean;
}

export interface ConnectionStatus {
  status: 'none' | 'pending' | 'connected' | 'following';
  isPendingReceived?: boolean; // If the request is received by the current user
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderSpecialty?: string;
  receiverId: string;
  createdAt: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
}
