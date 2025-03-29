
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Feed from '@/pages/Feed';
import News from '@/pages/News';
import Forum from '@/pages/Forum';
import AIAssistant from '@/pages/AIAssistant';
import Login from '@/pages/auth/Login';
import Jobs from '@/pages/Jobs';
import Network from '@/pages/Network';
import Profile from '@/pages/Profile';
import Notifications from '@/pages/Notifications';
import DoctorProfile from '@/pages/DoctorProfile';
import NotFound from '@/pages/NotFound';
import Achievements from '@/pages/Achievements';
import LikedPosts from '@/pages/LikedPosts';
import SavedPosts from '@/pages/SavedPosts';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { PointsProvider } from '@/contexts/PointsContext';
import './App.css';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      <PointsProvider>
        <ThemeProvider>
          {mounted && (
            <>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/news" element={<News />} />
                <Route path="/network" element={<Network />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/settings" element={<Profile />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/liked" element={<LikedPosts />} />
                <Route path="/saved" element={<SavedPosts />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/doctor/:id" element={<DoctorProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </>
          )}
        </ThemeProvider>
      </PointsProvider>
    </AuthProvider>
  );
}

export default App;
