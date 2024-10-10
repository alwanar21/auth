import { create } from "zustand";

interface User {
  id?: string;
  email?: string;
  username?: string;
  birthDate?: string;
  picture?: string;
  roles?: string;
  isActive?: boolean;
}

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  changeUser: (updatedUser: Partial<User>) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: {}, // All properties in User are now optional
  isAuthenticated: false,
  setUser: (user: User) =>
    set((state) => ({
      ...state,
      user: { ...state.user, ...user },
      isAuthenticated: true,
    })),
  logout: () =>
    set((state) => ({
      ...state,
      user: {},
      isAuthenticated: false,
    })),
  changeUser: (updatedUser: Partial<User>) =>
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        ...updatedUser,
      },
    })),
}));

export default useAuthStore;
