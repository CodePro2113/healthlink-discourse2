
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  currentStreak: number;
  className?: string;
}

const StreakTracker = ({ currentStreak, className }: StreakTrackerProps) => {
  // Last 7 days mock data (0 = no activity, 1 = some activity, 2 = high activity)
  const weekActivity = [2, 0, 1, 2, 2, 0, 1];
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={16} className="text-primary" />
        <h4 className="text-sm font-medium">Activity Streak</h4>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Trophy size={14} className="text-amber-500" />
          <span className="text-sm">{currentStreak} day streak</span>
        </div>
        <span className="text-xs text-muted-foreground">Best: 7 days</span>
      </div>
      
      <div className="flex items-center justify-between">
        {weekActivity.map((activity, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                activity === 0 
                  ? "bg-muted/40 text-muted-foreground"
                  : activity === 1
                    ? "bg-primary/30 text-primary-foreground"
                    : "bg-primary text-primary-foreground"
              )}
            >
              {activity > 0 && <Trophy size={12} />}
            </div>
            <span className="text-xs mt-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakTracker;
