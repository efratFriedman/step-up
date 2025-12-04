import { create } from "zustand";
import { toggleLike } from "@/services/client/postService";

interface LikeState {
    likeStatus: { [postId: string]: boolean };
    likeCount: { [postId: string]: number };
    toggle: (postId: string) => Promise<void>;
    setInitialLikes: ( post: any[]) => void;
}

export const useLikeStore = create<LikeState>((set, get) => ({
    likeStatus: {},
    likeCount: {},
  
    setInitialLikes: (posts) => {
      const statusMap: any = {};
      const countMap: any = {};
  
      posts.forEach((p) => {
        statusMap[p._id] = p.isLikedByCurrentUser;
        countMap[p._id] = p.likesCount;
      });
  
      set({
        likeStatus: statusMap,
        likeCount: countMap
      });
    },
  
    toggle: async (postId) => {
      try {
        const res = await toggleLike(postId);
  
        set((state) => ({
          likeStatus: {
            ...state.likeStatus,
            [postId]: res.liked
          },
          likeCount: {
            ...state.likeCount,
            [postId]: res.likesCount
          }
        }));
      } catch (err) {
        console.error("Error toggling like:", err);
      }
    },
  }));