import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { Notification } from '../../types/models';

export const notificationsApi = {
  list: (params?: PaginationParams) =>
    client
      .get<PaginatedResponse<Notification>>('/notifications', { params })
      .then(r => r.data),

  markAsRead: (id: string) =>
    client
      .put<ApiResponse<Notification>>(`/notifications/read/${id}`)
      .then(r => r.data),

  markAllAsRead: () =>
    client.patch<ApiResponse<null>>('/notifications/mark-all-read').then(r => r.data),
};
