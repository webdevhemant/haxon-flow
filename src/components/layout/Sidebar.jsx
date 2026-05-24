import { useState } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useSound } from '@/hooks/useSound'
import {
    IconHierarchy2, IconUsersGroup, IconListCheck, IconRobot, IconBuildingStore,
    IconTool, IconLock, IconVariable, IconKey, IconFiles, IconDatabase, IconTestPipe,
    IconChartHistogram, IconList, IconSettings, IconChevronLeft, IconChevronRight,
    IconBolt, IconBrain, IconBook2, IconChartBar, IconServer2, IconPlugConnected,
    IconLogin, IconUserPlus, IconMailCheck, IconUser
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
        <NavLink
            to={item.to}
            onClick={() => play('click')}
            className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
                collapsed && 'justify-center px-2.5'
            )}
        >
            {isActive && (
                <span className='absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary' />
            )}
            <Icon
                size={16}
                className={cn('shrink-0 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}
            />
            {!collapsed && <span className='flex-1 truncate leading-none'>{item.label}</span>}
            {!collapsed && item.badge && (
                <Badge variant='cyan' className='text-[9px] px-1.5 py-0.5 h-4 font-mono'>
                    {item.badge}
                </Badge>
            )}
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

    const handleToggle = () => { setCollapsed(!collapsed); play('click') }

    return (
        <TooltipProvider delayDuration={200}>
            <aside className={cn(
                'relative flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out',
                collapsed ? 'w-[60px]' : 'w-[240px]'
            )}>
                {/* Subtle background texture */}
                <div className='pointer-events-none absolute inset-0 bg-dot opacity-[0.12]' />
                <div className='pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl' />

                {/* Logo */}
                <div className={cn(
                    'relative flex items-center border-b border-border/60 h-[60px] shrink-0',
                    collapsed ? 'justify-center px-3' : 'px-4'
                )}>
                    <Logo collapsed={collapsed} />
                </div>

                {/* Navigation */}
                <ScrollArea className='relative flex-1 py-2'>
                    <nav className={cn('space-y-0.5', collapsed ? 'px-1.5' : 'px-2.5')}>
                        {NAV.map((section) => (
                            <div key={section.label} className='mb-0.5'>
                                {!collapsed && (
                                    <p className='mb-0.5 mt-4 first:mt-1 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40'>
                                        {section.label}
                                    </p>
                                )}
                                {collapsed && <div className='my-1.5 h-px bg-border/30 mx-1' />}
                                <div className='space-y-px'>
                                    {section.items.map((item) => (
                                        <NavItem key={item.id} item={item} collapsed={collapsed} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* Bottom: user profile + collapse */}
                <div className='relative border-t border-border/60 shrink-0'>
                    {/* User row */}
                    <Link
                        to='/account'
                        onClick={() => play('click')}
                        className={cn(
                            'flex items-center gap-3 px-3 py-3 hover:bg-secondary/50 transition-colors',
                            collapsed && 'justify-center'
                        )}
                    >
                        <div className='h-7 w-7 rounded-full bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-[11px] font-bold text-white shrink-0'>
                            H
                        </div>
                        {!collapsed && (
                            <div className='flex-1 min-w-0'>
                                <p className='text-xs font-semibold text-foreground leading-tight truncate'>Hemant</p>
                                <p className='text-[10px] text-muted-foreground truncate'>Owner · Pro</p>
                            </div>
                        )}
                        {!collapsed && (
                            <IconSettings size={13} className='text-muted-foreground/50 shrink-0' />
                        )}
                    </Link>

                    {/* Collapse toggle */}
                    <div className='border-t border-border/40 px-2 py-1.5'>
                        <button
                            onClick={handleToggle}
                            className={cn(
                                'w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground',
                                collapsed && 'justify-center px-2'
                            )}
                        >
                            {collapsed ? (
                                <IconChevronRight size={14} />
                            ) : (
                                <>
                                    <IconChevronLeft size={14} />
                                    <span>Collapse</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    )
}
