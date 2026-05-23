import { lazy } from 'react'

import MainLayout from '@/layout/MainLayout'
import Loadable from '@/ui-component/loading/Loadable'
import { DefaultRedirect } from '@/routes/DefaultRedirect'

const Chatflows = Loadable(lazy(() => import('@/views/chatflows')))
const Agentflows = Loadable(lazy(() => import('@/views/agentflows')))
const Marketplaces = Loadable(lazy(() => import('@/views/marketplaces')))
const APIKey = Loadable(lazy(() => import('@/views/apikey')))
const Tools = Loadable(lazy(() => import('@/views/tools')))
const Assistants = Loadable(lazy(() => import('@/views/assistants')))
const OpenAIAssistantLayout = Loadable(lazy(() => import('@/views/assistants/openai/OpenAIAssistantLayout')))
const CustomAssistantLayout = Loadable(lazy(() => import('@/views/assistants/custom/CustomAssistantLayout')))
const CustomAssistantConfigurePreview = Loadable(lazy(() => import('@/views/assistants/custom/CustomAssistantConfigurePreview')))
const Credentials = Loadable(lazy(() => import('@/views/credentials')))
const Variables = Loadable(lazy(() => import('@/views/variables')))
const Documents = Loadable(lazy(() => import('@/views/docstore')))
const DocumentStoreDetail = Loadable(lazy(() => import('@/views/docstore/DocumentStoreDetail')))
const ShowStoredChunks = Loadable(lazy(() => import('@/views/docstore/ShowStoredChunks')))
const LoaderConfigPreviewChunks = Loadable(lazy(() => import('@/views/docstore/LoaderConfigPreviewChunks')))
const VectorStoreConfigure = Loadable(lazy(() => import('@/views/docstore/VectorStoreConfigure')))
const VectorStoreQuery = Loadable(lazy(() => import('@/views/docstore/VectorStoreQuery')))
const EvalEvaluation = Loadable(lazy(() => import('@/views/evaluations/index')))
const EvaluationResult = Loadable(lazy(() => import('@/views/evaluations/EvaluationResult')))
const EvalDatasetRows = Loadable(lazy(() => import('@/views/datasets/DatasetItems')))
const EvalDatasets = Loadable(lazy(() => import('@/views/datasets')))
const Evaluators = Loadable(lazy(() => import('@/views/evaluators')))
const Account = Loadable(lazy(() => import('@/views/account')))
const Files = Loadable(lazy(() => import('@/views/files')))
const Logs = Loadable(lazy(() => import('@/views/serverlogs')))
const Executions = Loadable(lazy(() => import('@/views/agentexecutions')))

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        { path: '/', element: <DefaultRedirect /> },
        { path: '/chatflows', element: <Chatflows /> },
        { path: '/agentflows', element: <Agentflows /> },
        { path: '/executions', element: <Executions /> },
        { path: '/marketplaces', element: <Marketplaces /> },
        { path: '/apikey', element: <APIKey /> },
        { path: '/tools', element: <Tools /> },
        { path: '/assistants', element: <Assistants /> },
        { path: '/assistants/custom', element: <CustomAssistantLayout /> },
        { path: '/assistants/custom/:id', element: <CustomAssistantConfigurePreview /> },
        { path: '/assistants/openai', element: <OpenAIAssistantLayout /> },
        { path: '/credentials', element: <Credentials /> },
        { path: '/variables', element: <Variables /> },
        { path: '/document-stores', element: <Documents /> },
        { path: '/document-stores/:storeId', element: <DocumentStoreDetail /> },
        { path: '/document-stores/chunks/:storeId/:fileId', element: <ShowStoredChunks /> },
        { path: '/document-stores/:storeId/:name', element: <LoaderConfigPreviewChunks /> },
        { path: '/document-stores/vector/:storeId', element: <VectorStoreConfigure /> },
        { path: '/document-stores/vector/:storeId/:docId', element: <VectorStoreConfigure /> },
        { path: '/document-stores/query/:storeId', element: <VectorStoreQuery /> },
        { path: '/datasets', element: <EvalDatasets /> },
        { path: '/dataset_rows/:id', element: <EvalDatasetRows /> },
        { path: '/evaluations', element: <EvalEvaluation /> },
        { path: '/evaluation_results/:id', element: <EvaluationResult /> },
        { path: '/evaluators', element: <Evaluators /> },
        { path: '/logs', element: <Logs /> },
        { path: '/files', element: <Files /> },
        { path: '/account', element: <Account /> }
    ]
}

export default MainRoutes
