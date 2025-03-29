
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorSearch, { DoctorSearchFilters } from '@/components/networking/DoctorSearch';
import DoctorCard from '@/components/networking/DoctorCard';
import { DoctorProfile, ConnectionStatus } from '@/types/doctor';
import { getDoctors, getConnectionStatus, getRecommendedDoctors } from '@/services/doctorNetworkService';

interface NetworkFindTabProps {
  onConnect: (doctorId: string) => void;
  onFollowToggle: (doctorId: string, isFollowing: boolean) => void;
  onMessage: (doctorId: string) => void;
  specialties: string[];
  cities: string[];
}

const NetworkFindTab = ({
  onConnect,
  onFollowToggle,
  onMessage,
  specialties,
  cities
}: NetworkFindTabProps) => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorProfile[]>([]);
  const [recommendedDoctors, setRecommendedDoctors] = useState<DoctorProfile[]>([]);
  
  useEffect(() => {
    // Load initial data
    const allDoctors = getDoctors();
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
    
    // Get recommended doctors (in a real app, this would use the current user's specialty)
    setRecommendedDoctors(getRecommendedDoctors('Cardiology'));
  }, []);
  
  const handleSearch = (filters: DoctorSearchFilters) => {
    const filtered = getDoctors(
      filters.searchTerm,
      filters.specialty,
      filters.city,
      filters.experienceMin,
      filters.experienceMax
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div>
      <DoctorSearch 
        onSearch={handleSearch}
        specialties={specialties}
        cities={cities}
      />
      
      {/* Recommended Doctors Section */}
      {filteredDoctors.length === doctors.length && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                connectionStatus={getConnectionStatus(doctor.id)}
                onConnect={onConnect}
                onFollowToggle={onFollowToggle}
                onMessage={onMessage}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          {filteredDoctors.length === doctors.length 
            ? 'All Doctors' 
            : `${filteredDoctors.length} Doctors Found`}
        </h2>
        
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="mb-4 text-center text-muted-foreground">No doctors match your search criteria</p>
              <Button variant="outline" onClick={() => handleSearch({
                searchTerm: '',
                specialty: '',
                city: '',
                experienceMin: 0,
                experienceMax: 50
              })}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                connectionStatus={getConnectionStatus(doctor.id)}
                onConnect={onConnect}
                onFollowToggle={onFollowToggle}
                onMessage={onMessage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkFindTab;
