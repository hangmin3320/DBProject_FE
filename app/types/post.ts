// Post-related TypeScript interfaces

import { User } from '../types/user';

export interface Hashtag {
  hashtag_id: number;
  name: string;
}

export interface Image {
  image_id: number;
  image_url: string;
}

export interface Post {
  post_id: number;
  content: string;
  user_id: number;
  user?: User; // Optional user object for enriched data
  created_at: string;
  like_count: number;
  is_liked: boolean;
  hashtags: Hashtag[];
  images: Image[];
}

export interface PostCreate {
  content: string;
  files?: File[];
}

export interface PostUpdate {
  content?: string;
}