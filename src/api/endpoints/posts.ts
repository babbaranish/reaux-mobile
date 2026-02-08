import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { Post, Comment } from '../../types/models';
import type { CreatePostRequest } from '../../types/api';

export const postsApi = {
  list: (params?: PaginationParams & { category?: string; hashtag?: string }) =>
    client.get<PaginatedResponse<Post>>('/posts', { params }).then(r => r.data),

  getById: (id: string) =>
    client
      .get<ApiResponse<{ post: Post; comments: Comment[] }>>(`/posts/${id}`)
      .then(r => r.data),

  create: (data: CreatePostRequest) =>
    client.post<ApiResponse<Post>>('/posts', data).then(r => r.data),

  like: (id: string) =>
    client.post<ApiResponse<Post>>(`/posts/${id}/like`).then(r => r.data),

  comment: (id: string, content: string) =>
    client
      .post<ApiResponse<Comment>>(`/posts/${id}/comment`, { content })
      .then(r => r.data),
};
