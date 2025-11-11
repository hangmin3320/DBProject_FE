// Comment-related TypeScript interfaces

import { User } from '../types/user';
import { Post } from '../types/post';

export interface Comment {
  comment_id: number;
  content: string;
  post_id: number;
  post?: Post; // Optional post object for enriched data
  user_id: number;
  user?: User; // Optional user object for enriched data
  created_at: string;
}

export interface CommentCreate {
  content: string;
}

export interface CommentUpdate {
  content: string;
}