import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@workspace/api-client-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updatePoints: (points) => set((state) => ({
        user: state.user ? { ...state.user, greenPoints: state.user.greenPoints + points } : null
      }))
    }),
    {
      name: 'swachhtrack-auth',
    }
  )
);

export function useAuth() {
  const store = useAuthStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    store.logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon to continue recycling!",
    });
    setLocation("/");
  };

  return {
    ...store,
    handleLogout
  };
}

// Mock initial data for prototype
export const MOCK_USER: UserProfile = {
  id: "usr_12345",
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91 98765 43210",
  city: "Mumbai",
  greenPoints: 850,
  level: "Sustainability Hero",
  joinedAt: "2023-08-15T10:00:00Z"
};
