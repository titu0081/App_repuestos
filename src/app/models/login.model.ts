export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginRequest {
  name: string;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: LoginUser;
  token: string;
}
