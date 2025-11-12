'use client';

import { useState } from 'react';
import NavbarWrapper from './_components/layout/NavbarWrapper';
import PostsList from './_components/domain/PostsList';
import { Button } from './_components/ui';
import { useAuthStore } from './_store/auth';

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState('following'); // following, trending, all
  const { user: currentUser, isAuthenticated } = useAuthStore();

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
              placeholder="무신 일이 일어나고 있나요?"
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
        <PostsList 
          activeTab={activeTab} 
          currentUser={currentUser || undefined} 
          isAuthenticated={isAuthenticated} 
        />
      </div>
    </main>
  );
}