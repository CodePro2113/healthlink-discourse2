
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PointsBadge from './PointsBadge';

interface LeaderboardTableProps {
  extended?: boolean;
}

// Sample leaderboard data
const leaderboardData = [
  { 
    position: 1, 
    name: 'Dr. Priya Sharma', 
    specialty: 'Cardiology', 
    points: 1248, 
    avatar: 'https://i.pravatar.cc/150?img=1',
    trend: 'up',
    badges: 24
  },
  { 
    position: 2, 
    name: 'Dr. Rahul Kapoor', 
    specialty: 'Neurology', 
    points: 1105, 
    avatar: 'https://i.pravatar.cc/150?img=22',
    trend: 'up',
    badges: 19
  },
  { 
    position: 3, 
    name: 'Dr. Ananya Gupta', 
    specialty: 'Pediatrics', 
    points: 987, 
    avatar: 'https://i.pravatar.cc/150?img=28',
    trend: 'down',
    badges: 21
  },
  { 
    position: 4, 
    name: 'Dr. Vikram Singh', 
    specialty: 'Oncology', 
    points: 865, 
    avatar: 'https://i.pravatar.cc/150?img=12',
    trend: 'same',
    badges: 15
  },
  { 
    position: 5, 
    name: 'Dr. Arjun Mehta', 
    specialty: 'Cardiology', 
    points: 642, 
    avatar: 'https://i.pravatar.cc/150?img=8',
    trend: 'up',
    badges: 12,
    isCurrentUser: true
  }
];

const LeaderboardTable = ({ extended = false }: LeaderboardTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Rank</TableHead>
          <TableHead>Doctor</TableHead>
          {extended && <TableHead>Specialty</TableHead>}
          <TableHead className="text-right">Points</TableHead>
          {extended && <TableHead className="text-right">Badges</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((user) => (
          <TableRow key={user.position} className={user.isCurrentUser ? "bg-primary/5" : ""}>
            <TableCell className="font-medium">
              {user.position === 1 ? (
                <Badge className="bg-yellow-500 hover:bg-yellow-600">1</Badge>
              ) : user.position === 2 ? (
                <Badge className="bg-gray-400 hover:bg-gray-500">2</Badge>
              ) : user.position === 3 ? (
                <Badge className="bg-amber-600 hover:bg-amber-700">3</Badge>
              ) : (
                `#${user.position}`
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className={user.isCurrentUser ? "font-medium" : ""}>{user.name}</span>
                  {!extended && <span className="text-xs text-muted-foreground">{user.specialty}</span>}
                </div>
                {user.isCurrentUser && <Badge variant="outline" className="ml-1 h-5 py-0">You</Badge>}
              </div>
            </TableCell>
            {extended && <TableCell>{user.specialty}</TableCell>}
            <TableCell className="text-right">
              <PointsBadge points={user.points} size="sm" />
            </TableCell>
            {extended && (
              <TableCell className="text-right">
                <Badge variant="secondary">{user.badges}</Badge>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;
