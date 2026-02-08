import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { PromoCode } from '../../types/models';
import type { CreatePromoRequest } from '../../types/api';

export const promosApi = {
  list: (params?: PaginationParams & { isActive?: string; search?: string }) =>
    client.get<PaginatedResponse<PromoCode>>('/promo', { params }).then(r => r.data),

  create: (data: CreatePromoRequest) =>
    client.post<ApiResponse<PromoCode>>('/promo/create', data).then(r => r.data),

  validate: (code: string) =>
    client.post<ApiResponse<PromoCode>>('/promo/validate', { code }).then(r => r.data),
};
