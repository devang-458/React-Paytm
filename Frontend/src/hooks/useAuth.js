import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => set({
        user: userData,
        token: token,
        isAuthenticated: true
      }),
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      }))
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;