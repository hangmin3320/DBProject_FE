'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarWrapper from '../_components/layout/NavbarWrapper';
import { Avatar } from '../_components/ui';
import { User } from '../types/user';
import { userApi } from '../_lib/api';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchUsers = async () => {
      if (query) {
        try {
          // Fetch search results from the API
          const results = await userApi.searchUsers(query);
          setUsers(results);
        } catch (error) {
          console.error('Error searching users:', error);
          setUsers([]); // Set empty array on error
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
        setLoading(false);
      }
    };

    searchUsers();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          검색 결과: "{query}"
        </h1>

        {users.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {users.map(user => (
              <a
                key={user.user_id}
                href={`/profile/${user.user_id}`}
                className="block hover:bg-gray-50 transition-colors duration-150 p-4 border-b last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Avatar
                      src=""
                      fallback={user.username.charAt(0).toUpperCase()}
                      size="md"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
                    <p className="text-gray-500 text-sm">@{user.email}</p>
                    <p className="text-gray-600 text-sm mt-1">{user.bio}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching "{query}"</p>
          </div>
        )}
      </div>
    </main>
  );
}