import Layout from "@/components/layout"
import Login from "../pages/login"
import SignUp from "@/pages/signup"

export const routes = [
    { path: '/login', element: <Login />, protected: false },
    { path: '/signup', element: <SignUp />, protected: false },
    {
        element: <Layout />,
        protected: true,
        children: [
            { path: '/', element: <>dashboard</> },
        ],
    },
]