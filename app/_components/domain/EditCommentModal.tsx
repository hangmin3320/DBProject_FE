'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Comment } from '../../types/comment';
import { commentApi } from '../../_lib/api';

interface EditCommentModalProps {
  comment: Comment | null;
  onClose: () => void;
  onCommentUpdated: (updatedComment: Comment) => void;
}

export const EditCommentModal = ({ comment, onClose, onCommentUpdated }: EditCommentModalProps) => {
  const [content, setContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
  }, [comment]);

  if (!comment) {
    return null;
  }

  const handleUpdate = async () => {
    if (content.trim() === '') {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const updatedComment = await commentApi.updateComment(comment.comment_id, content);
      onCommentUpdated(updatedComment);
      onClose();
    } catch (err) {
      setError('댓글 수정에 실패했습니다. 다시 시도해주세요.');
      console.error('Update comment error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={!!comment} onClose={onClose} title="댓글 수정">
      <div className="mt-4">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isUpdating}
        ></textarea>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
          취소
        </Button>
        <Button onClick={handleUpdate} loading={isUpdating}>
          수정
        </Button>
      </div>
    </Modal>
  );
};
