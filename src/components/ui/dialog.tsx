import { Dialog, DialogPanel } from "@headlessui/react";

interface CustomDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  maxWidth?: string;
  onClose?: () => void;
}

export default function CustomDialog({
  isOpen,
  setIsOpen,
  children,
  maxWidth = "max-w-md",
  onClose,
}: CustomDialogProps) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative focus:outline-none"
      onClose={() => {
        setIsOpen(false);
        onClose?.();
      }}
    >
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className={`w-full ${maxWidth} rounded-xl border border-border bg-background shadow-lg p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0`}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
