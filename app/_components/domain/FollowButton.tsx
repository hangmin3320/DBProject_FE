'use client';

import React, { useState } from 'react';
import { Button } from '../ui';
import { userApi } from '../../_lib/api';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onFollowToggle?: (isFollowing: boolean) => void;
}

const FollowButtonComponent = ({ userId, isFollowing, onFollowToggle }: FollowButtonProps) => {
  // Mock current user - in a real app, this would come from context or store
  const currentUser = {
    id: 1,
    email: 'user@example.com',
    username: 'JohnDoe',
    bio: 'Software Developer',
    follower_count: 10,
    following_count: 15
  };
  
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);
  
  // Don't show button if it's the current user's own profile
  if (currentUser?.id === userId) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (!currentUser) {
      // Not logged in, redirect to sign in
      console.log("Please sign in to follow users");
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowingState) {
        // In a real app, you would call the API
        // await userApi.unfollowUser(userId);
        setIsFollowingState(false);
      } else {
        // In a real app, you would call the API
        // await userApi.followUser(userId);
        setIsFollowingState(true);
      }
      onFollowToggle?.(!isFollowingState);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowingState ? 'secondary' : 'primary'}
      size="sm"
      onClick={handleFollowToggle}
      loading={isLoading}
    >
      {isFollowingState ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

const FollowButton = (props: FollowButtonProps) => {
  return <FollowButtonComponent {...props} />;
};

export { FollowButton };