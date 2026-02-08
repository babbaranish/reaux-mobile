import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface UIState {
  isGlobalLoading: boolean;
  toast: { message: string; type: ToastType; visible: boolean };

  setGlobalLoading: (loading: boolean) => void;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isGlobalLoading: false,
  toast: { message: '', type: 'info', visible: false },

  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, visible: true } });
    setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, visible: false } }));
    }, 3000);
  },

  hideToast: () => set((state) => ({ toast: { ...state.toast, visible: false } })),
}));
