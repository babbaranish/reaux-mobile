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

  // Push notification device token management
  registerDeviceToken: (token: string) =>
    client
      .post<ApiResponse<{ message: string }>>('/notifications/device-token', { token })
      .then(r => r.data),

  removeDeviceToken: (token: string) =>
    client
      .delete<ApiResponse<{ message: string }>>('/notifications/device-token', { data: { token } })
      .then(r => r.data),

  sendTestNotification: () =>
    client
      .post<ApiResponse<{ message: string }>>('/notifications/test')
      .then(r => r.data),
};
