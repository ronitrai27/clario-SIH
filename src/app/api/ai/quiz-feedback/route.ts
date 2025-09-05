/* eslint-disable @typescript-eslint/no-explicit-any */
//api/ai/quiz-feedback/route.ts
// import { NextResponse } from "next/server";
// import { ChatGroq } from "@langchain/groq";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { StructuredOutputParser } from "@langchain/core/output_parsers";
// import { z } from "zod";

// interface QuizRequest {
//   quizData: { section: string; question: string; answer: string }[];
// }

// const careerSchema = z.object({
//   insights: z.object({
//     stream: z.string().optional(),
//     confidence: z.string().optional(),
//     additionalInterest: z.string().optional(),
//     summary: z.string().optional(),
//     careerOptions: z.array(z.string()).optional(),
//   }),
// });

// const parser = StructuredOutputParser.fromZodSchema(careerSchema  as any);

// // --- Prompt Template ---
// const promptTemplate = PromptTemplate.fromTemplate(`
// Student Quiz Data:
// {quizData}

// Based on the above, extract structured career insights.

// Your task:
// - stream (detected stream from answers)
// - confidence (student's confidence level)
// - additionalInterest (extra skill/interest mentioned)
// - summary (3-line summary about student profile)
// - careerOptions (list of 5 career paths suitable for this student)

// Return ONLY JSON in this format:
// {format_instructions}
// `);

// // --- LLM ---
// const llm = new ChatGroq({
//   model: "meta-llama/llama-4-scout-17b-16e-instruct",
//   temperature: 0.4,
//   maxTokens: 600,
// });

// // --- Chain ---
// const chain = promptTemplate.pipe(llm).pipe(parser);

// export async function POST(request: Request) {
//   try {
//     const body: QuizRequest = await request.json();
//     const { quizData } = body;

//     if (!quizData || quizData.length === 0) {
//       return NextResponse.json(
//         { isError: true, error: "Missing quiz data" },
//         { status: 400 }
//       );
//     }

//     const quizString = quizData
//       .map((q) => `${q.question}: ${q.answer}`)
//       .join("\n");

//     const input = {
//       quizData: quizString,
//       format_instructions: parser.getFormatInstructions(),
//     };

//     const result = (await chain.invoke(input)) as z.infer<typeof careerSchema>;

//     // --- Normalize response (safe defaults for DB/UI) ---
//     const finalResult = {
//       insights: {
//         stream: result?.insights?.stream ?? "",
//         confidence: result?.insights?.confidence ?? "",
//         additionalInterest: result?.insights?.additionalInterest ?? "",
//         summary: result?.insights?.summary ?? "",
//         careerOptions: result?.insights?.careerOptions ?? [],
//       },
//     };

//     return NextResponse.json({ data: finalResult });
//   } catch (error: any) {
//     console.error("❌ CAREER INSIGHT ERROR:", error);
//     return NextResponse.json(
//       { isError: true, error: error.message || "Failed to generate insights" },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
// api/ai/quiz-feedback/route.ts
import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

interface QuizRequest {
  quizData: { section: string; question: string; answer: string }[];
  userStatus: string;
  mainFocus: string;
}

function getSchemaAndPrompt(userStatus: string, mainFocus: string) {
  if (userStatus === "12th student" && mainFocus === "choose career paths") {
    const schema = z.object({
      insights: z.object({
        stream: z.string().optional(),
        confidence: z.string().optional(),
        additionalInterest: z.string().optional(),
        summary: z.string().optional(),
        careerOptions: z.array(z.string()).optional(),
      }),
    });

    const prompt = PromptTemplate.fromTemplate(`
    Student Quiz Data:
    {quizData}

    Based on the above, extract structured career insights.

    Your task:
    - stream (detected stream from answers)
    - confidence (student's confidence level)
    - additionalInterest (extra skill/interest mentioned)
    - summary (3-line summary about student profile)
    - careerOptions (list of 5 career paths suitable for this student)

    Return ONLY JSON in this format:
    {format_instructions}
    `);

    return { schema, prompt };
  }

  if (userStatus === "10th student" && mainFocus === "career/ path guidance") {
    const schema = z.object({
      insights: z.object({
        stream: z.string().optional(),
        confidence: z.string().optional(),
        reason: z.string().optional(),
        summary: z.string().optional(),
        careerOptions: z.array(z.string()).optional(),
      }),
    });

    const prompt = PromptTemplate.fromTemplate(`
    Student Quiz Data:
    {quizData}

    Based on the above, extract structured guidance for a 10th class student.

    Your task:
    - stream (main stream of interest)
    - confidence (student's confidence level in that stream)
    - reason (why student chose these subjects)
    - summary (3-line profile summary of the student)
    - careerOptions (5 long-term career paths suitable for them according to their chosen stream)

    Return ONLY JSON in this format:
    {format_instructions}
    `);

    return { schema, prompt };
  }

  throw new Error("Unsupported userStatus + mainFocus combination");
}

/**
 * 🔹 LLM Config
 */
const llm = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0.4,
  maxTokens: 600,
});

export async function POST(request: Request) {
  try {
    const body: QuizRequest = await request.json();
    const { quizData, userStatus, mainFocus } = body;

    if (!quizData || quizData.length === 0) {
      return NextResponse.json(
        { isError: true, error: "Missing quiz data" },
        { status: 400 }
      );
    }

    // --- Step 1: Pick schema + prompt dynamically ---
    const { schema, prompt } = getSchemaAndPrompt(userStatus, mainFocus);
    const parser = StructuredOutputParser.fromZodSchema(schema as any);
    const chain = prompt.pipe(llm).pipe(parser);

    // --- Step 2: Convert quiz data into plain string ---
    const quizString = quizData
      .map((q) => `${q.question}: ${q.answer}`)
      .join("\n");

    const input = {
      quizData: quizString,
      format_instructions: parser.getFormatInstructions(),
    };

    // --- Step 3: Run LLM ---
    const result = (await chain.invoke(input)) as z.infer<typeof schema>;

    // --- Step 4: Normalize (safe defaults to avoid UI crash) ---
    const finalResult = {
      insights: Object.fromEntries(
        Object.entries(result?.insights ?? {}).map(([key, val]) => [
          key,
          Array.isArray(val) ? val.filter(Boolean) : val ?? "",
        ])
      ),
    };

    return NextResponse.json({ data: finalResult });
  } catch (error: any) {
    console.error("❌ CAREER INSIGHT ERROR:", error);
    return NextResponse.json(
      { isError: true, error: error.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}
