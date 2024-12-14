import vertex from "@/api";
import { create } from "zustand";

export type User = {
  user_id: string;
  user_name: string;
  email: string;
  tag: string;
  bio: string;
  profile_image: string | null;
};

type UserStore = {
  user: User | null;
  error: string;
  loading: boolean;
  setUser: (user: any) => void;
  fetchUser: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  error: "",
  loading: true,
  setUser: (user: any) => set({ user }),
  fetchUser: async () => {
    try {
      const res = await vertex.get<{ data: User }>("http://localhost:8080/authenticated/me", {
        retry: 1,
        credentials: "include",
      });
      if (!res.ok) {
        set({ loading: false, error: "Failed to fetch user" });
        throw new Error("Failed to fetch user");
      }

      const user = (await res.json()).data;
      set({ user, loading: false });
    } catch (error) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));