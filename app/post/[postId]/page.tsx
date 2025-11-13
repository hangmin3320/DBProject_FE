'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostCard } from '../../_components/domain/PostCard';
import { CommentItem } from '../../_components/domain/CommentItem';
import { Input, Button } from '../../_components/ui';
import { Post } from '../../types/post';
import { Comment } from '../../types/comment';
import { User } from '../../types/user';
import { postApi } from '../../_lib/api';
import { commentApi } from '../../_lib/api';
import { useAuthStore } from '../../_store/auth';
import { EditPostModal } from '../../_components/domain/EditPostModal';
import { EditCommentModal } from '../../_components/domain/EditCommentModal';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuthStore();
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post data from API
        const postData = await postApi.getPostById(Number(postId));
        setPost(postData);

        // Fetch comments for this post
        const commentsData = await commentApi.getComments(Number(postId));
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !currentUser) return;

    try {
      // Add comment via API
      const newCommentData = await commentApi.createComment(Number(postId), newComment);
      
      // Add to local state
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Post not found</p>
      </div>
    );
  }

  const handleDeletePost = async (postId: number) => {
    try {
      await postApi.deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!post) return;

    const originalPost = { ...post };
    const newIsLiked = !post.is_liked;
    const newLikeCount = newIsLiked ? post.like_count + 1 : post.like_count - 1;

    // Optimistic update
    setPost({
      ...post,
      is_liked: newIsLiked,
      like_count: newLikeCount,
    });

    try {
      await postApi.likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      setPost(originalPost);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter(comment => comment.comment_id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments(comments.map(c => c.comment_id === updatedComment.comment_id ? updatedComment : c));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Post Detail */}
      <div className="max-w-2xl mx-auto py-6 px-4">
        <PostCard
          post={post}
          currentUser={currentUser || undefined}
          onDelete={handleDeletePost}
          onLike={handleLikePost}
          onEdit={handleEditPost}
        />

        {/* Comment Form */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leave a comment</h3>
          <div className="mb-4">
            <Input
              type="text"
              placeholder="댓글을 남겨보세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddComment}>등록</Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Comments ({comments.length})
          </h3>

          {comments.length > 0 ? (
            <div>
              {comments.map(comment => (
                <CommentItem
                  key={comment.comment_id}
                  comment={comment}
                  currentUser={currentUser || undefined}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          )}
        </div>
      </div>
      <EditPostModal 
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={handlePostUpdated}
      />
      <EditCommentModal
        comment={editingComment}
        onClose={() => setEditingComment(null)}
        onCommentUpdated={handleCommentUpdated}
      />
    </div>
  );
}