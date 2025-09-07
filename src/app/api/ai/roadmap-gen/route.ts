/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair";

//  schema non-strict
const RoadmapSchema = z.object({
  roadmapTitle: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  initialNodes: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.string().optional(),
        position: z
          .object({
            x: z.number().optional(),
            y: z.number().optional(),
          })
          .optional(),
        data: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            link: z.string().optional(), // any string allowed
          })
          .optional(),
      })
    )
    .optional(),
  initialEdges: z
    .array(
      z.object({
        id: z.string().optional(),
        source: z.string().optional(),
        target: z.string().optional(),
      })
    )
    .optional(),
});

const parser = StructuredOutputParser.fromZodSchema(RoadmapSchema as any);

const model = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0.3,
  maxTokens: 600,
});

export async function GET() {
  try {
    const formatInstructions = parser.getFormatInstructions();

    const prompt = `
Generate a concise basic learning roadmap for a "Software Developer".
Follow fundamentals → intermediate.
not required very long roadmap.
Response must be valid JSON.

${formatInstructions}
`;

    const response = await model.invoke(prompt);

    // Repair JSON before parsing
    let repairedJSON: string;
    try {
      repairedJSON = jsonrepair(response.content as string);
    } catch (repairErr) {
      console.warn("JSON repair failed, using raw LLM output", repairErr);
      repairedJSON = response.content as string; // fallback
    }

    // Parse with schema
    const parsed = await parser.parse(repairedJSON);

    console.log("Parsed Roadmap:", parsed);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
