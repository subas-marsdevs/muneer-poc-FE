import ChatMessages from "../../components/chat-messages";
import ChatPanel from "../../components/chat-panel";
import CustomDialog from "../../components/ui/dialog";
import DocumentUpload from "../../components/upload-documents";
import {
  useSidebarActions,
  useIsOpenSourceUpload,
  useUploadProgress,
} from "../../store/sidebar-store";
import { Popover } from "@headlessui/react";

export default function HomePage() {
  const { setIsOpenSourceUpload } = useSidebarActions();
  const isOpenSourceUpload = useIsOpenSourceUpload();
  const uploadProgress = useUploadProgress();

  return (
    <>
      <div
        className={`relative flex h-full max-w-[768px] w-full mx-auto flex-1 flex-col items-center justify-center`}
      >
        <ChatMessages />
        <ChatPanel />
      </div>
      <CustomDialog
        isOpen={isOpenSourceUpload}
        setIsOpen={setIsOpenSourceUpload}
        maxWidth="max-w-3xl"
      >
        <DocumentUpload
          label="Add sources"
          accept=".pdf,.pptx,.xlsx"
          placeholder="Drag and drop or click to upload"
        />
      </CustomDialog>
      {!isOpenSourceUpload && uploadProgress && (
        <Popover className="fixed top-1 right-1 p-4 bg-popover z-20 border border-border shadow-md rounded-md w-80">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between gap-1 items-end">
                <span className="text-xs text-card-foreground font-normal text-left">
                  {uploadProgress?.file?.name} ({uploadProgress?.progress}%)
                </span>
                <span className="text-xs text-card-foreground font-normal whitespace-nowrap">
                  {uploadProgress?.fileNumber} /{uploadProgress?.totalFiles}
                </span>
              </div>
              <div className="bg-muted-foreground rounded-full h-2">
                <div
                  className="bg-chart-1 h-2 rounded-full"
                  style={{ width: `${uploadProgress.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Popover>
      )}
    </>
  );
}
