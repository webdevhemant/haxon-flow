import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { IconSearch, IconRefresh, IconDownload, IconFilter, IconTerminal2 } from '@tabler/icons-react'

const LEVELS = ['all', 'info', 'warn', 'error', 'debug']
const LEVEL_COLORS = { info: 'text-cyan', warn: 'text-warning', error: 'text-destructive', debug: 'text-muted-foreground' }
const LEVEL_BG = { info: 'bg-cyan/10', warn: 'bg-warning/10', error: 'bg-destructive/10', debug: 'bg-secondary' }

const MOCK_LOGS = Array.from({ length: 60 }, (_, i) => {
    const levels = ['info', 'info', 'info', 'debug', 'warn', 'error']
    const level = levels[Math.floor(Math.random() * levels.length)]
    const messages = {
        info: ['Server started on port 3000', 'Flow execution completed', 'New API request received', 'Cache hit for node result', 'Webhook delivered successfully', 'Model response received in 420ms'],
        debug: ['Node input: {"query":"..."}', 'Fetching vector embeddings', 'Redis cache miss', 'Retry attempt 1/3', 'Streaming response chunk received'],
        warn: ['Rate limit approaching (80%)', 'Context length nearing max', 'Response latency high (>2s)', 'Deprecated node version detected'],
        error: ['Flow execution failed: timeout', 'Invalid API key provided', 'Vector store connection lost', 'LLM provider returned 429'],
    }
    const msgs = messages[level]
    const msg = msgs[Math.floor(Math.random() * msgs.length)]
    const ts = new Date(Date.now() - (60 - i) * 12000)
    return { id: i, level, message: msg, timestamp: ts.toISOString(), source: ['flowise-server', 'flow-executor', 'api-handler', 'cache-layer'][Math.floor(Math.random() * 4)] }
}).reverse()

export default function ServerLogs() {
    const [search, setSearch] = useState('')
    const [levelFilter, setLevelFilter] = useState('all')
    const [autoScroll, setAutoScroll] = useState(true)
    const logRef = useRef(null)

    const filtered = MOCK_LOGS.filter((l) => {
        const matchSearch = l.message.toLowerCase().includes(search.toLowerCase()) || l.source.toLowerCase().includes(search.toLowerCase())
        const matchLevel = levelFilter === 'all' || l.level === levelFilter
        return matchSearch && matchLevel
    })

    useEffect(() => {
        if (autoScroll && logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight
        }
    }, [filtered, autoScroll])

    return (
        <div className='space-y-4 animate-fade-in'>
            <div className='flex flex-col sm:flex-row gap-3'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input placeholder='Search logs...' className='pl-8 h-8 text-sm' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className='flex gap-2 flex-wrap'>
                    {LEVELS.map((l) => (
                        <button key={l} onClick={() => setLevelFilter(l)}
                            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-all capitalize',
                                levelFilter === l ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'
                            )}>
                            {l}
                        </button>
                    ))}
                </div>
                <div className='flex gap-2 ml-auto'>
                    <Button variant='ghost' size='sm' onClick={() => setAutoScroll((p) => !p)} className={cn(autoScroll && 'text-primary')}>
                        <IconFilter size={14} /> {autoScroll ? 'Auto' : 'Manual'}
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => toast?.info('Downloading...')}>
                        <IconDownload size={14} />
                    </Button>
                </div>
            </div>

            {/* Terminal */}
            <div className='rounded-xl border border-border bg-[hsl(228_45%_2%)] overflow-hidden'>
                <div className='flex items-center gap-2 px-4 py-2 border-b border-border bg-secondary/30'>
                    <IconTerminal2 size={13} className='text-muted-foreground' />
                    <span className='text-xs font-mono text-muted-foreground'>server.log</span>
                    <span className='ml-auto text-xs font-mono text-muted-foreground'>{filtered.length} entries</span>
                </div>
                <div ref={logRef} className='h-[520px] overflow-y-auto p-4 space-y-1 font-mono text-xs'>
                    {filtered.map((log) => (
                        <div key={log.id} className={cn('flex items-start gap-3 px-2 py-1 rounded hover:bg-white/5 transition-colors group', log.level === 'error' && 'bg-destructive/5')}>
                            <span className='text-muted-foreground/60 shrink-0 tabular-nums'>{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className={cn('shrink-0 uppercase font-bold w-10', LEVEL_COLORS[log.level])}>{log.level}</span>
                            <span className='text-primary/70 shrink-0 hidden md:block'>[{log.source}]</span>
                            <span className={cn('text-foreground/80', log.level === 'error' && 'text-destructive')}>{log.message}</span>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className='flex items-center justify-center h-full text-muted-foreground'>No logs match your filter</div>
                    )}
                </div>
            </div>
        </div>
    )
}
