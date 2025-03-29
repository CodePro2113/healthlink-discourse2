
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoaded(true);
    
    // Mobile responsive - close sidebar on small screens
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
    
    // Close sidebar on mobile when route changes
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className={cn(
      "flex min-h-screen bg-background transition-all duration-300 ease-in-out",
      isPageLoaded ? "opacity-100" : "opacity-0"
    )}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className={cn(
          "flex-1 overflow-auto px-4 md:px-6 py-8 transition-all duration-300 ease-in-out",
          isPageLoaded ? "animate-fade-in" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
