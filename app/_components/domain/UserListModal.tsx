'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/app/_components/ui/Modal';
import { Avatar } from '@/app/_components/ui/Avatar';
import { Button } from '@/app/_components/ui/Button';
import { Spinner } from '@/app/_components/ui/Spinner';
import { FollowButton } from '@/app/_components/domain/FollowButton';
import { User } from '@/app/types/user';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: User[];
  loading: boolean;
}

export const UserListModal = ({ isOpen, onClose, title, users, loading }: UserListModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mt-4 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : users.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.user_id} className="py-3 flex items-center justify-between">
                <Link href={`/profile/${user.user_id}`} onClick={onClose} className="flex items-center space-x-3">
                  <Avatar src="" fallback={user.username.charAt(0).toUpperCase()} size="md" />
                  <span className="font-medium text-gray-800">{user.username}</span>
                </Link>
                <FollowButton userId={user.user_id} isFollowing={user.is_following || false} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">사용자를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
