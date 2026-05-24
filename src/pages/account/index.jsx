import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    IconEye, IconEyeOff, IconTrash, IconDeviceFloppy, IconLogout, IconSettings2,
    IconTypography, IconDroplet, IconBolt, IconMailCheck, IconAlertCircle, IconChartBar, IconBrain,
    IconWaveSine, IconSpeakerphone
} from '@tabler/icons-react'

const SOUND_PACKS = [
    { id: 'default', label: 'Default', desc: 'Smooth sine-wave tones' },
    { id: 'crisp', label: 'Crisp', desc: 'Sharp triangle-wave clicks' },
    { id: 'soft', label: 'Soft', desc: 'Gentle, low-volume feedback' },
    { id: 'retro', label: 'Retro', desc: 'Chiptune square-wave bleeps' }
]

const PLAN_FEATURES = ['Unlimited flows', 'All models', 'Priority support', '10M tokens/month', 'Custom domains', 'SSO & SAML']

const COLOR_THEMES = [
    { id: 'default', label: 'Default', primary: '#009EFF', bg: '#06080f', desc: 'Electric blue' },
    { id: 'midnight', label: 'Midnight', primary: '#009EFF', bg: '#03040c', desc: 'Deep black' },
    { id: 'ocean', label: 'Ocean', primary: '#00D4FF', bg: '#040b16', desc: 'Teal depths' },
    { id: 'forest', label: 'Forest', primary: '#00E676', bg: '#030d06', desc: 'Neon green' },
    { id: 'sunset', label: 'Sunset', primary: '#FF8C00', bg: '#0d0602', desc: 'Warm amber' },
    { id: 'rose', label: 'Rose', primary: '#FF4081', bg: '#0d0305', desc: 'Hot pink' }
]

function SectionCard({ title, icon: Icon, iconColor = 'text-primary', children, className }) {
    return (
        <div className={cn('rounded-2xl border border-border bg-card/60 overflow-hidden', className)}>
            <div className='flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/20'>
                <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center border', iconColor.replace('text-', 'bg-') + '/10', iconColor.replace('text-', 'border-') + '/20')}>
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

function NotifRow({ icon: Icon, iconColor, label, desc, priority, enabled, onChange }) {
    const { play } = useSound()
    return (
        <div className='flex items-center gap-4 py-3 border-b border-border/40 last:border-0'>
            <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0', iconColor.replace('text-', 'bg-') + '/10')}>
                <Icon size={15} className={iconColor} />
            </div>
            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-foreground'>{label}</span>
                    {priority === 'high' && <Badge variant='destructive' className='text-[9px] px-1.5 h-4'>High</Badge>}
                    {priority === 'low' && <Badge variant='secondary' className='text-[9px] px-1.5 h-4'>Low</Badge>}
                </div>
                <p className='text-xs text-muted-foreground mt-0.5'>{desc}</p>
            </div>
            <button onClick={() => { onChange(!enabled); play('click') }}
                className={cn('relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200', enabled ? 'bg-primary' : 'bg-secondary border border-border')}>
                <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200', enabled ? 'left-[18px]' : 'left-0.5')} />
            </button>
        </div>
    )
}

export default function Account() {
    const { soundEnabled, setSoundEnabled, canvasMusicEnabled, setCanvasMusicEnabled, colorTheme, setColorTheme, fontSize, setFontSize, soundPack, setSoundPack, compactMode, setCompactMode, reducedMotion, setReducedMotion } = useUIStore()
    const { play } = useSound()

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('profile')
    const [profile, setProfile] = useState({ name: 'Hemant', email: 'hemant.dev.upwork@gmail.com', company: 'Haxon Labs', role: 'Owner' })
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(profile)
    const [showPw, setShowPw] = useState(false)
    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [twoFAExpanded, setTwoFAExpanded] = useState(false)
    const [notifications, setNotifications] = useState({
        failures: true, evaluations: true, rateLimit: false, weeklyReport: true, newModels: false, security: true
    })

    const tabs = [
        { id: 'profile', label: 'Profile', icon: IconUser },
        { id: 'preferences', label: 'Preferences', icon: IconSettings2 },
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

    const handleSignOut = () => {
        play('click')
        toast.success('Signed out successfully')
        setTimeout(() => navigate('/auth/login'), 800)
    }

    const handleUpdatePassword = () => {
        if (!currentPw) { toast.error('Enter your current password'); return }
        if (newPw.length < 8) { toast.error('New password must be at least 8 characters'); return }
        if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
        play('success')
        toast.success('Password updated successfully')
        setCurrentPw(''); setNewPw(''); setConfirmPw('')
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
                    onClick={handleSignOut}>
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
            {activeTab === 'preferences' && (
                <div className='space-y-4 animate-slide-up'>
                    {/* Sound & Audio */}
                    <SectionCard title='Sound & Audio' icon={IconVolume} iconColor='text-cyan'>
                        <Toggle enabled={soundEnabled} onChange={setSoundEnabled}
                            label='Sound Effects'
                            description='Audio feedback on clicks, actions, and confirmations' />
                        <Toggle enabled={canvasMusicEnabled} onChange={setCanvasMusicEnabled}
                            label='Canvas Ambient Music'
                            description='Soft drone tones while working in the flow canvas editor' />

                        {soundEnabled && (
                            <div className='mt-3 pt-3 border-t border-border/50'>
                                <p className='text-xs font-medium text-foreground mb-2'>Sound Pack</p>
                                <p className='text-xs text-muted-foreground mb-3'>Choose the character of your UI sounds. Click to preview.</p>
                                <div className='grid grid-cols-2 gap-2'>
                                    {SOUND_PACKS.map((p) => (
                                        <button key={p.id} onClick={() => { setSoundPack(p.id); play('click') }}
                                            className={cn('relative flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all',
                                                soundPack === p.id ? 'border-primary bg-primary/8 shadow-sm' : 'border-border hover:border-primary/30 hover:bg-secondary/50')}>
                                            <span className='text-xs font-semibold text-foreground'>{p.label}</span>
                                            <span className='text-[10px] text-muted-foreground'>{p.desc}</span>
                                            {soundPack === p.id && (
                                                <span className='absolute top-2 right-2 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center'>
                                                    <IconCheck size={8} className='text-white' />
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    {/* Color Themes */}
                    <SectionCard title='Color Theme' icon={IconDroplet} iconColor='text-purple'>
                        <p className='text-xs text-muted-foreground mb-4'>Choose an accent palette. Changes apply immediately across the entire app.</p>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                            {COLOR_THEMES.map((t) => (
                                <button key={t.id} onClick={() => { setColorTheme(t.id); play('click') }}
                                    className={cn('relative flex items-center gap-3 rounded-xl border p-3 transition-all text-left',
                                        colorTheme === t.id ? 'border-primary bg-primary/8 shadow-sm' : 'border-border hover:border-primary/40 hover:bg-secondary/50')}>
                                    <div className='h-8 w-8 rounded-full shrink-0 border-2 border-white/10' style={{ background: `radial-gradient(circle at 40% 40%, ${t.primary}, ${t.bg})` }} />
                                    <div className='min-w-0'>
                                        <div className='text-xs font-semibold text-foreground leading-tight'>{t.label}</div>
                                        <div className='text-[10px] text-muted-foreground'>{t.desc}</div>
                                    </div>
                                    {colorTheme === t.id && (
                                        <div className='absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center'>
                                            <IconCheck size={9} className='text-white' />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Typography */}
                    <SectionCard title='Typography & Display' icon={IconTypography} iconColor='text-warning'>
                        <p className='text-xs text-muted-foreground mb-3'>Interface font size — applies across all product pages.</p>
                        <div className='flex gap-2 mb-4'>
                            {[{ id: 'sm', label: 'Small', size: 'text-xs' }, { id: 'md', label: 'Default', size: 'text-sm' }, { id: 'lg', label: 'Large', size: 'text-base' }].map((f) => (
                                <button key={f.id} onClick={() => { setFontSize(f.id); play('click') }}
                                    className={cn('flex-1 rounded-lg border px-3 py-2.5 transition-all text-center',
                                        fontSize === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground')}>
                                    <div className={cn('font-semibold leading-none mb-1', f.size)}>{f.label}</div>
                                    <div className='text-[10px] opacity-60'>Aa</div>
                                </button>
                            ))}
                        </div>
                        <div className='pt-3 border-t border-border/50'>
                            <Toggle enabled={reducedMotion} onChange={setReducedMotion}
                                label='Reduce motion'
                                description='Disable transitions and animations throughout the interface' />
                        </div>
                    </SectionCard>

                    {/* Interface */}
                    <SectionCard title='Interface' icon={IconPalette} iconColor='text-primary'>
                        <Toggle enabled={compactMode} onChange={setCompactMode}
                            label='Compact Density'
                            description='Reduce padding and spacing for a denser information layout' />
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
                            <Button variant='outline' size='sm' onClick={() => { play('click'); window.open('https://billing.stripe.com', '_blank') }}>Manage Billing</Button>
                            <Button variant='ghost' size='sm' className='text-destructive hover:text-destructive'
                                onClick={() => { play('error'); toast.error('To cancel, email support@haxon.ai') }}>Cancel Plan</Button>
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
                    <SectionCard title='Notification Preferences' icon={IconBell} iconColor='text-warning'>
                        <p className='text-xs text-muted-foreground mb-4'>Control which events trigger email and in-app notifications.</p>

                        <div className='mb-2'>
                            <p className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1 px-1'>Operations</p>
                            <NotifRow icon={IconAlertCircle} iconColor='text-destructive' label='Flow execution failures' priority='high'
                                desc='Immediate alert when a deployed flow returns an error or crashes'
                                enabled={notifications.failures} onChange={(v) => setNotifications((p) => ({ ...p, failures: v }))} />
                            <NotifRow icon={IconBolt} iconColor='text-warning' label='Rate limit warnings' priority='high'
                                desc='Alert when you approach API rate limits (80% threshold)'
                                enabled={notifications.rateLimit} onChange={(v) => setNotifications((p) => ({ ...p, rateLimit: v }))} />
                            <NotifRow icon={IconShield} iconColor='text-success' label='Security alerts' priority='high'
                                desc='Login from new device, API key usage anomalies'
                                enabled={notifications.security} onChange={(v) => setNotifications((p) => ({ ...p, security: v }))} />
                        </div>

                        <div className='mb-2 mt-5'>
                            <p className='text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1 px-1'>Insights</p>
                            <NotifRow icon={IconChartBar} iconColor='text-cyan' label='Evaluation completed' priority='low'
                                desc='Notification when an eval run finishes with results summary'
                                enabled={notifications.evaluations} onChange={(v) => setNotifications((p) => ({ ...p, evaluations: v }))} />
                            <NotifRow icon={IconMailCheck} iconColor='text-primary' label='Weekly usage report' priority='low'
                                desc='Monday digest: token usage, cost breakdown, top flows'
                                enabled={notifications.weeklyReport} onChange={(v) => setNotifications((p) => ({ ...p, weeklyReport: v }))} />
                            <NotifRow icon={IconBrain} iconColor='text-purple' label='New model releases' priority='low'
                                desc='When new LLMs or integrations become available in the hub'
                                enabled={notifications.newModels} onChange={(v) => setNotifications((p) => ({ ...p, newModels: v }))} />
                        </div>
                    </SectionCard>
                </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
                <div className='space-y-4 animate-slide-up'>
                    <SectionCard title='Password' icon={IconKey} iconColor='text-primary'>
                        <div className='space-y-3'>
                            <div className='relative'>
                                <Input type={showPw ? 'text' : 'password'} placeholder='Current password' value={currentPw}
                                    onChange={(e) => setCurrentPw(e.target.value)} className='h-9 text-sm pr-10' />
                                <button onClick={() => setShowPw(!showPw)} className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                                    {showPw ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                                </button>
                            </div>
                            <Input type='password' placeholder='New password (min 8 chars)' value={newPw}
                                onChange={(e) => setNewPw(e.target.value)} className='h-9 text-sm' />
                            <Input type='password' placeholder='Confirm new password' value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)} className='h-9 text-sm' />
                            <Button variant='gradient' size='sm' onClick={handleUpdatePassword} className='gap-2'>
                                <IconDeviceFloppy size={13} /> Update Password
                            </Button>
                        </div>
                    </SectionCard>
                    <SectionCard title='Two-Factor Authentication' icon={IconShield} iconColor='text-success'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-sm font-medium text-foreground'>Authenticator App</div>
                                <div className='text-xs text-muted-foreground mt-0.5'>Secure your account with TOTP 2FA</div>
                            </div>
                            <Button variant='outline' size='sm' onClick={() => { play('click'); setTwoFAExpanded(!twoFAExpanded) }}
                                className='gap-2 border-success/20 text-success hover:bg-success/10 hover:text-success'>
                                {twoFAExpanded ? 'Cancel' : 'Enable 2FA'} <IconChevronRight size={12} className={cn('transition-transform', twoFAExpanded && 'rotate-90')} />
                            </Button>
                        </div>
                        {twoFAExpanded && (
                            <div className='mt-4 pt-4 border-t border-border/50'>
                                <p className='text-xs text-muted-foreground mb-4'>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                                <div className='flex gap-6 items-start'>
                                    <div className='h-32 w-32 rounded-xl border-2 border-border bg-white flex items-center justify-center shrink-0'>
                                        <div className='grid grid-cols-7 gap-0.5 p-2'>
                                            {Array.from({ length: 49 }, (_, i) => (
                                                <div key={i} className={cn('h-3 w-3 rounded-sm', Math.random() > 0.5 ? 'bg-gray-900' : 'bg-white')} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className='flex-1 space-y-3'>
                                        <div>
                                            <p className='text-xs font-medium text-foreground mb-1'>Manual entry key</p>
                                            <div className='font-mono text-xs bg-secondary/50 rounded-lg px-3 py-2 text-muted-foreground tracking-widest'>JBSW Y3DP EHPK 3PXP</div>
                                        </div>
                                        <div>
                                            <p className='text-xs font-medium text-foreground mb-1'>Verification code</p>
                                            <div className='flex gap-2'>
                                                <Input placeholder='Enter 6-digit code' className='h-8 text-sm font-mono' maxLength={6} />
                                                <Button variant='gradient' size='sm' onClick={() => { play('success'); toast.success('2FA enabled successfully'); setTwoFAExpanded(false) }}>
                                                    Verify
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
