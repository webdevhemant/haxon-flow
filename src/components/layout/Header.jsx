import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useSound } from '@/hooks/useSound'
import { useNotificationStore } from '@/store/useNotificationStore'
import {
    IconBell, IconSettings, IconUser, IconLogout, IconHelp,
    IconAlertCircle, IconCheck, IconInfoCircle, IconAlertTriangle,
    IconX, IconTrash, IconBellOff
} from '@tabler/icons-react'

const ROUTE_META = {
    '/chatflows': { title: 'Chatflows', desc: 'Visual AI conversation flows' },
    '/agentflows': { title: 'Agentflows', desc: 'Multi-agent orchestration' },
    '/executions': { title: 'Executions', desc: 'Workflow run history' },
    '/assistants': { title: 'Assistants', desc: 'AI assistant configurations' },
    '/marketplaces': { title: 'Templates', desc: 'Community flow templates' },
    '/tools': { title: 'Tools', desc: 'Function tool definitions' },
    '/prompt-library': { title: 'Prompt Library', desc: 'Saved prompt templates' },
    '/model-hub': { title: 'Model Hub', desc: 'AI model connections' },
    '/document-stores': { title: 'Document Stores', desc: 'Knowledge base management' },
    '/credentials': { title: 'Credentials', desc: 'Secure API credentials' },
    '/variables': { title: 'Variables', desc: 'Environment variables' },
    '/integrations': { title: 'Integrations', desc: 'Third-party connections' },
    '/datasets': { title: 'Datasets', desc: 'Evaluation datasets' },
    '/evaluators': { title: 'Evaluators', desc: 'Evaluation configurations' },
    '/evaluations': { title: 'Evaluations', desc: 'Evaluation run results' },
    '/analytics': { title: 'Analytics', desc: 'Usage metrics & insights' },
    '/deployments': { title: 'Deployments', desc: 'Live workflow endpoints' },
    '/apikey': { title: 'API Keys', desc: 'API access management' },
    '/logs': { title: 'Logs', desc: 'Server activity logs' },
    '/account': { title: 'Account', desc: 'Profile & preferences' }
}

const TYPE_CONFIG = {
    error:   { icon: IconAlertCircle,   color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    warning: { icon: IconAlertTriangle, color: 'text-warning',     bg: 'bg-warning/10',     border: 'border-warning/20' },
    success: { icon: IconCheck,         color: 'text-success',     bg: 'bg-success/10',     border: 'border-success/20' },
    info:    { icon: IconInfoCircle,    color: 'text-primary',     bg: 'bg-primary/10',     border: 'border-primary/20' }
}

function formatTime(ts) {
    const diff = Date.now() - ts
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
    return Math.floor(diff / 86400000) + 'd ago'
}

function NotificationPanel({ onClose }) {
    const { notifications, markRead, markAllRead, dismiss, clearAll } = useNotificationStore()
    const { play } = useSound()
    const unread = notifications.filter((n) => !n.read).length

    return (
        <div className='absolute right-0 top-full mt-2 w-96 rounded-2xl border border-border bg-card shadow-2xl shadow-background/60 z-50 overflow-hidden animate-slide-up'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30'>
                <div className='flex items-center gap-2'>
                    <span className='font-display text-sm font-semibold text-foreground'>Notifications</span>
                    {unread > 0 && (
                        <span className='h-5 min-w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1'>{unread}</span>
                    )}
                </div>
                <div className='flex items-center gap-1'>
                    {unread > 0 && (
                        <button onClick={() => { markAllRead(); play('click') }}
                            className='text-[10px] text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-md hover:bg-primary/10'>
                            Mark all read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button onClick={() => { clearAll(); play('click') }}
                            className='p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors' title='Clear all'>
                            <IconTrash size={12} />
                        </button>
                    )}
                    <button onClick={onClose} className='p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors'>
                        <IconX size={13} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className='max-h-[420px] overflow-y-auto'>
                {notifications.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <IconBellOff size={28} className='text-muted-foreground/30 mb-3' />
                        <p className='text-sm text-muted-foreground'>No notifications</p>
                        <p className='text-xs text-muted-foreground/60 mt-1'>You're all caught up</p>
                    </div>
                ) : (
                    notifications.map((n) => {
                        const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info
                        const Icon = cfg.icon
                        return (
                            <div key={n.id}
                                onClick={() => { markRead(n.id); play('click') }}
                                className={cn(
                                    'flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 cursor-pointer transition-colors hover:bg-secondary/40',
                                    !n.read && 'bg-primary/3'
                                )}>
                                <div className={cn('mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border', cfg.bg, cfg.border)}>
                                    <Icon size={13} className={cfg.color} />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-start justify-between gap-2'>
                                        <p className={cn('text-xs font-semibold leading-tight', !n.read ? 'text-foreground' : 'text-muted-foreground')}>{n.title}</p>
                                        <span className='text-[10px] text-muted-foreground/60 shrink-0 font-mono mt-px'>{formatTime(n.time)}</span>
                                    </div>
                                    <p className='text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2'>{n.body}</p>
                                </div>
                                <div className='flex flex-col items-end gap-1 shrink-0'>
                                    {!n.read && <span className='h-1.5 w-1.5 rounded-full bg-primary mt-1' />}
                                    <button onClick={(e) => { e.stopPropagation(); dismiss(n.id); play('click') }}
                                        className='opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-all'>
                                        <IconX size={10} />
                                    </button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Footer */}
            <div className='px-4 py-2.5 border-t border-border bg-secondary/20'>
                <Link to='/account' onClick={onClose} className='text-[10px] text-primary hover:text-primary/80 font-medium transition-colors'>
                    Manage notification settings →
                </Link>
            </div>
        </div>
    )
}

export function Header() {
    const location = useLocation()
    const { play } = useSound()
    const [showNotif, setShowNotif] = useState(false)
    const notifRef = useRef(null)
    const { notifications } = useNotificationStore()
    const unread = notifications.filter((n) => !n.read).length

    const basePath = '/' + location.pathname.split('/')[1]
    const meta = ROUTE_META[basePath] || { title: 'Haxon Flow', desc: '' }

    useEffect(() => {
        const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <header className='sticky top-0 z-30 flex h-[60px] items-center border-b border-border bg-background/80 backdrop-blur-md px-5 gap-4'>
            {/* Page title */}
            <div className='flex-1 min-w-0'>
                <h1 className='font-display text-base font-semibold text-foreground leading-none truncate'>{meta.title}</h1>
                {meta.desc && <p className='text-[11px] text-muted-foreground mt-0.5 hidden sm:block'>{meta.desc}</p>}
            </div>

            {/* Notifications */}
            <div className='relative group' ref={notifRef}>
                <button
                    onClick={() => { setShowNotif(!showNotif); play('click') }}
                    className={cn('relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors', showNotif ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                    <IconBell size={16} />
                    {unread > 0 && (
                        <span className='absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none'>
                            {unread > 9 ? '9+' : unread}
                        </span>
                    )}
                </button>
                {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
            </div>

            {/* User menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className='flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-secondary transition-colors outline-none'>
                        <Avatar className='h-7 w-7'>
                            <AvatarFallback className='text-[10px] bg-primary/20 text-primary font-semibold'>H</AvatarFallback>
                        </Avatar>
                        <div className='hidden sm:flex flex-col items-start leading-none'>
                            <span className='text-xs font-medium text-foreground'>Hemant</span>
                            <span className='text-[10px] text-muted-foreground mt-0.5'>hemant.dev.upwork@gmail.com</span>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-52'>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-semibold leading-none'>Hemant</p>
                            <p className='text-xs text-muted-foreground'>hemant.dev.upwork@gmail.com</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to='/account' className='flex items-center gap-2' onClick={() => play('click')}>
                            <IconUser size={14} /> Account & Preferences
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => play('click')}>
                        <IconHelp size={14} /> Help & Docs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive focus:text-destructive' onClick={() => play('click')}>
                        <IconLogout size={14} /> Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
