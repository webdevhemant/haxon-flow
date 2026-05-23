import { useRoutes } from 'react-router-dom'
import MainRoutes from './MainRoutes'
import LandingRoutes from './LandingRoutes'

export default function Routes() {
    return useRoutes([LandingRoutes, MainRoutes])
}
