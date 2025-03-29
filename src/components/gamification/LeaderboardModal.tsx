
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LeaderboardTable from './LeaderboardTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaderboardModal = ({ isOpen, onClose }: LeaderboardModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Community Leaderboard</DialogTitle>
          <DialogDescription>
            See who's leading the engagement in our medical community this week.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="weekly">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly">
            <LeaderboardTable extended={true} />
          </TabsContent>
          
          <TabsContent value="monthly">
            <LeaderboardTable extended={true} />
          </TabsContent>
          
          <TabsContent value="alltime">
            <LeaderboardTable extended={true} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;
