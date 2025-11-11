import { create } from "zustand";
import { ICategory } from "@/interfaces/ICategory";

interface CategoriesStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({

    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({loading: true, error: null});
        try{
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Error loading categories");
            const data: ICategory[] = await res.json();
            set({ categories: data, loading: false });
        }catch(err: any){
            set({ error: err.message, loading: false });
        }
    },

}));