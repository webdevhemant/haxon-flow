import {
    IconBrain, IconMessage, IconDatabase, IconSearch, IconTool, IconCode,
    IconRouter, IconVariable, IconBolt, IconChevronRight, IconFileText,
    IconScissors, IconServer, IconCpu, IconSettings, IconLink, IconCalculator,
    IconWorld, IconFileCode, IconTable, IconBrandGithub, IconClock,
    IconList, IconAdjustments, IconTransform, IconCurrencyDollar
} from '@tabler/icons-react'

export const CATEGORY_COLORS = {
    'Chat Models':    '#6366F1',
    'Chains':         '#10B981',
    'Agents':         '#A855F7',
    'Prompts':        '#F59E0B',
    'Memory':         '#EC4899',
    'Document Loaders': '#06B6D4',
    'Text Splitters': '#84CC16',
    'Vector Stores':  '#22D3EE',
    'Embeddings':     '#8B5CF6',
    'Tools':          '#F97316',
    'Output Parsers': '#EF4444',
    'Utilities':      '#6B7280',
}

// inputAnchors = left-side connection points (input from other nodes)
// inputParams  = right-panel configuration fields
// outputAnchors = right-side connection points

export const NODE_DEFS = {
    // ─── Chat Models ────────────────────────────────────────────────────────
    ChatOpenAI: {
        category: 'Chat Models', label: 'ChatOpenAI', icon: IconBrain,
        description: 'OpenAI chat completion model',
        inputAnchors: [
            { id: 'cache', label: 'Cache', optional: true },
        ],
        outputAnchors: [{ id: 'out', label: 'ChatOpenAI' }],
        inputParams: [
            { name: 'modelName', label: 'Model Name', type: 'options', options: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'], default: 'gpt-4o' },
            { name: 'temperature', label: 'Temperature', type: 'number', default: 0.9 },
            { name: 'maxTokens', label: 'Max Tokens', type: 'number', default: 2048, optional: true },
            { name: 'topP', label: 'Top P', type: 'number', default: 1, optional: true },
            { name: 'streaming', label: 'Streaming', type: 'boolean', default: true },
            { name: 'basepath', label: 'Base URL', type: 'string', optional: true, placeholder: 'https://api.openai.com/v1' },
        ]
    },
    ChatAnthropic: {
        category: 'Chat Models', label: 'ChatAnthropic', icon: IconBrain,
        description: 'Anthropic Claude models',
        inputAnchors: [{ id: 'cache', label: 'Cache', optional: true }],
        outputAnchors: [{ id: 'out', label: 'ChatAnthropic' }],
        inputParams: [
            { name: 'modelName', label: 'Model Name', type: 'options', options: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-haiku-4-5', 'claude-3-5-sonnet-20241022'], default: 'claude-sonnet-4-5' },
            { name: 'temperature', label: 'Temperature', type: 'number', default: 0.9 },
            { name: 'maxTokens', label: 'Max Tokens', type: 'number', default: 2048, optional: true },
            { name: 'streaming', label: 'Streaming', type: 'boolean', default: true },
        ]
    },
    ChatGoogleGenerativeAI: {
        category: 'Chat Models', label: 'ChatGoogleGenerativeAI', icon: IconBrain,
        description: 'Google Gemini chat models',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'ChatGoogleGenerativeAI' }],
        inputParams: [
            { name: 'modelName', label: 'Model Name', type: 'options', options: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'], default: 'gemini-2.0-flash' },
            { name: 'temperature', label: 'Temperature', type: 'number', default: 0.9 },
            { name: 'maxOutputTokens', label: 'Max Output Tokens', type: 'number', optional: true },
        ]
    },
    ChatOllama: {
        category: 'Chat Models', label: 'ChatOllama', icon: IconBrain,
        description: 'Run local models via Ollama',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'ChatOllama' }],
        inputParams: [
            { name: 'baseUrl', label: 'Base URL', type: 'string', default: 'http://localhost:11434' },
            { name: 'modelName', label: 'Model', type: 'string', default: 'llama3.2' },
            { name: 'temperature', label: 'Temperature', type: 'number', default: 0.9 },
            { name: 'numCtx', label: 'Context Window', type: 'number', default: 2048, optional: true },
        ]
    },
    ChatGroq: {
        category: 'Chat Models', label: 'ChatGroq', icon: IconCpu,
        description: 'Ultra-fast inference via Groq',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'ChatGroq' }],
        inputParams: [
            { name: 'modelName', label: 'Model', type: 'options', options: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'], default: 'llama-3.3-70b-versatile' },
            { name: 'temperature', label: 'Temperature', type: 'number', default: 0.9 },
            { name: 'maxTokens', label: 'Max Tokens', type: 'number', optional: true },
            { name: 'streaming', label: 'Streaming', type: 'boolean', default: true },
        ]
    },

    // ─── Chains ─────────────────────────────────────────────────────────────
    LLMChain: {
        category: 'Chains', label: 'LLM Chain', icon: IconLink,
        description: 'Simple LLM prompt-response chain',
        inputAnchors: [
            { id: 'model', label: 'Language Model' },
            { id: 'prompt', label: 'Prompt' },
            { id: 'memory', label: 'Memory', optional: true },
            { id: 'outputParser', label: 'Output Parser', optional: true },
        ],
        outputAnchors: [{ id: 'out', label: 'LLM Chain' }, { id: 'text', label: 'Output Prediction' }],
        inputParams: [
            { name: 'chainName', label: 'Chain Name', type: 'string', optional: true, placeholder: 'optional name' },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },
    ConversationChain: {
        category: 'Chains', label: 'Conversation Chain', icon: IconMessage,
        description: 'Multi-turn conversation with memory',
        inputAnchors: [
            { id: 'model', label: 'Chat Model' },
            { id: 'memory', label: 'Memory' },
        ],
        outputAnchors: [{ id: 'out', label: 'Conversation Chain' }],
        inputParams: [
            { name: 'systemMessagePrompt', label: 'System Message', type: 'textarea', rows: 4, default: 'The following is a friendly conversation between a human and an AI.' },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },
    RetrievalQAChain: {
        category: 'Chains', label: 'Retrieval QA Chain', icon: IconSearch,
        description: 'Question answering over documents',
        inputAnchors: [
            { id: 'model', label: 'Language Model' },
            { id: 'vectorStoreRetriever', label: 'Vector Store Retriever' },
        ],
        outputAnchors: [{ id: 'out', label: 'Retrieval QA Chain' }],
        inputParams: [
            { name: 'returnSourceDocuments', label: 'Return Source Documents', type: 'boolean', default: false },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },
    ConversationalRetrievalQAChain: {
        category: 'Chains', label: 'Conversational Retrieval QA', icon: IconMessage,
        description: 'Conversational QA with memory + retrieval',
        inputAnchors: [
            { id: 'model', label: 'Chat Model' },
            { id: 'vectorStoreRetriever', label: 'Vector Store Retriever' },
            { id: 'memory', label: 'Memory', optional: true },
        ],
        outputAnchors: [{ id: 'out', label: 'Conversational Retrieval QA' }],
        inputParams: [
            { name: 'returnSourceDocuments', label: 'Return Source Documents', type: 'boolean', default: false },
            { name: 'rephraseQuestion', label: 'Rephrase Question', type: 'boolean', default: true },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },

    // ─── Agents ─────────────────────────────────────────────────────────────
    OpenAIFunctionAgent: {
        category: 'Agents', label: 'OpenAI Function Agent', icon: IconAdjustments,
        description: 'Agent using OpenAI function calling',
        inputAnchors: [
            { id: 'model', label: 'Chat Model' },
            { id: 'memory', label: 'Memory', optional: true },
            { id: 'tools', label: 'Tools' },
        ],
        outputAnchors: [{ id: 'out', label: 'OpenAI Function Agent' }],
        inputParams: [
            { name: 'systemMessage', label: 'System Message', type: 'textarea', rows: 4, default: 'You are a helpful AI assistant.' },
            { name: 'maxIterations', label: 'Max Iterations', type: 'number', default: 10, optional: true },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },
    ReActAgent: {
        category: 'Agents', label: 'ReAct Agent', icon: IconAdjustments,
        description: 'Reasoning + acting agent loop',
        inputAnchors: [
            { id: 'model', label: 'Language Model' },
            { id: 'tools', label: 'Tools' },
            { id: 'memory', label: 'Memory', optional: true },
        ],
        outputAnchors: [{ id: 'out', label: 'ReAct Agent' }],
        inputParams: [
            { name: 'maxIterations', label: 'Max Iterations', type: 'number', default: 10 },
            { name: 'verbose', label: 'Verbose', type: 'boolean', default: false },
        ]
    },

    // ─── Prompts ─────────────────────────────────────────────────────────────
    PromptTemplate: {
        category: 'Prompts', label: 'Prompt Template', icon: IconFileText,
        description: 'Template with input variables',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Prompt Template' }],
        inputParams: [
            { name: 'template', label: 'Template', type: 'textarea', rows: 6, default: 'Answer the following question:\n{question}' },
            { name: 'promptValues', label: 'Format Prompt Values', type: 'json', optional: true, placeholder: '{ "question": "What is AI?" }' },
        ]
    },
    ChatPromptTemplate: {
        category: 'Prompts', label: 'Chat Prompt Template', icon: IconMessage,
        description: 'System + human message template',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Chat Prompt Template' }],
        inputParams: [
            { name: 'systemMessagePrompt', label: 'System Message', type: 'textarea', rows: 4, default: 'You are a helpful assistant.' },
            { name: 'humanMessagePrompt', label: 'Human Message', type: 'textarea', rows: 3, default: '{input}' },
            { name: 'promptValues', label: 'Format Prompt Values', type: 'json', optional: true },
        ]
    },

    // ─── Memory ─────────────────────────────────────────────────────────────
    BufferMemory: {
        category: 'Memory', label: 'Buffer Memory', icon: IconDatabase,
        description: 'Store full conversation in memory',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Buffer Memory' }],
        inputParams: [
            { name: 'memoryKey', label: 'Memory Key', type: 'string', default: 'chat_history' },
            { name: 'sessionId', label: 'Session ID', type: 'string', optional: true, placeholder: 'auto-generated if empty' },
            { name: 'returnMessages', label: 'Return Messages', type: 'boolean', default: true },
        ]
    },
    BufferWindowMemory: {
        category: 'Memory', label: 'Buffer Window Memory', icon: IconDatabase,
        description: 'Keep last K turns in memory',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Buffer Window Memory' }],
        inputParams: [
            { name: 'memoryKey', label: 'Memory Key', type: 'string', default: 'chat_history' },
            { name: 'k', label: 'Window Size (k)', type: 'number', default: 4 },
            { name: 'sessionId', label: 'Session ID', type: 'string', optional: true },
        ]
    },
    ConversationSummaryMemory: {
        category: 'Memory', label: 'Conversation Summary Memory', icon: IconDatabase,
        description: 'Summarise conversation using LLM',
        inputAnchors: [{ id: 'model', label: 'Chat Model' }],
        outputAnchors: [{ id: 'out', label: 'Conversation Summary Memory' }],
        inputParams: [
            { name: 'memoryKey', label: 'Memory Key', type: 'string', default: 'chat_history' },
            { name: 'sessionId', label: 'Session ID', type: 'string', optional: true },
        ]
    },

    // ─── Document Loaders ────────────────────────────────────────────────────
    PDFLoader: {
        category: 'Document Loaders', label: 'PDF File', icon: IconFileText,
        description: 'Load and parse PDF documents',
        inputAnchors: [{ id: 'textSplitter', label: 'Text Splitter', optional: true }],
        outputAnchors: [{ id: 'out', label: 'Document' }],
        inputParams: [
            { name: 'pdfFile', label: 'PDF File', type: 'file', fileType: '.pdf', placeholder: 'Choose a PDF file' },
            { name: 'usage', label: 'Usage', type: 'options', options: ['One document per page', 'One document per file'], default: 'One document per page' },
            { name: 'metadata', label: 'Additional Metadata', type: 'json', optional: true },
        ]
    },
    CSVLoader: {
        category: 'Document Loaders', label: 'CSV File', icon: IconTable,
        description: 'Load structured CSV data',
        inputAnchors: [{ id: 'textSplitter', label: 'Text Splitter', optional: true }],
        outputAnchors: [{ id: 'out', label: 'Document' }],
        inputParams: [
            { name: 'csvFile', label: 'CSV File', type: 'file', fileType: '.csv' },
            { name: 'columnName', label: 'Column to Extract', type: 'string', optional: true, placeholder: 'all columns if empty' },
        ]
    },
    WebLoader: {
        category: 'Document Loaders', label: 'Web Scraper', icon: IconWorld,
        description: 'Scrape content from URLs',
        inputAnchors: [{ id: 'textSplitter', label: 'Text Splitter', optional: true }],
        outputAnchors: [{ id: 'out', label: 'Document' }],
        inputParams: [
            { name: 'url', label: 'URL', type: 'string', placeholder: 'https://example.com' },
            { name: 'selector', label: 'CSS Selector', type: 'string', optional: true, placeholder: '.content' },
        ]
    },
    GithubLoader: {
        category: 'Document Loaders', label: 'GitHub', icon: IconBrandGithub,
        description: 'Load files from a GitHub repository',
        inputAnchors: [{ id: 'textSplitter', label: 'Text Splitter', optional: true }],
        outputAnchors: [{ id: 'out', label: 'Document' }],
        inputParams: [
            { name: 'repoLink', label: 'Repo URL', type: 'string', placeholder: 'https://github.com/owner/repo' },
            { name: 'branch', label: 'Branch', type: 'string', default: 'main' },
            { name: 'recursive', label: 'Recursive', type: 'boolean', default: false },
            { name: 'ignorePaths', label: 'Ignore Paths', type: 'string', optional: true, placeholder: 'node_modules,.git' },
        ]
    },

    // ─── Text Splitters ──────────────────────────────────────────────────────
    RecursiveCharacterTextSplitter: {
        category: 'Text Splitters', label: 'Recursive Character Text Splitter', icon: IconScissors,
        description: 'Smart recursive splitting by separators',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Text Splitter' }],
        inputParams: [
            { name: 'chunkSize', label: 'Chunk Size', type: 'number', default: 1000 },
            { name: 'chunkOverlap', label: 'Chunk Overlap', type: 'number', default: 200 },
            { name: 'separators', label: 'Custom Separators', type: 'string', optional: true, placeholder: '\\n\\n,\\n, ' },
        ]
    },
    CharacterTextSplitter: {
        category: 'Text Splitters', label: 'Character Text Splitter', icon: IconScissors,
        description: 'Split by a single separator character',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Text Splitter' }],
        inputParams: [
            { name: 'chunkSize', label: 'Chunk Size', type: 'number', default: 1000 },
            { name: 'chunkOverlap', label: 'Chunk Overlap', type: 'number', default: 200 },
            { name: 'separator', label: 'Separator', type: 'string', default: '\\n\\n' },
        ]
    },

    // ─── Vector Stores ───────────────────────────────────────────────────────
    Pinecone: {
        category: 'Vector Stores', label: 'Pinecone', icon: IconServer,
        description: 'Managed vector database',
        inputAnchors: [
            { id: 'document', label: 'Document', optional: true },
            { id: 'embeddings', label: 'Embeddings' },
        ],
        outputAnchors: [{ id: 'retriever', label: 'Pinecone Retriever' }, { id: 'vectorStore', label: 'Pinecone Vector Store' }],
        inputParams: [
            { name: 'indexName', label: 'Index Name', type: 'string', placeholder: 'my-index' },
            { name: 'namespace', label: 'Namespace', type: 'string', optional: true },
            { name: 'topK', label: 'Top K', type: 'number', default: 4 },
        ]
    },
    ChromaDB: {
        category: 'Vector Stores', label: 'Chroma', icon: IconDatabase,
        description: 'Open-source vector database',
        inputAnchors: [
            { id: 'document', label: 'Document', optional: true },
            { id: 'embeddings', label: 'Embeddings' },
        ],
        outputAnchors: [{ id: 'retriever', label: 'Chroma Retriever' }, { id: 'vectorStore', label: 'Chroma Vector Store' }],
        inputParams: [
            { name: 'chromaURL', label: 'Chroma URL', type: 'string', default: 'http://localhost:8000' },
            { name: 'collectionName', label: 'Collection Name', type: 'string', placeholder: 'my-collection' },
            { name: 'topK', label: 'Top K', type: 'number', default: 4 },
        ]
    },
    Qdrant: {
        category: 'Vector Stores', label: 'Qdrant', icon: IconDatabase,
        description: 'High-performance vector search',
        inputAnchors: [
            { id: 'document', label: 'Document', optional: true },
            { id: 'embeddings', label: 'Embeddings' },
        ],
        outputAnchors: [{ id: 'retriever', label: 'Qdrant Retriever' }, { id: 'vectorStore', label: 'Qdrant Vector Store' }],
        inputParams: [
            { name: 'qdrantServerUrl', label: 'Qdrant URL', type: 'string', placeholder: 'http://localhost:6333' },
            { name: 'collectionName', label: 'Collection Name', type: 'string' },
            { name: 'topK', label: 'Top K', type: 'number', default: 4 },
        ]
    },

    // ─── Embeddings ──────────────────────────────────────────────────────────
    OpenAIEmbeddings: {
        category: 'Embeddings', label: 'OpenAI Embeddings', icon: IconTransform,
        description: 'OpenAI text embedding models',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Embeddings' }],
        inputParams: [
            { name: 'modelName', label: 'Model', type: 'options', options: ['text-embedding-3-large', 'text-embedding-3-small', 'text-embedding-ada-002'], default: 'text-embedding-3-small' },
            { name: 'stripNewLines', label: 'Strip New Lines', type: 'boolean', default: true },
            { name: 'batchSize', label: 'Batch Size', type: 'number', default: 512, optional: true },
        ]
    },
    HuggingFaceEmbeddings: {
        category: 'Embeddings', label: 'HuggingFace Embeddings', icon: IconTransform,
        description: 'Open-source embeddings via HuggingFace',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Embeddings' }],
        inputParams: [
            { name: 'modelName', label: 'Model Name', type: 'string', default: 'sentence-transformers/all-MiniLM-L6-v2' },
        ]
    },

    // ─── Tools ───────────────────────────────────────────────────────────────
    Calculator: {
        category: 'Tools', label: 'Calculator', icon: IconCalculator,
        description: 'Evaluate math expressions',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Calculator Tool' }],
        inputParams: []
    },
    SerpAPI: {
        category: 'Tools', label: 'SerpAPI', icon: IconSearch,
        description: 'Google search results via SerpAPI',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'SerpAPI Tool' }],
        inputParams: [
            { name: 'apiKey', label: 'SerpAPI API Key', type: 'password' },
        ]
    },
    WebBrowser: {
        category: 'Tools', label: 'Web Browser', icon: IconWorld,
        description: 'Browse and extract web content',
        inputAnchors: [
            { id: 'model', label: 'Language Model' },
            { id: 'embeddings', label: 'Embeddings' },
        ],
        outputAnchors: [{ id: 'out', label: 'Web Browser Tool' }],
        inputParams: []
    },
    BraveSearch: {
        category: 'Tools', label: 'Brave Search', icon: IconSearch,
        description: 'Privacy-focused web search',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Brave Search Tool' }],
        inputParams: [
            { name: 'apiKey', label: 'Brave API Key', type: 'password' },
        ]
    },
    CustomTool: {
        category: 'Tools', label: 'Custom Tool', icon: IconTool,
        description: 'Call your own function/API',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Custom Tool' }],
        inputParams: [
            { name: 'name', label: 'Tool Name', type: 'string', default: 'my_tool' },
            { name: 'description', label: 'Description', type: 'string', default: 'Useful when you need to...' },
            { name: 'func', label: 'Function Code', type: 'code', default: 'async function main(input) {\n    return { result: input }\n}' },
        ]
    },

    // ─── Output Parsers ───────────────────────────────────────────────────────
    StructuredOutputParser: {
        category: 'Output Parsers', label: 'Structured Output Parser', icon: IconList,
        description: 'Parse LLM output into JSON structure',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Output Parser' }],
        inputParams: [
            { name: 'autoFix', label: 'Auto Fix', type: 'boolean', default: false },
        ]
    },
    CommaSeparatedListOutputParser: {
        category: 'Output Parsers', label: 'CSV List Output Parser', icon: IconList,
        description: 'Parse comma-separated list from LLM',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Output Parser' }],
        inputParams: []
    },

    // ─── Utilities ────────────────────────────────────────────────────────────
    IfElseFunction: {
        category: 'Utilities', label: 'If Else', icon: IconRouter,
        description: 'Conditional branching logic',
        inputAnchors: [{ id: 'in', label: 'Input' }],
        outputAnchors: [{ id: 'true', label: 'If True' }, { id: 'false', label: 'If False' }],
        inputParams: [
            { name: 'condition', label: 'Condition (JS)', type: 'code', default: 'if (input.length > 100) {\n    return "yes";\n}' },
        ]
    },
    SetVariable: {
        category: 'Utilities', label: 'Set Variable', icon: IconVariable,
        description: 'Store a value in a named variable',
        inputAnchors: [{ id: 'in', label: 'Input' }],
        outputAnchors: [{ id: 'out', label: 'Value' }],
        inputParams: [
            { name: 'variableName', label: 'Variable Name', type: 'string', default: 'myVar' },
        ]
    },
    GetVariable: {
        category: 'Utilities', label: 'Get Variable', icon: IconVariable,
        description: 'Retrieve a previously stored variable',
        inputAnchors: [],
        outputAnchors: [{ id: 'out', label: 'Value' }],
        inputParams: [
            { name: 'variableName', label: 'Variable Name', type: 'string', default: 'myVar' },
        ]
    },
    StickyNote: {
        category: 'Utilities', label: 'Sticky Note', icon: IconFileCode,
        description: 'Add a note/comment to the canvas',
        inputAnchors: [],
        outputAnchors: [],
        inputParams: [
            { name: 'note', label: 'Note Content', type: 'textarea', rows: 4, default: 'Add your notes here...' },
        ]
    },
}
