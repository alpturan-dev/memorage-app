import { RouterProvider as ReactRouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from '../routes/routes'
import { ProtectedRoute } from '../routes/ProtectedRoutes'

const router = createBrowserRouter(
    routes.map(route => ({
        path: route.path,
        element: route.protected ? (
            <ProtectedRoute>{route.element}</ProtectedRoute>
        ) : (
            route.element
        ),
        children: route.children?.map(child => ({
            path: child.path,
            element: <ProtectedRoute>{child.element}</ProtectedRoute>
        }))
    }))
)

export function RouterProvider() {
    return <ReactRouterProvider router={router} />
}