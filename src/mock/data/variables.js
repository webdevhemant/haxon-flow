export const variables = [
    {
        id: 'var-001',
        name: 'COMPANY_NAME',
        value: 'Haxon Corp',
        type: 'string',
        description: 'Primary company name for templates',
        usedIn: 12
    },
    {
        id: 'var-002',
        name: 'SUPPORT_EMAIL',
        value: 'support@haxon.ai',
        type: 'string',
        description: 'Default support email address',
        usedIn: 7
    },
    { id: 'var-003', name: 'MAX_RETRIES', value: '3', type: 'number', description: 'Maximum API retry attempts', usedIn: 24 },
    {
        id: 'var-004',
        name: 'DEFAULT_LOCALE',
        value: 'en-US',
        type: 'string',
        description: 'Default locale for content generation',
        usedIn: 15
    },
    {
        id: 'var-005',
        name: 'TEMPERATURE_DEFAULT',
        value: '0.7',
        type: 'number',
        description: 'Default LLM temperature setting',
        usedIn: 31
    },
    {
        id: 'var-006',
        name: 'CHAT_HISTORY_LIMIT',
        value: '20',
        type: 'number',
        description: 'Max messages to keep in conversation memory',
        usedIn: 18
    },
    {
        id: 'var-007',
        name: 'BRAND_TONE',
        value: 'professional, friendly, concise',
        type: 'string',
        description: 'Brand voice guidelines for content generation',
        usedIn: 9
    },
    { id: 'var-008', name: 'WEBHOOK_SECRET', value: '••••••••', type: 'secret', description: 'Webhook validation secret', usedIn: 3 },
    {
        id: 'var-009',
        name: 'VECTOR_CHUNK_SIZE',
        value: '512',
        type: 'number',
        description: 'Token chunk size for vector embeddings',
        usedIn: 11
    },
    { id: 'var-010', name: 'DEBUG_MODE', value: 'false', type: 'boolean', description: 'Enable verbose logging in flows', usedIn: 6 }
]

export default variables
