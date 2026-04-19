import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Target, Zap, ChevronRight, HelpCircle, 
  Send, Loader2, Award, Home, LayoutDashboard, 
  Settings, Play, Briefcase, BarChart, MessageSquare, Trash2, Cpu
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api";

// --- MOCK SERVICE (FALLBACKS) ---
const mockQuestions = [
  { id: 1, question: "How do you handle state management in a large-scale React application?", category: "Technical", hint: "Think about Flux architecture or Atomic state." },
  { id: 2, question: "Describe a time you had to resolve a difficult technical conflict within your team.", category: "Behavioral", hint: "Focus on communication and compromise." },
  { id: 3, question: "What is the difference between Virtual DOM and Shadow DOM?", category: "Technical", hint: "One is for performance, one is for encapsulation." }
];

const mockEvaluation = {
  score: 8,
  feedback: "Your explanation of state management was clear and showed depth. You addressed both local and global state concerns effectively.",
  strengths: ["Clear terminology", "Practical examples"],
  improvements: ["Mention performance optimization techniques"],
  idealAnswerSummary: "State management involves balancing local component state with global stores. Using tools like Redux or Context API effectively requires understanding data flow...",
  perfectScript: "I'd explain it like this: 'State management is about maintaining a single source of truth for your data. For example, in a shopping cart app, I would use React Context or Redux to ensure that the item count is synchronized across the header, product list, and checkout pages, preventing UI inconsistencies...'"
};

const mockMentorResponse = "The backend server appears to be offline. Please ensure the server is running on port 5000.";

// --- SUB-COMPONENTS ---

const LandingView = ({ setView }) => (
  <div className="flex flex-col items-center text-center space-y-12 py-20 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-bold uppercase tracking-widest">
        <Sparkles size={16} /> THE FUTURE OF PREP
      </div>
      <h1 className="text-7xl font-black italic tracking-tighter glow-text">
        Prepare Like <br />A <span className="text-white">Professional.</span>
      </h1>
      <p className="text-slate-400 text-xl max-w-2xl mx-auto">
        Hyper-realistic AI interviews and Full-Stack mentoring. Get expert feedback and clear your technical doubts in real-time.
      </p>
    </motion.div>
    <div className="flex gap-4">
      <button onClick={() => setView('setup')} className="gradient-btn px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-2 cursor-pointer">
        Start Interview <ChevronRight size={20} />
      </button>
      <button onClick={() => setView('mentor')} className="glass-btn px-10 py-4 rounded-xl font-bold text-lg border border-white/10 hover:bg-sky-500/10 transition-all cursor-pointer group">
        <MessageSquare className="group-hover:text-sky-400" size={20} /> AI Mentor
      </button>
    </div>
  </div>
);

const SetupView = ({ config, setConfig, startInterview, loading }) => (
  <div className="max-w-2xl mx-auto py-12 space-y-8">
    <h2 className="text-3xl font-bold italic">Session Settings</h2>
    <div className="premium-glass p-8 rounded-2xl space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2"><Briefcase size={16}/> Target Role</label>
        <select 
          value={config.role} 
          onChange={e => setConfig({...config, role: e.target.value})}
          className="w-full"
        >
          <option>Frontend Developer</option>
          <option>Full Stack Engineer</option>
          <option>Product Manager</option>
          <option>UI/UX Designer</option>
        </select>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-bold uppercase text-slate-500 flex items-center gap-2"><BarChart size={16}/> Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <button 
              key={lvl}
              onClick={() => setConfig({...config, difficulty: lvl})}
              className={`py-3 rounded-xl border transition-all cursor-pointer ${config.difficulty === lvl ? 'bg-sky-600 border-sky-500 font-bold' : 'border-white/5 bg-slate-900/50 text-slate-400 hover:border-white/20'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
      <button onClick={startInterview} disabled={loading} className="w-full gradient-btn py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Launch Interview <Play size={18} fill="currentColor" /></>}
      </button>
    </div>
  </div>
);

const InterviewView = ({ activeSession, currentIndex, userAnswer, setUserAnswer, handleNext, submitting }) => {
  const q = activeSession.questions[currentIndex];
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sky-400 font-bold text-xs uppercase tracking-widest">Question {currentIndex + 1} of {activeSession.questions.length}</p>
          <h3 className="text-2xl font-bold mt-2">{q.category} Assessment</h3>
        </div>
        <div className="h-2 w-48 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${((currentIndex + 1) / activeSession.questions.length) * 100}%` }} />
        </div>
      </div>

      <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-glass p-10 rounded-3xl space-y-8">
        <div className="flex gap-6">
          <div className="p-4 bg-sky-500/10 rounded-2xl text-sky-400 h-fit">
            <HelpCircle size={32} />
          </div>
          <h4 className="text-3xl font-medium leading-relaxed">{q.question}</h4>
        </div>
        
        <textarea 
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder="Type your strategic answer here..."
          className="w-full h-48 text-lg"
          autoFocus
        />

        <div className="flex justify-between items-center">
          <button className="text-slate-500 hover:text-white flex items-center gap-2 text-sm font-medium">
            <Settings size={16} /> AI assistance mode enabled
          </button>
          <button 
            onClick={handleNext} 
            disabled={!userAnswer.trim() || submitting}
            className="gradient-btn px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? <><Loader2 className="animate-spin" size={18} /> Evaluating...</> : <>Submit Answer <Send size={18} /></>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const SummaryView = ({ activeSession, setView }) => (
  <div className="max-w-5xl mx-auto py-12 space-y-10">
    <div className="flex justify-between items-center">
      <h2 className="text-5xl font-black italic glow-text">Performance Analysis</h2>
      <button onClick={() => setView('landing')} className="flex items-center gap-2 px-6 py-2 bg-slate-800 rounded-xl border border-white/10 cursor-pointer hover:bg-slate-700">
        <Home size={18} /> Exit
      </button>
    </div>

    <div className="premium-glass p-12 rounded-[3rem] border-l-8 border-sky-500 flex gap-16 items-center">
      <div className="relative flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
          <circle cx="96" cy="96" r="80" stroke="#0ea5e9" strokeWidth="12" fill="none" strokeDasharray="502" strokeDashoffset={502 - (502 * (activeSession.overallScore / 10))} strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-black">{activeSession.overallScore.toFixed(1)}</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Score / 10</span>
        </div>
      </div>
      <div className="space-y-4 flex-1">
        <div className="px-3 py-1 bg-sky-500/10 text-sky-400 rounded-lg text-xs font-bold border border-sky-500/20 w-fit uppercase">Overall Feedback</div>
        <p className="text-2xl font-bold text-slate-200 leading-relaxed italic">
          "You showed exceptional poise in technical reasoning. Focus on refining your system design analogies."
        </p>
      </div>
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-bold px-4">Session Transcript</h3>
      {activeSession.questions.map((q, i) => (
        <div key={i} className="premium-glass p-8 rounded-2xl space-y-6">
           <div className="flex justify-between items-start">
             <div className="space-y-1">
               <p className="text-xs uppercase font-bold text-slate-500">{q.category}</p>
               <h4 className="text-xl font-bold">{q.question}</h4>
             </div>
             <div className="text-right">
               <p className="text-2xl font-black text-sky-400">{q.score}</p>
               <p className="text-[10px] uppercase font-bold text-slate-600">Score</p>
             </div>
           </div>
           <div className="space-y-4">
             <div>
               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Your Answer</p>
               <p className="text-slate-300 text-sm">{q.answer || "No answer provided"}</p>
             </div>
             
             <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 text-slate-400 italic">
               "{q.feedback}"
             </div>

             {q.perfectScript && (
               <div className="p-6 bg-sky-500/5 border border-sky-500/20 rounded-2xl space-y-3">
                 <div className="flex items-center gap-2 text-sky-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                   <Sparkles size={14} /> Perfect Interview Script
                 </div>
                 <p className="text-slate-200 font-medium leading-relaxed italic">
                   "{q.perfectScript}"
                 </p>
                 <p className="text-[10px] text-sky-500/50 font-medium">Tip: Use this exact phrasing to demonstrate seniority and technical depth.</p>
               </div>
             )}
           </div>
        </div>
      ))}
    </div>
  </div>
);

const MentorView = ({ mentorHistory, handleClearChat, mentorQuery, setMentorQuery, handleSendMessage, chatLoading }) => {
  const scrollRef = useRef(null);
  const suggestedTopics = [
    "React Virtual DOM", "Node.js Event Loop", "SQL vs NoSQL", 
    "Redis Caching", "Docker Containers", "Microservices"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentorHistory, chatLoading]);

  return (
    <div className="max-w-5xl mx-auto py-12 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-5xl font-black italic glow-text">AI Technical Mentor</h2>
          <p className="text-slate-500 mt-2">Clear your doubts about Full Stack engineering.</p>
        </div>
        <button onClick={handleClearChat} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-sm font-bold uppercase tracking-widest">
          <Trash2 size={16} /> Clear History
        </button>
      </div>

      <div className="flex-1 premium-glass rounded-3xl mb-6 overflow-hidden flex flex-col border-white/5">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {mentorHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 select-none py-10">
              <div className="space-y-4 opacity-30">
                <Cpu size={64} className="mx-auto animate-pulse" />
                <p className="text-2xl font-medium px-10">Master the Stack. Ask me about <br/> architecture, performance, or deep internals.</p>
              </div>
              
              <div className="space-y-4 max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500/50">Suggested Knowledge Seeds</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {suggestedTopics.map(topic => (
                    <button 
                      key={topic}
                      onClick={() => setMentorQuery(`Tell me more about ${topic}`)}
                      className="px-4 py-2 rounded-full border border-white/5 bg-white/5 text-xs font-bold text-slate-400 hover:border-sky-500/30 hover:text-sky-400 transition-all cursor-pointer"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {mentorHistory.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-6 ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-tr-none' : 'bg-slate-900 border border-white/10 rounded-tl-none'}`}>
                <div className="leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
               <div className="bg-slate-900 border border-white/10 rounded-2xl rounded-tl-none p-6 animate-pulse flex items-center gap-3">
                 <Loader2 className="animate-spin text-sky-500" size={18} />
                 <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Architect is analyzing...</span>
               </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-6 bg-slate-950/40 border-t border-white/5">
          <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="relative">
            <input 
              value={mentorQuery}
              onChange={e => setMentorQuery(e.target.value)}
              placeholder="Ask a technical question..."
              className="w-full pr-16 h-16 text-lg border-white/10 bg-slate-900/50"
              disabled={chatLoading}
            />
            <button 
              type="submit"
              disabled={!mentorQuery.trim() || chatLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-sky-600 rounded-xl text-white hover:bg-sky-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ history, setView, setActiveSession }) => (
  <div className="max-w-6xl mx-auto py-12 space-y-12">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-5xl font-black italic glow-text">Progress Dashboard</h2>
        <p className="text-slate-500 mt-2">Visualizing your growth as a candidate.</p>
      </div>
      <button onClick={() => setView('setup')} className="gradient-btn px-8 py-3 rounded-xl font-bold flex items-center gap-2 cursor-pointer">
         <Plus size={18} /> New Session
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: 'Total Practice', val: history.length, unit: 'Sessions' },
        { label: 'Avg Readiness', val: history.length ? (history.reduce((a,b)=>a+b.overallScore,0)/history.length).toFixed(1) : 0, unit: '/ 10' },
        { label: 'Time Spent', val: history.length ? (history.reduce((a,b)=>a+b.duration,0)/60).toFixed(0) : 0, unit: 'Minutes' }
      ].map((s,i) => (
        <div key={i} className="premium-glass p-8 rounded-3xl text-center space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
          <p className="text-5xl font-black tracking-tighter">{s.val}</p>
          <p className="text-xs font-bold text-sky-500">{s.unit}</p>
        </div>
      ))}
    </div>

    <div className="space-y-6">
      <h3 className="text-2xl font-bold px-4">Recent History</h3>
      <div className="space-y-4">
        {history.map((s, i) => (
          <button key={i} onClick={() => { setActiveSession(s); setView('summary'); }} className="w-full premium-glass p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-sky-500/30">
            <div className="flex items-center gap-6 text-left">
              <div className="p-3 bg-slate-900 rounded-xl group-hover:bg-sky-500/10 transition-colors">
                <Award className="text-slate-500 group-hover:text-sky-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg group-hover:text-sky-400">{s.role}</h4>
                <p className="text-xs font-bold text-slate-500 uppercase">{s.date} • {s.difficulty}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <p className="text-2xl font-black text-sky-400">{s.overallScore.toFixed(1)}</p>
                <p className="text-[10px] uppercase font-bold text-slate-600">Score</p>
              </div>
              <ChevronRight className="text-slate-700 group-hover:text-sky-500 transform group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
        {history.length === 0 && <p className="text-center py-20 text-slate-500 italic">No sessions yet. Get started today!</p>}
      </div>
    </div>
  </div>
);

// --- CORE APPLICATION ---
export default function App() {
  const [view, setView] = useState('landing');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('sessions') || '[]'));
  const [mentorHistory, setMentorHistory] = useState(() => JSON.parse(localStorage.getItem('mentorChat') || '[]'));
  
  const [activeSession, setActiveSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [config, setConfig] = useState({ role: 'Frontend Developer', difficulty: 'Intermediate' });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [mentorQuery, setMentorQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('mentorChat', JSON.stringify(mentorHistory));
  }, [mentorHistory]);

  // --- ACTIONS ---
  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/interview/generate`, { ...config, type: 'technical', count: 3 });
      setActiveSession({ questions: res.data, startTime: Date.now() });
      setEvaluations([]);
      setCurrentIndex(0);
      setView('interview');
      toast.success('AI Questions Generated');
    } catch (e) {
      console.error(e);
      setActiveSession({ questions: mockQuestions, startTime: Date.now() });
      setEvaluations([]);
      setCurrentIndex(0);
      setView('interview');
      toast.error('API Error: Using Mock Questions');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setSubmitting(true);
    toast.loading('AI Evaluating...', { id: 'eval' });
    
    try {
      const res = await axios.post(`${API_BASE}/interview/evaluate`, {
        question: activeSession.questions[currentIndex].question,
        answer: userAnswer,
        role: config.role
      });
      
      const newEval = {
        ...res.data,
        question: activeSession.questions[currentIndex].question,
        category: activeSession.questions[currentIndex].category,
        answer: userAnswer
      };
      
      const updatedEvals = [...evaluations, newEval];
      setEvaluations(updatedEvals);
      setUserAnswer('');
      toast.success('Answer Evaluated', { id: 'eval' });

      if (currentIndex < activeSession.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const totalScore = updatedEvals.reduce((a, b) => a + b.score, 0) / updatedEvals.length;
        const finalSession = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          ...config,
          questions: updatedEvals,
          overallScore: totalScore,
          duration: Math.floor((Date.now() - activeSession.startTime) / 1000)
        };
        setHistory([finalSession, ...history]);
        setActiveSession(finalSession);
        setView('summary');
      }
    } catch (e) {
      console.error(e);
      toast.error('AI Error: Simulated Evaluation Used', { id: 'eval' });
      // Fallback
      const fallbackEval = { ...mockEvaluation, answer: userAnswer, question: activeSession.questions[currentIndex].question };
      const updatedEvals = [...evaluations, fallbackEval];
      setEvaluations(updatedEvals);
      setUserAnswer('');
      if (currentIndex < activeSession.questions.length - 1) setCurrentIndex(currentIndex + 1);
      else setView('summary');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!mentorQuery.trim()) return;
    
    const newUserMsg = { role: 'user', content: mentorQuery };
    const updatedHistory = [...mentorHistory, newUserMsg];
    setMentorHistory(updatedHistory);
    setMentorQuery('');
    setChatLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/interview/chat`, { messages: updatedHistory });
      const aiMsg = { role: 'assistant', content: res.data.content };
      setMentorHistory([...updatedHistory, aiMsg]);
      toast.success('Mentor Responded');
    } catch (e) {
      console.error(e);
      toast.error('API Offline: Fallback Active');
      const fallbackMsg = { role: 'assistant', content: mockMentorResponse };
      setMentorHistory([...updatedHistory, fallbackMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setMentorHistory([]);
    toast.success('Chat History Cleared');
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-white/5 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50 px-10 py-5 flex justify-between items-center">
        <div onClick={() => setView('landing')} className="text-2xl font-black italic tracking-tighter cursor-pointer flex items-center gap-2 select-none group">
          <Zap className="text-sky-500 group-hover:scale-110 transition-transform" fill="currentColor" /> InterviewAI
        </div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-wider text-slate-400">
          <button onClick={() => setView('dashboard')} className={`hover:text-white transition-all cursor-pointer relative py-2 ${view === 'dashboard' ? 'text-white' : ''}`}>
            Dashboard
            {view === 'dashboard' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />}
          </button>
          <button onClick={() => setView('mentor')} className={`hover:text-white transition-all cursor-pointer relative py-2 ${view === 'mentor' ? 'text-white' : ''}`}>
            AI Mentor
            {view === 'mentor' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />}
          </button>
          <button onClick={() => setView('setup')} className={`hover:text-white transition-all cursor-pointer relative py-2 ${view === 'setup' ? 'text-white' : ''}`}>
            New Session
            {view === 'setup' && <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />}
          </button>
        </div>
      </nav>

      <main className="px-10 py-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'landing' && <LandingView setView={setView} />}
            {view === 'setup' && <SetupView config={config} setConfig={setConfig} startInterview={startInterview} loading={loading} />}
            {view === 'interview' && (
              <InterviewView 
                activeSession={activeSession} 
                currentIndex={currentIndex} 
                userAnswer={userAnswer} 
                setUserAnswer={setUserAnswer} 
                handleNext={handleNext}
                submitting={submitting}
              />
            )}
            {view === 'summary' && <SummaryView activeSession={activeSession} setView={setView} />}
            {view === 'dashboard' && <DashboardView history={history} setView={setView} setActiveSession={setActiveSession} />}
            {view === 'mentor' && (
              <MentorView 
                mentorHistory={mentorHistory} 
                handleClearChat={handleClearChat} 
                mentorQuery={mentorQuery} 
                setMentorQuery={setMentorQuery} 
                handleSendMessage={handleSendMessage}
                chatLoading={chatLoading}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Toaster position="bottom-center" toastOptions={{
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }} />
    </div>
  );
}

const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
