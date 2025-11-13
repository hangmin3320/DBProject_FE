'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Input, Button } from '../../_components/ui';
import { useAuthStore } from '../../_store/auth';
import { userApi } from '../../_lib/api';
import { setAuthToken } from '../../_lib/api/client'; // Import setAuthToken

export default function SignInPageClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // API call to login
      const response = await userApi.login(email, password);
      
      // Set token in cookie
      Cookies.set('access_token', response.access_token, { expires: 7, secure: true, sameSite: 'strict' });

      // Set the token in the API client for subsequent requests
      setAuthToken(response.access_token);

      // Fetch current user's data
      const currentUser = await userApi.getMe();

      // Update auth store
      login(currentUser, response.access_token);

      // Redirect to home page
      router.push('/');
      router.refresh(); // Refresh to update the UI based on auth status
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account? Sign up
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}