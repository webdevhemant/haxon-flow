import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useFlowStore } from '@/store/useFlowStore'
import { toast } from 'sonner'
import { IconApi } from '@tabler/icons-react'

const REGIONS = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'ap-northeast-1']

export function DeployDialog({ open, onClose, onDeploy }) {
    const { chatflows, agentflows } = useFlowStore()
    const allFlows = [...chatflows, ...agentflows]
    const [selectedFlow, setSelectedFlow] = useState(allFlows[0]?.id || '')
    const [name, setName] = useState('')
    const [region, setRegion] = useState('us-east-1')

    const handleDeploy = () => {
        if (!name.trim()) { toast.error('Deployment name is required'); return }
        if (!selectedFlow) { toast.error('Select a flow to deploy'); return }
        const flow = allFlows.find((f) => f.id === selectedFlow)
        onDeploy({
            name: name.trim(),
            flowName: flow?.name || selectedFlow,
            endpoint: `https://api.haxon.io/v1/flows/${name.trim().toLowerCase().replace(/\s+/g, '-')}`,
            method: 'POST',
            status: 'live',
            requestsToday: 0,
            avgLatency: null,
            uptime: 100,
            region,
            deployedAt: new Date().toISOString()
        })
        setName('')
        setRegion('us-east-1')
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='font-display flex items-center gap-2'>
                        <IconApi size={16} className='text-primary' /> Deploy Flow
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4 py-2'>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Deployment name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. Support Bot API' autoFocus />
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Flow</label>
                        <select value={selectedFlow} onChange={(e) => setSelectedFlow(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {allFlows.length === 0
                                ? <option value=''>No flows available</option>
                                : allFlows.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                    </div>
                    <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>Region</label>
                        <select value={region} onChange={(e) => setRegion(e.target.value)}
                            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground'>
                            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    {name && (
                        <div className='rounded-lg border border-border bg-secondary/40 p-3'>
                            <p className='text-[10px] text-muted-foreground mb-1'>Endpoint preview</p>
                            <code className='text-[10px] font-mono text-primary/80'>
                                POST https://api.haxon.io/v1/flows/{name.toLowerCase().replace(/\s+/g, '-')}
                            </code>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>Cancel</Button>
                    <Button variant='gradient' onClick={handleDeploy}><IconApi size={14} /> Deploy</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
