
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export type PointAction = 'post' | 'comment' | 'upvote' | 'share' | 'streak' | 'badge' | 'save';

interface PointsContextType {
  points: number;
  dailyPoints: number;
  dailyPointsGoal: number;
  addPoints: (amount: number, action: PointAction) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Action point values
export const POINTS_VALUES = {
  post: 5,
  comment: 10,
  upvote: 5,
  share: 2,
  streak: 15,
  badge: 50,
  save: 5  // Added save points value
};

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In a real app, these would be loaded from a database
  const [points, setPoints] = useState<number>(642);
  const [dailyPoints, setDailyPoints] = useState<number>(25);
  const [dailyPointsGoal] = useState<number>(50);

  const addPoints = (amount: number, action: PointAction) => {
    setPoints(prev => prev + amount);
    setDailyPoints(prev => Math.min(prev + amount, dailyPointsGoal));
    
    // Show toast notification
    toast(`+${amount} points earned!`, {
      description: `You earned points for ${action.replace(/^\w/, c => c.toUpperCase())}`,
      duration: 3000,
    });
  };

  return (
    <PointsContext.Provider value={{ points, dailyPoints, dailyPointsGoal, addPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};
