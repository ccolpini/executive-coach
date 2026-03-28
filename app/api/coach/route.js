import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildScenarioPrompt } from "@/lib/systemPrompt";
import { getWeek } from "@/lib/curriculum";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { type, weekNumber, scenarioId, userMessage, conversationHistory } = await req.json();

    const week = getWeek(weekNumber);

    // Generate scenario prompt
    if (type === "scenario") {
      const prompt = buildScenarioPrompt(scenarioId, week);
      const msg = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });
      return Response.json({ content: msg.content[0].text });
    }

    // Evaluate user response
    if (type === "evaluate") {
      const systemPrompt = buildSystemPrompt(week);
      const messages = [
        ...conversationHistory,
        { role: "user", content: userMessage },
      ];

      const ratingTool = {
        name: "submit_evaluation",
        description: "Submit your coaching evaluation with a structured rating and feedback.",
        input_schema: {
          type: "object",
          properties: {
            rating: {
              type: "string",
              enum: ["strong", "decent", "needs_work"],
              description: "Overall rating: 'strong' if the response nails the week's criteria, 'decent' if partially there, 'needs_work' if it misses key criteria.",
            },
            feedback: {
              type: "string",
              description: "Your full coaching feedback in markdown. Include: **What worked** (if applicable), **Fix this** (quote their words, explain the issue), **Rewrite** (improved version), and **Next rep** (follow-up question).",
            },
          },
          required: ["rating", "feedback"],
        },
      };

      const msg = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: systemPrompt,
        messages,
        tools: [ratingTool],
        tool_choice: { type: "tool", name: "submit_evaluation" },
      });

      const toolBlock = msg.content.find((b) => b.type === "tool_use");
      const rating = toolBlock?.input?.rating || "decent";
      const feedback = toolBlock?.input?.feedback || "Unable to evaluate. Please try again.";

      return Response.json({ content: feedback, rating });
    }

    return Response.json({ error: "Unknown request type" }, { status: 400 });
  } catch (err) {
    console.error("[coach api error]", err);
    const message = err?.message || "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
