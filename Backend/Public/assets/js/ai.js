/* ============================================================
   ai.js — Claude AI integration for Guide Me
   Place your Anthropic API key below.
   ⚠️  For production, move the key to a backend proxy.
   ============================================================ */

const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
const AI_MODEL = 'claude-sonnet-4-20250514';

async function callClaude(systemPrompt, userMessage, history = []) {
    const messages = [
        ...history,
        { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
            model: AI_MODEL,
            max_tokens: 2000,
            system: systemPrompt,
            messages
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '';
}

/* ── Roadmap generation ─────────────────────────────────── */

async function generateRoadmapWithAI(profile) {
    const { domain, level, goal, duration, hoursPerWeek } = profile;

    const system = `You are an expert learning roadmap generator. 
Always respond with valid JSON only — no markdown, no explanation, just the raw JSON object.`;

    const prompt = `Create a detailed learning roadmap with this profile:
- Domain: ${domain}
- Level: ${level}
- Goal: ${goal || 'general knowledge'}
- Duration: ${duration || '3 months'}
- Hours per week: ${hoursPerWeek || '4-7h'}

Return a JSON object with exactly this structure:
{
  "title": "string",
  "description": "string",
  "field": "string",
  "level": "${level}",
  "duration": "${duration || '3 months'}",
  "status": "not-started",
  "progress": 0,
  "chapters": [
    {
      "title": "string",
      "description": "string (2-3 sentences)",
      "duration": "string (e.g. '1 week')",
      "advice": "string (1 practical tip)",
      "resources": ["url or resource name"],
      "todos": ["actionable task 1", "actionable task 2", "actionable task 3"],
      "status": "not-started"
    }
  ]
}

Include 6 to 10 chapters. Make it practical and realistic.`;

    const raw = await callClaude(system, prompt);

    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Merge with profile metadata
    return {
        ...parsed,
        id: generateUuid(),
        userId: profile.userId,
        domain: profile.domain,
        goal: profile.goal,
        hoursPerWeek: profile.hoursPerWeek,
        createdAt: new Date().toISOString().split('T')[0],
        completedSteps: [],
        chatHistory: [],
        // localStorage fallback shape
        steps: (parsed.chapters || []).map((c, i) => ({
            step: i + 1,
            title: c.title,
            description: c.description,
            duration: c.duration,
            advice: c.advice || '',
            resources: (c.resources || []).map(r => ({ name: r, url: '#', free: true })),
            todos: c.todos || [],
            completed: false
        })),
        completedSteps: []
    };
}

/* ── Roadmap-specific chat ──────────────────────────────── */

async function askClaudeAboutRoadmap(question, roadmap, chatHistory = []) {
    const chapters = roadmap.chapters || roadmap.steps || [];
    const chaptersText = chapters.map((c, i) =>
        `Step ${i + 1}: ${c.title} (${c.duration || '?'}) — ${c.description || ''}`
    ).join('\n');

    const system = `You are GUIDE ME, an AI learning assistant. 
The user is following this learning roadmap:

Title: ${roadmap.title}
Level: ${roadmap.level || ''}
Duration: ${roadmap.duration || ''}
Field: ${roadmap.field || roadmap.domain || ''}

Chapters:
${chaptersText}

Answer questions about this roadmap clearly and concisely. 
If asked about resources, suggest real free ones (MDN, freeCodeCamp, YouTube, official docs).
Keep responses under 150 words. Be encouraging and practical.`;

    // Build conversation history for context
    const history = chatHistory.slice(-6).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
    }));

    return await callClaude(system, question, history);
}

/* ── General chat (roadmap builder) ────────────────────── */

async function askClaudeGeneral(question, conversationHistory = []) {
    const system = `You are GUIDE ME, a friendly AI that helps people create personalized learning roadmaps.
Keep responses short (under 100 words), friendly, and action-oriented.
If the user wants a roadmap, ask clarifying questions one at a time: domain, level, goal, duration.
Once you have enough info, tell the user you're ready to generate their roadmap.`;

    const history = conversationHistory.slice(-8).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
    }));

    return await callClaude(system, question, history);
}
