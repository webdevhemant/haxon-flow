import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function ChatDialog({ open, onClose, assistant }) {
    const [messages, setMessages] = useState([{ role: 'assistant', content: `Hi! I'm ${assistant?.name}. How can I help you?` }])
    const [input, setInput] = useState('')

    const send = () => {
        if (!input.trim()) return
        const userMsg = { role: 'user', content: input }
        setMessages((p) => [...p, userMsg])
        setInput('')
        setTimeout(() => {
            setMessages((p) => [...p, { role: 'assistant', content: `I received: "${userMsg.content}". This is a demo response from ${assistant?.name}.` }])
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
                            <div className={cn('max-w-[80%] rounded-lg px-3 py-2 text-xs', m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground')}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex gap-2'>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder='Type a message...' className='flex-1' />
                    <Button onClick={send} variant='gradient' size='sm'>Send</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
