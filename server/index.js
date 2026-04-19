require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CLAUDE_MODEL = "claude-3-5-sonnet-20240620";

app.post('/api/generate', async (req, res) => {
    try {
        const { role, difficulty, type, count } = req.body;
        const msg = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: `Generate ${count} ${type} interview questions for ${role} at ${difficulty} level. Return ONLY a JSON array of objects with id, question, category, and hint. No markdown.`,
            messages: [{ role: "user", content: "Generate questions." }],
        });
        res.json(JSON.parse(msg.content[0].text.trim()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/evaluate', async (req, res) => {
    try {
        const { question, answer, role } = req.body;
        const msg = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            system: `Evaluate this answer for a ${role} interview. Return ONLY a JSON object with score (0-10), feedback (2 sentences), strengths (array), improvements (array), idealAnswerSummary (1 paragraph). No markdown.`,
            messages: [{ role: "user", content: `Question: ${question}\nAnswer: ${answer}` }],
        });
        res.json(JSON.parse(msg.content[0].text.trim()));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body; // Expecting [{role, content}, ...]
        const msg = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: "You are a Senior Full Stack Technical Architect and Mentor. Your goal is to help users clear their doubts about engineering concepts. Provide clear, concise, and academically sound explanations. Use markdown for code snippets.",
            messages: messages,
        });
        res.json({ content: msg.content[0].text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Simplified API running on port ${PORT}`));
