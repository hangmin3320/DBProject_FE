'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostsList from '@/app/_components/domain/PostsList';
import { Post } from '../../types/post';
import { postApi } from '../../_lib/api';
import { useAuthStore } from '../../_store/auth';

export default function HashtagPageClient() {
  const { tag_name } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchPostsByHashtag = async () => {
      if (tag_name) {
        try {
          // Fetch posts with the specific hashtag from the API
          // Use the encoded tag name for the API call
          const postsData = await postApi.getPostsByHashtag(tag_name as string);
          setPosts(postsData);
        } catch (error) {
          console.error('Error fetching posts by hashtag:', error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPostsByHashtag();
  }, [tag_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // For this page, we can just use PostsList component without additional controls
  // since we're just displaying posts for a specific hashtag
  // Decode the URL-encoded tag name for display
  const decodedTagName = decodeURIComponent(tag_name as string);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          #{decodedTagName} 관련 게시물
        </h1>

        <PostsList hashtagName={decodedTagName} initialPosts={posts} currentUser={currentUser || undefined} />
      </div>
    </div>
  );
}