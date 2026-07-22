import React, { useState, useRef, useEffect } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are "AIT Placement Assistant", an expert AI chatbot embedded inside the AIT College Placement Management Portal.
You help students named Jayasurya K (B.Tech IT, IV Year, CGPA 8.74) with:
- Upcoming campus drive schedules (TCS on 20 Jul, Zoho on 25 Jul, Infosys on 30 Jul 2025)
- Resume tips and ATS optimization
- Interview preparation strategies
- Aptitude & coding test tips
- Company eligibility criteria
- Placement statistics and leaderboard info

Always respond concisely, in a friendly and professional tone. Keep answers under 4 sentences unless asked for details.
Use emojis sparingly to make responses feel warm. Prioritize placement-relevant information.
If asked something outside placement scope, gently redirect to placement topics.`;

const FALLBACK_RESPONSES = {
  tcs: 'The next TCS drive is on 20 July 2025. It includes Online Test (Aptitude + Coding), TR, MR, and HR rounds. Registration closes on 18 July 2025. 📅',
  resume: '🔍 Use the AI Resume Analyzer in the Resume Workspace tab! It gives ATS score, keyword analysis, and rewrites weak bullet points using the STAR method.',
  infosys: '📋 Infosys eligibility: Minimum 6.5 CGPA, No active backlogs, 60% throughout academics. Drive scheduled for 30 July 2025.',
  compan: '🏢 Companies this month: TCS (20 Jul), Zoho (25 Jul), Infosys (30 Jul). Check Drive Calendar for full details.',
  aptitude: '📚 For aptitude prep: (1) Practice on the Assessments tab, (2) Download Aptitude Handbook from Resources, (3) Take Daily MCQ tests in Training.',
  zoho: '🚀 Zoho drive is on 25 July 2025 for Software Developer roles. CTC: ₹6.5 LPA. Requires strong coding skills, no arrears.',
  wipro: '🔷 Wipro Elite drive on 25 Aug 2025. Role: Elite Developer | CTC: ₹6.5 LPA. Rounds: Online Assessment → Tech Interview → HR.',
  interview: '🎤 Use the Mock Interview section to practice! Includes HR, Technical, and Behavioral question sets with company-specific tips.',
  hello: '👋 Hello Jayasurya! Ask me about upcoming drives, resume tips, interview prep, or company eligibility!',
  thank: "😊 You're welcome! Best of luck with your placement journey!",
};

const getFallback = (query) => {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (q.includes(key)) return response;
  }
  return `I understand you're asking about "${query}". Check the relevant section — Drive Calendar, Resume Workspace, Training, or Assessments. Feel free to ask me anything else! 💡`;
};

const getTimeString = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

const BotAvatar = () => (
  <div style={{
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, var(--primary-maroon) 0%, #9B1B30 100%)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '800', letterSpacing: '-0.5px', boxShadow: '0 2px 8px rgba(122,0,0,0.3)',
  }}>
    AI
  </div>
);

const UserAvatar = () => (
  <div style={{
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  </div>
);

export default function ChatbotView() {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isApiMode, setIsApiMode] = useState(!!GEMINI_API_KEY);
  const [messages, setMessages] = useState([
    {
      id: 1, sender: 'bot', time: '10:24 AM',
      text: `Hello Jayasurya! 👋 I'm your **AIT Placement Assistant** powered by ${GEMINI_API_KEY ? 'Gemini AI' : 'Smart Responses'}.\n\nAsk me anything about upcoming drives, resume tips, interview prep, or company details!`,
    },
  ]);

  const quickPrompts = [
    '📅 Upcoming drives this month',
    '📄 Resume improvement tips',
    '🏢 TCS drive details',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const callGeminiAPI = async (userMessage) => {
    const conversationHistory = messages.map(m => ({
      role: m.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood! I am the AIT Placement Assistant, ready to help Jayasurya with placement-related queries.' }] },
        ...conversationHistory,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini API');
    return text.trim();
  };

  const sendMessage = async (text) => {
    const trimmed = (text !== undefined ? text : inputValue).trim();
    if (!trimmed || isTyping) return;

    const userMsg = { id: Date.now(), sender: 'user', text: trimmed, time: getTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      let botText;
      if (GEMINI_API_KEY) {
        botText = await callGeminiAPI(trimmed);
      } else {
        // Simulate delay for fallback
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
        botText = getFallback(trimmed);
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText, time: getTimeString() }]);
    } catch (err) {
      console.error('Gemini API Error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot', time: getTimeString(),
        text: `⚠️ AI response unavailable (${err.message}). Falling back to smart responses.\n\n${getFallback(trimmed)}`,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderText = (text) => {
    // Simple bold markdown support
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*([^*]+)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* API mode badge */}
      <div style={{
        padding: '4px 14px 8px',
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '10.5px', fontWeight: '700',
        color: GEMINI_API_KEY ? '#16A34A' : '#D97706',
        borderBottom: '1px solid #F1F5F9',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          backgroundColor: GEMINI_API_KEY ? '#22C55E' : '#F59E0B',
          display: 'inline-block', flexShrink: 0,
        }} />
        {GEMINI_API_KEY ? '● Gemini AI Connected' : '● Smart Response Mode'}
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
        display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', alignItems: 'flex-end', gap: '8px',
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
          }}>
            {msg.sender === 'bot' ? <BotAvatar /> : <UserAvatar />}
            <div style={{ maxWidth: '74%' }}>
              <div style={{
                padding: '10px 13px',
                borderRadius: msg.sender === 'bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                backgroundColor: msg.sender === 'bot' ? '#F8FAFC' : 'var(--primary-maroon)',
                color: msg.sender === 'bot' ? '#1E293B' : '#fff',
                fontSize: '12.5px', lineHeight: '1.6', fontWeight: '500',
                border: msg.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                {renderText(msg.text)}
              </div>
              <div style={{
                fontSize: '10px', color: '#94A3B8', marginTop: '3px', fontWeight: '500',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <BotAvatar />
            <div style={{
              padding: '11px 14px', borderRadius: '16px 16px 16px 4px',
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: 'var(--primary-maroon)',
                  animation: 'chatDot 1.2s infinite',
                  animationDelay: `${i * 0.2}s`,
                  display: 'inline-block', opacity: 0.5,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 12px 4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => sendMessage(p)}
            disabled={isTyping}
            style={{
              fontSize: '11px', fontWeight: '600', padding: '5px 10px',
              borderRadius: '20px', border: '1.5px solid rgba(122,0,0,0.3)',
              color: 'var(--primary-maroon)', backgroundColor: '#FFF5F5',
              cursor: isTyping ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
              opacity: isTyping ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.backgroundColor = 'var(--primary-maroon)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary-maroon)'; }}}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFF5F5'; e.currentTarget.style.color = 'var(--primary-maroon)'; e.currentTarget.style.borderColor = 'rgba(122,0,0,0.3)'; }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        padding: '10px 12px 12px', borderTop: '1px solid #F1F5F9',
        display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#fff',
      }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={GEMINI_API_KEY ? 'Ask Gemini AI anything...' : 'Ask anything about placement...'}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '24px',
            border: '1.5px solid #E2E8F0', fontSize: '12.5px', fontWeight: '500',
            outline: 'none', backgroundColor: '#F8FAFC', fontFamily: 'inherit', color: '#1E293B',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary-maroon)'; }}
          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
        />
        <button
          onClick={() => sendMessage(undefined)}
          disabled={!inputValue.trim() || isTyping}
          style={{
            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
            background: inputValue.trim() && !isTyping
              ? 'linear-gradient(135deg, var(--primary-maroon), #9B1B30)'
              : '#E2E8F0',
            color: inputValue.trim() && !isTyping ? '#fff' : '#94A3B8',
            border: 'none', cursor: inputValue.trim() && !isTyping ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', boxShadow: inputValue.trim() && !isTyping ? '0 2px 10px rgba(122,0,0,0.3)' : 'none',
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
          </svg>
        </button>
      </div>

      {/* Dot animation CSS */}
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
