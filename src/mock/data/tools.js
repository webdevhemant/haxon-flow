export const tools = [
    {
        id: 'tool-001',
        name: 'Web Search',
        description: 'Real-time web search via Brave Search API with result ranking and summarization',
        category: 'Search',
        iconColor: '#6366F1',
        usageCount: 9821,
        flowCount: 34,
        createdDate: '2026-03-10T08:00:00Z',
        schema: { query: 'string', maxResults: 'number' }
    },
    {
        id: 'tool-002',
        name: 'Code Executor',
        description: 'Sandboxed Python/JS execution with package support and timeout controls',
        category: 'Development',
        iconColor: '#10B981',
        usageCount: 4532,
        flowCount: 18,
        createdDate: '2026-03-15T08:00:00Z',
        schema: { code: 'string', language: 'string', timeout: 'number' }
    },
    {
        id: 'tool-003',
        name: 'Send Email',
        description: 'Send transactional emails via SMTP or SendGrid with template support',
        category: 'Communication',
        iconColor: '#F59E0B',
        usageCount: 2341,
        flowCount: 12,
        createdDate: '2026-03-20T08:00:00Z',
        schema: { to: 'string', subject: 'string', body: 'string' }
    },
    {
        id: 'tool-004',
        name: 'Database Query',
        description: 'Execute read/write SQL queries against connected PostgreSQL or MySQL databases',
        category: 'Data',
        iconColor: '#22D3EE',
        usageCount: 3890,
        flowCount: 22,
        createdDate: '2026-04-01T08:00:00Z',
        schema: { query: 'string', database: 'string' }
    },
    {
        id: 'tool-005',
        name: 'HTTP Request',
        description: 'Configurable HTTP client with auth, retries, and response transformation',
        category: 'Integration',
        iconColor: '#A855F7',
        usageCount: 7621,
        flowCount: 45,
        createdDate: '2026-03-08T08:00:00Z',
        schema: { url: 'string', method: 'string', headers: 'object', body: 'object' }
    },
    {
        id: 'tool-006',
        name: 'File Reader',
        description: 'Parse PDF, DOCX, CSV, and TXT files with structured output',
        category: 'Files',
        iconColor: '#EF4444',
        usageCount: 1834,
        flowCount: 9,
        createdDate: '2026-04-10T08:00:00Z',
        schema: { filePath: 'string', encoding: 'string' }
    },
    {
        id: 'tool-007',
        name: 'Slack Notifier',
        description: 'Send messages and blocks to Slack channels or DMs via Bot token',
        category: 'Communication',
        iconColor: '#F59E0B',
        usageCount: 1243,
        flowCount: 7,
        createdDate: '2026-04-15T08:00:00Z',
        schema: { channel: 'string', message: 'string', blocks: 'array' }
    },
    {
        id: 'tool-008',
        name: 'Calculator',
        description: 'Safe arithmetic and formula evaluator with unit conversion support',
        category: 'Utility',
        iconColor: '#10B981',
        usageCount: 5621,
        flowCount: 28,
        createdDate: '2026-03-05T08:00:00Z',
        schema: { expression: 'string' }
    },
    {
        id: 'tool-009',
        name: 'Date & Time',
        description: 'Timezone-aware date calculations, formatting, and relative time expressions',
        category: 'Utility',
        iconColor: '#6366F1',
        usageCount: 3421,
        flowCount: 19,
        createdDate: '2026-03-12T08:00:00Z',
        schema: { date: 'string', timezone: 'string', format: 'string' }
    },
    {
        id: 'tool-010',
        name: 'JSON Transform',
        description: 'JSONata-powered transformation with schema validation and diff output',
        category: 'Data',
        iconColor: '#22D3EE',
        usageCount: 2910,
        flowCount: 14,
        createdDate: '2026-04-05T08:00:00Z',
        schema: { input: 'object', expression: 'string' }
    }
]

export default tools
