import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import Layout from "./components/layout"
import Login from "./pages/login"
import SignUp from "./pages/signup"
import Dashboard from "./pages/dashboard"
import Profile from "./pages/profile"
import Collections from "./pages/collections"
import Collection from "./pages/collection"
import Exercises from "./pages/exercises"
import Flashcards from "./pages/exercises/components/flashcards"
import Shuffle from "./pages/exercises/components/shuffle"
import { Toaster } from "react-hot-toast"
import { Suspense } from "react"
import { Loader } from "lucide-react"
import PresetCollection from "./pages/collection/components/preset-collection"

const ProviderLayout = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AuthContextProvider>
        <Toaster position="bottom-right" />
        <Outlet />
      </AuthContextProvider>
    </Suspense>
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
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <SignUp /> },
            { path: '/profile', element: <Profile /> },
            { path: '/collections', element: <Collections /> },
            { path: '/collection/:id', element: <Collection /> },
            { path: '/preset-collection/:languageCode/:level', element: <PresetCollection /> },
            { path: '/exercises', element: <Exercises /> },
            { path: '/exercises/flashcards', element: <Flashcards /> },
            { path: '/exercises/shuffle', element: <Shuffle /> },
          ]
        },
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
