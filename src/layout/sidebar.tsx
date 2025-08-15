import { IconPanelLeft, PlusHome } from "../assets/icons";
import { useSidebarSize, useSidebarActions } from "../store/sidebar-store";
import SourceViewer from "../components/ui/source-viewer";

const Sidebar = () => {
  const sidebarSize = useSidebarSize();
  const { setSidebarSize, setIsOpenSourceUpload } = useSidebarActions();

  return (
    <div className="group peer hidden text-sidebar-foreground md:block">
      <div
        className={`relative ${
          (sidebarSize === "small" && "w-[var(--sidebar-width-icon)]") ||
          (sidebarSize === "medium" && "w-[var(--sidebar-width)]") ||
          (sidebarSize === "large" && "w-[var(--sidebar-width-large)]")
        } bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-[--sidebar-width-icon]`}
      ></div>
      <div
        className={`fixed inset-y-0 z-10 hidden h-svh ${
          (sidebarSize === "small" && "w-[var(--sidebar-width-icon)]") ||
          (sidebarSize === "medium" && "w-[var(--sidebar-width)]") ||
          (sidebarSize === "large" && "w-[var(--sidebar-width-large)]")
        } transition-[left,right,width] duration-200 ease-linear md:flex left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l`}
      >
        <div className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
          <div
            data-sidebar="header"
            className={`gap-2 px-2 py-3 flex flex-row ${
              sidebarSize !== "small" ? "justify-between" : "justify-center"
            } items-center`}
          >
            {sidebarSize !== "small" && (
              <a className="flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
                <span className="font-semibold text-md">Muneer</span>
              </a>
            )}

            {sidebarSize === "large" ? (
              <button
                className="inline-flex items-center justify-center rounded-full rotate-45 p-1.5 cursor-pointer whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8"
                data-sidebar="trigger"
                onClick={() => setSidebarSize("medium")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m7 20 5-5 5 5" />
                  <path d="m7 4 5 5 5-5" />
                </svg>
                <span className="sr-only">Toggle Sidebar</span>
              </button>
            ) : (
              <button
                className="inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-6"
                data-sidebar="trigger"
                onClick={() =>
                  setSidebarSize(sidebarSize === "small" ? "medium" : "small")
                }
              >
                <IconPanelLeft />
                <span className="sr-only">Toggle Sidebar</span>
              </button>
            )}
          </div>
          <div
            className={`min-h-0 flex-1 gap-2 overflow-y-auto overflow-x-hidden border-t border-sidebar-border group-data-[collapsible=icon]:overflow-hidden flex flex-col ${
              sidebarSize !== "small" ? "px-4" : "px-0"
            } py-4 h-full`}
          >
            {/* Show source viewer if open, otherwise show default content */}
            {sidebarSize === "large" ? (
              <SourceViewer />
            ) : (
              <div className="flex flex-col items-center gap-2">
                {sidebarSize !== "small" && (
                  <button
                    onClick={() => setIsOpenSourceUpload(true)}
                    className="flex items-center justify-center gap-2 h-9 w-full py-3 px-5 border border-border rounded-4xl cursor-pointer"
                  >
                    <PlusHome className="w-4 h-4" />
                    <span className="text-xs font-poppins">Add Source</span>
                  </button>
                )}
                {sidebarSize === "small" && (
                  <button
                    onClick={() => setIsOpenSourceUpload(true)}
                    className="cursor-pointer"
                  >
                    <PlusHome className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
