"use client";

import { create } from "zustand";
import { IPost } from "@/interfaces/IPost";
import Pusher from "pusher-js";

interface PostState {
  posts: IPost[];
  setPosts: (posts: IPost[]) => void;
  clearPosts: () => void;
  updatePost: (id: string, updated: Partial<IPost>) => void;
  removePost: (id: string) => void;
  updatePostLikes: (postId: string, newLikesCount: number) => void;
  initializePusherChannel: (postId: string, pusher: Pusher) => () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
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

  updatePostLikes: (postId, newLikesCount) =>
    set((state) => ({
      posts: state.posts.map((p) => p.id === postId ?
        { ...p, likesCount: newLikesCount } as IPost : p
      ),
    })),

  initializePusherChannel: (postId: string, pusher: Pusher) => {
    const channelName = `post-likes-${postId}`;
    console.log(`[Pusher] Initializing channel: ${channelName}`);
    
    const channel = pusher.subscribe(channelName);

    channel.bind("like-toggled", (data: any) => {
      console.log(`[Pusher] Received like-toggled event for post ${data.postId}:`, data);
      console.log(`[Pusher] Updating likes count to: ${data.likesCount}`);
      get().updatePostLikes(data.postId, data.likesCount);
    });

    console.log(`[Pusher] Channel subscribed and event listener bound`);

    return () => {
      console.log(`[Pusher] Unsubscribing from channel: ${channelName}`);
      channel.unbind("like-toggled");
      pusher.unsubscribe(channelName);
      console.log(`[Pusher] Channel cleanup completed`);
    };
  },
}));

