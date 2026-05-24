# Haxon Flow

A canvas-first AI workflow studio built for exploring and prototyping AI pipelines visually.

> **Inspired by [FlowiseAI](https://flowiseai.com/)** — Haxon Flow takes design inspiration from Flowise's drag-and-drop AI workflow paradigm. Full credit to the FlowiseAI team for pioneering this concept. Haxon Flow is an independent reimplementation built for learning and exploration; it is not derived from Flowise's source code and is not affiliated with FlowiseAI in any way.

---

## Overview

Haxon Flow is a modern React-based AI workflow builder that lets you:

- **Visually compose** AI pipelines by dragging and connecting nodes on an infinite canvas
- **Orchestrate multi-agent flows** with conditional branches and parallel execution
- **Connect to any LLM** — GPT-4o, Claude 3.7, Gemini 2.5, Llama 4, Mistral, and more
- **Build RAG pipelines** with document stores and vector search
- **Deploy flows as REST APIs** with built-in auth, monitoring, and rate limiting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| State | Zustand v5 |
| Canvas | `@xyflow/react` (React Flow v12) |
| Routing | React Router v7 |
| UI | shadcn/ui components |
| Fonts | Bricolage Grotesque · Manrope · JetBrains Mono |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

The app runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── pages/          # Route-level page components
│   ├── landing/    # Marketing landing page
│   ├── canvas/     # Flow canvas editor
│   ├── auth/       # Login, signup, reset password
│   └── ...         # Other app pages
├── components/     # Shared UI components
├── store/          # Zustand state stores
├── hooks/          # Custom React hooks (useSound, etc.)
├── routes/         # React Router route definitions
└── assets/         # CSS, fonts, images
```

## Credits & Inspiration

This project was inspired by **[FlowiseAI](https://flowiseai.com/)**, an open-source low-code platform for building customized LLM flows. We deeply respect their work and encourage you to check out the original project.

- FlowiseAI GitHub: [https://github.com/FlowiseAI/Flowise](https://github.com/FlowiseAI/Flowise)
- FlowiseAI License: Apache 2.0

Haxon Flow is a separate, independently written project. No source code from FlowiseAI was used.

## License

MIT License — see [LICENSE.md](./LICENSE.md)

This project is for learning, exploration, and non-commercial use. Not intended for production deployment or commercial product launch.
