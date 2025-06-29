export interface UserData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface LoginInput {
  username: string;
  password: string;
}