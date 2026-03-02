import client from '../client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '../types';
import type { Workout, WorkoutCategory, WorkoutDifficulty } from '../../types/models';

interface WorkoutFilters extends PaginationParams {
  category?: WorkoutCategory;
  difficulty?: WorkoutDifficulty;
  tag?: string;
}

interface CreateWorkoutPayload {
  title: string;
  description?: string;
  category: WorkoutCategory;
  difficulty: WorkoutDifficulty;
  duration: number;
  caloriesBurn?: number;
  image?: string;
  tags?: string[];
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
    restTime?: number;
    notes?: string;
  }[];
}

export const workoutsApi = {
  list: (params?: WorkoutFilters) =>
    client.get<PaginatedResponse<Workout>>('/workouts', { params }).then(r => r.data),

  getById: (id: string) =>
    client.get<ApiResponse<Workout>>(`/workouts/${id}`).then(r => r.data),

  create: (data: CreateWorkoutPayload) =>
    client.post<ApiResponse<Workout>>('/workouts', data).then(r => r.data),

  update: (id: string, data: Partial<CreateWorkoutPayload>) =>
    client.put<ApiResponse<Workout>>(`/workouts/${id}`, data).then(r => r.data),

  delete: (id: string) =>
    client.delete<ApiResponse<null>>(`/workouts/${id}`).then(r => r.data),
};
