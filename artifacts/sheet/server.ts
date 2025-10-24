import { streamObject } from "ai";
import { z } from "zod";
import { sheetPrompt, updateDocumentPrompt } from "@/lib/ai/prompts";
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

export const sheetDocumentHandler = createDocumentHandler<"sheet">({
  kind: "sheet",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamObject({
      model,
      system: sheetPrompt,
      prompt: title,
      schema: z.object({
        csv: z.string().describe("CSV data"),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          dataStream.write({
            type: "data-sheetDelta",
            data: csv,
            transient: true,
          });

          draftContent = csv;
        }
      }
    }

    dataStream.write({
      type: "data-sheetDelta",
      data: draftContent,
      transient: true,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const model = resolveArtifactModel();

    const { fullStream } = streamObject({
      model,
      system: updateDocumentPrompt(document.content, "sheet"),
      prompt: description,
      schema: z.object({
        csv: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { csv } = object;

        if (csv) {
          dataStream.write({
            type: "data-sheetDelta",
            data: csv,
            transient: true,
          });

          draftContent = csv;
        }
      }
    }

    return draftContent;
  },
});
