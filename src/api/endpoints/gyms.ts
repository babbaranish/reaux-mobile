import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { Gym } from '../../types/models';

export interface CreateGymRequest {
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  phone?: string;
  email?: string;
  amenities?: string[];
}

export const gymsApi = {
  list: (params?: PaginationParams & { city?: string }) =>
    client.get<PaginatedResponse<Gym>>('/gyms', { params }).then((r) => r.data),

  getById: (id: string) =>
    client.get<ApiResponse<Gym>>(`/gyms/${id}`).then((r) => r.data),

  create: (data: CreateGymRequest) =>
    client.post<ApiResponse<Gym>>('/gyms', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateGymRequest>) =>
    client.put<ApiResponse<Gym>>(`/gyms/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    client.delete<ApiResponse<null>>(`/gyms/${id}`).then((r) => r.data),

  assignAdmin: (gymId: string, userId: string) =>
    client
      .post<ApiResponse<any>>(`/gyms/${gymId}/assign-admin`, { userId })
      .then((r) => r.data),
};
