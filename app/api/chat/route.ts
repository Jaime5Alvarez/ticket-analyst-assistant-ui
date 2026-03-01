import { convertModelMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { createAgent } from "langchain";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createLangchainModel } from "@/lib/langchain-model-factory";
import { getTicketAnalystSystemPrompt } from "@/lib/ticket-analyst-system-prompt";
import { getServerConstant } from "@/lib/server-constants";
import { auth } from "@/lib/auth";
import { upsertConversationSnapshot } from "@/lib/conversations";
import { z } from "zod";

export const runtime = "nodejs";

const chatRequestSchema = z.object({
  id: z.string().min(1),
  messages: z.custom<UIMessage[]>(
    (value) => Array.isArray(value),
    "messages must be an array",
  ),
  system: z.string().optional(),
  model: z.string().min(1),
});

type ChatRequestBody = z.infer<typeof chatRequestSchema>;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rawBody: unknown = await req.json();
  const parsedBody = chatRequestSchema.safeParse(rawBody);
  if (!parsedBody.success) {
    return Response.json(
      {
        error: "Invalid request body",
        issues: parsedBody.error.issues,
      },
      { status: 400 },
    );
  }
  const { id, messages, system, model }: ChatRequestBody = parsedBody.data;
  const selectedModel = model;

  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      playwright: {
        url: getServerConstant("PLAYWRIGHT_MCP_SERVER"),
      },
    },
  });

  try {
    const tools = await mcpClient.getTools();
    const llm = createLangchainModel(selectedModel);
    const agent = createAgent({
      model: llm,
      tools,
    });
    const modelMessages = await convertToModelMessages(messages);
    const langchainMessages = convertModelMessages([
      {
        role: "system",
        content: system ?? getTicketAnalystSystemPrompt(),
      },
      ...modelMessages,
    ]);

    const langchainStream = await agent.stream(
      { messages: langchainMessages },
      { streamMode: ["values", "messages"], recursionLimit: 100 },
    );

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        execute: async ({ writer }) => {
          writer.merge(
            toUIMessageStream(langchainStream as AsyncIterable<never>),
          );
        },
        generateId: () => crypto.randomUUID(),
        onFinish: async ({ responseMessage }) => {
          await upsertConversationSnapshot({
            threadId: id,
            userId: session.user.id,
            model: selectedModel,
            messages: [...messages, responseMessage],
          });
          await mcpClient.close();
        },
      }),
    });
  } catch (error) {
    await mcpClient.close();
    throw error;
  }
}
