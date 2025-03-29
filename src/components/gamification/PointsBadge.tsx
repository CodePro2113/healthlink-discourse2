
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const PointsBadge = ({ 
  points, 
  size = 'md', 
  showIcon = true,
  className 
}: PointsBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-3'
  };
  
  return (
    <Badge 
      className={cn(
        "bg-primary/10 text-primary hover:bg-primary/20 font-semibold", 
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Trophy className="mr-1" size={size === 'sm' ? 12 : (size === 'md' ? 14 : 16)} />}
      {points} pts
    </Badge>
  );
};

export default PointsBadge;
