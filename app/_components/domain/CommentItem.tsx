'use client';

import React from 'react';
import Link from 'next/link';
import { Comment } from '../../types/comment';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../_lib/utils';

interface CommentItemProps {
  comment: Comment;
  onEdit?: (comment: Comment) => void;
  onDelete?: (commentId: number) => void;
}

const CommentItemComponent = ({ comment, onEdit, onDelete }: CommentItemProps) => {
  // Mock current user - in a real app, this would come from context or store
  const currentUser = {
    id: 1,
    email: 'user@example.com',
    username: 'JohnDoe',
    bio: 'Software Developer',
    follower_count: 10,
    following_count: 15
  };
  
  // Check if current user is the comment author
  const isAuthor = currentUser && currentUser.id === comment.user_id;

  return (
    <div className="flex items-start py-3 border-b border-gray-100">
      <Link href={`/profile/${comment.user_id}`}>
        <Avatar 
          src="" 
          fallback={comment.user?.username?.charAt(0).toUpperCase() || 'U'} 
          size="sm"
        />
      </Link>
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <Link href={`/profile/${comment.user_id}`} className="font-semibold text-gray-900 hover:underline text-sm">
            {comment.user?.username || `User ${comment.user_id}`}
          </Link>
          <span className="mx-2 text-gray-500 text-xs">•</span>
          <span className="text-gray-500 text-xs">{formatDate(comment.created_at)}</span>
        </div>
        <p className="mt-1 text-gray-800 text-sm">{comment.content}</p>
        
        {isAuthor && (
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={() => onEdit && onEdit(comment)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete && onDelete(comment.comment_id)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CommentItem = (props: CommentItemProps) => {
  return <CommentItemComponent {...props} />;
};

export { CommentItem };