import apiClient from './client';
import { Post, PostCreate, PostUpdate } from '../../types/post';

// Post API functions
export const postApi = {
  // Get posts
  getPosts: async (skip: number = 0, limit: number = 100, userId?: number, sortBy: 'latest' | 'oldest' = 'latest'): Promise<Post[]> => {
    const response = await apiClient.get('/posts', {
      params: { skip, limit, user_id: userId, sort_by: sortBy }
    });
    return response.data;
  },

  // Get feed posts
  getFeed: async (skip: number = 0, limit: number = 100): Promise<Post[]> => {
    const response = await apiClient.get('/posts/feed', { params: { skip, limit } });
    return response.data;
  },

  // Get trending posts
  getTrending: async (skip: number = 0, limit: number = 10): Promise<Post[]> => {
    const response = await apiClient.get('/posts/trending', { params: { skip, limit } });
    return response.data;
  },

  // Get liked posts
  getLikedPosts: async (): Promise<Post[]> => {
    const response = await apiClient.get('/posts/liked');
    return response.data;
  },

  // Create a new post
  createPost: async (content: string, files?: File[]): Promise<Post> => {
    const formData = new FormData();
    formData.append('content', content);
    
    if (files) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    }
    
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get post by ID
  getPostById: async (postId: number): Promise<Post> => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  },

  // Update a post
  updatePost: async (postId: number, postData: PostUpdate): Promise<Post> => {
    const response = await apiClient.put(`/posts/${postId}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
  },

  // Like a post
  likePost: async (postId: number): Promise<void> => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Get posts by hashtag
  getPostsByHashtag: async (tagName: string): Promise<Post[]> => {
    const response = await apiClient.get(`/tags/${tagName}/posts`);
    return response.data;
  },
};