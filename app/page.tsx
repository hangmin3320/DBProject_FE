'use client';

import { useState } from 'react';
import NavbarWrapper from './_components/layout/NavbarWrapper';
import { PostCard } from './_components/domain/PostCard';
import { Button } from './_components/ui';
import { Post } from './types/post';
import { User } from './types/user';

export default function HomePage() {
  // Mock data for demonstration
  const mockUser: User = {
    user_id: 1,
    email: 'user@example.com',
    username: 'JohnDoe',
    bio: 'Software Developer',
    created_at: new Date().toISOString(),
    follower_count: 10,
    following_count: 15
  };

  const mockPosts: Post[] = [
    {
      post_id: 1,
      content: 'First post! This is a sample post with #hashtag example.',
      user_id: 1,
      user: mockUser,
      created_at: new Date().toISOString(),
      like_count: 5,
      hashtags: [
        { hashtag_id: 1, name: 'hashtag' }
      ],
      images: []
    },
    {
      post_id: 2,
      content: 'Second post! Another example post to show the feed.',
      user_id: 1,
      user: mockUser,
      created_at: new Date().toISOString(),
      like_count: 12,
      hashtags: [],
      images: []
    }
  ];

  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [activeTab, setActiveTab] = useState('following'); // following, trending, all

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.post_id !== postId));
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.post_id === postId 
        ? { ...post, like_count: post.like_count + 1 } 
        : post
    ));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('following')}
          >
            팔로잉 피드
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'trending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('trending')}
          >
            트렌딩
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            전체 게시물
          </button>
        </div>

        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">무슨 일이 일어나고 있나요?</h2>
          <div className="mb-4">
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="무슨 일이 일어나고 있나요?"
            ></textarea>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">
                📷 이미지 첨부
              </button>
            </div>
            <Button>게시</Button>
          </div>
        </div>

        {/* Posts List */}
        <div>
          {posts.map(post => (
            <PostCard 
              key={post.post_id} 
              post={post} 
              onDelete={handleDeletePost}
              onLike={handleLikePost}
            />
          ))}
        </div>
      </div>
    </main>
  );
}