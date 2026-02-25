'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import MachinesSection from '@/components/machine/Machinessection';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-text">Dashboard</h1>
        <p className="text-slate-muted mt-2 text-sm">
          Manage your machines and open terminal sessions from here.
        </p>
      </div>
      <MachinesSection />
    </div>
  );
}