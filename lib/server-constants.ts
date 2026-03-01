const serverConstants = {
  AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
  AI_GATEWAY_BASE_URL: process.env.AI_GATEWAY_BASE_URL,
  PLAYWRIGHT_MCP_SERVER: process.env.PLAYWRIGHT_MCP_SERVER,
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
} as const;

export const getServerConstant = (key: keyof typeof serverConstants) => {
  const value = serverConstants[key];

  if (!value) {
    throw new Error(`${key} is not defined`);
  }

  return value;
};
