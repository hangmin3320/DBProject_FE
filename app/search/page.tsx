'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Avatar } from '../_components/ui';
import { User } from '../types/user';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      // In a real app, fetch search results from the API
      // For now, we'll use mock data
      const mockUsers: User[] = [
        {
          user_id: 1,
          email: 'john@example.com',
          username: 'JohnDoe',
          bio: 'Software Developer',
          created_at: new Date().toISOString(),
          follower_count: 150,
          following_count: 89
        },
        {
          user_id: 2,
          email: 'jane@example.com',
          username: 'JaneSmith',
          bio: 'Designer and Artist',
          created_at: new Date().toISOString(),
          follower_count: 230,
          following_count: 120
        },
        {
          user_id: 3,
          email: 'bob@example.com',
          username: 'BobJohnson',
          bio: 'Musician and Producer',
          created_at: new Date().toISOString(),
          follower_count: 50,
          following_count: 210
        }
      ];
      
      // Filter mock users based on the query
      const filteredUsers = mockUsers.filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.bio.toLowerCase().includes(query.toLowerCase())
      );
      
      setUsers(filteredUsers);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}