// User-related TypeScript interfaces

export interface User {
  user_id: number;
  email: string;
  username: string;
  bio: string;
  created_at: string;
  follower_count: number;
  following_count: number;
}

export interface UserCreate {
  email: string;
  username: string;
  bio?: string;
  password: string;
}

export interface UserUpdate {
  username?: string;
  bio?: string;
}

export interface PasswordUpdate {
  old_password: string;
  new_password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}