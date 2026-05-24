import { useRoutes } from 'react-router-dom'
import MainRoutes from './MainRoutes'
import LandingRoutes from './LandingRoutes'
import CanvasRoutes from './CanvasRoutes'
import AuthRoutes from './AuthRoutes'
import NotFound from '@/pages/notfound'

export default function Routes() {
    return useRoutes([LandingRoutes, AuthRoutes, CanvasRoutes, MainRoutes, { path: '*', element: <NotFound /> }])
}
