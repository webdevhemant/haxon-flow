import { lazy, Suspense } from 'react'

const Login = lazy(() => import('@/pages/auth/Login'))
const Signup = lazy(() => import('@/pages/auth/Signup'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const NewPassword = lazy(() => import('@/pages/auth/NewPassword'))
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'))

const AuthRoutes = {
    path: '/auth',
    children: [
        { path: 'login', element: <Suspense fallback={null}><Login /></Suspense> },
        { path: 'signup', element: <Suspense fallback={null}><Signup /></Suspense> },
        { path: 'reset-password', element: <Suspense fallback={null}><ResetPassword /></Suspense> },
        { path: 'new-password', element: <Suspense fallback={null}><NewPassword /></Suspense> },
        { path: 'verify-email', element: <Suspense fallback={null}><VerifyEmail /></Suspense> }
    ]
}

export default AuthRoutes
