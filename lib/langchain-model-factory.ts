import { ChatOpenAI } from "@langchain/openai";
import { getServerConstant } from "@/lib/server-constants";

export const createLangchainModel = (model: string) => {
  return new ChatOpenAI({
    model,
    apiKey: getServerConstant("AI_GATEWAY_API_KEY"),
    streamUsage: true,
    configuration: {
      baseURL: getServerConstant("AI_GATEWAY_BASE_URL"),
    },
  });
};
