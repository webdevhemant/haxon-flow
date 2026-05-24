import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/useUIStore'
import { useSound } from '@/hooks/useSound'
import { toast } from 'sonner'
import {
    IconUser, IconKey, IconBell, IconCreditCard, IconShield, IconCheck, IconEdit,
    IconVolume, IconVolumeOff, IconMusic, IconPalette, IconChevronRight,
    IconEye, IconEyeOff, IconTrash, IconDeviceFloppy, IconLogout
} from '@tabler/icons-react'

const PLAN_FEATURES = ['Unlimited flows', 'All models', 'Priority support', '10M tokens/month', 'Custom domains', 'SSO & SAML']

function SectionCard({ title, icon: Icon, iconColor = 'text-primary', children, className }) {
    return (
        <div className={cn('rounded-2xl border border-border bg-card/60 overflow-hidden', className)}>
            <div className='flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/20'>
                <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', iconColor.replace('text-', 'bg-') + '/10', 'border', iconColor.replace('text-', 'border-') + '/20')}>
                    <Icon size={14} className={iconColor} />
                </div>
                <h3 className='font-display text-sm font-semibold text-foreground'>{title}</h3>
            </div>
            <div className='p-5'>{children}</div>
        </div>
    )
}

function Toggle({ enabled, onChange, label, description }) {
    const { play } = useSound()
    return (
        <div className='flex items-center justify-between py-3 border-b border-border/50 last:border-0'>
            <div className='flex-1 min-w-0 mr-4'>
                <div className='text-sm font-medium text-foreground'>{label}</div>
                {description && <div className='text-xs text-muted-foreground mt-0.5 leading-relaxed'>{description}</div>}
            </div>
            <button onClick={() => { onChange(!enabled); play('click') }}
                className={cn('relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200', enabled ? 'bg-primary' : 'bg-secondary border border-border')}>
                <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', enabled ? 'left-[18px]' : 'left-0.5')} />
            </button>
        </div>
    )
}

export default function Account() {
    const { soundEnabled, setSoundEnabled, canvasMusicEnabled, setCanvasMusicEnabled } = useUIStore()
    const { play } = useSound()

    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({ name: 'Hemant', email: 'akshaybendadi@gmail.com', company: 'Haxon Labs', role: 'Owner' })
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(profile)
    const [showPw, setShowPw] = useState(false)
    const [notifications, setNotifications] = useState({
        failures: true, evaluations: true, rateLimit: false, weeklyReport: true, newModels: false
    })

    const tabs = [
        { id: 'profile', label: 'Profile', icon: IconUser },
        { id: 'appearance', label: 'Preferences', icon: IconPalette },
        { id: 'billing', label: 'Billing', icon: IconCreditCard },
        { id: 'notifications', label: 'Notifications', icon: IconBell },
        { id: 'security', label: 'Security', icon: IconShield }
    ]

    const handleSave = () => {
        setProfile(draft)
        setEditing(false)
        play('success')
        toast.success('Profile updated')
    }

    return (
        <div className='max-w-4xl animate-fade-in'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-8'>
                <div className='h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-2xl font-display font-bold text-white shadow-lg shadow-primary/20'>
                    {profile.name.charAt(0)}
                </div>
                <div>
                    <h1 className='font-display text-xl font-bold text-foreground'>{profile.name}</h1>
                    <div className='flex items-center gap-2 mt-0.5'>
                        <span className='text-sm text-muted-foreground'>{profile.email}</span>
                        <Badge variant='success' className='text-[10px]'>{profile.role}</Badge>
                    </div>
                </div>
                <Button variant='outline' size='sm' className='ml-auto gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive'
                    onClick={() => { play('click'); toast.info('Sign out coming soon') }}>
                    <IconLogout size={13} /> Sign Out
                </Button>
            </div>

            {/* Tab bar */}
            <div className='flex gap-1 p-1 rounded-xl bg-secondary/40 border border-border mb-6 overflow-x-auto scrollbar-hidden'>
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); play('click') }}
                        className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap',
                            activeTab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                        <t.icon size={13} />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Profile */}
            {activeTab === 'profile' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Personal Information' icon={IconUser}>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {[{ label: 'Full Name', key: 'name' }, { label: 'Email', key: 'email' }, { label: 'Company', key: 'company' }, { label: 'Role', key: 'role' }].map(({ label, key }) => (
                                <div key={key}>
                                    <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>{label}</label>
                                    {editing && key !== 'role' ? (
                                        <Input value={draft[key]} onChange={(e) => setDraft((p) => ({ ...p, [key]: e.target.value }))} className='h-8 text-sm' />
                                    ) : (
                                        <div className='text-sm text-foreground font-medium py-1'>{profile[key]}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='flex gap-2 mt-5 pt-4 border-t border-border'>
                            {editing ? (
                                <>
                                    <Button variant='gradient' size='sm' onClick={handleSave} className='gap-2'>
                                        <IconDeviceFloppy size={13} /> Save Changes
                                    </Button>
                                    <Button variant='outline' size='sm' onClick={() => { setEditing(false); setDraft(profile); play('close') }}>Cancel</Button>
                                </>
                            ) : (
                                <Button variant='outline' size='sm' onClick={() => { setEditing(true); play('open') }} className='gap-2'>
                                    <IconEdit size={13} /> Edit Profile
                                </Button>
                            )}
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* Preferences */}
            {activeTab === 'appearance' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Sound & Audio' icon={IconVolume} iconColor='text-cyan'>
                        <Toggle enabled={soundEnabled} onChange={setSoundEnabled}
                            label='Sound Effects'
                            description='Play subtle audio feedback on clicks, actions, and notifications' />
                        <Toggle enabled={canvasMusicEnabled} onChange={setCanvasMusicEnabled}
                            label='Canvas Ambient Music'
                            description='Play soft ambient tones while working in the canvas flow editor' />
                        <div className='mt-4 pt-3 border-t border-border/50'>
                            <p className='text-xs text-muted-foreground flex items-center gap-2'>
                                <IconVolume size={12} className='text-primary' />
                                Sounds use your system volume. Adjust in your OS settings.
                            </p>
                        </div>
                    </SectionCard>

                    <SectionCard title='Interface' icon={IconPalette} iconColor='text-purple'>
                        <Toggle enabled={true} onChange={() => toast.info('Theme switching coming soon')}
                            label='Dark Mode'
                            description='The app uses a dark theme optimized for extended use' />
                        <Toggle enabled={false} onChange={() => toast.info('Coming soon')}
                            label='Compact View'
                            description='Reduce padding and spacing for higher information density' />
                        <Toggle enabled={true} onChange={() => toast.info('Coming soon')}
                            label='Animations'
                            description='Enable UI transitions and micro-animations' />
                    </SectionCard>
                </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Current Plan' icon={IconCreditCard} iconColor='text-warning'>
                        <div className='flex items-start justify-between mb-5'>
                            <div>
                                <div className='font-display text-2xl font-bold text-foreground mb-0.5'>Pro Plan</div>
                                <div className='text-sm text-muted-foreground'>$49 / month · renews Jun 23, 2026</div>
                            </div>
                            <Badge variant='success' className='text-xs'>Active</Badge>
                        </div>
                        <div className='grid grid-cols-2 gap-2 mb-5'>
                            {PLAN_FEATURES.map((f) => (
                                <div key={f} className='flex items-center gap-2 text-xs text-muted-foreground'>
                                    <IconCheck size={12} className='text-success shrink-0' /> {f}
                                </div>
                            ))}
                        </div>
                        <div className='flex gap-2 pt-4 border-t border-border'>
                            <Button variant='outline' size='sm' onClick={() => { play('click'); toast.info('Coming soon') }}>Manage Billing</Button>
                            <Button variant='ghost' size='sm' className='text-destructive hover:text-destructive'
                                onClick={() => { play('click'); toast.info('Contact support to cancel') }}>Cancel Plan</Button>
                        </div>
                    </SectionCard>
                    <SectionCard title='Usage This Month' icon={IconChartBar} iconColor='text-primary'>
                        <div className='space-y-4'>
                            {[
                                { label: 'Tokens Used', value: 4200000, max: 10000000, unit: 'tokens', color: 'bg-primary' },
                                { label: 'API Calls', value: 12400, max: 50000, unit: 'calls', color: 'bg-cyan' },
                                { label: 'Storage', value: 2.4, max: 10, unit: 'GB', color: 'bg-purple' }
                            ].map((u) => (
                                <div key={u.label}>
                                    <div className='flex items-center justify-between text-xs mb-1.5'>
                                        <span className='text-muted-foreground'>{u.label}</span>
                                        <span className='font-mono text-foreground'>
                                            {u.value > 1000 ? (u.value / 1000000 >= 1 ? (u.value / 1000000).toFixed(1) + 'M' : (u.value / 1000).toFixed(0) + 'K') : u.value} / {u.max > 1000 ? (u.max / 1000000 >= 1 ? (u.max / 1000000).toFixed(0) + 'M' : (u.max / 1000).toFixed(0) + 'K') : u.max} {u.unit}
                                        </span>
                                    </div>
                                    <div className='h-1.5 bg-secondary rounded-full overflow-hidden'>
                                        <div className={cn('h-full rounded-full transition-all', u.color)} style={{ width: `${(u.value / u.max) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Email Notifications' icon={IconBell} iconColor='text-warning'>
                        <Toggle enabled={notifications.failures} onChange={(v) => setNotifications((p) => ({ ...p, failures: v }))}
                            label='Flow execution failures' description='Alert when a deployed flow returns an error' />
                        <Toggle enabled={notifications.evaluations} onChange={(v) => setNotifications((p) => ({ ...p, evaluations: v }))}
                            label='Evaluation completed' description='Notification when an eval run finishes' />
                        <Toggle enabled={notifications.rateLimit} onChange={(v) => setNotifications((p) => ({ ...p, rateLimit: v }))}
                            label='Rate limit warnings' description='Alert when approaching API rate limits' />
                        <Toggle enabled={notifications.weeklyReport} onChange={(v) => setNotifications((p) => ({ ...p, weeklyReport: v }))}
                            label='Weekly usage report' description='Summary of usage and costs every Monday' />
                        <Toggle enabled={notifications.newModels} onChange={(v) => setNotifications((p) => ({ ...p, newModels: v }))}
                            label='New model releases' description='When new LLM models become available' />
                    </SectionCard>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Password' icon={IconKey} iconColor='text-primary'>
                        <div className='space-y-3'>
                            <div className='relative'>
                                <Input type={showPw ? 'text' : 'password'} placeholder='Current password' className='h-9 text-sm pr-10' />
                                <button onClick={() => setShowPw(!showPw)} className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                                    {showPw ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                                </button>
                            </div>
                            <Input type='password' placeholder='New password' className='h-9 text-sm' />
                            <Input type='password' placeholder='Confirm new password' className='h-9 text-sm' />
                            <Button variant='gradient' size='sm' onClick={() => { play('click'); toast.info('Coming soon') }}>Update Password</Button>
                        </div>
                    </SectionCard>
                    <SectionCard title='Two-Factor Authentication' icon={IconShield} iconColor='text-success'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-sm font-medium text-foreground'>Authenticator App</div>
                                <div className='text-xs text-muted-foreground mt-0.5'>Secure your account with TOTP 2FA</div>
                            </div>
                            <Button variant='outline' size='sm' onClick={() => { play('click'); toast.info('Coming soon') }}
                                className='gap-2 border-success/20 text-success hover:bg-success/10 hover:text-success'>
                                Enable 2FA <IconChevronRight size={12} />
                            </Button>
                        </div>
                    </SectionCard>
                    <SectionCard title='Danger Zone' icon={IconTrash} iconColor='text-destructive'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-sm font-medium text-foreground'>Delete Account</div>
                                <div className='text-xs text-muted-foreground mt-0.5'>Permanently delete your account and all data. Irreversible.</div>
                            </div>
                            <Button variant='outline' size='sm'
                                className='border-destructive/30 text-destructive hover:bg-destructive/10'
                                onClick={() => { play('error'); toast.error('Contact support to delete your account') }}>
                                Delete
                            </Button>
                        </div>
                    </SectionCard>
                </div>
            )}
        </div>
    )
}
