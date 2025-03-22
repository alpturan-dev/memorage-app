import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { scrollToTop } from "@/lib/utils";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <Outlet />
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-2 bg-primary/80 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
