
import { DoctorProfile, ConnectionStatus, ConnectionRequest } from '@/types/doctor';

// Mock data for doctor profiles
const mockDoctors: DoctorProfile[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology',
    experience: 12,
    hospital: 'Mercy General Hospital',
    city: 'New York',
    country: 'USA',
    bio: 'Specialized in complex coronary interventions and structural heart disease',
    interests: ['Heart Failure', 'Preventive Cardiology', 'Medical Education'],
    isPublic: true,
    publications: [
      'Novel biomarkers for early detection of cardiovascular disease',
      'Outcomes of TAVR in elderly patients'
    ],
    education: [
      {
        id: 'edu1',
        institution: 'Harvard Medical School',
        degree: 'MD',
        field: 'Medicine',
        startYear: 2005,
        endYear: 2009
      }
    ],
    connections: 256,
    followers: 420
  },
  {
    id: 'doc2',
    name: 'Dr. Michael Patel',
    avatar: 'https://i.pravatar.cc/150?img=11',
    specialty: 'Neurology',
    subSpecialty: 'Movement Disorders',
    experience: 15,
    hospital: 'University Medical Center',
    city: 'Chicago',
    country: 'USA',
    bio: 'Focused on Parkinson\'s Disease and essential tremor research and treatment',
    interests: ['Deep Brain Stimulation', 'Parkinson\'s Disease', 'Tremor Disorders'],
    isPublic: true,
    publications: [
      'Long-term outcomes of DBS in movement disorders',
      'Novel pharmacological approaches to essential tremor'
    ],
    connections: 189,
    followers: 312
  },
  {
    id: 'doc3',
    name: 'Dr. Aisha Rahman',
    avatar: 'https://i.pravatar.cc/150?img=5',
    specialty: 'Oncology',
    subSpecialty: 'Hematological Malignancies',
    experience: 10,
    hospital: 'Memorial Cancer Institute',
    city: 'Boston',
    country: 'USA',
    bio: 'Specializing in lymphoma and leukemia treatment strategies',
    interests: ['CAR-T Therapy', 'Lymphoma', 'Precision Oncology'],
    isPublic: true,
    publications: [
      'CAR-T cell therapy in refractory lymphomas',
      'Biomarkers of response to immunotherapy'
    ],
    connections: 143,
    followers: 278
  },
  {
    id: 'doc4',
    name: 'Dr. James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    specialty: 'Orthopedics',
    subSpecialty: 'Sports Medicine',
    experience: 8,
    hospital: 'Sports Medicine Center',
    city: 'Los Angeles',
    country: 'USA',
    bio: 'Specializing in knee and shoulder injuries in athletes',
    interests: ['ACL Reconstruction', 'Rotator Cuff Repair', 'Cartilage Restoration'],
    isPublic: true,
    connections: 122,
    followers: 201
  },
  {
    id: 'doc5',
    name: 'Dr. Sophia Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=3',
    specialty: 'Pediatrics',
    subSpecialty: 'Pediatric Gastroenterology',
    experience: 11,
    hospital: 'Children\'s Memorial Hospital',
    city: 'Miami',
    country: 'USA',
    bio: 'Dedicated to treating IBD and other digestive disorders in children',
    interests: ['Inflammatory Bowel Disease', 'Nutrition', 'Microbiome'],
    isPublic: true,
    connections: 176,
    followers: 290
  },
  {
    id: 'doc6',
    name: 'Dr. Ahmed Khan',
    avatar: 'https://i.pravatar.cc/150?img=15',
    specialty: 'Cardiology',
    subSpecialty: 'Electrophysiology',
    experience: 14,
    hospital: 'Heart Rhythm Institute',
    city: 'New York',
    country: 'USA',
    bio: 'Specialized in complex arrhythmias and device therapy',
    interests: ['Atrial Fibrillation', 'Cardiac Devices', 'Catheter Ablation'],
    isPublic: true,
    connections: 210,
    followers: 350
  }
];

// Mock data for connection requests
const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    senderId: 'doc2',
    senderName: 'Dr. Michael Patel',
    senderAvatar: 'https://i.pravatar.cc/150?img=11',
    senderSpecialty: 'Neurology',
    receiverId: 'currentUser',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    message: 'I saw your recent presentation on stroke management. Would love to connect!',
    status: 'pending'
  },
  {
    id: 'req2',
    senderId: 'doc5',
    senderName: 'Dr. Sophia Rodriguez',
    senderAvatar: 'https://i.pravatar.cc/150?img=3',
    senderSpecialty: 'Pediatrics',
    receiverId: 'currentUser',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'pending'
  }
];

// Mock connections status for demo
const mockConnectionStatuses: Record<string, ConnectionStatus> = {
  doc1: { status: 'connected' },
  doc2: { status: 'pending', isPendingReceived: true },
  doc3: { status: 'following' },
  doc4: { status: 'none' },
  doc5: { status: 'pending', isPendingReceived: true },
  doc6: { status: 'none' }
};

// Get all available specialties from the mock data
export const getSpecialties = (): string[] => {
  const specialties = new Set(mockDoctors.map(doc => doc.specialty));
  return Array.from(specialties);
};

// Get all available cities from the mock data
export const getCities = (): string[] => {
  const cities = new Set(mockDoctors.filter(doc => doc.city).map(doc => doc.city as string));
  return Array.from(cities);
};

// Get doctors with filters
export const getDoctors = (
  searchTerm: string = '',
  specialty: string = '',
  city: string = '',
  experienceMin: number = 0,
  experienceMax: number = 100
): DoctorProfile[] => {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return mockDoctors.filter(doctor => {
    // Search term matching
    const matchesSearchTerm = normalizedSearchTerm === '' ||
      doctor.name.toLowerCase().includes(normalizedSearchTerm) ||
      doctor.specialty.toLowerCase().includes(normalizedSearchTerm) ||
      (doctor.hospital && doctor.hospital.toLowerCase().includes(normalizedSearchTerm));
    
    // Specialty matching
    const matchesSpecialty = specialty === '' || doctor.specialty === specialty;
    
    // City matching
    const matchesCity = city === '' || doctor.city === city;
    
    // Experience matching
    const matchesExperience = doctor.experience >= experienceMin && doctor.experience <= experienceMax;
    
    return matchesSearchTerm && matchesSpecialty && matchesCity && matchesExperience;
  });
};

// Get a specific doctor by ID
export const getDoctorById = (id: string): DoctorProfile | undefined => {
  return mockDoctors.find(doctor => doctor.id === id);
};

// Get connection requests for the current user
export const getConnectionRequests = (): ConnectionRequest[] => {
  // In a real app, we would filter requests for the current user
  return mockConnectionRequests;
};

// Get connection status between current user and another doctor
export const getConnectionStatus = (doctorId: string): ConnectionStatus => {
  return mockConnectionStatuses[doctorId] || { status: 'none' };
};

// Send connection request
export const sendConnectionRequest = (doctorId: string, message?: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Connection request sent to doctor ${doctorId} with message: ${message || 'No message'}`);
      mockConnectionStatuses[doctorId] = { status: 'pending', isPendingReceived: false };
      resolve(true);
    }, 500);
  });
};

// Accept connection request
export const acceptConnectionRequest = (requestId: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = mockConnectionRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'accepted';
        mockConnectionStatuses[request.senderId] = { status: 'connected' };
        console.log(`Connection request ${requestId} accepted`);
      }
      resolve(true);
    }, 500);
  });
};

// Reject connection request
export const rejectConnectionRequest = (requestId: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = mockConnectionRequests.find(req => req.id === requestId);
      if (request) {
        request.status = 'rejected';
        mockConnectionStatuses[request.senderId] = { status: 'none' };
        console.log(`Connection request ${requestId} rejected`);
      }
      resolve(true);
    }, 500);
  });
};

// Toggle follow status
export const toggleFollow = (doctorId: string, isFollowing: boolean): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (isFollowing) {
        mockConnectionStatuses[doctorId] = { status: 'following' };
        console.log(`Now following doctor ${doctorId}`);
      } else {
        mockConnectionStatuses[doctorId] = { status: 'none' };
        console.log(`Unfollowed doctor ${doctorId}`);
      }
      resolve(true);
    }, 500);
  });
};

// Get recommended doctors based on specialty and interests
export const getRecommendedDoctors = (currentUserSpecialty: string, limit: number = 3): DoctorProfile[] => {
  // In a real app, this would use more advanced recommendation algorithms
  return mockDoctors
    .filter(doctor => doctor.specialty === currentUserSpecialty)
    .slice(0, limit);
};
