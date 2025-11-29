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

  // Don't show button if it's the current user's own profile
  if (!isAuthenticated || currentUser?.user_id === userId) {
    return null;
  }

  const handleFollowToggle = async () => {
    if (!currentUser) {
      // Not logged in, maybe redirect to sign in in a real app or show a toast
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
      // Revert state if API call fails
      setIsFollowingState(isFollowingState);
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
      {isFollowingState ? '언팔로우' : '팔로우'}
    </Button>
  );
};

export { FollowButton };