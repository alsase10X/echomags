import { streamObject } from "ai";
import { z } from "zod";
import { codePrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
import { getModel, MissingGroqApiKeyError } from "@/lib/llm";
import { createDocumentHandler } from "@/lib/artifacts/server";

function resolveArtifactModel() {
  try {
    return getModel("artifact-model");
  } catch (error) {
    if (error instanceof MissingGroqApiKeyError) {
      throw new Error("Missing GROQ_API_KEY");
    }

    throw error;
  }
}

export const codeDocumentHandler = createDocumentHandler<"code">({
  kind: "code",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamObject({
      model,
      system: codePrompt,
      prompt: title,
      schema: z.object({
        code: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          dataStream.write({
            type: "data-codeDelta",
            data: code ?? "",
            transient: true,
          });

          draftContent = code;
        }
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamObject({
      model,
      system: updateDocumentPrompt(document.content, "code"),
      prompt: description,
      schema: z.object({
        code: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { code } = object;

        if (code) {
          dataStream.write({
            type: "data-codeDelta",
            data: code ?? "",
            transient: true,
          });

          draftContent = code;
        }
      }
    }

    return draftContent;
  },
});
