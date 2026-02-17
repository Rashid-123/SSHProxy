'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthContextType, User } from '@/types';
import { authenticateWithBackend, logoutUser } from '@/lib/auth';
import { useClerk } from '@clerk/nextjs';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();
  const { signOut } = useClerk();
  
  // Ref to track logout state - prevents any hooks from running during logout
  const isLoggingOutRef = useRef(false);
  
  // AbortController to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const isAuthenticated = !!user;

  // Broadcast logout to other tabs
  useEffect(() => {
    const channel = new BroadcastChannel('auth_channel');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'LOGOUT') {
        setUser(null);
        router.push('/');
      }
    };

    return () => {
      channel.close();
    };
  }, [router]);

  const login = async (token: string) => {
    if (isLoggingOutRef.current) return;
    
    try {
      const data = await authenticateWithBackend(token);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (token: string) => {
    if (isLoggingOutRef.current) return;
    
    try {
      const data = await authenticateWithBackend(token);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    // Step 1: Set logout flag immediately
    isLoggingOutRef.current = true;

    // Step 2: Abort any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Step 3: Clear user state synchronously
    setUser(null);

    try {
      // Step 4: Call backend logout (clear cookie, cleanup SSH sessions)
      await logoutUser();

      // Step 5: Sign out from Clerk
      await signOut();

      // Step 6: Broadcast to other tabs
      const channel = new BroadcastChannel('auth_channel');
      channel.postMessage({ type: 'LOGOUT' });
      channel.close();

      // Step 7: Navigate to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate even if logout calls fail
      router.push('/');
    } finally {
      // Step 8: Clear logout flag after navigation
      setTimeout(() => {
        isLoggingOutRef.current = false;
      }, 500);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}