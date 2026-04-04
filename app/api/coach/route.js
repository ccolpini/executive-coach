import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildScenarioPrompt } from "@/lib/systemPrompt";
import { getWeek } from "@/lib/curriculum";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.COACH_MODEL || "claude-sonnet-4-20250514";

const VALID_ROLES = new Set(["user", "assistant"]);
const MAX_HISTORY_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_USER_MESSAGE_LENGTH = 2000;

function validateConversationHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (msg) =>
        msg &&
        typeof msg.role === "string" &&
        VALID_ROLES.has(msg.role) &&
        typeof msg.content === "string" &&
        msg.content.length <= MAX_MESSAGE_LENGTH
    )
    .slice(-MAX_HISTORY_LENGTH);
}

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 30;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const { type, weekNumber, scenarioId, userMessage, conversationHistory } = await req.json();

    if (typeof weekNumber !== "number" || weekNumber < 1 || weekNumber > 12) {
      return Response.json({ error: "Invalid week number" }, { status: 400 });
    }

    const week = getWeek(weekNumber);

    if (type === "scenario") {
      const prompt = buildScenarioPrompt(scenarioId, week);
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });
      return Response.json({ content: msg.content[0].text });
    }

    if (type === "evaluate") {
      if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
        return Response.json({ error: "User message is required" }, { status: 400 });
      }
      if (userMessage.length > MAX_USER_MESSAGE_LENGTH) {
        return Response.json({ error: "Message too long" }, { status: 400 });
      }

      const systemPrompt = buildSystemPrompt(week);
      const validHistory = validateConversationHistory(conversationHistory);
      const messages = [
        ...validHistory,
        { role: "user", content: userMessage.slice(0, MAX_USER_MESSAGE_LENGTH) },
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
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages,
        tools: [ratingTool],
        tool_choice: { type: "tool", name: "submit_evaluation" },
      });

      const toolBlock = msg.content.find((b) => b.type === "tool_use");
      if (toolBlock?.input?.feedback) {
        return Response.json({
          content: toolBlock.input.feedback,
          rating: toolBlock.input.rating || "decent",
        });
      }

      const textBlock = msg.content.find((b) => b.type === "text");
      return Response.json({
        content: textBlock?.text || "Unable to evaluate. Please try again.",
        rating: "decent",
      });
    }

    return Response.json({ error: "Unknown request type" }, { status: 400 });
  } catch (err) {
    console.error("[coach api error]", err);
    const message = err?.message || "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
