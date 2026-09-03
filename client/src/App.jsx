import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"
import AuthContextProvider from "./context/AuthContext"
import ThemeContextProvider from "./context/ThemeContext"
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
import WordMatch from "./pages/exercises/components/word-match"
import ThemedToaster from "./components/themed-toaster"
import { Suspense } from "react"
import { Loader } from "lucide-react"
import PresetCollection from "./pages/collection/components/preset-collection"
import SharedCollection from "./pages/shared-collection"

const ProviderLayout = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ThemeContextProvider>
        <AuthContextProvider>
          <ThemedToaster />
          <Outlet />
        </AuthContextProvider>
      </ThemeContextProvider>
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
            { path: '/shared/:token', element: <SharedCollection /> },
            { path: '/exercises', element: <Exercises /> },
            { path: '/exercises/flashcards', element: <Flashcards /> },
            { path: '/exercises/shuffle', element: <Shuffle /> },
            { path: '/exercises/reverse-shuffle', element: <Shuffle reverse /> },
            { path: '/exercises/word-match', element: <WordMatch /> },
          ]
        },
      ]
    }
  ]
)

const App = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Without a client id there is nothing for the Google SDK to initialise,
  // so the app falls back to email/password authentication only.
  if (!googleClientId) {
    return <RouterProvider router={router} />
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  )
}

export default App
