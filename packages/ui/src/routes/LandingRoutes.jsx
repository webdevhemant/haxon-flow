import { lazy } from 'react'
import Loadable from '@/ui-component/loading/Loadable'

const Landing = Loadable(lazy(() => import('@/pages/landing')))

const LandingRoutes = {
    path: '/home',
    element: <Landing />,
}

export default LandingRoutes
