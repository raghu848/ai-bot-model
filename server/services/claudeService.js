const Anthropic = require('@anthropic-ai/sdk');
const { FULL_STACK_KNOWLEDGE } = require('../data/knowledge');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLAUDE_MODEL = "claude-3-5-sonnet-20240620";

/**
 * Helper to get relevant knowledge for offline/online context
 */
const getRelevantKnowledge = (query) => {
    const q = query.toLowerCase();
    return FULL_STACK_KNOWLEDGE.filter(item => 
        item.topics.some(topic => q.includes(topic)) || 
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
};

/**
 * Generate Interview Questions
 */
exports.generateQuestions = async ({ role, difficulty, type, count, resumeText }) => {
    const systemPrompt = `You are an expert technical interviewer. 
    Generate ${count} ${type} interview questions for a ${role} position at ${difficulty} level.
    ${resumeText ? `Relevant candidate background: ${resumeText}` : ''}
    Return ONLY a JSON array of objects.
    Each object must have: 
    - "id": number
    - "question": string
    - "category": string (e.g., DSA, Tech-Specific, Behavioral, System Design)
    - "hint": string (a subtle hint to help the candidate)
    
    Return ONLY valid JSON. No preamble, no markdown formatting.`;

    try {
        const message = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: "user", content: "Generate questions now." }],
        });

        const content = message.content[0].text;
        return JSON.parse(content.trim());
    } catch (error) {
        console.error('Claude API Error (Generation):', error);
        throw new Error('Failed to generate questions from AI');
    }
};

/**
 * Evaluate Single Answer
 */
exports.evaluateAnswer = async ({ question, answer, role }) => {
    const systemPrompt = `You are an expert interviewer evaluating a ${role} candidate's answer.
    Question: "${question}"
    Candidate's Answer: "${answer}"
    
    Evaluate the answer and return ONLY a JSON object with:
    - "score": number (0-10)
    - "feedback": string (2-3 constructive sentences)
    - "strengths": string array
    - "improvements": string array
    - "idealAnswerSummary": string (1 concise paragraph)
    - "perfectScript": string (A conversational, first-person "perfect script" of how the candidate should say the answer in an interview, including a concrete example)
    
    Return ONLY valid JSON.`;

    try {
        const message = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: "user", content: "Evaluate answer now." }],
        });

        const content = message.content[0].text;
        return JSON.parse(content.trim());
    } catch (error) {
        console.error('Claude API Error (Evaluation):', error);
        throw new Error('Failed to evaluate answer using AI');
    }
};

/**
 * Generate Overall Session Feedback
 */
exports.generateOverallFeedback = async (sessionData) => {
    const systemPrompt = `Analyze this interview session and provide a final 3-line summary feedback.
    Session data: ${JSON.stringify(sessionData)}
    Return ONLY the string for the feedback.`;

    try {
        const message = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 500,
            system: systemPrompt,
            messages: [{ role: "user", content: "Provide summary feedback." }],
        });

        return message.content[0].text.trim();
    } catch (error) {
        console.error('Claude API Error (Summary):', error);
        return "Excellent effort! Continue practicing to refine your technical depth and communication.";
    }
};

/**
 * Technical Mentor Chat
 */
exports.chat = async (messages) => {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const relevantKnowledge = getRelevantKnowledge(lastUserMessage);

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_key_here' || process.env.ANTHROPIC_API_KEY.includes('your_')) {
        // Advanced Offline Knowledge Recognition
        await new Promise(resolve => setTimeout(resolve, 800)); // Artificial thinking time

        if (relevantKnowledge.length > 0) {
            const bestMatch = relevantKnowledge[0];
            return `### ${bestMatch.title}\n\n${bestMatch.content}\n\n*Note: I am currently in offline mode using my internal high-fidelity knowledge base. For real-time personalized architectural reviews, please connect a Claude API key.*`;
        }

        // Default expert response if no specific keyword matches
        return `As a Senior Full Stack Technical Architect, I've seen many developers struggle with concepts like **"${lastUserMessage}"**. \n\nIn a production-grade environment, you should focus on:
        
1. **Scalability:** How does this component handle 10x traffic?
2. **Observability:** Are you logging the right metrics?
3. **Security:** Have you sanitized all inputs?

Is there a specific part of the stack (Frontend, Backend, or DevOps) you'd like to dive deeper into? I have extensive knowledge of React patterns, Node.js internals, and Distributed Systems.`;
    }

    // Enhanced Online System Prompt with specialized knowledge grounding
    const knowledgeContext = relevantKnowledge.map(k => `[Context: ${k.title}] ${k.content}`).join('\n\n');
    const systemPrompt = `You are a Senior Full Stack Technical Architect and Mentor. 
    Your goal is to help users clear their doubts about engineering concepts with world-class accuracy.
    
    ${knowledgeContext ? `Use the following technical reference concepts to ground your answer if relevant:\n${knowledgeContext}` : ''}
    
    Guidelines:
    - Provide clear, professional, and academically sound explanations.
    - Use markdown for code snippets and bolding for key terms.
    - If explaining a trade-off, mention Performance vs. Readability.
    - Always suggest a best-practice or a "Senior Engineer" tip at the end.`;

    try {
        const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 2000,
            system: systemPrompt,
            messages: messages,
        });

        return response.content[0].text;
    } catch (error) {
        console.error('Claude API Error (Chat):', error.message);
        
        // Return knowledge-aware error message if API fails
        if (relevantKnowledge.length > 0) {
            const bestMatch = relevantKnowledge[0];
            return `⚠️ **AI Error**: ${error.message}\n\n**Expert Reference:**\n\n### ${bestMatch.title}\n${bestMatch.content}`;
        }
        
        let errorMessage = "An unknown error occurred while communicating with the AI.";
        if (error.status === 401 || error.message.includes('401')) {
            errorMessage = "⚠️ **Authentication Error**: Your Anthropic API Key seems to be invalid.";
        } else if (error.status === 429 || error.message.includes('429')) {
             errorMessage = "⚠️ **Rate Limit Exceeded**: Too many requests to the AI API.";
        }
        return errorMessage;
    }
};
