import apiClient from './client';
import { Comment, CommentCreate, CommentUpdate } from '../../types/comment';

// Comment API functions
export const commentApi = {
  // Get comments for a post
  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Create a comment
  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Update a comment
  updateComment: async (commentId: number, content: string): Promise<Comment> => {
    const response = await apiClient.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};