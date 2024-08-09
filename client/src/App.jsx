import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import Layout from "./components/layout"
import Login from "./pages/login"
import SignUp from "./pages/signup"
import Dashboard from "./pages/dashboard"
import Collections from "./pages/collections"

const ProviderLayout = () => {
  return (
    <AuthContextProvider>
      <Outlet />
    </AuthContextProvider>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <ProviderLayout />,
      children: [
        {
          element: <Layout />,
          children: [
            { path: '/', element: <Dashboard /> },
            { path: '/collections', element: <Collections /> },
          ]
        },
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <SignUp /> },
      ]
    }
  ]
)

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
