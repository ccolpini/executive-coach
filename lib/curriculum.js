export const CURRICULUM = [
  // ── MINTO PYRAMID PRINCIPLE ──────────────────────────────────────
  {
    week: 1,
    framework: "Minto Pyramid Principle",
    title: "BLUF — Bottom Line Up Front",
    focus: "Lead with your conclusion. The answer comes first; support follows.",
    criteria: [
      "The single most important point is the very first sentence",
      "No wind-up, no context preamble before the point",
      "Supporting detail only appears after the conclusion",
    ],
    dailyDrill: "Take any email draft or meeting prep note. Move the last sentence to the first position. Read it aloud.",
    redFlags: ["starts with background before the point", "buries the recommendation", "uses 'so basically' or 'what I wanted to share is'"],
    example: {
      weak: "We've been looking at the Q2 numbers and there are a few things I want to walk through. After reviewing with the team, I think we might want to consider adjusting our timeline.",
      strong: "We should push the Q2 launch two weeks. Here's why: the engineering team flagged three blocking issues that can't be parallelized.",
    },
  },
  {
    week: 2,
    framework: "Minto Pyramid Principle",
    title: "P→R→I — Point, Reason, Implication",
    focus: "Every verbal answer follows: Point → Reason → Implication.",
    criteria: [
      "Opens with a clear Point (the answer)",
      "Follows with one or two supporting Reasons",
      "Closes with the Implication (so what / what should happen next)",
    ],
    dailyDrill: "Answer three random questions today using only P→R→I structure. Time yourself — aim for under 30 seconds per answer.",
    redFlags: ["gives reasons without stating the point", "no implication or next step", "more than two reasons (dilutes the point)"],
    example: {
      weak: "There's been some latency issues and the team has been working on it, and there are a few different factors at play here...",
      strong: "The API is the bottleneck. Response times tripled after last week's deploy introduced a synchronous call. We need to async that call by Thursday or we miss SLA.",
    },
  },
  {
    week: 3,
    framework: "Minto Pyramid Principle",
    title: "Context Gate",
    focus: "Set context in one sentence maximum, then immediately deliver your point.",
    criteria: [
      "Context, if given, is one sentence and no longer",
      "Context serves the listener, not the speaker (no 'I was thinking...')",
      "Point arrives by sentence two at the latest",
    ],
    dailyDrill: "Before your next meeting, write your context sentence. Time it: if reading it aloud takes more than 7 seconds, cut it.",
    redFlags: ["multi-sentence context setup", "context that explains your reasoning process", "apologetic or hedging context"],
    example: {
      weak: "So I've been spending a lot of time on this and I wanted to make sure I had all the information before bringing it up, but I think there's something we should discuss...",
      strong: "Quick flag on the vendor contract: the indemnity clause is non-standard and legal needs to review before we sign Thursday.",
    },
  },
  {
    week: 4,
    framework: "Minto Pyramid Principle",
    title: "The Pause",
    focus: "Use silence deliberately. Don't fill space with hedges or filler while thinking.",
    criteria: [
      "Takes a beat before answering instead of starting immediately with 'um' or 'so'",
      "No hedge chains ('I think maybe it could potentially be...')",
      "Delivers a complete thought, then stops — no trailing 'you know?' or 'does that make sense?'",
    ],
    dailyDrill: "In every conversation today, count to two silently before responding. Notice the urge to fill silence. Resist it.",
    redFlags: ["um, uh, so, like as filler", "question-tag endings ('right?', 'you know?')", "thinking out loud while searching for the point"],
    example: {
      weak: "That's a good question, um, so I think, you know, we could potentially look at a few different options, does that make sense?",
      strong: "[2-second pause] Two options: fast-track the vendor or build internally. Given timeline, I'd recommend the vendor.",
    },
  },

  // ── DECKER — COMMUNICATE TO INFLUENCE ───────────────────────────
  {
    week: 5,
    framework: "Decker: Communicate to Influence",
    title: "Strategic Anchoring",
    focus: "Open with what's at stake for your audience before presenting your point.",
    criteria: [
      "Explicitly names what the listener cares about before making your point",
      "Anchor is one sentence, audience-facing (their goal, not your process)",
      "Point follows immediately after the anchor",
    ],
    dailyDrill: "Before any meeting today, write one sentence starting with 'What's at stake for you is…' Do not use that sentence verbatim — internalize the intent.",
    redFlags: ["opens with 'I' or internal process", "no audience framing before the ask", "anchor feels like flattery rather than stakes"],
    example: {
      weak: "I've been working on the migration plan and wanted to share some updates with the team.",
      strong: "This decision affects your Q3 shipping dates. The migration plan I'm proposing protects that deadline — here's the key trade-off you need to decide.",
    },
  },
  {
    week: 6,
    framework: "Decker: Communicate to Influence",
    title: "Language Swap — Behaviors of Trust",
    focus: "Replace hedging and weakening language with direct, confident phrasing.",
    criteria: [
      "No hedge clusters ('I think maybe we could possibly...')",
      "Replaces 'I feel like' with 'I believe' or removes it entirely",
      "Uses active verbs ('we will', 'I recommend') over passive/tentative forms",
    ],
    dailyDrill: "Record a 60-second voice memo about any work topic. Transcribe it. Highlight every hedge word. Rerecord without them.",
    redFlags: ["'I feel like'", "'kind of / sort of'", "'just' as a softener", "'does that make sense?' as approval-seeking"],
    example: {
      weak: "I just wanted to kind of flag that I feel like maybe we should potentially reconsider the approach?",
      strong: "I recommend we revisit the approach. The current path has a dependency risk we haven't priced in.",
    },
  },
  {
    week: 7,
    framework: "Decker: Communicate to Influence",
    title: "SHARP Storytelling",
    focus: "Use Stories, Humor, Analogies, References, and Pictures to make ideas stick.",
    criteria: [
      "Uses at least one concrete example, analogy, or brief story",
      "The SHARP element illuminates the point — not decorative",
      "Stays under 3 sentences for the illustrative element",
    ],
    dailyDrill: "Find one analogy for a technical concept you explain repeatedly. Test it on a non-technical person today.",
    redFlags: ["all abstraction, no illustration", "story longer than the point it supports", "analogy that requires explaining"],
    example: {
      weak: "The architecture creates compounding technical debt that will slow velocity over time.",
      strong: "The architecture is like building the second floor before finishing the foundation. We're adding rooms, but the whole thing sways. We need to pause and reinforce before Q4.",
    },
  },
  {
    week: 8,
    framework: "Decker: Communicate to Influence",
    title: "Pushback Handling",
    focus: "Absorb objections without deflecting, then redirect with your point intact.",
    criteria: [
      "Acknowledges the objection directly ('That's a real constraint' — not 'great point')",
      "Does not immediately cave or over-explain defensively",
      "Re-anchors to the core recommendation after acknowledging",
    ],
    dailyDrill: "Write three anticipated objections to a current proposal. Write a one-sentence absorb + one-sentence redirect for each.",
    redFlags: ["'you're right, nevermind'", "lengthy defensive justification", "ignoring the objection and restating your point louder"],
    example: {
      weak: "I mean, yeah, I hear you, I guess maybe it's not the right time, I was just thinking it could work but we don't have to do it.",
      strong: "Budget is a real constraint — I'm not dismissing it. Even with half the budget, the first phase delivers the core risk reduction. Want me to scope that version?",
    },
  },

  // ── GALLO — TALK LIKE TED ───────────────────────────────────────
  {
    week: 9,
    framework: "Gallo: Talk Like TED",
    title: "Own the Narrative",
    focus: "Control what the audience thinks this is about before they decide for themselves.",
    criteria: [
      "First sentence frames the narrative explicitly ('This is about X')",
      "Narrative frame is memorable and specific — not generic ('I want to share an update')",
      "Everything in the response reinforces that frame",
    ],
    dailyDrill: "For your next meeting topic, write the one sentence that frames what you want people to walk away thinking.",
    redFlags: ["no explicit frame — let audience interpret", "frame buried mid-response", "generic frame ('just a quick update')"],
    example: {
      weak: "So I wanted to go through some of the changes we've been making on the product side...",
      strong: "This is a story about how we turned a support problem into our strongest retention signal. Three weeks ago, churn was trending up. Here's what changed.",
    },
  },
  {
    week: 10,
    framework: "Gallo: Talk Like TED",
    title: "Conversational Delivery",
    focus: "Sound like a person talking, not a person presenting.",
    criteria: [
      "Short sentences — average under 15 words",
      "Varies rhythm: fast for urgency, slower for emphasis",
      "No corporate filler ('leverage', 'synergize', 'circle back', 'bandwidth')",
    ],
    dailyDrill: "Read your last Slack message or doc section aloud. Every sentence over 20 words: cut it in two.",
    redFlags: ["corporate jargon density", "sentences that can only be parsed visually (not heard)", "monotone structure — all sentences same length"],
    example: {
      weak: "We need to leverage our existing cross-functional bandwidth to synergize the go-to-market approach and circle back with stakeholders on alignment.",
      strong: "We have the team. We have the plan. What's missing is a decision. I need a yes or no by Friday so we can move.",
    },
  },
  {
    week: 11,
    framework: "Gallo: Talk Like TED",
    title: "Economy of Words",
    focus: "Say the same thing in half the words. Every word earns its place.",
    criteria: [
      "No redundant phrases ('as I mentioned', 'what I mean by that is')",
      "Each sentence is one thought — not two thoughts with 'and'",
      "Closes before the energy drops — stops talking when the point is made",
    ],
    dailyDrill: "Take something you said or wrote today. Cut it by 40%. If the meaning survives, that was the right version.",
    redFlags: ["restating what was just said", "multi-clause sentences that could be two sentences", "trailing explanation after the close"],
    example: {
      weak: "So in summary, what I'm basically trying to say is that the deadline is at risk and I think we should talk about it and figure out what to do.",
      strong: "The deadline is at risk. We need a decision today.",
    },
  },
  {
    week: 12,
    framework: "Gallo: Talk Like TED",
    title: "Full Integration",
    focus: "Combine all frameworks: BLUF, P→R→I, anchoring, trust language, narrative, economy.",
    criteria: [
      "Opens with BLUF — conclusion first",
      "Uses direct, hedge-free language throughout",
      "Frames a narrative, uses concrete illustration, closes cleanly",
    ],
    dailyDrill: "Record a 90-second response to a complex scenario. Score yourself on all 12 weeks' criteria. Identify your single weakest point.",
    redFlags: ["regressing to any week 1-11 failure mode", "strong opening that collapses into hedging mid-response", "no concrete illustration"],
    example: {
      weak: "I've been thinking about this a lot and I feel like there are a number of different factors we should probably consider as we move forward with this.",
      strong: "We should ship Friday. The risk is manageable — one edge case affects less than 2% of users, and we can patch it Monday. Delaying costs more than fixing.",
    },
  },
];

export function getWeek(n) {
  return CURRICULUM.find((w) => w.week === n) || CURRICULUM[0];
}

export const SCENARIOS = [
  { id: "open", label: "Open Practice", description: "Free-form — respond to whatever scenario Claude generates based on this week's focus." },
  { id: "status", label: "Status Update", description: "You're asked: 'Where do things stand?' in a cross-functional meeting." },
  { id: "propose", label: "Propose Idea", description: "You need to pitch a recommendation to a senior stakeholder in under 60 seconds." },
  { id: "pushback", label: "Handle Pushback", description: "Someone challenges your proposal: 'That's too expensive / too risky / not the right time.'" },
  { id: "cold", label: "Cold Question", description: "You're called on unexpectedly: 'What do you think about this?' with no prep." },
];
