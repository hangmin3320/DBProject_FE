'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PostCard } from '../../_components/domain/PostCard';
import { CommentItem } from '../../_components/domain/CommentItem';
import { Input, Button } from '../../_components/ui';
import { Post } from '../../types/post';
import { Comment } from '../../types/comment';
import { User } from '../../types/user';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Mock current user ID - in a real app, get from auth store
  const currentUserId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock post data - in a real app, fetch from API
        const mockPost: Post = {
          post_id: Number(postId),
          content: 'This is an example post with some detailed content to see how the post detail page looks like. It includes images, hashtags and can have multiple lines.',
          user_id: 1,
          user: {
            user_id: 1,
            email: 'user@example.com',
            username: 'JohnDoe',
            bio: 'Software Developer',
            created_at: new Date().toISOString(),
            follower_count: 10,
            following_count: 15
          },
          created_at: new Date().toISOString(),
          like_count: 5,
          hashtags: [
            { hashtag_id: 1, name: 'example' },
            { hashtag_id: 2, name: 'detail' }
          ],
          images: [
            { image_id: 1, image_url: 'https://via.placeholder.com/600x400.png?text=Post+Image' }
          ]
        };
        
        setPost(mockPost);
        
        // Mock comments for the post - in a real app, fetch from API
        const mockComments: Comment[] = [
          {
            comment_id: 1,
            content: 'Great post! Thanks for sharing.',
            post_id: Number(postId),
            user_id: 2,
            user: {
              user_id: 2,
              email: 'commenter@example.com',
              username: 'Commenter',
              bio: 'Frequent commenter',
              created_at: new Date().toISOString(),
              follower_count: 5,
              following_count: 8
            },
            created_at: new Date().toISOString()
          },
          {
            comment_id: 2,
            content: 'I really enjoyed reading this.',
            post_id: Number(postId),
            user_id: 3,
            user: {
              user_id: 3,
              email: 'reader@example.com',
              username: 'Reader',
              bio: 'Active reader',
              created_at: new Date().toISOString(),
              follower_count: 12,
              following_count: 7
            },
            created_at: new Date().toISOString()
          }
        ];
        
        setComments(mockComments);
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

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    
    const newCommentObj: Comment = {
      comment_id: comments.length + 1, // Mock ID
      content: newComment,
      post_id: Number(postId),
      user_id: currentUserId,
      user: {
        user_id: currentUserId,
        email: 'currentuser@example.com',
        username: 'CurrentUser',
        bio: 'Current user',
        created_at: new Date().toISOString(),
        follower_count: 5,
        following_count: 8
      },
      created_at: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
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

  const handleDeletePost = (postId: number) => {
    console.log('Deleting post:', postId);
    // In a real app, implement actual deletion
  };

  const handleLikePost = (postId: number) => {
    setPost({
      ...post,
      like_count: post.like_count + 1
    });
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.comment_id !== commentId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Post Detail */}
      <div className="max-w-2xl mx-auto py-6 px-4">
        <PostCard 
          post={post} 
          onDelete={handleDeletePost}
          onLike={handleLikePost}
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
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}