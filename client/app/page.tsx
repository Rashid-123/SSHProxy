'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyApp</h1>
        <p className="text-gray-600 mb-8">
          Secure SSH proxy with 24-hour persistent sessions
        </p>

        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 border border-gray-900 text-gray-900 rounded hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-700"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}