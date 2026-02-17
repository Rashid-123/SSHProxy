'use client';

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuthCallbackPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useClerkAuth();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // Already authenticated with backend
      if (isAuthenticated) {
        router.push('/dashboard');
        return;
      }

      // Wait for Clerk to load
      if (!isLoaded) return;

      // Not signed in with Clerk
      if (!isSignedIn) {
        router.push('/login');
        return;
      }

      // Exchange Clerk token for backend JWT
      try {
        const token = await getToken({ template: 'default' });
        if (token) {
          await login(token);
          // login function handles navigation to dashboard
        } else {
          setError('Failed to get authentication token');
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleAuth();
  }, [isLoaded, isSignedIn, isAuthenticated, getToken, login, router]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return <LoadingSpinner />;
}