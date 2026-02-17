export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  register: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthRequest {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}