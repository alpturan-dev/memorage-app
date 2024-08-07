import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import Login from "./pages/login"
import SignUp from "./pages/signup"

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
        { path: '/', element: <>dashboard</> },
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
