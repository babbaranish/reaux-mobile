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
  suggestedPlans: DietPlan[];
  isLoading: boolean;
  error: string | null;
  pagination: DietPagination;
  suggestedPagination: DietPagination;

  fetchPlans: (page?: number, category?: DietCategory) => Promise<void>;
  getPlanById: (id: string) => Promise<void>;
  fetchSuggestedPlans: (page?: number) => Promise<void>;
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
  suggestedPlans: [],
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, pages: 0 },
  suggestedPagination: { page: 1, limit: 10, total: 0, pages: 0 },

  fetchPlans: async (page = 1, category?) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, any> = { page, limit: 10 };
      if (category) params.category = category;
      const response = await dietsApi.list(params);

      // Ensure count fields exist (initialize from arrays if not provided by backend)
      const plansWithCounts = response.data.map(plan => ({
        ...plan,
        likesCount: plan.likesCount ?? plan.likes?.length ?? 0,
        followersCount: plan.followersCount ?? plan.followers?.length ?? 0,
      }));

      set({
        plans: page === 1 ? plansWithCounts : [...get().plans, ...plansWithCounts],
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

      // Ensure count fields exist (initialize from arrays if not provided by backend)
      const planWithCounts = {
        ...response.data,
        likesCount: response.data.likesCount ?? response.data.likes?.length ?? 0,
        followersCount: response.data.followersCount ?? response.data.followers?.length ?? 0,
      };

      set({ selectedPlan: planWithCounts, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch diet plan',
        isLoading: false,
      });
    }
  },

  fetchSuggestedPlans: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, limit: 10 };
      const response = await dietsApi.getSuggested(params);
      set({
        suggestedPlans: page === 1 ? response.data : [...get().suggestedPlans, ...response.data],
        suggestedPagination: response.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Failed to fetch suggested diet plans',
        isLoading: false,
      });
    }
  },

  followPlan: async (id) => {
    const { plans, selectedPlan } = get();

    // Optimistic update: toggle isFollowed and followersCount
    const optimisticUpdate = (plan: DietPlan) => {
      if (plan._id !== id) return plan;
      const currentCount = plan.followersCount ?? 0;
      const isCurrentlyFollowed = plan.isFollowed ?? false;
      return {
        ...plan,
        isFollowed: !isCurrentlyFollowed,
        followersCount: isCurrentlyFollowed ? currentCount - 1 : currentCount + 1,
      };
    };

    set({
      plans: plans.map(optimisticUpdate),
      selectedPlan: selectedPlan ? optimisticUpdate(selectedPlan) : null,
    });

    try {
      const response = await dietsApi.follow(id);
      const serverPlan = response.data;

      // Merge server response, preserving counts if server doesn't provide them
      set((state) => ({
        plans: state.plans.map((p) => {
          if (p._id !== id) return p;
          return {
            ...p,
            ...serverPlan,
            // Only update counts if server provides them, otherwise keep existing
            likesCount: serverPlan.likesCount ?? serverPlan.likes?.length ?? p.likesCount,
            followersCount: serverPlan.followersCount ?? serverPlan.followers?.length ?? p.followersCount,
          };
        }),
        selectedPlan: state.selectedPlan?._id === id ? {
          ...state.selectedPlan,
          ...serverPlan,
          likesCount: serverPlan.likesCount ?? serverPlan.likes?.length ?? state.selectedPlan.likesCount,
          followersCount: serverPlan.followersCount ?? serverPlan.followers?.length ?? state.selectedPlan.followersCount,
        } : state.selectedPlan,
      }));
    } catch (err: any) {
      // Revert optimistic update on failure
      set({ plans, selectedPlan, error: err.message || 'Failed to follow plan' });
      throw err;
    }
  },

  likePlan: async (id) => {
    const { plans, selectedPlan } = get();

    // Optimistic update: toggle isLiked and likesCount
    const optimisticUpdate = (plan: DietPlan) => {
      if (plan._id !== id) return plan;
      const currentCount = plan.likesCount ?? 0;
      const isCurrentlyLiked = plan.isLiked ?? false;
      return {
        ...plan,
        isLiked: !isCurrentlyLiked,
        likesCount: isCurrentlyLiked ? currentCount - 1 : currentCount + 1,
      };
    };

    set({
      plans: plans.map(optimisticUpdate),
      selectedPlan: selectedPlan ? optimisticUpdate(selectedPlan) : null,
    });

    try {
      const response = await dietsApi.like(id);
      const serverPlan = response.data;

      // Merge server response, preserving counts if server doesn't provide them
      set((state) => ({
        plans: state.plans.map((p) => {
          if (p._id !== id) return p;
          return {
            ...p,
            ...serverPlan,
            // Only update counts if server provides them, otherwise keep existing
            likesCount: serverPlan.likesCount ?? serverPlan.likes?.length ?? p.likesCount,
            followersCount: serverPlan.followersCount ?? serverPlan.followers?.length ?? p.followersCount,
          };
        }),
        selectedPlan: state.selectedPlan?._id === id ? {
          ...state.selectedPlan,
          ...serverPlan,
          likesCount: serverPlan.likesCount ?? serverPlan.likes?.length ?? state.selectedPlan.likesCount,
          followersCount: serverPlan.followersCount ?? serverPlan.followers?.length ?? state.selectedPlan.followersCount,
        } : state.selectedPlan,
      }));
    } catch (err: any) {
      // Revert optimistic update on failure
      set({ plans, selectedPlan, error: err.message || 'Failed to like plan' });
      throw err;
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
