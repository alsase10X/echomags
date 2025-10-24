export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Llama 3.3 70B",
    description: "Versatile Groq hosted Llama 3.3 70B model for general chat",
  },
  {
    id: "chat-model-reasoning",
    name: "DeepSeek R1 70B",
    description: "Reasoning focused model distillation for complex workflows",
  },
];
