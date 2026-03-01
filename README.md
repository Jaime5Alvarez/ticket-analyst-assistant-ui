Ticket analyst UI with assistant-ui + LangChain agent + Playwright MCP.

## Getting Started

1. Configure environment variables in `.env`:

```bash
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
AI_PROVIDER=openai
AI_MODEL=gpt-5-nano
PLAYWRIGHT_MCP_SERVER=http://localhost:8931/mcp
DATABASE_URL=postgresql://ticket_analyst:ticket_analyst_pass@localhost:5432/ticket_analyst_db
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-random-secret-min-32-chars
```

2. Install dependencies and create Better Auth tables:

```bash
bun install
bunx @better-auth/cli migrate
```

3. Start the Playwright MCP server (in another terminal):

```bash
bunx @playwright/mcp@latest --port 8931 --headless --device "iPhone 15"
```

4. Run the development server:

```bash
bun dev
```

5. Create users as admin (provisioning script):

```bash
bun run create:user
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
