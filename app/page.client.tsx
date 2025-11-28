'use client';

import { useState, useRef } from 'react';
import NavbarWrapper from './_components/layout/NavbarWrapper';
import PostsList from './_components/domain/PostsList';
import { Button } from './_components/ui';
import { useAuthStore } from './_store/auth';
import { postApi } from './_lib/api';

export default function HomePageClient() {
  const [activeTab, setActiveTab] = useState('following'); // following, trending, all
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'liked'>('latest');
  const { user: currentUser, isAuthenticated } = useAuthStore();
  
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [postListKey, setPostListKey] = useState(Date.now()); // To force re-render of PostsList
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCreatePost = async () => {
    if (content.trim() === '' || !isAuthenticated) {
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    try {
      await postApi.createPost(content, files);
      setContent('');
      setFiles([]);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Change the key of PostsList to trigger a re-fetch
      setPostListKey(Date.now());
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NavbarWrapper />
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Tab Navigation */}
        <div className="flex justify-between items-center border-b border-gray-200 mb-6">
          <div className="flex">
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
          {activeTab === 'all' && (
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest' | 'liked')}
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="liked">좋아요 누른 게시물</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Create Post Form */}
        {isAuthenticated && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">무슨 일이 일어나고 있나요?</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="무슨 일이 일어나고 있나요?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isCreating}
              ></textarea>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={isCreating}
                >
                  📷 {files.length > 0 ? `${files.length} file(s) selected` : '이미지 첨부'}
                </button>
              </div>
              <Button onClick={handleCreatePost} loading={isCreating}>게시</Button>
            </div>
          </div>
        )}

        {/* Posts List */}
        <PostsList 
          key={postListKey}
          activeTab={activeTab} 
          currentUser={currentUser || undefined} 
          isAuthenticated={isAuthenticated} 
          sortBy={sortBy}
        />
      </div>
    </main>
  );
}