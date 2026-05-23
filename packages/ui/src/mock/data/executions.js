const statuses = ['success', 'success', 'success', 'success', 'error', 'running']
const flows = ['Customer Support Bot', 'Code Review Assistant', 'Document Q&A', 'HR Onboarding', 'Sales Pipeline', 'IT Helpdesk', 'Marketing Copy', 'Financial Analyst']

export const executions = Array.from({ length: 50 }, (_, i) => {
    const d = new Date('2026-05-23T06:00:00Z')
    d.setMinutes(d.getMinutes() - i * 18)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    return {
        id: `exec-${String(i + 1).padStart(3, '0')}`,
        flow: flows[Math.floor(Math.random() * flows.length)],
        status,
        duration: status === 'error' ? Math.round(Math.random() * 500 + 100) : Math.round(Math.random() * 4000 + 400),
        tokens: status === 'error' ? Math.round(Math.random() * 400) : Math.round(Math.random() * 5000 + 500),
        cost: status === 'error' ? 0 : +(Math.random() * 0.08 + 0.002).toFixed(4),
        triggeredBy: ['api', 'webhook', 'manual', 'schedule'][Math.floor(Math.random() * 4)],
        startTime: d.toISOString(),
    }
})

export default executions
