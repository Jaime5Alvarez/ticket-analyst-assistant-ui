"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const DEFAULT_MODEL = "openai/gpt-5.4";
const MODEL_STORAGE_KEY = "ticket-analyst:selected-model";

type ModelStore = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      selectedModel: DEFAULT_MODEL,
      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },
      hasHydrated: false,
      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: MODEL_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
