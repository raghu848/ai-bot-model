const Session = require('../models/Session');
const claudeService = require('../services/claudeService');

exports.generateQuestions = async (req, res, next) => {
    try {
        const { role, difficulty, type, count, resumeText } = req.body;
        const questions = await claudeService.generateQuestions({ role, difficulty, type, count, resumeText });
        res.json(questions);
    } catch (error) {
        next(error);
    }
};

exports.evaluateAnswer = async (req, res, next) => {
    try {
        const { question, answer, role } = req.body;
        const evaluation = await claudeService.evaluateAnswer({ question, answer, role });
        res.json(evaluation);
    } catch (error) {
        next(error);
    }
};

exports.chat = async (req, res, next) => {
    try {
        const { messages } = req.body;
        const response = await claudeService.chat(messages);
        res.json({ content: response });
    } catch (error) {
        next(error);
    }
};

exports.saveSession = async (req, res, next) => {
    try {
        const { role, difficulty, interviewType, questions, duration } = req.body;
        
        const overallScore = questions.reduce((acc, q) => acc + q.score, 0) / questions.length;
        const overallFeedback = await claudeService.generateOverallFeedback({ role, questions, overallScore });

        const session = await Session.create({
            userId: req.user.id,
            role,
            difficulty,
            interviewType,
            questions,
            overallScore,
            overallFeedback,
            duration
        });

        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
};

exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        next(error);
    }
};

exports.getSessionDetail = async (req, res, next) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (error) {
        next(error);
    }
};
