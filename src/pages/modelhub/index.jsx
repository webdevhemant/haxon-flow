import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconSearch, IconCpu, IconBolt, IconDatabase, IconCoin, IconCheck } from '@tabler/icons-react'

const MODELS = [
    {
        id: 'm-1',
        name: 'GPT-4o',
        provider: 'OpenAI',
        category: 'Reasoning',
        contextWindow: '128K',
        inputPrice: '$2.50',
        outputPrice: '$10.00',
        features: ['Vision', 'Function Calling', 'JSON Mode'],
        latency: 'Medium',
        available: true,
        new: false,
        color: '#10B981'
    },
    {
        id: 'm-2',
        name: 'GPT-4o mini',
        provider: 'OpenAI',
        category: 'Efficient',
        contextWindow: '128K',
        inputPrice: '$0.15',
        outputPrice: '$0.60',
        features: ['Vision', 'Function Calling', 'JSON Mode'],
        latency: 'Fast',
        available: true,
        new: false,
        color: '#22D3EE'
    },
    {
        id: 'm-3',
        name: 'Claude Opus 4',
        provider: 'Anthropic',
        category: 'Reasoning',
        contextWindow: '200K',
        inputPrice: '$15.00',
        outputPrice: '$75.00',
        features: ['Vision', 'Tool Use', 'Extended Thinking'],
        latency: 'Slow',
        available: true,
        new: true,
        color: '#A855F7'
    },
    {
        id: 'm-4',
        name: 'Claude Sonnet 4.6',
        provider: 'Anthropic',
        category: 'Balanced',
        contextWindow: '200K',
        inputPrice: '$3.00',
        outputPrice: '$15.00',
        features: ['Vision', 'Tool Use', 'Extended Thinking'],
        latency: 'Medium',
        available: true,
        new: true,
        color: '#6366F1'
    },
    {
        id: 'm-5',
        name: 'Claude Haiku 4.5',
        provider: 'Anthropic',
        category: 'Efficient',
        contextWindow: '200K',
        inputPrice: '$0.80',
        outputPrice: '$4.00',
        features: ['Vision', 'Tool Use'],
        latency: 'Fast',
        available: true,
        new: true,
        color: '#8B5CF6'
    },
    {
        id: 'm-6',
        name: 'Gemini 1.5 Pro',
        provider: 'Google',
        category: 'Multimodal',
        contextWindow: '1M',
        inputPrice: '$3.50',
        outputPrice: '$10.50',
        features: ['Vision', 'Audio', 'Video', 'Function Calling'],
        latency: 'Medium',
        available: true,
        new: false,
        color: '#F59E0B'
    },
    {
        id: 'm-7',
        name: 'Gemini 1.5 Flash',
        provider: 'Google',
        category: 'Efficient',
        contextWindow: '1M',
        inputPrice: '$0.35',
        outputPrice: '$1.05',
        features: ['Vision', 'Function Calling'],
        latency: 'Fast',
        available: true,
        new: false,
        color: '#EF4444'
    },
    {
        id: 'm-8',
        name: 'Llama 3.3 70B',
        provider: 'Meta (via Groq)',
        category: 'Open Source',
        contextWindow: '128K',
        inputPrice: '$0.59',
        outputPrice: '$0.79',
        features: ['Tool Use'],
        latency: 'Very Fast',
        available: true,
        new: false,
        color: '#06B6D4'
    },
    {
        id: 'm-9',
        name: 'Mixtral 8x7B',
        provider: 'Mistral AI',
        category: 'Open Source',
        contextWindow: '32K',
        inputPrice: '$0.45',
        outputPrice: '$0.70',
        features: ['Function Calling'],
        latency: 'Fast',
        available: true,
        new: false,
        color: '#F97316'
    }
]

const CATEGORIES = ['All', 'Reasoning', 'Balanced', 'Efficient', 'Multimodal', 'Open Source']
const PROVIDERS = ['All', 'OpenAI', 'Anthropic', 'Google', 'Meta (via Groq)', 'Mistral AI']
const LATENCY_COLORS = { 'Very Fast': '#10B981', Fast: '#22D3EE', Medium: '#F59E0B', Slow: '#EF4444' }

export default function ModelHub() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [selectedModel, setSelectedModel] = useState(null)

    const filtered = MODELS.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || m.category === category
        return matchSearch && matchCat
    })

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search models...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='text-xs text-muted-foreground flex items-center gap-1 ml-auto'>
                    <span className='font-mono text-foreground'>{MODELS.length}</span> models available
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

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((model, i) => (
                    <Card
                        key={model.id}
                        className={cn(
                            'card-hover overflow-hidden group animate-slide-up cursor-pointer',
                            `stagger-${Math.min(i + 1, 8)}`,
                            selectedModel === model.id && 'border-primary/40'
                        )}
                        onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
                    >
                        <div className='h-0.5' style={{ background: model.color }} />
                        <CardContent className='p-5'>
                            <div className='flex items-start justify-between mb-3'>
                                <div
                                    className='rounded-xl p-2.5'
                                    style={{ background: model.color + '18', border: `1px solid ${model.color}28` }}
                                >
                                    <IconCpu size={16} style={{ color: model.color }} />
                                </div>
                                <div className='flex items-center gap-2'>
                                    {model.new && (
                                        <Badge variant='cyan' className='text-[10px]'>
                                            New
                                        </Badge>
                                    )}
                                    <Badge variant='secondary' className='text-[10px]'>
                                        {model.category}
                                    </Badge>
                                </div>
                            </div>
                            <h3 className='font-display text-sm font-semibold text-foreground mb-0.5'>{model.name}</h3>
                            <p className='text-xs text-muted-foreground mb-4'>{model.provider}</p>

                            <div className='grid grid-cols-2 gap-3 mb-4 text-xs'>
                                <div>
                                    <div className='text-muted-foreground mb-0.5'>Context</div>
                                    <div className='font-mono font-semibold text-foreground'>{model.contextWindow}</div>
                                </div>
                                <div>
                                    <div className='text-muted-foreground mb-0.5'>Latency</div>
                                    <div className='font-semibold' style={{ color: LATENCY_COLORS[model.latency] || '#fff' }}>
                                        {model.latency}
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-wrap gap-1 mb-4'>
                                {model.features.map((f) => (
                                    <span
                                        key={f}
                                        className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'
                                    >
                                        {f}
                                    </span>
                                ))}
                            </div>

                            <div className='flex items-center justify-between pt-3 border-t border-border text-xs'>
                                <div>
                                    <span className='text-muted-foreground'>In: </span>
                                    <span className='font-mono text-foreground'>{model.inputPrice}</span>
                                    <span className='text-muted-foreground'> / 1M</span>
                                </div>
                                <div>
                                    <span className='text-muted-foreground'>Out: </span>
                                    <span className='font-mono text-foreground'>{model.outputPrice}</span>
                                    <span className='text-muted-foreground'> / 1M</span>
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='h-6 text-[10px]'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        toast.success(`Using ${model.name}!`)
                                    }}
                                >
                                    Select
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
