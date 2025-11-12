import { create } from "zustand";
import { ICategory } from "@/interfaces/ICategory";

interface CategoriesStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: (force?: boolean) => Promise<void>; 
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (force = false) => {
    const { categories } = get();

    if (categories.length > 0 && !force) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Error loading categories");
      const data: ICategory[] = await res.json();
      set({ categories: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
