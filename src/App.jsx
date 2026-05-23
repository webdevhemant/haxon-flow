import Routes from '@/routes'
import { Toaster } from '@/components/ui/sonner'

const App = () => (
    <>
        <Routes />
        <Toaster position='bottom-right' richColors />
    </>
)

export default App
