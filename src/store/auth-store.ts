import { create } from "zustand";

interface User {
  id: string;
  email: string;
  username: string;
  birthDate: string;
  picture: string;
  roles: string;
  isActive: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
