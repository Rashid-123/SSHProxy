'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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
             appearance={{
               baseTheme: dark,
               variables: {
                 colorBackground: '#161b22',
                 colorInputBackground: '#0e1116',
                 colorInputText: '#e6edf3',
                 colorText: '#e6edf3',
                 colorTextSecondary: '#8b949e',
                 colorPrimary: '#238636',
                 colorDanger: '#da3633',
                 borderRadius: '0px',
               },
               elements: {
                 card: 'border border-slate-border shadow-none',
                 formButtonPrimary: 'bg-brand-primary hover:bg-brand-primaryHover',
               },
             }}
             fallbackRedirectUrl="/auth/callback"
             redirectUrl="/auth/callback"
           />
    </div>
  );
}