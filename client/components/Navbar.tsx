'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { user: clerkUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-border bg-slate-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 text-2xl font-semibold tracking-tight">
              <span className="text-slate-text font-mono">SSH</span>
              <span className="text-brand-primary font-mono">Proxy</span>
            </Link>

            {/* Desktop right */}
            <div className="hidden sm:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-3 pl-3 border-l border-slate-border">
                    {clerkUser?.imageUrl && (
                      <Image src={clerkUser.imageUrl} alt="Profile" width={32} height={32} className="rounded-full ring-2 ring-slate-border" />
                    )}
                    <span className="text-slate-text text-sm">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-4 py-1.5 bg-brand-danger hover:bg-brand-dangerHover text-slate-text text-sm disabled:opacity-50 transition-colors"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-slate-muted hover:text-slate-text transition-colors text-sm">
                    Sign In
                  </Link>
                  <Link href="/register" className="px-4 py-1.5 bg-brand-primary hover:bg-brand-primaryHover text-slate-text text-sm transition-colors">
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right — avatar + menu button */}
            <div className="flex sm:hidden items-center gap-3">
              {clerkUser?.imageUrl && (
                <Image src={clerkUser.imageUrl} alt="Profile" width={30} height={30} className="rounded-full ring-2 ring-slate-border" />
              )}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="text-slate-muted hover:text-slate-text transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile drawer — slides in from left */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 bg-slate-card border-r border-slate-border flex flex-col sm:hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-border">
              <Link href="/" className="flex items-center gap-1 text-xl font-semibold" onClick={() => setMenuOpen(false)}>
                <span className="text-slate-text font-mono">SSH</span>
                <span className="text-brand-primary font-mono">Proxy</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="text-slate-muted hover:text-slate-text transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Drawer links */}
            <div className="flex flex-col flex-1 px-5 py-6 gap-1">
              {isAuthenticated ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 pb-5 mb-4 border-b border-slate-border">
                    {clerkUser?.imageUrl && (
                      <Image src={clerkUser.imageUrl} alt="Profile" width={36} height={36} className="rounded-full ring-2 ring-slate-border" />
                    )}
                    <div>
                      <p className="text-slate-text text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-slate-muted text-xs">{user?.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="text-blue-400 hover:text-blue-300 text-sm py-2 transition-colors"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    disabled={isLoggingOut}
                    className="mt-auto w-full px-4 py-2 bg-brand-danger hover:bg-brand-dangerHover text-slate-text text-sm disabled:opacity-50 transition-colors text-left"
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-slate-muted hover:text-slate-text text-sm py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-slate-muted hover:text-slate-text text-sm py-2 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}