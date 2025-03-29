
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin } from "lucide-react";
import { DoctorProfile } from '@/types/doctor';

interface DoctorSearchProps {
  onSearch: (filters: DoctorSearchFilters) => void;
  specialties: string[];
  cities: string[];
}

export interface DoctorSearchFilters {
  searchTerm: string;
  specialty: string;
  city: string;
  experienceMin: number;
  experienceMax: number;
}

const DoctorSearch = ({ onSearch, specialties, cities }: DoctorSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [experienceMin, setExperienceMin] = useState(0);
  const [experienceMax, setExperienceMax] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    // Simple search with just the term for immediate filtering
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
      onSearch({
        searchTerm,
        specialty,
        city,
        experienceMin,
        experienceMax
      });
    }
  }, [searchTerm]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      specialty,
      city,
      experienceMin,
      experienceMax
    });
  };
  
  const handleReset = () => {
    setSearchTerm('');
    setSpecialty('');
    setCity('');
    setExperienceMin(0);
    setExperienceMax(50);
    onSearch({
      searchTerm: '',
      specialty: '',
      city: '',
      experienceMin: 0,
      experienceMax: 50
    });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search doctors by name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="mr-1" />
              Filters
            </Button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="city">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <select
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Any Location</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="experienceMin">Min Experience (years)</Label>
                <Input
                  id="experienceMin"
                  type="number"
                  min={0}
                  max={50}
                  value={experienceMin}
                  onChange={(e) => setExperienceMin(Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="experienceMax">Max Experience (years)</Label>
                <Input
                  id="experienceMax"
                  type="number"
                  min={0}
                  max={50}
                  value={experienceMax}
                  onChange={(e) => setExperienceMax(Number(e.target.value))}
                />
              </div>
              
              <div className="col-span-1 sm:col-span-2 md:col-span-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button type="submit">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorSearch;
