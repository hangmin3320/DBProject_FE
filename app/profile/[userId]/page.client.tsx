'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import NavbarWrapper from '../../_components/layout/NavbarWrapper';
import PostsList from '../../_components/domain/PostsList';
import { FollowButton } from '../../_components/domain/FollowButton';
import { Avatar } from '../../_components/ui/Avatar';
import { Button } from '../../_components/ui/Button';
import { UserListModal } from '../../_components/domain/UserListModal';
import { User } from '../../types/user';
import { userApi } from '../../_lib/api';
import { useAuthStore } from '../../_store/auth';

export default function ProfilePageClient() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'followers' | 'following' | null;
    title: string;
    users: User[];
    loading: boolean;
  }>({
    isOpen: false,
    type: null,
    title: '',
    users: [],
    loading: false,
  });

  const isOwnProfile = currentUser?.user_id === Number(userId);

  useEffect(() => {
    const fetchUserData = async (id: number) => {
      try {
        const userData = await userApi.getUserById(id);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      const numericUserId = Array.isArray(userId) ? Number(userId[0]) : Number(userId);
      if (!isNaN(numericUserId) && isFinite(numericUserId)) {
        fetchUserData(numericUserId);
      } else {
        console.error('Invalid user ID:', userId);
        setError('유효하지 않은 사용자 ID입니다.');
        setLoading(false);
      }
    } else {
      setError('사용자 ID를 찾을 수 없습니다.');
      setLoading(false);
    }
  }, [userId]);

  const openUserListModal = async (type: 'followers' | 'following') => {
    if (!user) return;

    setModalState({
      isOpen: true,
      type: type,
      title: type === 'followers' ? '팔로워' : '팔로잉',
      users: [],
      loading: true,
    });

    try {
      const users = type === 'followers'
        ? await userApi.getFollowers(user.user_id)
        : await userApi.getFollowing(user.user_id);
      
      setModalState(prev => ({ ...prev, users, loading: false }));
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      setModalState(prev => ({ ...prev, loading: false, error: `Error fetching ${type}` }));
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, title: '', users: [], loading: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>사용자를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <NavbarWrapper />
        {/* Profile Header */}
        <div className="bg-white shadow">
          <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Avatar 
                  src="" 
                  fallback={user.username.charAt(0).toUpperCase()} 
                  size="xl" 
                />
              </div>
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    <p className="text-gray-600">@{user.email}</p>
                  </div>
                  
                  <div className="flex space-x-3">
                    {isOwnProfile ? (
                      <Button>
                        <a href="/settings">프로필 수정</a>
                      </Button>
                    ) : (
                      <FollowButton 
                        userId={user.user_id} 
                        isFollowing={user.is_following || false}
                      />
                    )}
                  </div>
                </div>
                
                <p className="mt-3 text-gray-700">{user.bio}</p>
                
                <div className="mt-4 flex space-x-6">
                  <div className="cursor-pointer" onClick={() => openUserListModal('following')}>
                    <span className="font-semibold text-gray-900">{user.following_count}</span>
                    <span className="text-gray-600 ml-1">팔로잉</span>
                  </div>
                  <div className="cursor-pointer" onClick={() => openUserListModal('followers')}>
                    <span className="font-semibold text-gray-900">{user.follower_count}</span>
                    <span className="text-gray-600 ml-1">팔로워</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content - showing only this user's posts */}
        <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">게시물</h2>
          
          <PostsList activeTab="all" userId={Number(userId)} currentUser={currentUser || undefined} />
        </div>
      </main>

      <UserListModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        users={modalState.users}
        loading={modalState.loading}
      />
    </>
  );
}