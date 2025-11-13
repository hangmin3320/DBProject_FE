'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Post } from '../../types/post';
import { postApi } from '../../_lib/api';

interface EditPostModalProps {
  post: Post | null;
  onClose: () => void;
  onPostUpdated: (updatedPost: Post) => void;
}

export const EditPostModal = ({ post, onClose, onPostUpdated }: EditPostModalProps) => {
  const [content, setContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  if (!post) {
    return null;
  }

  const handleUpdate = async () => {
    if (content.trim() === '') {
      setError('Content cannot be empty.');
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      const updatedPost = await postApi.updatePost(post.post_id, { content });
      onPostUpdated(updatedPost);
      onClose();
    } catch (err) {
      setError('Failed to update post. Please try again.');
      console.error('Update post error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={!!post} onClose={onClose} title="Edit Post">
      <div className="mt-4">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isUpdating}
        ></textarea>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} loading={isUpdating}>
          Update
        </Button>
      </div>
    </Modal>
  );
};
