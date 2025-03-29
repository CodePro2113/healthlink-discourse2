
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePoints } from '@/contexts/PointsContext';
import {
  Home,
  Users,
  MessageSquare,
  Newspaper,
  Trophy,
  Heart,
  BellDot,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Brain,
  Bot,
  Bookmark,
  Award,
  Crown,
  Briefcase
} from 'lucide-react';
import PointsBadge from '@/components/gamification/PointsBadge';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  badge?: number;
  highlight?: boolean;
  points?: number;
}

const NavItem = ({ 
  to, 
  icon, 
  label, 
  isCollapsed, 
  badge,
  highlight,
  points
}: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink to={to} className="w-full">
      {({ isActive }) => (
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 p-2 text-sm font-medium",
            isActive 
              ? "bg-accent/50 text-accent-foreground"
              : highlight
                ? "bg-primary/10 hover:bg-primary/20 text-primary" 
                : "hover:bg-accent/20",
            isCollapsed ? "px-2" : "px-3"
          )}
        >
          {icon}
          {!isCollapsed && (
            <span className="transition-all duration-300 ease-in-out">
              {label}
            </span>
          )}
          {!isCollapsed && badge && badge > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          {!isCollapsed && points && (
            <div className="ml-auto">
              <PointsBadge points={points} size="sm" showIcon={false} />
            </div>
          )}
        </Button>
      )}
    </NavLink>
  );
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { points } = usePoints();

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/feed', icon: <Newspaper size={20} />, label: 'My Feed', badge: 5 },
    { to: '/forum', icon: <MessageSquare size={20} />, label: 'Forum', badge: 12 },
    { to: '/network', icon: <Users size={20} />, label: 'My Network' },
    { to: '/jobs', icon: <Briefcase size={20} />, label: 'Jobs' },
    { to: '/ai-assistant', icon: <Brain size={20} />, label: 'AI Assistant' },
    { to: '/news', icon: <Bot size={20} />, label: 'AI News Feed' },
  ];

  const secondaryNavItems = [
    { to: '/saved', icon: <Bookmark size={20} />, label: 'Saved Items' },
    { 
      to: '/achievements', 
      icon: <Trophy size={20} />, 
      label: 'Achievements', 
      highlight: true,
      points: points
    },
    { to: '/liked', icon: <Heart size={20} />, label: 'Liked Posts' },
    { to: '/notifications', icon: <BellDot size={20} />, label: 'Notifications', badge: 7 },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[70px]",
        "md:relative"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-14 items-center justify-between px-4 py-2 border-b">
        {isOpen ? (
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-xl">
            <span className="bg-primary text-primary-foreground rounded-md px-2 py-1">Med</span>
            <span>Connect</span>
          </NavLink>
        ) : (
          <NavLink to="/" className="flex items-center justify-center w-full">
            <span className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-lg font-bold">M</span>
          </NavLink>
        )}
      </div>
      
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute -right-3 top-6 z-50 rounded-full border bg-background p-1 shadow-md",
            isHovered ? "opacity-100" : "opacity-0 md:opacity-100"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
      
      {isOpen && (
        <div className="px-3 py-2">
          <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Level 4</span>
                <span className="text-sm font-medium">{points} points</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Award size={14} className="mr-1" />
              Rank #18
            </Button>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isOpen}
              badge={item.badge}
            />
          ))}
          
          {!isOpen ? (
            <Separator className="my-2" />
          ) : (
            <div className="py-2">
              <Separator className="mb-2" />
            </div>
          )}
          
          {secondaryNavItems.map((item, index) => (
            <NavItem
              key={index}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isCollapsed={!isOpen}
              badge={item.badge}
              highlight={item.highlight}
              points={item.points}
            />
          ))}
        </nav>
      </ScrollArea>
      
      <div className="border-t p-3">
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-start gap-2",
            !isOpen && "justify-center"
          )}
        >
          <PlusCircle size={18} />
          {isOpen && <span>New Post</span>}
          {isOpen && <Badge className="ml-1 bg-primary/20 text-primary hover:bg-primary/30">+5</Badge>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
