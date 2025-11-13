'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../_store/auth';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('Navbar user state changed:', user);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Micro SNS</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              {user && (
                <>
                  <Link 
                    href={`/profile/${user.user_id || user.id}`} 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname.includes('/profile') 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === '/settings' 
                        ? 'border-blue-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="flex items-center mr-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              <Button type="submit" className="ml-2">Search</Button>
            </form>
            
            {user ? (
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative ml-3">
                  <div className="flex space-x-3 items-center">
                    <Link href={`/profile/${user.user_id || user.id}`}>
                      <Avatar 
                        src="" 
                        fallback={user.username.charAt(0).toUpperCase()} 
                        size="sm"
                      />
                    </Link>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user.username}</span>
                    <Button 
                      variant="ghost" 
                      onClick={logout}
                      className="text-sm"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };