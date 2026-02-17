import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/contexts/AuthContext';
import { getServerAuthState } from '@/lib/server-auth';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyApp - SSH Proxy',
  description: 'Secure SSH proxy with persistent sessions',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get initial auth state from server (no client-side delay)
  const { user } = await getServerAuthState();

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AuthProvider initialUser={user}>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}