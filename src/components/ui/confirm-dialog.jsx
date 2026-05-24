import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { IconAlertTriangle } from '@tabler/icons-react'

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', description, confirmLabel = 'Delete', danger = true }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-sm'>
                <DialogHeader>
                    <div className='flex items-center gap-3 mb-1'>
                        {danger && (
                            <div className='h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0'>
                                <IconAlertTriangle size={16} className='text-destructive' />
                            </div>
                        )}
                        <DialogTitle className='font-display text-base'>{title}</DialogTitle>
                    </div>
                </DialogHeader>
                {description && <p className='text-sm text-muted-foreground -mt-2 pb-2'>{description}</p>}
                <DialogFooter>
                    <Button variant='outline' size='sm' onClick={onClose}>Cancel</Button>
                    <Button variant={danger ? 'destructive' : 'gradient'} size='sm' onClick={() => { onConfirm(); onClose() }}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
