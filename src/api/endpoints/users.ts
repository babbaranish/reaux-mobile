import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { User, Role, UserStatus } from '../../types/models';

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  gymId?: string;
  status?: UserStatus;
}

export const usersApi = {
  getUsers: (params?: PaginationParams) =>
    client.get<PaginatedResponse<User>>('/users', { params }).then(r => r.data),

  getUserById: (id: string) =>
    client.get<ApiResponse<User>>(`/users/${id}`).then(r => r.data),

  createUser: (payload: CreateUserPayload) =>
    client.post<ApiResponse<User>>('/users', payload).then(r => r.data),

  updateUserRole: (id: string, role: Role) =>
    client.put<ApiResponse<User>>(`/users/${id}/role`, { role }).then(r => r.data),

  updateUserStatus: (id: string, status: UserStatus) =>
    client.put<ApiResponse<User>>(`/users/${id}/status`, { status }).then(r => r.data),
};
