export const chatflows = [
    {
        id: 'cf-001', name: 'Customer Support Bot', description: 'Multi-turn customer service flow with escalation logic and sentiment detection',
        deployed: true, category: 'Support', nodeCount: 14, executionCount: 4821,
        updatedDate: '2026-05-20T10:30:00Z', createdDate: '2026-04-15T08:00:00Z',
        tags: ['gpt-4o', 'memory', 'tools'], color: '#6366F1'
    },
    {
        id: 'cf-002', name: 'Sales Qualification Pipeline', description: 'Lead scoring and qualification flow integrated with CRM via webhooks',
        deployed: true, category: 'Sales', nodeCount: 9, executionCount: 1203,
        updatedDate: '2026-05-19T14:00:00Z', createdDate: '2026-04-20T09:00:00Z',
        tags: ['claude-3-5', 'webhook'], color: '#22D3EE'
    },
    {
        id: 'cf-003', name: 'Document Q&A Assistant', description: 'RAG pipeline with PDF ingestion, chunk retrieval, and cited responses',
        deployed: false, category: 'Research', nodeCount: 11, executionCount: 892,
        updatedDate: '2026-05-18T16:45:00Z', createdDate: '2026-05-01T10:00:00Z',
        tags: ['gemini-1.5', 'vector-store', 'rag'], color: '#A855F7'
    },
    {
        id: 'cf-004', name: 'Code Review Assistant', description: 'Automated PR review with security scanning and style suggestions',
        deployed: true, category: 'DevTools', nodeCount: 8, executionCount: 2340,
        updatedDate: '2026-05-17T11:00:00Z', createdDate: '2026-04-25T07:00:00Z',
        tags: ['gpt-4o', 'tools', 'github'], color: '#10B981'
    },
    {
        id: 'cf-005', name: 'Marketing Copy Generator', description: 'Brand-aware content generation for social media, emails, and landing pages',
        deployed: false, category: 'Marketing', nodeCount: 6, executionCount: 456,
        updatedDate: '2026-05-16T09:30:00Z', createdDate: '2026-05-10T11:00:00Z',
        tags: ['claude-3-5', 'templates'], color: '#F59E0B'
    },
    {
        id: 'cf-006', name: 'HR Onboarding Assistant', description: 'Guides new employees through onboarding steps, answers policy questions',
        deployed: true, category: 'HR', nodeCount: 12, executionCount: 678,
        updatedDate: '2026-05-15T13:00:00Z', createdDate: '2026-04-30T08:00:00Z',
        tags: ['gpt-4o-mini', 'memory', 'rag'], color: '#EF4444'
    },
    {
        id: 'cf-007', name: 'Financial Data Analyst', description: 'Processes earnings reports, computes KPIs, and generates summaries',
        deployed: false, category: 'Finance', nodeCount: 16, executionCount: 234,
        updatedDate: '2026-05-14T15:20:00Z', createdDate: '2026-05-05T09:00:00Z',
        tags: ['claude-3-opus', 'tools', 'csv'], color: '#06B6D4'
    },
    {
        id: 'cf-008', name: 'IT Helpdesk Triage', description: 'Classifies tickets, provides auto-responses, and routes to correct team',
        deployed: true, category: 'Support', nodeCount: 10, executionCount: 3102,
        updatedDate: '2026-05-13T10:00:00Z', createdDate: '2026-04-18T07:00:00Z',
        tags: ['gpt-4o-mini', 'webhook', 'jira'], color: '#8B5CF6'
    },
]

export default chatflows
