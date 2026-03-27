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

      const msg = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: systemPrompt,
        messages,
      });

      const responseText = msg.content[0].text;

      let rating = "decent";
      if (/\*\*STRONG\*\*/i.test(responseText)) rating = "strong";
      else if (/\*\*NEEDS WORK\*\*/i.test(responseText)) rating = "needs_work";

      return Response.json({ content: responseText, rating });
    }

    return Response.json({ error: "Unknown request type" }, { status: 400 });
  } catch (err) {
    console.error("[coach api error]", err);
    const message = err?.message || "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
