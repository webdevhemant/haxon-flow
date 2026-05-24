import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import assistantsData from '@/mock/data/assistants'
import { toast } from 'sonner'
import { IconPlus, IconSearch, IconDots, IconEdit, IconCopy, IconTrash, IconRobot, IconMessage, IconCpu } from '@tabler/icons-react'

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-opus-4-5', 'claude-sonnet-4-5', 'gemini-2.0-flash', 'llama-3.3-70b']
const MODEL_COLORS = {
    'gpt-4o': '#10B981',
    'gpt-4o-mini': '#22D3EE',
    'claude-opus-4-5': '#6366F1',
    'claude-sonnet-4-5': '#A855F7',
    'gemini-2.0-flash': '#F59E0B',
    'llama-3.3-70b': '#EF4444'
}
const AVATARS = ['🤖', '🧠', '💡', '⚡', '🎯', '🔮', '🦾', '🌟']

function AssistantDialog({ open, onClose, onSave, initial }) {
    const [name, setName] = useState(initial?.name || '')
    const [desc, setDesc] = useState(initial?.description || '')
    const [model, setModel] = useState(initial?.model || 'gpt-4o')
    const [avatar, setAvatar] = useState(initial?.avatar || '🤖')
    const [sysPrompt, setSysPrompt] = useState(initial?.systemPrompt || 'You are a helpful AI assistant.')
    const isEdit = !!initial

    const handleSave = () => {
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        onSave({
            name: name.trim(),
            description: desc.trim(),
            model,
            avatar,
            systemPrompt: sysPrompt,
            type: 'custom',
            conversations: initial?.conversations || 0
        })
        setName('')
        setDesc('')
        setModel('gpt-4o')
        setAvatar('🤖')
        setSysPrompt('You are a helpful AI assistant.')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='font-display'>{isEdit ? 'Edit Assistant' : 'New Assistant'}</DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Avatar</label>
                        <div className='flex gap-2'>
                            {AVATARS.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => setAvatar(a)}
                                    className={cn(
                                        'h-9 w-9 rounded-lg text-xl transition-all',
                                        avatar === a ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary hover:bg-secondary/80'
                                    )}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Customer Support Bot' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Description</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder='What does this assistant do?' />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Model</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'
                        >
                            {MODELS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>System Prompt</label>
                        <textarea
                            value={sysPrompt}
                            onChange={(e) => setSysPrompt(e.target.value)}
                            rows={4}
                            className='w-full text-xs rounded-md border border-border bg-background px-3 py-2 text-foreground resize-none'
                            placeholder='You are a helpful assistant...'
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='gradient' onClick={handleSave}>
                        {isEdit ? (
                            'Save Changes'
                        ) : (
                            <>
                                <IconPlus size={14} /> Create
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ChatDialog({ open, onClose, assistant }) {
    const [messages, setMessages] = useState([{ role: 'assistant', content: `Hi! I'm ${assistant?.name}. How can I help you?` }])
    const [input, setInput] = useState('')

    const send = () => {
        if (!input.trim()) return
        const userMsg = { role: 'user', content: input }
        setMessages((p) => [...p, userMsg])
        setInput('')
        setTimeout(() => {
            setMessages((p) => [
                ...p,
                { role: 'assistant', content: `I received: "${userMsg.content}". This is a demo response from ${assistant?.name}.` }
            ])
        }, 800)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <span className='text-xl'>{assistant?.avatar}</span> {assistant?.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='h-72 overflow-y-auto space-y-3 py-2 border border-border rounded-lg p-3 bg-background'>
                    {messages.map((m, i) => (
                        <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                            <div
                                className={cn(
                                    'max-w-[80%] rounded-lg px-3 py-2 text-xs',
                                    m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                                )}
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder='Type a message...'
                        className='flex-1'
                    />
                    <Button onClick={send} variant='gradient' size='sm'>
                        Send
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function Assistants() {
    const [search, setSearch] = useState('')
    const [items, setItems] = useState(assistantsData)
    const [showAdd, setShowAdd] = useState(false)
    const [editing, setEditing] = useState(null)
    const [chatWith, setChatWith] = useState(null)

    const filtered = items.filter(
        (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.description?.toLowerCase().includes(search.toLowerCase())
    )

    const handleAdd = (data) => {
        setItems((p) => [{ ...data, id: `ast-${Date.now()}` }, ...p])
        setShowAdd(false)
        toast.success('Assistant created')
    }
    const handleEdit = (data) => {
        setItems((p) => p.map((a) => (a.id === editing.id ? { ...a, ...data } : a)))
        setEditing(null)
        toast.success('Updated')
    }
    const handleDelete = (id) => {
        setItems((p) => p.filter((a) => a.id !== id))
        toast.success('Deleted')
    }
    const handleDuplicate = (a) => {
        setItems((p) => [{ ...a, id: `ast-${Date.now()}`, name: a.name + ' (Copy)', conversations: 0 }, ...p])
        toast.success('Duplicated')
    }

    return (
        <div className='space-y-6 animate-fade-in'>
            <AssistantDialog open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAdd} />
            <AssistantDialog open={!!editing} onClose={() => setEditing(null)} onSave={handleEdit} initial={editing} />
            {chatWith && <ChatDialog open={!!chatWith} onClose={() => setChatWith(null)} assistant={chatWith} />}

            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                <div className='relative flex-1 max-w-xs'>
                    <IconSearch size={14} className='absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground' />
                    <Input
                        placeholder='Search assistants...'
                        className='pl-8 h-8 text-sm'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant='gradient' size='sm' onClick={() => setShowAdd(true)}>
                    <IconPlus size={14} /> New Assistant
                </Button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filtered.map((a, i) => {
                    const color = MODEL_COLORS[a.model] || '#6366F1'
                    return (
                        <Card
                            key={a.id}
                            className={cn('card-hover overflow-hidden group animate-slide-up', `stagger-${Math.min(i + 1, 8)}`)}
                        >
                            <div className='h-0.5' style={{ background: color }} />
                            <CardContent className='p-5'>
                                <div className='flex items-start justify-between mb-4'>
                                    <div
                                        className='h-12 w-12 rounded-xl flex items-center justify-center text-2xl'
                                        style={{ background: color + '18', border: `1px solid ${color}28` }}
                                    >
                                        {a.avatar || '🤖'}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='icon-sm'
                                                className='opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                <IconDots size={14} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => setEditing(a)}>
                                                <IconEdit size={13} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(a)}>
                                                <IconCopy size={13} /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className='text-destructive focus:text-destructive'
                                                onClick={() => handleDelete(a.id)}
                                            >
                                                <IconTrash size={13} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <h3 className='font-display text-sm font-semibold text-foreground mb-1'>{a.name}</h3>
                                <p className='text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed'>{a.description}</p>
                                <div className='flex items-center gap-2 mb-4'>
                                    <Badge style={{ background: color + '18', color }} className='border-0 text-[10px] font-mono'>
                                        {a.model}
                                    </Badge>
                                    <Badge variant='secondary' className='text-[10px]'>
                                        {a.type}
                                    </Badge>
                                </div>
                                <div className='flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border'>
                                    <span className='flex items-center gap-1'>
                                        <IconMessage size={11} className='text-primary' />
                                        <span className='font-mono'>{(a.conversations || 0).toLocaleString()}</span> chats
                                    </span>
                                    <Button variant='outline' size='sm' className='h-6 text-[10px]' onClick={() => setChatWith(a)}>
                                        Try it
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <IconRobot size={40} className='text-muted-foreground/30 mb-4' />
                    <h3 className='font-display text-lg font-semibold mb-2'>No assistants yet</h3>
                    <Button variant='gradient' onClick={() => setShowAdd(true)}>
                        <IconPlus size={14} /> New Assistant
                    </Button>
                </div>
            )}
        </div>
    )
}
