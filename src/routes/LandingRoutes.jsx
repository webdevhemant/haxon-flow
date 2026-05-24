import { lazy, Suspense } from 'react'

const Landing = lazy(() => import('@/pages/landing'))
const Pricing = lazy(() => import('@/pages/pricing'))

const LandingRoutes = {
    path: '/',
    children: [
        {
            index: true,
            element: (
                <Suspense fallback={null}>
                    <Landing />
                </Suspense>
            )
        },
        {
            path: 'pricing',
            element: (
                <Suspense fallback={null}>
                    <Pricing />
                </Suspense>
            )
        }
    ]
}

export default LandingRoutes
