import Sidebar from "./sidebar";
import Header from "./header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <ToastContainer
        autoClose={5000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        closeButton={false}
      />
    </div>
  );
}
