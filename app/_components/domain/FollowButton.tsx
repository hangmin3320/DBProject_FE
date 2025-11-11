'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../_store/auth';
import { userApi } from '../../_lib/api';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onFollowToggle?: (isFollowing: boolean) => void;
}

const FollowButton = ({ userId, isFollowing, onFollowToggle }: FollowButtonProps) => {
  const { user: currentUser } = useAuthStore();
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
        await userApi.unfollowUser(userId);
        setIsFollowingState(false);
      } else {
        await userApi.followUser(userId);
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

export { FollowButton };