import { create } from "zustand";

interface SourceData {
  document_id: number;
  page_number: number;
  source_location: string;
  similarity: number;
  chunk_text: string;
  filename: string;
  file_path: string;
  file_url: string;
}

interface SidebarState {
  sidebarSize: "small" | "medium" | "large";
  isOpenSourceUpload: boolean;
  uploadProgress: {
    file: File;
    progress: number;
    fileNumber: number;
    totalFiles: number;
  } | null;
  // New source viewer state
  selectedSource: SourceData | null;

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
    // New source viewer actions
    openSourceViewer: (source: SourceData) => void;
    closeSourceViewer: () => void;
  };
}

const useSidebarStore = create<SidebarState>((set) => ({
  sidebarSize: "small",
  isOpenSourceUpload: false,
  uploadProgress: null,
  selectedSource: null,

  actions: {
    setSidebarSize: (sidebarSize) => set(() => ({ sidebarSize })),
    setIsOpenSourceUpload: (isOpenSourceUpload) =>
      set(() => ({ isOpenSourceUpload })),
    setUploadProgress: (uploadProgress) => set(() => ({ uploadProgress })),
    openSourceViewer: (source) =>
      set(() => ({
        sidebarSize: "large",
        selectedSource: source,
      })),
    closeSourceViewer: () =>
      set(() => ({
        sidebarSize: "medium",
        selectedSource: null,
      })),
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

// New exports for source viewer
export const useSelectedSource = () =>
  useSidebarStore((state) => state.selectedSource);
