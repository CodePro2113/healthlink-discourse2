
import React from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Users, 
  Heart, 
  ThumbsUp, 
  TrendingUp,
  MessageCircle,
  Calendar,
  FileText,
  MessageSquare,
  Share2,
  CheckCircle,
  BookOpen,
  Crown,
  Zap,
  PenTool,
  Compass,
  Lightbulb,
  Brain,
  UserPlus,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementProps {
  name: string;
  description?: string;
  date?: string;
  icon: string;
  unlocked?: boolean;
  small?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Award,
  Star,
  Users,
  Heart,
  ThumbsUp,
  TrendingUp,
  MessageCircle,
  Calendar,
  FileText,
  MessageSquare,
  Share2,
  CheckCircle,
  BookOpen,
  Crown,
  Zap,
  PenTool,
  Brain,
  UserPlus,
  Compass,
  Lightbulb
};

const AchievementCard = ({ 
  achievement, 
  small = false 
}: { 
  achievement: AchievementProps;
  small?: boolean;
}) => {
  // Default to unlocked if not specified
  const isUnlocked = achievement.unlocked !== false;
  const IconComponent = iconMap[achievement.icon] || Trophy;
  
  if (small) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-3 rounded-lg text-center",
        isUnlocked 
          ? "bg-primary/10" 
          : "bg-muted/30 grayscale opacity-70"
      )}>
        <div className={cn(
          "p-2 rounded-full mb-2",
          isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          <IconComponent size={16} />
        </div>
        <p className="text-xs font-medium">{achievement.name}</p>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex flex-col items-center text-center p-4 rounded-lg border",
      isUnlocked 
        ? "bg-card" 
        : "bg-muted/30 grayscale opacity-60"
    )}>
      <div className={cn(
        "p-3 rounded-full mb-3",
        isUnlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        <IconComponent size={24} />
      </div>
      <h4 className="font-medium mb-1">{achievement.name}</h4>
      {achievement.description && (
        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
      )}
      {achievement.date && (
        <p className="text-xs text-muted-foreground">{achievement.date}</p>
      )}
    </div>
  );
};

export default AchievementCard;
