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
            className={`relative w-full ${maxWidth} rounded-xl border border-border bg-background shadow-lg p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0`}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 p-1 rounded-full hover:bg-secondary cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
