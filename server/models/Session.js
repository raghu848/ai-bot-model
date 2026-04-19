const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    interviewType: { type: String, required: true },
    questions: [{
        questionText: String,
        category: String,
        userAnswer: String,
        score: Number,
        feedback: String,
        strengths: [String],
        improvements: [String],
        idealAnswerSummary: String
    }],
    overallScore: { type: Number, default: 0 },
    overallFeedback: { type: String },
    duration: { type: Number }, // in seconds
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
