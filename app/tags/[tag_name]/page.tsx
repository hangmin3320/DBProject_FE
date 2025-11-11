'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostCard } from '../../_components/domain/PostCard';
import { Post } from '../../types/post';
import { User } from '../../types/user';

export default function HashtagPage() {
  const { tag_name } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tag_name) {
      // In a real app, fetch posts with the specific hashtag from the API
      // For now, we'll use mock data
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
          content: `This is a post with the #${tag_name} hashtag. It shows how posts with specific tags are displayed.`,
          user_id: 1,
          user: mockUser,
          created_at: new Date().toISOString(),
          like_count: 5,
          hashtags: [
            { hashtag_id: 1, name: tag_name as string }
          ],
          images: []
        },
        {
          post_id: 2,
          content: `Another example post with the #${tag_name} hashtag. This helps demonstrate the hashtag page functionality.`,
          user_id: 2,
          user: {
            ...mockUser,
            user_id: 2,
            username: 'JaneSmith'
          },
          created_at: new Date().toISOString(),
          like_count: 12,
          hashtags: [
            { hashtag_id: 1, name: tag_name as string },
            { hashtag_id: 2, name: 'example' }
          ],
          images: [
            { image_id: 1, image_url: 'https://via.placeholder.com/600x400.png?text=Example+Image' }
          ]
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    }
  }, [tag_name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          #{tag_name} 관련 게시물
        </h1>
        
        {posts.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found with the hashtag #{tag_name}</p>
          </div>
        )}
      </div>
    </div>
  );
}