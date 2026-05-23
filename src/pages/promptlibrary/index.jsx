import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconCopy, IconBookmark, IconBolt, IconSparkles } from '@tabler/icons-react'

const PROMPTS = [
    {
        id: 'p-1',
        name: 'Structured JSON Extractor',
        category: 'Data',
        description: 'Extract structured data from unstructured text into a specified JSON schema.',
        template: 'Extract the following fields from the text below as JSON: {{fields}}.\n\nText: {{input}}',
        variables: ['fields', 'input'],
        usageCount: 4200,
        bookmarked: true,
        tags: ['extraction', 'json', 'structured']
    },
    {
        id: 'p-2',
        name: 'Customer Email Responder',
        category: 'Support',
        description: 'Draft professional, empathetic responses to customer support emails.',
        template:
            'You are a helpful customer support agent for {{company}}. Respond to the following customer email professionally and empathetically:\n\n{{email}}',
        variables: ['company', 'email'],
        usageCount: 3100,
        bookmarked: false,
        tags: ['email', 'support', 'tone']
    },
    {
        id: 'p-3',
        name: 'Code Review Checklist',
        category: 'DevTools',
        description: 'Review code for correctness, security, and style with actionable feedback.',
        template:
            'Review the following {{language}} code for: correctness, security vulnerabilities, performance, and style. Format as a checklist with severity labels.\n\n```{{language}}\n{{code}}\n```',
        variables: ['language', 'code'],
        usageCount: 1800,
        bookmarked: true,
        tags: ['code', 'review', 'security']
    },
    {
        id: 'p-4',
        name: 'Meeting Summarizer',
        category: 'Productivity',
        description: 'Transform meeting transcripts into concise action-item summaries.',
        template:
            'Summarize the following meeting transcript. Include: key decisions, action items (with owners), and open questions.\n\nTranscript:\n{{transcript}}',
        variables: ['transcript'],
        usageCount: 2900,
        bookmarked: false,
        tags: ['meeting', 'summary', 'actions']
    },
    {
        id: 'p-5',
        name: 'SEO Blog Outline',
        category: 'Marketing',
        description: 'Generate SEO-optimized blog outlines with keyword integration.',
        template:
            'Create a detailed SEO blog post outline for the topic "{{topic}}" targeting the keyword "{{keyword}}". Include H2/H3 headings, meta description, and key points for each section.',
        variables: ['topic', 'keyword'],
        usageCount: 1400,
        bookmarked: false,
        tags: ['seo', 'content', 'blog']
    },
    {
        id: 'p-6',
        name: 'SQL Query Generator',
        category: 'Data',
        description: 'Generate optimized SQL queries from natural language descriptions.',
        template:
            'Generate an optimized {{dialect}} SQL query for the following requirement:\n\n{{requirement}}\n\nDatabase schema:\n{{schema}}',
        variables: ['dialect', 'requirement', 'schema'],
        usageCount: 3600,
        bookmarked: true,
        tags: ['sql', 'database', 'query']
    },
    {
        id: 'p-7',
        name: 'Legal Clause Simplifier',
        category: 'Legal',
        description: 'Translate complex legal clauses into plain English.',
        template:
            'Translate the following legal clause into plain English that a non-lawyer can understand. Highlight any important risks or obligations.\n\nClause:\n{{clause}}',
        variables: ['clause'],
        usageCount: 890,
        bookmarked: false,
        tags: ['legal', 'simplify', 'plain-english']
    },
    {
        id: 'p-8',
        name: 'API Documentation Writer',
        category: 'DevTools',
        description: 'Generate comprehensive API documentation from code or spec.',
        template:
            'Write comprehensive API documentation for the following endpoint. Include: description, request/response schemas, example calls, and error codes.\n\nEndpoint spec:\n{{spec}}',
        variables: ['spec'],
        usageCount: 1100,
        bookmarked: false,
        tags: ['api', 'docs', 'openapi']
    }
]

const CATEGORIES = ['All', 'Data', 'Support', 'DevTools', 'Productivity', 'Marketing', 'Legal']
const CATEGORY_COLORS = {
    Data: '#A855F7',
    Support: '#6366F1',
    DevTools: '#10B981',
    Productivity: '#8B5CF6',
    Marketing: '#F59E0B',
    Legal: '#06B6D4'
}

export default function PromptLibrary() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [bookmarks, setBookmarks] = useState(() => new Set(PROMPTS.filter((p) => p.bookmarked).map((p) => p.id)))

    const filtered = PROMPTS.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || p.category === category
        return matchSearch && matchCat
    })

    const toggleBookmark = (id) => {
        setBookmarks((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleCopy = (template) => {
        navigator.clipboard.writeText(template).catch(() => {})
        toast.success('Prompt copied!')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search prompts...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => toast.info('Prompt editor coming soon!')}>
                    <IconPlus size={14} /> New Prompt
                </Button>
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
                {filtered.map((prompt, i) => {
                    const color = CATEGORY_COLORS[prompt.category] || '#6366F1'
                    const isBookmarked = bookmarks.has(prompt.id)
                    return (
                        <Card
                            key={prompt.id}
                            className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                        >
                            <div className='h-0.5' style={{ background: color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-3'>
                                    <Badge style={{ background: color + '18', color }} className='border-0 text-[10px]'>
                                        {prompt.category}
                                    </Badge>
                                    <button
                                        onClick={() => toggleBookmark(prompt.id)}
                                        className={cn(
                                            'transition-colors',
                                            isBookmarked ? 'text-warning' : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <IconBookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1.5'>{prompt.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed'>{prompt.description}</p>

                                {/* Template preview */}
                                <div className='bg-secondary/50 rounded-lg p-3 mb-3 border border-border'>
                                    <p className='text-[10px] font-mono text-muted-foreground line-clamp-3 leading-relaxed'>
                                        {prompt.template}
                                    </p>
                                </div>

                                <div className='flex flex-wrap gap-1 mb-3'>
                                    {prompt.variables.map((v) => (
                                        <span key={v} className='text-[9px] font-mono bg-primary/10 text-primary rounded px-1.5 py-0.5'>
                                            {'{{' + v + '}}'}
                                        </span>
                                    ))}
                                </div>

                                <div className='flex items-center justify-between pt-3 border-t border-border'>
                                    <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                                        <IconBolt size={11} className='text-primary' />
                                        <span className='font-mono'>{prompt.usageCount.toLocaleString()}</span> uses
                                    </span>
                                    <div className='flex gap-1.5'>
                                        <Button
                                            variant='ghost'
                                            size='icon-sm'
                                            className='h-7 w-7'
                                            onClick={() => handleCopy(prompt.template)}
                                        >
                                            <IconCopy size={12} />
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='h-7 text-xs'
                                            onClick={() => toast.info('Adding to flow...')}
                                        >
                                            <IconSparkles size={11} /> Use
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
