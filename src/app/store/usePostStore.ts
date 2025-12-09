import { create } from "zustand";
import Pusher from "pusher-js";
import { IPost } from "@/interfaces/IPost";
import { toggleLike } from "@/services/client/postService";

interface PostState {
  posts: IPost[];
  subscribedChannels: Set<string>;
  setPosts: (posts: IPost[]) => void;
  clearPosts: () => void;

  updatePost: (id: string, updated: Partial<IPost>) => void;
  removePost: (id: string) => void;

  updatePostLikes: (postId: string, newLikesCount: number, liked?: boolean) => void;

  initializePusherChannel: (postId: string, pusher: Pusher) => void;
  unsubscribeAll: (pusher: Pusher) => void;

  toggleLikeAction: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  subscribedChannels: new Set(),

  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),

  updatePost: (id, updated) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updated } as IPost : p
      ),
    })),

  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id === id),
    })),

  updatePostLikes: (postId, newLikesCount, liked) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        String(p._id) === postId
          ? {
            ...p,
            likesCount: newLikesCount,
            isLikedByCurrentUser:
              liked !== undefined ? liked : p.isLikedByCurrentUser,
          } as IPost
          : p
      ),
    })),

  initializePusherChannel: (postId: string, pusher: Pusher) => {
    const channelName = `post-likes-${postId}`;
    const subscribed = get().subscribedChannels;
    if (subscribed.has(channelName)) return;
    console.log(`[Pusher] Initializing channel: ${channelName}`);


    subscribed.add(channelName);

    const channel = pusher.subscribe(channelName);

    channel.bind("like-toggled", (data: any) => {
      console.log(`[Pusher] Received like-toggled event for post ${data.postId}:`, data);
      console.log(`[Pusher] Updating likes count to: ${data.likesCount}`);
      get().updatePostLikes(data.postId, data.likesCount);
    });

    console.log(`[Pusher] Channel subscribed and event listener bound`);
  },
  unsubscribeAll: (pusher: Pusher) => {
    const subscribed = get().subscribedChannels;

    subscribed.forEach((name) => {
      pusher.unsubscribe(name);
    });
    subscribed.clear();
  },

  toggleLikeAction: async (postId: string) => {
    try {
      const res = await toggleLike(postId);

      get().updatePostLikes(postId, res.likesCount, res.liked);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  },
}));

