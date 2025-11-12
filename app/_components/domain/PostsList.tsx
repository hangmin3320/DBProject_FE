'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { postApi } from '../../_lib/api';

interface PostsListProps {
  activeTab?: string; // Optional - for different feed types
  userId?: number; // Optional user ID to filter posts by user
  hashtagName?: string; // Optional hashtag name to filter posts by hashtag
  initialPosts?: Post[]; // Optional initial posts to display without fetching
  currentUser?: User; // Pass current user as prop to avoid hook issues
  isAuthenticated?: boolean; // Whether the user is authenticated
}

export default function PostsList({ 
  activeTab = 'all', 
  userId, 
  hashtagName, 
  initialPosts, 
  currentUser,
  isAuthenticated = false 
}: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        
        let fetchedPosts: Post[] = [];
        
        if (initialPosts) {
          // Use provided initial posts
          fetchedPosts = initialPosts;
        } else if (hashtagName) {
          // Fetch posts for a specific hashtag
          fetchedPosts = await postApi.getPostsByHashtag(hashtagName);
        } else if (activeTab === 'following') {
          // For the 'following' tab, only load if user is authenticated
          if (isAuthenticated) {
            fetchedPosts = await postApi.getFeed();
          } else {
            // If not authenticated, show public posts instead
            fetchedPosts = await postApi.getPosts();
          }
        } else if (activeTab === 'trending') {
          fetchedPosts = await postApi.getTrending();
        } else if (userId) {
          // Fetch posts for a specific user
          fetchedPosts = await postApi.getPosts(0, 100, userId);
        } else {
          fetchedPosts = await postApi.getPosts();
        }
        
        setPosts(fetchedPosts);
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        // Check if it's an authentication error
        if (error.response?.status === 401) {
          setError('Please log in to view this content');
        } else {
          setError('Failed to load posts. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, userId, hashtagName, initialPosts, isAuthenticated]);

  const handleDeletePost = async (postId: number) => {
    try {
      await postApi.deletePost(postId);
      setPosts(posts.filter(post => post.post_id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      // In a real app, this would make an API call
      // await postApi.likePost(postId);
      
      // For now, update the count optimistically
      setPosts(posts.map(post => 
        post.post_id === postId 
          ? { ...post, like_count: post.like_count + 1 } 
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">{error}</p>
        {error.includes('log in') && (
          <a href="/auth/signin" className="text-blue-600 hover:underline mt-2 inline-block">
            Sign in
          </a>
        )}
      </div>
    );
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard 
            key={post.post_id} 
            post={post} 
            currentUser={currentUser}
            onDelete={handleDeletePost}
            onLike={handleLikePost}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}
    </div>
  );
}