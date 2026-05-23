import { lazy, Suspense } from 'react'

const Canvas = lazy(() => import('@/pages/canvas'))

const CanvasRoutes = {
    path: '/canvas',
    children: [
        {
            path: ':id',
            element: (
                <Suspense fallback={null}>
                    <Canvas />
                </Suspense>
            )
        }
    ]
}

export default CanvasRoutes
