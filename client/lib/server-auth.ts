import { cookies } from 'next/headers';
import type { User } from '@/types';

export async function getServerAuthState(): Promise<{ user: User | null }> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('auth_token'); // Adjust cookie name to match your backend
    
    if (!authCookie) {
      return { user: null };
    }

    // Validate token with backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Cookie': `auth_token=${authCookie.value}`,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return { user: null };
    }

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error('Server auth check failed:', error);
    return { user: null };
  }
}