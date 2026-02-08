import { create } from 'zustand';
import { dietsApi } from '../api/endpoints/diets';
import type { DietPlan, DietCategory } from '../types/models';
import type { CreateDietRequest } from '../types/api';

interface DietPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface DietState {
  plans: DietPlan[];
  selectedPlan: DietPlan | null;
  isLoading: boolean;
  error: string | null;
  pagination: DietPagination;

  fetchPlans: (page?: number, category?: DietCategory) => Promise<void>;
  getPlanById: (id: string) => Promise<void>;
  followPlan: (id: string) => Promise<void>;
  likePlan: (id: string) => Promise<void>;
  createPlan: (data: CreateDietRequest | FormData) => Promise<void>;
  updatePlan: (id: string, data: Partial<CreateDietRequest> | FormData) => Promise<void>;
  clearError: () => void;
  clearSelectedPlan: () => void;
}

export const useDietStore = create<DietState>((set, get) => ({
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },

  fetchPlans: async (page = 1, category?) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, any> = { page, limit: 10 };
      if (category) params.category = category;
      const response = await dietsApi.list(params);
      set({
        plans: page === 1 ? response.data : [...get().plans, ...response.data],
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch diet plans',
        isLoading: false,
      });
    }
  },

  getPlanById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dietsApi.getById(id);
      set({ selectedPlan: response.data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch diet plan',
        isLoading: false,
      });
    }
  },

  followPlan: async (id) => {
    try {
      const response = await dietsApi.follow(id);
      const updatedPlan = response.data;
      set((state) => ({
        plans: state.plans.map((p) => (p._id === id ? updatedPlan : p)),
        selectedPlan:
          state.selectedPlan?._id === id ? updatedPlan : state.selectedPlan,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to follow plan' });
    }
  },

  likePlan: async (id) => {
    try {
      const response = await dietsApi.like(id);
      const updatedPlan = response.data;
      set((state) => ({
        plans: state.plans.map((p) => (p._id === id ? updatedPlan : p)),
        selectedPlan:
          state.selectedPlan?._id === id ? updatedPlan : state.selectedPlan,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to like plan' });
    }
  },

  createPlan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dietsApi.create(data);
      set((state) => ({
        plans: [response.data, ...state.plans],
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || 'Failed to create diet plan',
        isLoading: false,
      });
      throw err;
    }
  },

  updatePlan: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dietsApi.update(id, data);
      set((state) => ({
        plans: state.plans.map((p) => (p._id === id ? response.data : p)),
        selectedPlan:
          state.selectedPlan?._id === id ? response.data : state.selectedPlan,
        isLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || 'Failed to update diet plan',
        isLoading: false,
      });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedPlan: () => set({ selectedPlan: null }),
}));
