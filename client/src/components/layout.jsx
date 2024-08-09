import { Outlet } from "react-router-dom"
import Navbar from "./navbar"

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/*<Footer /> */}
    </>
  )
}

export default Layout