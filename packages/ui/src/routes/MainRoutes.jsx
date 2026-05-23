import { lazy } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import Loadable from '@/ui-component/loading/Loadable'
import { Navigate } from 'react-router-dom'

const Chatflows = Loadable(lazy(() => import('@/pages/chatflows')))
const Agentflows = Loadable(lazy(() => import('@/pages/agentflows')))
const Executions = Loadable(lazy(() => import('@/pages/agentexecutions')))
const Marketplaces = Loadable(lazy(() => import('@/pages/marketplaces')))
const Tools = Loadable(lazy(() => import('@/pages/tools')))
const Credentials = Loadable(lazy(() => import('@/pages/credentials')))
const Variables = Loadable(lazy(() => import('@/pages/variables')))
const Assistants = Loadable(lazy(() => import('@/pages/assistants')))
const Documents = Loadable(lazy(() => import('@/pages/docstore')))
const APIKey = Loadable(lazy(() => import('@/pages/apikey')))
const Logs = Loadable(lazy(() => import('@/pages/serverlogs')))
const Datasets = Loadable(lazy(() => import('@/pages/datasets')))
const Evaluators = Loadable(lazy(() => import('@/pages/evaluators')))
const Evaluations = Loadable(lazy(() => import('@/pages/evaluations')))
const Analytics = Loadable(lazy(() => import('@/pages/analytics')))
const Deployments = Loadable(lazy(() => import('@/pages/deployments')))
const Integrations = Loadable(lazy(() => import('@/pages/integrations')))
const PromptLibrary = Loadable(lazy(() => import('@/pages/promptlibrary')))
const ModelHub = Loadable(lazy(() => import('@/pages/modelhub')))
const Account = Loadable(lazy(() => import('@/pages/account')))

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        { path: '/', element: <Navigate to='/chatflows' replace /> },
        { path: '/chatflows', element: <Chatflows /> },
        { path: '/agentflows', element: <Agentflows /> },
        { path: '/executions', element: <Executions /> },
        { path: '/marketplaces', element: <Marketplaces /> },
        { path: '/tools', element: <Tools /> },
        { path: '/credentials', element: <Credentials /> },
        { path: '/variables', element: <Variables /> },
        { path: '/assistants', element: <Assistants /> },
        { path: '/document-stores', element: <Documents /> },
        { path: '/apikey', element: <APIKey /> },
        { path: '/logs', element: <Logs /> },
        { path: '/datasets', element: <Datasets /> },
        { path: '/evaluators', element: <Evaluators /> },
        { path: '/evaluations', element: <Evaluations /> },
        { path: '/analytics', element: <Analytics /> },
        { path: '/deployments', element: <Deployments /> },
        { path: '/integrations', element: <Integrations /> },
        { path: '/prompt-library', element: <PromptLibrary /> },
        { path: '/model-hub', element: <ModelHub /> },
        { path: '/account', element: <Account /> },
    ],
}

export default MainRoutes
