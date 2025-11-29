'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui';
import { userApi } from '../../_lib/api';
import { useAuthStore } from '../../_store/auth';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onFollowToggle?: (isFollowing: boolean) => void;
}

const FollowButton = ({ userId, isFollowing, onFollowToggle }: FollowButtonProps) => {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [isFollowingState, setIsFollowingState] = useState(isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsFollowingState(isFollowing);
  }, [isFollowing]);

  if (!isAuthenticated || currentUser?.user_id === userId) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    const previousState = isFollowingState;
    // 1. Optimistic Update: Change UI immediately
    setIsFollowingState(!previousState);
    setIsLoading(true);

    try {
      if (previousState) {
        // If it was following, now unfollow
        await userApi.unfollowUser(userId);
      } else {
        // If it was not following, now follow
        await userApi.followUser(userId);
      }
      onFollowToggle?.(!previousState);
    } catch (error) {
      console.error('Error toggling follow status:', error);
      // 2. Revert on error
      setIsFollowingState(previousState);
      // In a real app, you might want to show a toast notification here
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
      // Prevent clicking again while the API call is in progress
      disabled={isLoading}
    >
      {isFollowingState ? '언팔로우' : '팔로우'}
    </Button>
  );
};

export { FollowButton };
