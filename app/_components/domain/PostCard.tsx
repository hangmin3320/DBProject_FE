'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '../../types/post';
import { User } from '../../types/user';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui';
import { formatDate, extractHashtags } from '../../_lib/utils';

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
  const shouldTruncate = post.content.length > 200;
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
            >
              ❤️ {post.like_count} Likes
            </Button>
            <Button variant="ghost" size="sm">
              💬 Comments
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