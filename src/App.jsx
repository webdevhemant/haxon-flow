import { useEffect } from 'react'
import Routes from '@/routes'
import { Toaster } from '@/components/ui/sonner'
import { useUIStore } from '@/store/useUIStore'

function ThemeSync() {
    const { colorTheme, fontSize } = useUIStore()
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorTheme)
        document.documentElement.setAttribute('data-font-size', fontSize)
    }, [colorTheme, fontSize])
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
