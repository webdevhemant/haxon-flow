import { lazy, Suspense } from 'react'

const Landing = lazy(() => import('@/pages/landing'))

const LandingRoutes = {
    path: '/',
    element: (
        <Suspense fallback={null}>
            <Landing />
        </Suspense>
    ),
}

export default LandingRoutes
