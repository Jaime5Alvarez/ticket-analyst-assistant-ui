const serverConstants = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  AI_MODEL: process.env.AI_MODEL,
  AI_PROVIDER: process.env.AI_PROVIDER,
  AI_USE_GATEWAY: process.env.AI_USE_GATEWAY,
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  AI_GATEWAY_BASE_URL: process.env.AI_GATEWAY_BASE_URL,
  PLAYWRIGHT_MCP_SERVER: process.env.PLAYWRIGHT_MCP_SERVER,
} as const;

export const getServerConstant = (key: keyof typeof serverConstants) => {
  const value = serverConstants[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};
