import { create } from 'zustand';
import { workoutsApi } from '../api/endpoints/workouts';
import type { Workout, WorkoutCategory, WorkoutDifficulty } from '../types/models';

interface WorkoutState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; pages: number };

  fetchWorkouts: (params?: {
    page?: number;
    category?: WorkoutCategory;
    difficulty?: WorkoutDifficulty;
    tag?: string;
  }) => Promise<void>;
  refreshWorkouts: (params?: {
    category?: WorkoutCategory;
    difficulty?: WorkoutDifficulty;
  }) => Promise<void>;
  fetchWorkoutById: (id: string) => Promise<void>;
  clearSelected: () => void;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  workouts: [],
  selectedWorkout: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },

  fetchWorkouts: async (params) => {
    const page = params?.page ?? 1;
    set({ isLoading: true, error: null });
    try {
      const response = await workoutsApi.list({
        page,
        limit: 10,
        category: params?.category,
        difficulty: params?.difficulty,
        tag: params?.tag,
      });
      set((state) => ({
        workouts: page === 1 ? response.data : [...state.workouts, ...response.data],
        pagination: response.pagination,
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || 'Failed to load workouts',
        isLoading: false,
      });
    }
  },

  refreshWorkouts: async (params) => {
    set({ isRefreshing: true, error: null });
    try {
      const response = await workoutsApi.list({
        page: 1,
        limit: 10,
        category: params?.category,
        difficulty: params?.difficulty,
      });
      set({
        workouts: response.data,
        pagination: response.pagination,
        isRefreshing: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to refresh workouts',
        isRefreshing: false,
      });
    }
  },

  fetchWorkoutById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workoutsApi.getById(id);
      set({ selectedWorkout: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to load workout',
        isLoading: false,
      });
    }
  },

  clearSelected: () => set({ selectedWorkout: null }),
  clearError: () => set({ error: null }),
}));
