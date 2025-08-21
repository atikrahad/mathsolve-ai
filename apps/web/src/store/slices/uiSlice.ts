import { type StateCreator } from "zustand";

export interface UISlice {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const uiSlice: StateCreator<UISlice> = (set) => ({
  theme: "system",
  sidebarOpen: false,
  setTheme: (theme: "light" | "dark" | "system") =>
    set({
      theme,
    }),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  setSidebarOpen: (open: boolean) =>
    set({
      sidebarOpen: open,
    }),
});