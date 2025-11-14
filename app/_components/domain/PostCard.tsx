'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui';
import { formatDate, extractHashtags } from '../../_lib/utils';

import { HeartOutlineIcon } from '../ui/HeartOutlineIcon';
import { HeartFilledIcon } from '../ui/HeartFilledIcon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

interface PostCardProps {
  post: Post;
  currentUser?: User; // Pass current user as prop to avoid hook issues
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  onLike?: (postId: number) => void;
}

const PostCard = ({ post, currentUser, onEdit, onDelete, onLike }: PostCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if current user is the post author
  const isAuthor = currentUser && currentUser.user_id === post.user_id;
  
  // Extract hashtags from content
  const hashtags = extractHashtags(post.content);
  
  // Truncate content if too long
  const shouldTruncate = (post.content || '').length > 200;
  const displayContent = isExpanded 
    ? post.content 
    : shouldTruncate 
      ? `${post.content.substring(0, 200)}...` 
      : post.content;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <div className="flex items-start">
        <Link href={`/profile/${post.user_id}`}>
          <Avatar 
            src="" 
            fallback={post.user?.username?.charAt(0).toUpperCase() || 'U'} 
            size="md"
          />
        </Link>
        <div className="ml-4 flex-1">
          <div className="flex items-center">
            <Link href={`/profile/${post.user_id}`} className="font-semibold text-gray-900 hover:underline">
              {post.user?.username || `User ${post.user_id}`}
            </Link>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-gray-500 text-sm">{formatDate(post.created_at)}</span>
          </div>
          <div className="mt-2 text-gray-800">
            {displayContent}
            
            {shouldTruncate && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-blue-600"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
          
          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {hashtags.map((tag, index) => (
                <Link 
                  key={index} 
                  href={`/tags/${tag}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {post.images.map((image, index) => (
                <img 
                  key={index} 
                  src={`${API_BASE_URL}${image.image_url}`} 
                  alt={`Post image ${index + 1}`} 
                  className="w-full h-auto rounded object-cover"
                />
              ))}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 flex items-center text-gray-500 space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onLike && onLike(post.post_id)}
              className="flex items-center space-x-1"
            >
              {post.is_liked ? (
                <HeartFilledIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="w-5 h-5" />
              )}
              <span>{post.like_count}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span>Comments</span>
            </Button>
            {isAuthor && (
              <div className="flex space-x-2 ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit && onEdit(post)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete && onDelete(post.post_id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PostCard };