import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./footer"

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default Layout