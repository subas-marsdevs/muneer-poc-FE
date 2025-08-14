import Sidebar from "./sidebar";
import Header from "./header";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex min-h-svh w-full opacity-100 transition-opacity duration-150">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex flex-1 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
