import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      // Here you would integrate with your authentication service
      // For now, we'll just simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        user: {
          id: '1',
          email,
          user_metadata: {
            full_name: 'Admin User',
            role: 'admin'
          }
        }
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      set({ loading: true, error: null });
      // Here you would integrate with your authentication service
      // For now, we'll just simulate a successful signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        user: {
          id: Date.now().toString(),
          email,
          user_metadata: {
            full_name: fullName,
            role: 'user'
          }
        }
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      // Here you would integrate with your authentication service
      // For now, we'll just clear the user
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  initialize: async () => {
    try {
      // Here you would check for an existing session
      // For now, we'll just simulate the check
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ loading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, error: (error as Error).message });
    }
  },
}));