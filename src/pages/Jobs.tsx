
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, MapPin, Calendar, Search, Filter, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Cardiologist',
    hospital: 'Apollo Hospitals',
    location: 'Mumbai, India',
    salary: '₹24L - ₹30L per year',
    type: 'Full-time',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced Cardiologist to join our team at Apollo Hospitals. The ideal candidate will have at least 8 years of experience in cardiology and be board certified.',
    requirements: [
      'MD in Cardiology',
      'Min. 8 years of experience',
      'Board certification',
      'Experience with cardiac catheterization',
    ],
    tags: ['Cardiology', 'Senior Position', 'Clinical'],
  },
  {
    id: '2',
    title: 'Pediatrician',
    hospital: 'Fortis Healthcare',
    location: 'Delhi, India',
    salary: '₹18L - ₹22L per year',
    type: 'Full-time',
    postedDate: '3 days ago',
    description: 'Fortis Healthcare is seeking a compassionate and skilled Pediatrician to provide comprehensive care for infants, children, and adolescents.',
    requirements: [
      'MD in Pediatrics',
      'Min. 3 years of experience',
      'Strong communication skills',
      'Experience in a hospital setting',
    ],
    tags: ['Pediatrics', 'Child Care', 'Clinical'],
  },
  {
    id: '3',
    title: 'Neurologist - Part Time',
    hospital: 'Max Healthcare',
    location: 'Bengaluru, India',
    salary: '₹8,000 - ₹12,000 per day',
    type: 'Part-time',
    postedDate: '1 week ago',
    description: 'Max Healthcare is looking for a part-time Neurologist to work 2-3 days per week in our Bengaluru facility.',
    requirements: [
      'MD in Neurology',
      'Min. 5 years of experience',
      'Flexible schedule',
      'Diagnostic expertise',
    ],
    tags: ['Neurology', 'Part-time', 'Consultant'],
  },
  {
    id: '4',
    title: 'Telemedicine Physician',
    hospital: 'Practo',
    location: 'Remote',
    salary: '₹15L - ₹20L per year',
    type: 'Full-time',
    postedDate: '2 weeks ago',
    description: 'Practo is seeking licensed physicians for our telemedicine platform to provide virtual consultations to patients across India.',
    requirements: [
      'MBBS required, MD preferred',
      'Min. 2 years of clinical experience',
      'Comfortable with technology',
      'Good internet connection',
    ],
    tags: ['Telemedicine', 'Remote', 'Digital Health'],
  },
  {
    id: '5',
    title: 'Medical Research Scientist',
    hospital: 'ICMR',
    location: 'Hyderabad, India',
    salary: '₹18L - ₹25L per year',
    type: 'Full-time',
    postedDate: '3 weeks ago',
    description: 'The Indian Council of Medical Research (ICMR) is looking for a Medical Research Scientist to contribute to ongoing research projects.',
    requirements: [
      'PhD in Medical Sciences or related field',
      'Published research papers',
      'Experience with clinical trials',
      'Grant writing experience preferred',
    ],
    tags: ['Research', 'Medical Science', 'Academia'],
  },
];

const JobCard = ({ job }: { job: typeof mockJobs[0] }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
            <CardDescription className="text-base font-medium">{job.hospital}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-3 mt-1 mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={16} className="mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase size={16} className="mr-1" />
            {job.type}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-1" />
            {job.postedDate}
          </div>
        </div>
        
        <p className="text-sm mb-3">{job.description}</p>
        
        <div className="font-medium text-sm mb-2">Requirements:</div>
        <ul className="list-disc pl-5 text-sm mb-3 space-y-1">
          {job.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {job.tags.map((tag, i) => (
            <Badge key={i} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-md font-semibold text-primary">{job.salary}</div>
        <Button size="sm">Apply Now</Button>
      </CardFooter>
    </Card>
  );
};

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredJobs = mockJobs.filter(job => {
    return job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           job.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  const displayJobs = activeTab === 'all' 
    ? filteredJobs 
    : filteredJobs.filter(job => job.type.toLowerCase() === activeTab);
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Medical Jobs</h1>
        <p className="text-muted-foreground mb-6">Find opportunities in healthcare across India</p>
        
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, hospital, or keywords..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="full-time">Full-time</TabsTrigger>
            <TabsTrigger value="part-time">Part-time</TabsTrigger>
            <TabsTrigger value="remote">Remote</TabsTrigger>
          </TabsList>
          
          <Separator className="my-6" />
          
          <TabsContent value="all" className="mt-0">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {displayJobs.length} jobs</p>
              <select className="border rounded p-1 text-sm">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
            {displayJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          
          <TabsContent value="full-time" className="mt-0">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {displayJobs.length} full-time jobs</p>
              <select className="border rounded p-1 text-sm">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
            {displayJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          
          <TabsContent value="part-time" className="mt-0">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {displayJobs.length} part-time jobs</p>
              <select className="border rounded p-1 text-sm">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
            {displayJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
          
          <TabsContent value="remote" className="mt-0">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">Showing {displayJobs.length} remote jobs</p>
              <select className="border rounded p-1 text-sm">
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
            {displayJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Jobs;
