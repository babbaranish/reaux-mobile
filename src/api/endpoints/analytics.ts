import client from '../client';
import type { ApiResponse } from '../types';
import type { PlatformStats, SalesReport } from '../../types/models';

export const analyticsApi = {
  getStats: () =>
    client.get<ApiResponse<PlatformStats>>('/admin/stats').then(r => r.data),

  getSalesReport: () =>
    client.get<ApiResponse<SalesReport>>('/admin/sales-report').then(r => r.data),
};
