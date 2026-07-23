/**
 * @file ChatbotWidget.jsx
 * @description Floating AI Chatbot widget for the AIT Placement Management Portal.
 *
 * This component provides a fully interactive chat interface powered by the
 * Google Gemini API (gemini-2.0-flash model). When no API key is available,
 * it automatically falls back to a built-in smart response engine covering
 * common placement queries.
 *
 * Features:
 *  - Multi-turn conversation (full history sent to Gemini on each request)
 *  - Placement-specific system prompt (drives, companies, resume, interview tips)
 *  - Quick-prompt chips for one-tap common questions
 *  - Animated typing indicator (3 bouncing dots)
 *  - Bold markdown support in bot messages (**text**)
 *  - Live API status badge (Gemini AI Connected / Smart Response Mode)
 *
 * Usage:
 *  Set VITE_GEMINI_API_KEY=your_key in .env to enable live AI responses.
 *  Without a key, the component works entirely offline using FALLBACK_RESPONSES.
 *
 * @author AIT Placement Portal Team
 */

import React, { useState, useRef, useEffect } from 'react';

// ─── API Configuration ─────────────────────────────────────────────────────────
/**
 * Gemini API key loaded from environment variable.
 * Set VITE_GEMINI_API_KEY in your .env file to enable live AI responses.
 * If empty, the component uses local FALLBACK_RESPONSES instead.
 */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// ─── Gemini System Prompt ──────────────────────────────────────────────────────
/**
 * System-level instruction sent at the start of every Gemini API call.
 * Defines the AI persona, scope, tone, and student context.
 * This ensures the AI stays focused on placement-related topics.
 */
const SYSTEM_PROMPT = (userName) => `You are "AIT Placement Assistant", an expert AI chatbot embedded inside the AIT College Placement Management Portal.
You help the student named ${userName} (B.Tech IT, IV Year, CGPA 8.74) with:
- Upcoming campus drive schedules (TCS on 20 Jul, Zoho on 25 Jul, Infosys on 30 Jul 2025)
- Resume tips and ATS optimization
- Interview preparation strategies
- Aptitude & coding test tips
- Company eligibility criteria
- Placement statistics and leaderboard info

Always respond concisely, in a friendly and professional tone. Keep answers under 4 sentences unless asked for details.
Use emojis sparingly to make responses feel warm. Prioritize placement-relevant information.
If asked something outside placement scope, gently redirect to placement topics.`;

// ─── Offline Fallback Responses ────────────────────────────────────────────────
/**
 * Pre-written responses for common placement queries.
 * Used when GEMINI_API_KEY is not set, or when the API call fails.
 * Keys are partial keywords matched against the user's input (case-insensitive).
 */
const FALLBACK_RESPONSES = {
  tcs:       'The next TCS drive is on 20 July 2025. It includes Online Test (Aptitude + Coding), TR, MR, and HR rounds. Registration closes on 18 July 2025. 📅',
  resume:    '🔍 Use the AI Resume Analyzer in the Resume Workspace tab! It gives ATS score, keyword analysis, and rewrites weak bullet points using the STAR method.',
  infosys:   '📋 Infosys eligibility: Minimum 6.5 CGPA, No active backlogs, 60% throughout academics. Drive scheduled for 30 July 2025.',
  compan:    '🏢 Companies this month: TCS (20 Jul), Zoho (25 Jul), Infosys (30 Jul). Check Drive Calendar for full details.',
  aptitude:  '📚 For aptitude prep: (1) Practice on the Assessments tab, (2) Download Aptitude Handbook from Resources, (3) Take Daily MCQ tests in Training.',
  zoho:      '🚀 Zoho drive is on 25 July 2025 for Software Developer roles. CTC: ₹6.5 LPA. Requires strong coding skills, no arrears.',
  wipro:     '🔷 Wipro Elite drive on 25 Aug 2025. Role: Elite Developer | CTC: ₹6.5 LPA. Rounds: Online Assessment → Tech Interview → HR.',
  interview: '🎤 Use the Mock Interview section to practice! Includes HR, Technical, and Behavioral question sets with company-specific tips.',
  hello:     '👋 Hello Jayasurya! Ask me about upcoming drives, resume tips, interview prep, or company eligibility!',
  thank:     "😊 You're welcome! Best of luck with your placement journey!",
};

/**
 * Matches the user's query against FALLBACK_RESPONSES keyword map.
 * Returns the first matched response, or a generic fallback message.
 *
 * @param {string} query - The raw user input string
 * @returns {string} - A relevant placement response
 */
const getFallback = (query, userName = 'Jayasurya K') => {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (q.includes(key)) {
      return key === 'hello'
        ? `👋 Hello ${userName}! Ask me about upcoming drives, resume tips, interview prep, or company eligibility!`
        : response;
    }
  }
  return `I understand you're asking about "${query}". Check the relevant section — Drive Calendar, Resume Workspace, Training, or Assessments. Feel free to ask me anything else! 💡`;
};

// ─── Utility Helpers ───────────────────────────────────────────────────────────
/**
 * Returns the current time formatted as "HH:MM AM/PM".
 * Used as the timestamp shown beneath each chat message.
 *
 * @returns {string} - e.g. "03:45 PM"
 */
const getTimeString = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

// ─── Avatar Components ─────────────────────────────────────────────────────────
/**
 * Bot avatar — maroon gradient circle with "AI" text.
 * Shown to the left of every bot message bubble.
 */
const BotAvatar = () => (
  <div style={{
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, var(--primary-maroon) 0%, #9B1B30 100%)',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(122,0,0,0.3)',
  }}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
      <path d="M12 2v3" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
      <rect x="4" y="5" width="16" height="13" rx="4" />
      <path d="M1 11.5h3" />
      <path d="M20 11.5h3" />
      <circle cx="9" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M9 14.5h6" />
      <path d="M9 18v2.5" />
      <path d="M15 18v2.5" />
    </svg>
  </div>
);

/**
 * User avatar — slate gradient circle with a person icon.
 * Shown to the right of every user message bubble.
 */
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

// ─── Main Component ────────────────────────────────────────────────────────────
/**
 * ChatbotView — main chatbot UI rendered inside the floating panel.
 *
 * State:
 *  - messages      : Array of chat message objects { id, sender, text, time }
 *  - inputValue    : Current text in the message input box
 *  - isTyping      : Whether the bot is currently "thinking" (shows dot animation)
 *
 * Key functions:
 *  - callGeminiAPI : Sends multi-turn chat history to the Gemini REST API
 *  - sendMessage   : Handles both typed input and quick-prompt button clicks
 *  - renderText    : Converts **bold** markdown to <strong> tags in bot messages
 */
export default function ChatbotView({ userName = 'Jayasurya K' }) {
  const messagesEndRef = useRef(null); // Scroll anchor — always stays at bottom of message list
  const inputRef = useRef(null);       // Reference to the text input element

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Unused state kept for potential future toggle UI — tracks whether Gemini API is active
  const [isApiMode, setIsApiMode] = useState(!!GEMINI_API_KEY);

  // Initial greeting message shown when the chatbot opens
  const [messages, setMessages] = useState([
    {
      id: 1, sender: 'bot', time: '10:24 AM',
      text: `Hello ${userName}! 👋 I'm your **AIT Placement Assistant** powered by ${GEMINI_API_KEY ? 'Gemini AI' : 'Smart Responses'}.\n\nAsk me anything about upcoming drives, resume tips, interview prep, or company details!`,
    },
  ]);

  // Pre-defined one-tap quick prompt suggestions shown above the input bar
  const quickPrompts = [
    '📅 Upcoming drives this month',
    '📄 Resume improvement tips',
    '🏢 TCS drive details',
  ];

  // Auto-scroll to the bottom whenever a new message or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── API Call ───────────────────────────────────────────────────────────────
  /**
   * Sends the full conversation history + new user message to the Gemini API.
   * Uses multi-turn format: system prompt → conversation history → new user message.
   *
   * @param {string} userMessage - The latest message typed by the user
   * @returns {Promise<string>} - The AI-generated response text
   * @throws {Error} - Throws if the HTTP response is not OK or response text is empty
   */
  const callGeminiAPI = async (userMessage) => {
    // Build conversation history in Gemini's required role/parts format
    const conversationHistory = messages.map(m => ({
      role: m.sender === 'bot' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const requestBody = {
      contents: [
        // Inject system prompt as the first user turn (Gemini 1.5+ supports system role)
        { role: 'user', parts: [{ text: SYSTEM_PROMPT(userName) }] },
        // Acknowledge system prompt as model to complete the turn pair
        { role: 'model', parts: [{ text: 'Understood! I am the AIT Placement Assistant, ready to help Jayasurya with placement-related queries.' }] },
        // Append full past conversation for multi-turn memory
        ...conversationHistory,
        // Add the latest user message
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,       // Balanced creativity — not too random, not too rigid
        maxOutputTokens: 300,   // Keep responses concise and suitable for the small chat panel
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

  // ── Send Message Handler ───────────────────────────────────────────────────
  /**
   * Handles sending a message — works for both typed input and quick-prompt clicks.
   * Shows the user message immediately, then fetches the bot response asynchronously.
   * Falls back to FALLBACK_RESPONSES if API key is missing or API call fails.
   *
   * @param {string|undefined} text - Optional pre-filled text (from quick prompts).
   *                                   If undefined, uses the current inputValue state.
   */
  const sendMessage = async (text) => {
    const trimmed = (text !== undefined ? text : inputValue).trim();
    if (!trimmed || isTyping) return; // Ignore empty or duplicate sends

    // Immediately render the user's message in the UI
    const userMsg = { id: Date.now(), sender: 'user', text: trimmed, time: getTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true); // Show typing dots indicator

    try {
      let botText;
      if (GEMINI_API_KEY) {
        // Live AI mode — call the Gemini REST API
        botText = await callGeminiAPI(trimmed);
      } else {
        // Offline mode — simulate a short delay then use keyword-based response
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
        botText = getFallback(trimmed, userName);
      }
      // Add successful bot reply to the message list
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botText, time: getTimeString() }]);
    } catch (err) {
      // API failed — log the error and still provide a useful fallback response
      console.error('Gemini API Error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, sender: 'bot', time: getTimeString(),
        text: `⚠️ AI response unavailable (${err.message}). Falling back to smart responses.\n\n${getFallback(trimmed, userName)}`,
      }]);
    } finally {
      setIsTyping(false); // Always hide the typing indicator when done
    }
  };

  /**
   * Keyboard handler for the input field.
   * Submits the message when the user presses Enter (without Shift).
   * Shift+Enter is reserved for multiline input (though not currently used).
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Text Renderer ──────────────────────────────────────────────────────────
  /**
   * Converts plain text with basic markdown into React elements.
   * Supports:
   *  - **bold text** → <strong>bold text</strong>
   *  - newline characters → <br /> line breaks
   *
   * @param {string} text - The raw message text (may contain ** and \n)
   * @returns {React.ReactNode} - Rendered JSX with formatting applied
   */
  const renderText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*([^*]+)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── API Status Badge ─────────────────────────────────────────────── */}
      {/* Shows whether Gemini AI is active or Smart Response mode is used */}
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

      {/* ── Message List ─────────────────────────────────────────────────── */}
      {/* Scrollable area displaying all chat messages with sender avatars */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
        display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex', alignItems: 'flex-end', gap: '8px',
            // Reverse row direction for user messages so they appear on the right
            flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Show appropriate avatar based on message sender */}
            {msg.sender === 'bot' ? <BotAvatar /> : <UserAvatar />}

            <div style={{ maxWidth: '74%' }}>
              {/* Message bubble — different colors for bot vs user */}
              <div style={{
                padding: '10px 13px',
                // Bot: flat bottom-left corner; User: flat bottom-right corner
                borderRadius: msg.sender === 'bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                backgroundColor: msg.sender === 'bot' ? '#F8FAFC' : 'var(--primary-maroon)',
                color: msg.sender === 'bot' ? '#1E293B' : '#fff',
                fontSize: '12.5px', lineHeight: '1.6', fontWeight: '500',
                border: msg.sender === 'bot' ? '1px solid #E2E8F0' : 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                {renderText(msg.text)}
              </div>

              {/* Timestamp shown below each bubble */}
              <div style={{
                fontSize: '10px', color: '#94A3B8', marginTop: '3px', fontWeight: '500',
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* ── Typing Indicator ───────────────────────────────────────────── */}
        {/* Shown while waiting for Gemini API response or fallback delay */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <BotAvatar />
            <div style={{
              padding: '11px 14px', borderRadius: '16px 16px 16px 4px',
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
              display: 'flex', gap: '4px', alignItems: 'center',
            }}>
              {/* Three animated dots with staggered delays for bounce effect */}
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

        {/* Invisible anchor element — always scrolled into view when new messages arrive */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompt Chips ────────────────────────────────────────────── */}
      {/* One-tap shortcut buttons for common placement questions */}
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

      {/* ── Input Bar ─────────────────────────────────────────────────────── */}
      {/* Text input + Send button. Enter key or button click sends the message */}
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
        {/* Send button — active (maroon) only when there is input text */}
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
          {/* Paper-plane send icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/>
          </svg>
        </button>
      </div>

      {/* ── Keyframe Styles ───────────────────────────────────────────────── */}
      {/* chatDot: used for the 3-dot typing indicator bounce animation */}
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
