'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostCard } from '../../_components/domain/PostCard';
import { FollowButton } from '../../_components/domain/FollowButton';
import { Avatar } from '../../_components/ui/Avatar';
import { Button } from '../../_components/ui/Button';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { userApi } from '../../_lib/api';

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // In a real app, you would get the current user from the auth store
  const currentUserId = 1; // Mock current user ID

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock user data for now - in a real app, fetch from API
        const mockUser: User = {
          user_id: Number(userId),
          email: 'user@example.com',
          username: `User${userId}`,
          bio: 'Software Developer and Open Source Contributor',
          created_at: new Date().toISOString(),
          follower_count: 150,
          following_count: 89
        };
        
        setUser(mockUser);
        setIsOwnProfile(Number(userId) === currentUserId);
        
        // Mock posts for the user - in a real app, fetch from API
        const mockPosts: Post[] = [
          {
            post_id: 1,
            content: 'This is a sample post from the user profile.',
            user_id: Number(userId),
            user: mockUser,
            created_at: new Date().toISOString(),
            like_count: 5,
            hashtags: [{ hashtag_id: 1, name: 'example' }],
            images: []
          },
          {
            post_id: 2,
            content: 'Another post showing what the user has been up to.',
            user_id: Number(userId),
            user: mockUser,
            created_at: new Date().toISOString(),
            like_count: 12,
            hashtags: [],
            images: []
          }
        ];
        
        setUserPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
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

  const handleDeletePost = (postId: number) => {
    setUserPosts(userPosts.filter(post => post.post_id !== postId));
  };

  const handleLikePost = (postId: number) => {
    setUserPosts(userPosts.map(post => 
      post.post_id === postId 
        ? { ...post, like_count: post.like_count + 1 } 
        : post
    ));
  };

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
      
      {/* Profile Content */}
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Posts</h2>
        
        {userPosts.length > 0 ? (
          <div>
            {userPosts.map(post => (
              <PostCard 
                key={post.post_id} 
                post={post} 
                onDelete={handleDeletePost}
                onLike={handleLikePost}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}