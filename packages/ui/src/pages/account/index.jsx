import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { IconUser, IconKey, IconBell, IconCreditCard, IconShield, IconCheck, IconEdit, IconCopy } from '@tabler/icons-react'

const PLAN_FEATURES = ['Unlimited flows', 'All models', 'Priority support', '10M tokens/month', 'Custom domains', 'SSO & SAML']

export default function Account() {
    const [profile, setProfile] = useState({ name: 'Hemant', email: 'akshaybendadi@gmail.com', company: 'Haxon Labs', role: 'Owner' })
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(profile)

    const handleSave = () => {
        setProfile(draft)
        setEditing(false)
        toast.success('Profile updated')
    }

    return (
        <div className='max-w-3xl space-y-6 animate-fade-in'>
            <Tabs defaultValue='profile'>
                <TabsList className='mb-6'>
                    <TabsTrigger value='profile'><IconUser size={13} /> Profile</TabsTrigger>
                    <TabsTrigger value='billing'><IconCreditCard size={13} /> Billing</TabsTrigger>
                    <TabsTrigger value='notifications'><IconBell size={13} /> Notifications</TabsTrigger>
                    <TabsTrigger value='security'><IconShield size={13} /> Security</TabsTrigger>
                </TabsList>

                {/* Profile */}
                <TabsContent value='profile' className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'>
                            <div className='flex items-center justify-between'>
                                <CardTitle className='text-sm'>Personal Information</CardTitle>
                                <Button variant='ghost' size='sm' onClick={() => { setEditing(!editing); setDraft(profile) }}>
                                    <IconEdit size={13} /> {editing ? 'Cancel' : 'Edit'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-center gap-4 mb-6'>
                                <div className='h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-2xl font-display font-bold text-white'>
                                    {profile.name.charAt(0)}
                                </div>
                                <div>
                                    <div className='font-display text-lg font-semibold text-foreground'>{profile.name}</div>
                                    <div className='text-sm text-muted-foreground'>{profile.email}</div>
                                    <Badge variant='success' className='text-[10px] mt-1'>{profile.role}</Badge>
                                </div>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {[
                                    { label: 'Full Name', key: 'name' },
                                    { label: 'Email', key: 'email' },
                                    { label: 'Company', key: 'company' },
                                    { label: 'Role', key: 'role' },
                                ].map(({ label, key }) => (
                                    <div key={key}>
                                        <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>{label}</label>
                                        {editing && key !== 'role' ? (
                                            <Input value={draft[key]} onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))} className='h-8 text-sm' />
                                        ) : (
                                            <div className='text-sm text-foreground font-medium'>{profile[key]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {editing && (
                                <Button variant='gradient' size='sm' onClick={handleSave}>Save Changes</Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing */}
                <TabsContent value='billing' className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'><CardTitle className='text-sm'>Current Plan</CardTitle></CardHeader>
                        <CardContent>
                            <div className='flex items-center justify-between mb-4'>
                                <div>
                                    <div className='font-display text-xl font-bold text-foreground'>Pro Plan</div>
                                    <div className='text-sm text-muted-foreground'>$49 / month · renews Jun 23, 2026</div>
                                </div>
                                <Badge variant='success' className='text-xs'>Active</Badge>
                            </div>
                            <div className='grid grid-cols-2 gap-2 mb-4'>
                                {PLAN_FEATURES.map((f) => (
                                    <div key={f} className='flex items-center gap-2 text-xs text-muted-foreground'>
                                        <IconCheck size={12} className='text-success shrink-0' />
                                        {f}
                                    </div>
                                ))}
                            </div>
                            <div className='flex gap-2 pt-4 border-t border-border'>
                                <Button variant='outline' size='sm' onClick={() => toast.info('Coming soon!')}>Manage Billing</Button>
                                <Button variant='ghost' size='sm' className='text-destructive hover:text-destructive' onClick={() => toast.info('Please contact support')}>Cancel Plan</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='pb-3'><CardTitle className='text-sm'>Usage This Month</CardTitle></CardHeader>
                        <CardContent className='space-y-3'>
                            {[
                                { label: 'Tokens Used', value: 4200000, max: 10000000, unit: 'tokens' },
                                { label: 'API Calls', value: 12400, max: 50000, unit: 'calls' },
                                { label: 'Storage', value: 2.4, max: 10, unit: 'GB' },
                            ].map((u) => (
                                <div key={u.label}>
                                    <div className='flex items-center justify-between text-xs mb-1.5'>
                                        <span className='text-muted-foreground'>{u.label}</span>
                                        <span className='font-mono text-foreground'>{typeof u.value === 'number' && u.value > 1000 ? (u.value / 1000000).toFixed(1) + 'M' : u.value} / {typeof u.max === 'number' && u.max > 1000 ? (u.max / 1000000).toFixed(0) + 'M' : u.max} {u.unit}</span>
                                    </div>
                                    <div className='h-1.5 bg-secondary rounded-full overflow-hidden'>
                                        <div className='h-full bg-primary rounded-full' style={{ width: `${(u.value / u.max) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value='notifications' className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'><CardTitle className='text-sm'>Notification Preferences</CardTitle></CardHeader>
                        <CardContent className='space-y-4'>
                            {[
                                { label: 'Flow execution failures', description: 'Get notified when a deployed flow fails', enabled: true },
                                { label: 'Evaluation completed', description: 'Notification when eval run finishes', enabled: true },
                                { label: 'Rate limit warnings', description: 'Alert when approaching API rate limits', enabled: false },
                                { label: 'Weekly usage report', description: 'Summary of usage and costs every Monday', enabled: true },
                                { label: 'New model releases', description: 'When new models become available', enabled: false },
                            ].map((n) => (
                                <div key={n.label} className='flex items-center justify-between py-2'>
                                    <div>
                                        <div className='text-sm font-medium text-foreground'>{n.label}</div>
                                        <div className='text-xs text-muted-foreground'>{n.description}</div>
                                    </div>
                                    <button onClick={() => toast.info('Coming soon!')} className={cn('h-5 w-9 rounded-full transition-colors relative', n.enabled ? 'bg-primary' : 'bg-secondary border border-border')}>
                                        <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all', n.enabled ? 'left-[18px]' : 'left-0.5')} />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value='security' className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'><CardTitle className='text-sm'>Password</CardTitle></CardHeader>
                        <CardContent className='space-y-3'>
                            <Input type='password' placeholder='Current password' className='h-8 text-sm' />
                            <Input type='password' placeholder='New password' className='h-8 text-sm' />
                            <Input type='password' placeholder='Confirm new password' className='h-8 text-sm' />
                            <Button variant='gradient' size='sm' onClick={() => toast.info('Coming soon!')}>Update Password</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='pb-3'><CardTitle className='text-sm'>Two-Factor Authentication</CardTitle></CardHeader>
                        <CardContent>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='text-sm font-medium text-foreground'>Authenticator App</div>
                                    <div className='text-xs text-muted-foreground'>Use an authenticator app for 2FA</div>
                                </div>
                                <Button variant='outline' size='sm' onClick={() => toast.info('Coming soon!')}>Enable 2FA</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='border-destructive/20'>
                        <CardHeader className='pb-3'><CardTitle className='text-sm text-destructive'>Danger Zone</CardTitle></CardHeader>
                        <CardContent>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <div className='text-sm font-medium text-foreground'>Delete Account</div>
                                    <div className='text-xs text-muted-foreground'>Permanently delete your account and all data</div>
                                </div>
                                <Button variant='outline' size='sm' className='border-destructive/30 text-destructive hover:bg-destructive/10' onClick={() => toast.error('Please contact support to delete your account')}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
