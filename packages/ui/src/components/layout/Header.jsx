import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { IconSearch, IconBell, IconPlus, IconSettings, IconUser, IconLogout, IconHelp, IconChevronRight } from '@tabler/icons-react'

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
    '/account': { title: 'Account', desc: 'Profile & preferences' },
    '/home': { title: 'Home', desc: '' },
}

export function Header() {
    const location = useLocation()
    const [searchOpen, setSearchOpen] = useState(false)

    const basePath = '/' + location.pathname.split('/')[1]
    const meta = ROUTE_META[basePath] || { title: 'Haxon Flow', desc: '' }

    return (
        <header className='sticky top-0 z-30 flex h-[60px] items-center border-b border-border bg-background/80 backdrop-blur-md px-5 gap-4'>
            {/* Page title */}
            <div className='flex-1 min-w-0'>
                <h1 className='font-display text-base font-semibold text-foreground leading-none truncate'>
                    {meta.title}
                </h1>
                {meta.desc && (
                    <p className='text-[11px] text-muted-foreground mt-0.5 hidden sm:block'>{meta.desc}</p>
                )}
            </div>

            {/* Search */}
            <div className='hidden md:flex items-center'>
                <div className='relative'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search...'
                        className='h-8 w-48 pl-8 text-xs bg-secondary border-0 focus-visible:ring-0 focus-visible:border-primary/30 placeholder:text-muted-foreground/60'
                    />
                    <kbd className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground/50 hidden lg:block'>⌘K</kbd>
                </div>
            </div>

            {/* Notifications */}
            <Button variant='ghost' size='icon-sm' className='relative text-muted-foreground'>
                <IconBell size={16} />
                <span className='absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse' />
            </Button>

            {/* New flow CTA */}
            <Button variant='gradient' size='sm' className='hidden sm:flex gap-1.5' asChild>
                <Link to='/chatflows'>
                    <IconPlus size={14} />
                    New Flow
                </Link>
            </Button>

            {/* User menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className='flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-secondary transition-colors outline-none'>
                        <Avatar className='h-7 w-7'>
                            <AvatarFallback className='text-[10px] bg-primary/20 text-primary font-semibold'>HX</AvatarFallback>
                        </Avatar>
                        <div className='hidden sm:flex flex-col items-start leading-none'>
                            <span className='text-xs font-medium text-foreground'>Haxon User</span>
                        </div>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium leading-none'>Haxon User</p>
                            <p className='text-xs text-muted-foreground'>user@haxon.ai</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to='/account' className='flex items-center gap-2'>
                            <IconUser size={14} />
                            Account Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <IconHelp size={14} />
                        Help & Docs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-destructive focus:text-destructive'>
                        <IconLogout size={14} />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
