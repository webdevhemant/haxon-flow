import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import marketplaces from '@/mock/data/marketplaces'
import { toast } from 'sonner'
import { IconSearch, IconStar, IconDownload, IconHierarchy2, IconFilter, IconSparkles } from '@tabler/icons-react'

const CATEGORIES = ['All', 'Support', 'Research', 'DevTools', 'Data', 'Marketing', 'HR', 'Legal', 'Productivity', 'Finance']
const CATEGORY_COLORS = {
    Support: '#6366F1',
    Research: '#22D3EE',
    DevTools: '#10B981',
    Data: '#A855F7',
    Marketing: '#F59E0B',
    HR: '#EF4444',
    Legal: '#06B6D4',
    Productivity: '#8B5CF6',
    Finance: '#F59E0B'
}

export default function Marketplaces() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [sort, setSort] = useState('stars')

    const filtered = marketplaces
        .filter((m) => {
            const matchSearch =
                m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())
            return matchSearch && (category === 'All' || m.category === category)
        })
        .sort((a, b) => b[sort] - a[sort])

    const featured = marketplaces.filter((m) => m.featured)

    return (
        <div className='space-y-8 animate-fade-in'>
            {/* Featured banner */}
            <div className='rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden'>
                <div className='absolute inset-0 bg-grid opacity-20' />
                <div className='relative flex flex-col sm:flex-row sm:items-center gap-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                            <IconSparkles size={14} className='text-primary' />
                            <span className='text-xs font-mono text-primary uppercase tracking-wider'>Featured Templates</span>
                        </div>
                        <h2 className='font-display text-xl font-semibold mb-1'>Start with a proven template</h2>
                        <p className='text-sm text-muted-foreground'>
                            Production-ready flows built by the Haxon team and top community contributors.
                        </p>
                    </div>
                    <div className='flex gap-3 overflow-x-auto pb-1 sm:pb-0'>
                        {featured.slice(0, 3).map((m) => (
                            <button
                                key={m.id}
                                onClick={() => toast.success(`Installing "${m.name}"...`)}
                                className='shrink-0 rounded-lg border border-border bg-card px-4 py-3 text-left hover:border-primary/30 transition-colors'
                            >
                                <div className='text-xs font-semibold text-foreground'>{m.name}</div>
                                <div className='text-[10px] text-muted-foreground mt-0.5'>{m.downloads.toLocaleString()} installs</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search templates...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='flex gap-2'>
                    {['stars', 'downloads'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSort(s)}
                            className={cn(
                                'rounded-lg px-3 py-1.5 text-xs transition-colors capitalize',
                                sort === s ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {s === 'stars' ? '⭐ Top Rated' : '⬇️ Most Used'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category pills */}
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

            {/* Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((m, i) => {
                    const catColor = CATEGORY_COLORS[m.category] || '#6366F1'
                    return (
                        <Card
                            key={m.id}
                            className={cn('card-hover group overflow-hidden animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                        >
                            <div className='h-0.5' style={{ background: catColor }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-3'>
                                    <Badge style={{ background: catColor + '18', color: catColor }} className='border-0 text-[10px]'>
                                        {m.category}
                                    </Badge>
                                    {m.featured && (
                                        <Badge variant='cyan' className='text-[10px]'>
                                            Featured
                                        </Badge>
                                    )}
                                </div>
                                <h3 className='font-display text-sm font-semibold mb-2'>{m.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{m.description}</p>
                                <div className='flex flex-wrap gap-1 mb-4'>
                                    {m.tags.slice(0, 3).map((t) => (
                                        <span
                                            key={t}
                                            className='text-[9px] font-mono bg-secondary border border-border rounded px-1.5 py-0.5 text-muted-foreground'
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className='flex items-center justify-between pt-3 border-t border-border'>
                                    <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                                        <span className='flex items-center gap-1'>
                                            <IconStar size={11} className='text-warning' />
                                            <span className='font-mono'>{m.stars}</span>
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <IconDownload size={11} />
                                            <span className='font-mono'>{m.downloads.toLocaleString()}</span>
                                        </span>
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='h-7 text-xs'
                                        onClick={() => toast.success(`Installing "${m.name}"...`)}
                                    >
                                        <IconDownload size={11} /> Use Template
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
