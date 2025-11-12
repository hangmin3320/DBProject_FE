'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostsList from '../../_components/domain/PostsList';
import { FollowButton } from '../../_components/domain/FollowButton';
import { Avatar } from '../../_components/ui/Avatar';
import { Button } from '../../_components/ui/Button';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { userApi } from '../../_lib/api';
import { useAuthStore } from '../../_store/auth';

export default function ProfilePageClient() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();
  
  // Determine if this is the current user's profile
  const isOwnProfile = currentUser?.user_id === Number(userId);

  useEffect(() => {
    const fetchUserData = async (id: number) => {
      try {
        // Fetch user data from API
        const userData = await userApi.getUserById(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      const numericUserId = Array.isArray(userId) ? Number(userId[0]) : Number(userId);
      if (!isNaN(numericUserId) && isFinite(numericUserId)) {
        fetchUserData(numericUserId);
      } else {
        console.error('Invalid user ID:', userId);
        setError('Invalid user ID provided.');
        setLoading(false);
      }
    } else {
      setError('User ID not found.');
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Avatar 
                src="" 
                fallback={user.username.charAt(0).toUpperCase()} 
                size="xl" 
              />
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                  <p className="text-gray-600">@{user.email}</p>
                </div>
                
                <div className="flex space-x-3">
                  {isOwnProfile ? (
                    <Button>
                      <a href="/settings">Edit Profile</a>
                    </Button>
                  ) : (
                    <FollowButton 
                      userId={user.user_id} 
                      isFollowing={false} // In a real app, determine from state
                    />
                  )}
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{user.bio}</p>
              
              <div className="mt-4 flex space-x-6">
                <div>
                  <span className="font-semibold text-gray-900">{user.following_count}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{user.follower_count}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content - showing only this user's posts */}
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Posts</h2>
        
        {/* Use PostsList component, but filter to show only this user's posts */}
        <PostsList activeTab="all" userId={Number(userId)} currentUser={currentUser || undefined} />
      </div>
    </div>
  );
}