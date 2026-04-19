const express = require('express');
const router = express.Router();
const { 
    generateQuestions, 
    evaluateAnswer, 
    saveSession, 
    getSessions, 
    getSessionDetail,
    chat
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

// Public AI Endpoints (No Auth Required for Simulation)
router.post('/generate', generateQuestions);
router.post('/evaluate', evaluateAnswer);
router.post('/chat', chat);

// Protected Routes (Require Auth)
router.use(protect);
router.post('/session', saveSession);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionDetail);

module.exports = router;
