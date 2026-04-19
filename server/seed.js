require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Session = require('./models/Session');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interviewai');
        
        // Find or create a test user
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                targetRole: 'Frontend Developer',
                experienceLevel: 'Intermediate'
            });
        }

        const roles = ['Frontend Developer', 'Backend Developer', 'System Architect'];
        const sessions = [];

        for (let i = 0; i < 5; i++) {
            sessions.push({
                userId: user._id,
                role: roles[i % 3],
                difficulty: 'Intermediate',
                interviewType: 'Mixed',
                overallScore: 6 + Math.random() * 3,
                overallFeedback: "Great performance overall. Solid technical knowledge shown in core concepts.",
                duration: 900 + Math.random() * 600,
                questions: [
                    {
                        questionText: "Explain React Hooks and their benefits.",
                        category: "React",
                        userAnswer: "Hooks allow you to use state and other React features without writing a class.",
                        score: 8,
                        feedback: "Good concise answer, but could explain more about 'useEffect' dependencies.",
                        strengths: ["Clear definition", "Accuracy"],
                        improvements: ["Mention specific hooks like useMemo"],
                        idealAnswerSummary: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components..."
                    }
                ],
                createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
            });
        }

        await Session.insertMany(sessions);
        console.log('✅ Seeded 5 sample sessions');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();
