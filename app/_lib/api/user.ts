import apiClient from './client';
import { User, UserCreate, UserUpdate, PasswordUpdate } from '../types/user';

// User API functions
export const userApi = {
  // Sign up a new user
  signup: async (userData: UserCreate): Promise<User> => {
    const response = await apiClient.post('/users/signup', userData);
    return response.data;
  },

  // Login user and get token
  login: async (email: string, password: string): Promise<{ access_token: string; token_type: string }> => {
    const response = await apiClient.post('/users/token', { email, password });
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/search`, { params: { q: query } });
    return response.data;
  },

  // Update user profile
  updateUser: async (userId: number, userData: UserUpdate): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Update user password
  updatePassword: async (userId: number, passwordData: PasswordUpdate): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },

  // Follow a user
  followUser: async (userId: number): Promise<void> => {
    await apiClient.post(`/users/${userId}/follow`);
  },

  // Unfollow a user
  unfollowUser: async (userId: number): Promise<void> => {
    await apiClient.delete(`/users/${userId}/follow`);
  },

  // Get followers of a user
  getFollowers: async (userId: number): Promise<User[]> => {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return response.data;
  },

  // Get users that a user is following
  getFollowing: async (userId: number): Promise<User[]> => {
    const response = await apiClient.get(`/users/${userId}/following`);
    return response.data;
  },
};