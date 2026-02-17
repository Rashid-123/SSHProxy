'use client';

import { SignUp } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Simple redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12">
      <SignUp 
        afterSignUpUrl="/auth/callback"
        redirectUrl="/auth/callback"
      />
    </div>
  );
}