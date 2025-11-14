'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { postApi } from '../../_lib/api';
import { EditPostModal } from './EditPostModal';

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
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        let fetchedPosts: Post[] = [];

        // If not authenticated and not on a specific user/hashtag page, prevent fetching posts
        if (!isAuthenticated && !userId && !hashtagName) {
          setPosts([]);
          setError('Please log in to view posts.');
          return;
        }
        
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
            // If not authenticated, following feed should not show public posts
            setPosts([]);
            setError('Please log in to view your following feed.');
            return;
          }
        } else if (activeTab === 'trending') {
          fetchedPosts = await postApi.getTrending();
        } else if (userId) {
          // Fetch posts for a specific user
          fetchedPosts = await postApi.getPosts(0, 100, userId);
        } else {
          // Default to all posts, but only if authenticated
          if (isAuthenticated) {
            fetchedPosts = await postApi.getPosts();
          } else {
            setPosts([]);
            setError('Please log in to view all posts.');
            return;
          }
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
    const originalPosts = [...posts];

    const updatedPosts = posts.map(post => {
      if (post.post_id === postId) {
        const newIsLiked = !post.is_liked;
        const newLikeCount = newIsLiked ? post.like_count + 1 : post.like_count - 1;
        return { ...post, is_liked: newIsLiked, like_count: newLikeCount };
      }
      return post;
    });

    // Optimistic update
    setPosts(updatedPosts);

    try {
      // The API should return the updated post object
      const updatedPost = await postApi.likePost(postId);
      // Sync state with the server's response
      setPosts(posts.map(p => p.post_id === updatedPost.post_id ? updatedPost : p));
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setPosts(originalPosts);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p.post_id === updatedPost.post_id ? updatedPost : p));
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
            onEdit={handleEditPost}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet</p>
        </div>
      )}

      <EditPostModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}