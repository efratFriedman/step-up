"use client";

import { create } from "zustand";
import { IPost } from "@/interfaces/IPost";

interface PostState {
  posts: IPost[];
  setPosts: (posts: IPost[]) => void;
  clearPosts: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),
}));
