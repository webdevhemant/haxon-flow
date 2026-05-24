import { useEffect } from 'react'
import Routes from '@/routes'
import { Toaster } from '@/components/ui/sonner'
import { useUIStore } from '@/store/useUIStore'

function ThemeSync() {
    const { colorTheme, fontSize, compactMode, reducedMotion } = useUIStore()
    useEffect(() => {
        const el = document.documentElement
        el.setAttribute('data-theme', colorTheme)
        el.setAttribute('data-font-size', fontSize)
        el.setAttribute('data-density', compactMode ? 'compact' : 'default')
        el.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false')
    }, [colorTheme, fontSize, compactMode, reducedMotion])
    return null
}

const App = () => (
    <>
        <ThemeSync />
        <Routes />
        <Toaster position='bottom-right' richColors />
    </>
)

export default App
