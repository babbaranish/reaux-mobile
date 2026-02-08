import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { Challenge } from '../../types/models';
import type { CreateChallengeRequest } from '../../types/api';

export const challengesApi = {
  list: (params?: PaginationParams) =>
    client.get<PaginatedResponse<Challenge>>('/challenges', { params }).then(r => r.data),

  create: (data: CreateChallengeRequest) =>
    client.post<ApiResponse<Challenge>>('/challenges', data).then(r => r.data),

  join: (id: string) =>
    client.post<ApiResponse<Challenge>>(`/challenges/${id}/join`).then(r => r.data),
};
