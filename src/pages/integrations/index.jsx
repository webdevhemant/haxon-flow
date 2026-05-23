import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconSearch, IconPlug, IconCheck, IconExternalLink } from '@tabler/icons-react'

const INTEGRATIONS = [
    {
        id: 'int-1',
        name: 'Slack',
        category: 'Communication',
        description: 'Send messages, create channels, and trigger flows from Slack.',
        connected: true,
        color: '#E01E5A',
        logo: '💬'
    },
    {
        id: 'int-2',
        name: 'GitHub',
        category: 'DevTools',
        description: 'Trigger flows on PRs, issues, and commits. Post automated comments.',
        connected: true,
        color: '#6366F1',
        logo: '🐙'
    },
    {
        id: 'int-3',
        name: 'HubSpot',
        category: 'CRM',
        description: 'Sync leads, contacts, and trigger flows on CRM events.',
        connected: false,
        color: '#FF7A59',
        logo: '🎯'
    },
    {
        id: 'int-4',
        name: 'Zapier',
        category: 'Automation',
        description: 'Connect Haxon flows to 6,000+ apps via Zapier webhooks.',
        connected: false,
        color: '#FF4A00',
        logo: '⚡'
    },
    {
        id: 'int-5',
        name: 'Notion',
        category: 'Productivity',
        description: 'Read and write Notion pages, databases, and blocks.',
        connected: true,
        color: '#ffffff',
        logo: '📝'
    },
    {
        id: 'int-6',
        name: 'Google Sheets',
        category: 'Data',
        description: 'Read/write spreadsheet data as a flow data source or sink.',
        connected: false,
        color: '#34A853',
        logo: '📊'
    },
    {
        id: 'int-7',
        name: 'Jira',
        category: 'DevTools',
        description: 'Create tickets, update statuses, and query issues in flows.',
        connected: false,
        color: '#0052CC',
        logo: '🔷'
    },
    {
        id: 'int-8',
        name: 'Linear',
        category: 'DevTools',
        description: 'Automate issue creation, triage, and status updates.',
        connected: false,
        color: '#5E6AD2',
        logo: '📐'
    },
    {
        id: 'int-9',
        name: 'Stripe',
        category: 'Finance',
        description: 'Trigger flows on payment events and subscription changes.',
        connected: false,
        color: '#635BFF',
        logo: '💳'
    },
    {
        id: 'int-10',
        name: 'Twilio',
        category: 'Communication',
        description: 'Send SMS and voice notifications from your flows.',
        connected: false,
        color: '#F22F46',
        logo: '📱'
    },
    {
        id: 'int-11',
        name: 'Airtable',
        category: 'Data',
        description: 'Use Airtable bases as structured data sources in flows.',
        connected: false,
        color: '#FFBF00',
        logo: '🗂️'
    },
    {
        id: 'int-12',
        name: 'Salesforce',
        category: 'CRM',
        description: 'Sync records and trigger flows from Salesforce events.',
        connected: false,
        color: '#00A1E0',
        logo: '☁️'
    }
]

const CATEGORIES = ['All', 'Communication', 'DevTools', 'CRM', 'Data', 'Automation', 'Productivity', 'Finance']

export default function Integrations() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [connected, setConnected] = useState(() => new Set(INTEGRATIONS.filter((i) => i.connected).map((i) => i.id)))

    const filtered = INTEGRATIONS.filter((i) => {
        const matchSearch =
            i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || i.category === category
        return matchSearch && matchCat
    })

    const toggleConnect = (id, name) => {
        setConnected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
                toast.info(`${name} disconnected`)
            } else {
                next.add(id)
                toast.success(`${name} connected!`)
            }
            return next
        })
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search integrations...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='text-xs text-muted-foreground flex items-center gap-1 ml-auto'>
                    <span className='font-mono text-success'>{connected.size}</span> connected
                </div>
            </div>

            <div className='flex flex-wrap gap-2'>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium transition-all',
                            category === cat
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filtered.map((int, i) => {
                    const isConnected = connected.has(int.id)
                    return (
                        <Card
                            key={int.id}
                            className={cn(
                                'card-hover overflow-hidden group animate-slide-up',
                                `stagger-${Math.min(i + 1, 8)}`,
                                isConnected && 'border-primary/20'
                            )}
                        >
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div
                                        className='h-11 w-11 rounded-xl flex items-center justify-center text-2xl'
                                        style={{ background: int.color + '15', border: `1px solid ${int.color}25` }}
                                    >
                                        {int.logo}
                                    </div>
                                    {isConnected && (
                                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-success/15'>
                                            <IconCheck size={11} className='text-success' strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1'>{int.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{int.description}</p>
                                <Badge variant='secondary' className='text-[10px] mb-4'>
                                    {int.category}
                                </Badge>
                                <div className='flex gap-2 pt-3 border-t border-border'>
                                    <Button
                                        variant={isConnected ? 'outline' : 'gradient'}
                                        size='sm'
                                        className='flex-1 text-xs h-7'
                                        onClick={() => toggleConnect(int.id, int.name)}
                                    >
                                        <IconPlug size={11} />
                                        {isConnected ? 'Disconnect' : 'Connect'}
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size='icon-sm'
                                        className='h-7 w-7'
                                        onClick={() => toast.info('Docs coming soon!')}
                                    >
                                        <IconExternalLink size={12} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
