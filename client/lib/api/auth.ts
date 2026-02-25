import api from './api';
import type { AuthRequest , AuthResponse, LogoutResponse } from "@/types";

export const authenticateWithBackend = async (token: string) => {
  console.log(token)
  // const response = await api.post<AuthResponse>('/api/auth', {
  //   token,
  // } as AuthRequest);
  // return response.data;
  return ;
};

export const getCurrentUser = async () => {
  const response = await api.get<AuthResponse>('/api/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post<LogoutResponse>('/api/auth/logout');
  return response.data;
};