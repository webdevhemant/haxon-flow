import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export default function MainLayout() {
    return (
        <div className='flex h-screen overflow-hidden bg-background'>
            <Sidebar />
            <div className='flex flex-1 flex-col overflow-hidden'>
                <Header />
                <main className='flex-1 overflow-auto'>
                    <div className='h-full p-5'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
