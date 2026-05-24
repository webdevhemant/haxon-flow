import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useSound } from '@/hooks/useSound'
import { useUIStore } from '@/store/useUIStore'
import {
    IconHierarchy2, IconUsersGroup, IconListCheck, IconRobot, IconBuildingStore,
    IconTool, IconLock, IconVariable, IconKey, IconFiles, IconDatabase, IconTestPipe,
    IconChartHistogram, IconList, IconSettings, IconChevronLeft, IconChevronRight,
    IconBolt, IconBrain, IconBook2, IconChartBar, IconServer2, IconPlugConnected,
    IconLogin, IconUserPlus, IconMailCheck, IconVolume,
    IconVolumeOff, IconMusic
} from '@tabler/icons-react'

const NAV = [
    {
        label: 'Studio',
        items: [
            { id: 'chatflows', label: 'Chatflows', icon: IconHierarchy2, to: '/chatflows' },
            { id: 'agentflows', label: 'Agentflows', icon: IconUsersGroup, to: '/agentflows' },
            { id: 'executions', label: 'Executions', icon: IconListCheck, to: '/executions' },
            { id: 'assistants', label: 'Assistants', icon: IconRobot, to: '/assistants' },
            { id: 'marketplaces', label: 'Templates', icon: IconBuildingStore, to: '/marketplaces' }
        ]
    },
    {
        label: 'AI Tools',
        items: [
            { id: 'tools', label: 'Tools', icon: IconTool, to: '/tools' },
            { id: 'prompt-library', label: 'Prompt Library', icon: IconBook2, to: '/prompt-library', badge: 'NEW' },
            { id: 'model-hub', label: 'Model Hub', icon: IconBrain, to: '/model-hub', badge: 'NEW' }
        ]
    },
    {
        label: 'Data',
        items: [
            { id: 'document-stores', label: 'Document Stores', icon: IconFiles, to: '/document-stores' },
            { id: 'credentials', label: 'Credentials', icon: IconLock, to: '/credentials' },
            { id: 'variables', label: 'Variables', icon: IconVariable, to: '/variables' }
        ]
    },
    {
        label: 'Marketplace',
        items: [{ id: 'integrations', label: 'Integrations', icon: IconPlugConnected, to: '/integrations', badge: 'NEW' }]
    },
    {
        label: 'Evaluate',
        items: [
            { id: 'datasets', label: 'Datasets', icon: IconDatabase, to: '/datasets' },
            { id: 'evaluators', label: 'Evaluators', icon: IconTestPipe, to: '/evaluators' },
            { id: 'evaluations', label: 'Evaluations', icon: IconChartHistogram, to: '/evaluations' }
        ]
    },
    {
        label: 'Monitor',
        items: [
            { id: 'analytics', label: 'Analytics', icon: IconChartBar, to: '/analytics', badge: 'NEW' },
            { id: 'deployments', label: 'Deployments', icon: IconServer2, to: '/deployments', badge: 'NEW' },
            { id: 'apikey', label: 'API Keys', icon: IconKey, to: '/apikey' },
            { id: 'logs', label: 'Logs', icon: IconList, to: '/logs' }
        ]
    },
    {
        label: 'Account',
        items: [
            { id: 'account', label: 'Settings', icon: IconSettings, to: '/account' },
            { id: 'login', label: 'Sign In', icon: IconLogin, to: '/auth/login' },
            { id: 'signup', label: 'Sign Up', icon: IconUserPlus, to: '/auth/signup' },
            { id: 'verify', label: 'Verify Email', icon: IconMailCheck, to: '/auth/verify-email' }
        ]
    }
]

function NavItem({ item, collapsed }) {
    const location = useLocation()
    const { play } = useSound()
    const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
    const Icon = item.icon

    const content = (
        <NavLink to={item.to}
            onClick={() => play('click')}
            className={cn(
                'nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                'text-muted-foreground hover:text-foreground',
                isActive && 'nav-item-active text-primary',
                collapsed && 'justify-center px-2.5'
            )}>
            <Icon size={17} className={cn('shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
            {!collapsed && <span className='flex-1 truncate leading-none'>{item.label}</span>}
            {!collapsed && item.badge && (
                <Badge variant='cyan' className='text-[9px] px-1.5 py-0.5 h-4 font-mono'>{item.badge}</Badge>
            )}
            {isActive && !collapsed && <div className='absolute inset-y-0 right-0 w-0.5 rounded-full bg-primary opacity-60' />}
        </NavLink>
    )

    if (collapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side='right' className='flex items-center gap-2'>
                    {item.label}
                    {item.badge && <Badge variant='cyan' className='text-[9px]'>{item.badge}</Badge>}
                </TooltipContent>
            </Tooltip>
        )
    }
    return content
}

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const { play } = useSound()
    const { soundEnabled, toggleSound, canvasMusicEnabled, toggleCanvasMusic } = useUIStore()

    const handleToggle = () => { setCollapsed(!collapsed); play('click') }

    return (
        <TooltipProvider delayDuration={200}>
            <aside className={cn('relative flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out', collapsed ? 'w-16' : 'w-[260px]')}>
                <div className='pointer-events-none absolute inset-0 bg-dot opacity-20' />
                <div className='pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/4 blur-3xl' />

                {/* Logo */}
                <div className={cn('relative flex items-center border-b border-border py-4', collapsed ? 'justify-center px-3' : 'px-4')}>
                    <Logo collapsed={collapsed} />
                </div>

                {/* Navigation */}
                <ScrollArea className='relative flex-1 py-3'>
                    <nav className={cn('space-y-0.5', collapsed ? 'px-2' : 'px-3')}>
                        {NAV.map((section) => (
                            <div key={section.label} className='mb-1'>
                                {!collapsed && (
                                    <p className='mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50'>
                                        {section.label}
                                    </p>
                                )}
                                {collapsed && <div className='my-2 h-px bg-border/40' />}
                                <div className='space-y-0.5'>
                                    {section.items.map((item) => (
                                        <NavItem key={item.id} item={item} collapsed={collapsed} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* Sound + Music toggles */}
                <div className={cn('relative border-t border-border px-3 py-2 space-y-1', collapsed && 'px-2')}>
                    {collapsed ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => { toggleSound(); play('click') }}
                                        className={cn('w-full flex justify-center p-2 rounded-lg transition-colors hover:bg-secondary', soundEnabled ? 'text-primary' : 'text-muted-foreground')}>
                                        {soundEnabled ? <IconVolume size={15} /> : <IconVolumeOff size={15} />}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side='right'>Sound Effects {soundEnabled ? 'On' : 'Off'}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button onClick={() => { toggleCanvasMusic(); play('click') }}
                                        className={cn('w-full flex justify-center p-2 rounded-lg transition-colors hover:bg-secondary', canvasMusicEnabled ? 'text-primary' : 'text-muted-foreground')}>
                                        <IconMusic size={15} />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side='right'>Canvas Music {canvasMusicEnabled ? 'On' : 'Off'}</TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { toggleSound(); play('click') }}
                                className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors'>
                                <span className='flex items-center gap-2'>
                                    {soundEnabled ? <IconVolume size={13} /> : <IconVolumeOff size={13} />}
                                    Sound Effects
                                </span>
                                <div className={cn('h-4 w-8 rounded-full relative transition-colors', soundEnabled ? 'bg-primary' : 'bg-secondary border border-border')}>
                                    <div className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all', soundEnabled ? 'left-[18px]' : 'left-0.5')} />
                                </div>
                            </button>
                            <button onClick={() => { toggleCanvasMusic(); play('click') }}
                                className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors'>
                                <span className='flex items-center gap-2'>
                                    <IconMusic size={13} /> Canvas Music
                                </span>
                                <div className={cn('h-4 w-8 rounded-full relative transition-colors', canvasMusicEnabled ? 'bg-primary' : 'bg-secondary border border-border')}>
                                    <div className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all', canvasMusicEnabled ? 'left-[18px]' : 'left-0.5')} />
                                </div>
                            </button>
                        </>
                    )}
                </div>

                {/* Collapse toggle */}
                <div className='relative border-t border-border p-3'>
                    <button onClick={handleToggle}
                        className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground', collapsed && 'justify-center px-2')}>
                        {collapsed ? <IconChevronRight size={15} /> : <><IconChevronLeft size={15} /><span>Collapse</span></>}
                    </button>
                </div>
            </aside>
        </TooltipProvider>
    )
}
