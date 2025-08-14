import { create } from "zustand";

interface SidebarState {
  sidebarSize: "small" | "medium" | "large";
  isOpenSourceUpload: boolean;
  uploadProgress: {
    file: File;
    progress: number;
    fileNumber: number;
    totalFiles: number;
  } | null;

  actions: {
    setSidebarSize: (sidebarSize: "small" | "medium" | "large") => void;
    setIsOpenSourceUpload: (isOpenSourceUpload: boolean) => void;
    setUploadProgress: (
      uploadProgress: {
        file: File;
        progress: number;
        fileNumber: number;
        totalFiles: number;
      } | null
    ) => void;
  };
}

const useSidebarStore = create<SidebarState>((set) => ({
  sidebarSize: "small",
  isOpenSourceUpload: false,
  uploadProgress: null,

  actions: {
    setSidebarSize: (sidebarSize) => set(() => ({ sidebarSize })),
    setIsOpenSourceUpload: (isOpenSourceUpload) =>
      set(() => ({ isOpenSourceUpload })),
    setUploadProgress: (uploadProgress) => set(() => ({ uploadProgress })),
  },
}));

export const useSidebarSize = () =>
  useSidebarStore((state) => state.sidebarSize);

export const useIsOpenSourceUpload = () =>
  useSidebarStore((state) => state.isOpenSourceUpload);

export const useUploadProgress = () =>
  useSidebarStore((state) => state.uploadProgress);

export const useSidebarActions = () =>
  useSidebarStore((state) => state.actions);
