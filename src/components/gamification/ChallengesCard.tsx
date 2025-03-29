
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChallengesCardProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  daysLeft?: number;
  completed?: boolean;
  dailyTask?: boolean;
}

const ChallengesCard = ({
  title,
  description,
  progress,
  total,
  reward,
  daysLeft,
  completed = false,
  dailyTask = false
}: ChallengesCardProps) => {
  const progressPercentage = (progress / total) * 100;
  
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      completed ? "bg-primary/5 border-primary/20" : "bg-card"
    )}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-full",
            completed ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground"
          )}>
            {completed ? <CheckCircle size={16} /> : <Trophy size={16} />}
          </div>
          <h4 className="font-medium">{title}</h4>
        </div>
        
        <div className="flex items-center gap-1">
          {dailyTask && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
              Daily
            </Badge>
          )}
          
          {completed ? (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Completed
            </Badge>
          ) : daysLeft !== undefined && daysLeft > 0 ? (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              {daysLeft} days left
            </div>
          ) : null}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span>
            Progress: <span className="font-medium">{progress}/{total}</span>
          </span>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            +{reward} pts
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        {completed && (
          <div className="pt-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 w-full justify-center py-1">
              <CheckCircle size={14} className="mr-1" />
              {reward} points earned
            </Badge>
          </div>
        )}
        
        {!completed && dailyTask && progress === total && (
          <div className="pt-2">
            <Button size="sm" className="w-full">Claim Reward</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesCard;
