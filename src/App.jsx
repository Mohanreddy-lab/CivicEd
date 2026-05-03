import { useState, useRef, useEffect, memo } from 'react'
import { factCheckDB, knowledgeBase, refusalTopics } from './data'
import './App.css'

// -------------------------------------------------------------
// Telemetry Ticker
// -------------------------------------------------------------
const TelemetryTicker = memo(() => {
  const [telemetry, setTelemetry] = useState({
    registrations: 42105,
    stations: 98.4,
    claims: 142
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        registrations: prev.registrations + Math.floor(Math.random() * 3),
        stations: Math.min(100, prev.stations + (Math.random() * 0.1 - 0.05)),
        claims: prev.claims + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#000000] border-b-2 border-[#ff3b30] text-[10px] font-mono text-zinc-500 py-1.5 px-4 overflow-hidden relative">
      <div className="animate-ticker space-x-12 whitespace-nowrap">
        <span className="text-[#00ff41] font-bold">SYS.STAT: ONLINE</span>
        <span>ACTIVE_REGISTRATIONS: {telemetry.registrations.toLocaleString()}</span>
        <span>POLLING_STATIONS_REPORTING: {telemetry.stations.toFixed(1)}%</span>
        <span>CLAIMS_ANALYZED: {telemetry.claims}</span>
        <span className="text-[#00ff41]">SECURE_CONN: ESTABLISHED</span>
        
        <span className="text-[#00ff41] font-bold">SYS.STAT: ONLINE</span>
        <span>ACTIVE_REGISTRATIONS: {telemetry.registrations.toLocaleString()}</span>
        <span>POLLING_STATIONS_REPORTING: {telemetry.stations.toFixed(1)}%</span>
        <span>CLAIMS_ANALYZED: {telemetry.claims}</span>
        <span className="text-[#00ff41]">SECURE_CONN: ESTABLISHED</span>
      </div>
      <div className="scanline-overlay"></div>
    </div>
  );
});

// -------------------------------------------------------------
// Typewriter Chat Message
// -------------------------------------------------------------
const TypewriterMessage = memo(({ text, isTyping }) => {
  const [displayedText, setDisplayedText] = useState(isTyping ? '' : text);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    const typeInterval = setInterval(() => {
      let nextText = text.substring(0, i + 1);
      if (text.charAt(i) === '<') {
        const closeIdx = text.indexOf('>', i);
        if (closeIdx !== -1) {
          i = closeIdx;
          nextText = text.substring(0, i + 1);
        }
      }
      
      if (i >= text.length - 1) {
        clearInterval(typeInterval);
        setDisplayedText(text);
      } else {
        setDisplayedText(nextText);
      }
      i++;
    }, 15);

    return () => clearInterval(typeInterval);
  }, [text, isTyping]);

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: displayedText }} />
      {isTyping && displayedText !== text && <span className="typewriter-cursor"></span>}
    </>
  );
});

// -------------------------------------------------------------
// Chat Terminal Component (Upgraded with Async / Commands)
// -------------------------------------------------------------
const ChatTerminal = memo(() => {
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('civicEd_chatHistory_v2');
    return saved ? JSON.parse(saved) : [
      { id: 1, role: 'bot', text: 'INITIATING NEUTRAL CIVIC AI...\n\nHello. I am the CivicEd System. I explain election processes and democratic principles. Type `/help` for system commands or ask a question.', isTyping: false }
    ];
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('civicEd_chatHistory_v2', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const getBotResponse = (text) => {
    const lower = text.toLowerCase().trim();
    
    // System Commands
    if (lower === '/clear') return 'CLEAR_CMD';
    if (lower === '/help') return '<strong>SYSTEM COMMANDS:</strong><br>/help - Show this menu<br>/status - Display system diagnostics<br>/clear - Wipe terminal history';
    if (lower === '/status') return '<strong>SYSTEM DIAGNOSTICS:</strong><br>AI_CORE: ONLINE<br>NEUTRALITY_LOCK: ENGAGED<br>LIVE_DATA_FEED: DISCONNECTED (Simulated Mode)<br>LATENCY: 42ms';

    if (refusalTopics.some(t => lower.includes(t))) {
      return `[SECURITY OVERRIDE]\nI am designed strictly for <strong>election process education</strong>.<br><br>I cannot suggest how to vote, recommend any party or candidate, or express any political opinion. Your vote is your private decision.`;
    }
    
    if (lower.includes('gerrymandering')) return knowledgeBase.gerrymandering.a;
    if (lower.includes('electoral college')) return knowledgeBase.electoralcollege.a;
    if (lower.includes('municipal') || lower.includes('corporator')) return knowledgeBase.municipal.a;
    if (lower.includes('chief minister') || lower.includes('cm') || lower.includes('mla')) return knowledgeBase.cm_selection.a;
    if (lower.includes('count') || lower.includes('tabulat')) return knowledgeBase.counting.a;
    if (lower.includes('security') || lower.includes('paper') || lower.includes('vvpat')) return knowledgeBase.security.a;
    if (lower.includes('secret') || lower.includes('private')) {
      return `<strong>The Secret Ballot</strong><br><br>The secret ballot is a cornerstone of modern democracy. It means:<br>• <strong>Your vote is private.</strong> No record links your name to your specific vote.<br>• <strong>No one can demand to know</strong> how you voted.`;
    }
    
    return `Query logged. While I don't have a specific pre-loaded module for this topic, here is how to get accurate information:<br><br>1. <strong>Official source:</strong> Your national or local election commission website<br>2. <strong>Civic organizations:</strong> Non-partisan groups like the League of Women Voters<br><br>Try typing <code>/help</code> or asking about <em>ballot counting</em> or <em>election security.</em>`;
  };

  const handleSendChat = () => {
    if (!chatInput.trim() || isProcessing) return;
    
    const rawText = chatInput;
    const newUserMsg = { id: Date.now(), role: 'user', text: rawText, isTyping: false };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsProcessing(true);
    
    // Simulate Async API Request to an LLM
    setTimeout(() => {
      const response = getBotResponse(rawText);
      
      if (response === 'CLEAR_CMD') {
        setChatMessages([{ id: Date.now(), role: 'bot', text: 'Terminal history wiped. System ready.', isTyping: true }]);
      } else {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: response, isTyping: true }]);
      }
      setIsProcessing(false);
    }, 1200); // Simulated network latency
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-2 border-[#111] bg-[#050505] shadow-[8px_8px_0px_#ff3b30] flex flex-col h-[500px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff3b30] to-transparent opacity-50"></div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5 border-b-2 border-[#222]">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`max-w-[85%] ${msg.role === 'bot' ? 'self-start' : 'self-end'}`}>
              <div className={`text-[10px] tracking-[0.15em] mb-1.5 font-mono font-bold ${msg.role === 'bot' ? 'text-[#ff3b30]' : 'text-[#00ff41]'}`}>
                {msg.role === 'bot' ? '> CIVICED_SYS_AI' : '> USER_INPUT'}
              </div>
              <div className={`p-4 text-[14px] leading-relaxed border-l-4 ${msg.role === 'bot' ? 'bg-[#111] border-[#ff3b30] text-[#e8e4dc]' : 'bg-[#1a1a1a] border-[#00ff41] text-[#e8e4dc]'}`}>
                <TypewriterMessage text={msg.text} isTyping={msg.isTyping} />
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="self-start max-w-[85%]">
               <div className="text-[10px] tracking-[0.15em] mb-1.5 font-mono font-bold text-[#ff3b30]">&gt; CIVICED_SYS_AI</div>
               <div className="p-4 text-[14px] border-l-4 bg-[#111] border-[#ff3b30] text-zinc-500 font-mono animate-pulse">
                 AWAITING_API_RESPONSE...
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex flex-col md:flex-row p-4 bg-[#0a0a0a]">
          <input 
            type="text" 
            className="flex-1 bg-[#111] border-2 border-[#333] md:border-r-0 text-[#00ff41] font-mono text-[14px] px-4 py-3 outline-none focus:border-[#ff3b30] placeholder-zinc-600 focus:bg-[#000]"
            placeholder={isProcessing ? "> SYSTEM LOCKED..." : "> INITIATE QUERY OR COMMAND (/help)..."}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            disabled={isProcessing}
          />
          <button 
            className={`px-8 py-3 font-mono text-[14px] font-black tracking-widest uppercase transition-colors mt-2 md:mt-0 border-2 ${isProcessing ? 'bg-zinc-800 text-zinc-500 border-zinc-800' : 'bg-[#ff3b30] text-black border-[#ff3b30] hover:bg-white hover:border-white'}`}
            onClick={handleSendChat}
            disabled={isProcessing}
          >EXECUTE</button>
        </div>
      </div>
    </div>
  );
});

// -------------------------------------------------------------
// Fact Check Component
// -------------------------------------------------------------
const FactCheck = memo(() => {
  const [fcInput, setFcInput] = useState('');
  const [fcResult, setFcResult] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fcHistory, setFcHistory] = useState(() => {
    const saved = localStorage.getItem('civicEd_fcHistory_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('civicEd_fcHistory_v2', JSON.stringify(fcHistory));
  }, [fcHistory]);

  const handleFactCheck = () => {
    if (!fcInput.trim()) return;
    
    setIsParsing(true);
    setFcResult(null);

    setTimeout(() => {
      const lower = fcInput.toLowerCase();
      let match = null;

      for (const entry of factCheckDB) {
        if (entry.keywords.some(k => lower.includes(k))) {
          match = entry;
          break;
        }
      }

      const resultObj = match ? {
        claim: fcInput,
        verdict: match.verdict,
        verdictClass: match.verdictClass,
        explanation: match.explanation,
        timestamp: new Date().toLocaleTimeString()
      } : {
        claim: fcInput,
        verdict: 'INSUFFICIENT DATA',
        verdictClass: 'text-zinc-500 border-zinc-700 bg-zinc-900',
        explanation: `This specific claim is not in our current fact-check database.\nFor accurate information, please consult official election commission websites.\n\n<em>We never classify claims without sufficient factual basis.</em>`,
        timestamp: new Date().toLocaleTimeString()
      };

      setFcResult(resultObj);
      setFcHistory(prev => [resultObj, ...prev].slice(0, 5));
      setIsParsing(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1140px] mx-auto px-6">
      <div className="border-b-4 border-[#111] pb-8 mb-12">
          <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] mb-4 font-black font-mono">MODULE 03</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">Fact Check Matrix</h2>
          <p className="text-lg text-zinc-400 max-w-[600px] font-mono">Claims are processed algorithmically against the updated DB. No political bias.</p>
      </div>
      
      <div className="border-2 border-[#222] p-8 bg-[#0a0a0a] shadow-[8px_8px_0px_#111] mb-12 relative">
        <div className="flex flex-col md:flex-row gap-0">
          <input 
            type="text" 
            className="flex-1 bg-[#000] border-2 border-[#333] md:border-r-0 text-[#00ff41] font-mono text-[16px] px-6 py-4 outline-none focus:border-[#ff3b30] focus:bg-[#050505] placeholder-zinc-700"
            placeholder="> INPUT CLAIM (e.g., 'mail voting fraud')..."
            value={fcInput}
            onChange={(e) => setFcInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFactCheck()}
            disabled={isParsing}
          />
          <button 
            className={`px-8 py-4 font-mono text-[16px] font-black tracking-widest transition-colors uppercase border-2 ${isParsing ? 'bg-zinc-800 text-zinc-500 border-zinc-800' : 'bg-[#ff3b30] text-black border-[#ff3b30] hover:bg-white hover:border-white'}`}
            onClick={handleFactCheck}
            disabled={isParsing}
          >
            {isParsing ? 'PARSING...' : 'ANALYZE'}
          </button>
        </div>
        
        {isParsing && (
          <div className="mt-8 border-2 border-[#ff3b30] p-6 bg-[#111] relative overflow-hidden">
             <div className="absolute inset-0 bg-[#ff3b30]/10 animate-pulse"></div>
             <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] font-black font-mono relative z-10">ANALYZING CLAIM VECTORS...</div>
             <div className="h-2 w-full bg-[#000] mt-4 relative z-10">
                <div className="h-full bg-[#ff3b30] animate-progress"></div>
             </div>
          </div>
        )}

        {fcResult && !isParsing && (
          <div className="mt-8 border-2 border-[#333] p-8 bg-[#000]">
              <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] mb-4 font-black font-mono">
                {fcResult.verdict === 'INSUFFICIENT DATA' ? 'SYSTEM DIAGNOSTIC' : 'VERIFIED OUTPUT'}
              </div>
              <div className="text-[20px] font-bold text-white mb-6 bg-[#111] p-4 border-l-4 border-zinc-700 font-mono italic">
                "{fcResult.claim}"
              </div>
              <div className={`font-mono text-[16px] font-black tracking-widest mb-6 px-4 py-2 inline-block border-2 ${fcResult.verdictClass}`}>
                {fcResult.verdict}
              </div>
              <div className="text-[15px] text-zinc-300 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: fcResult.explanation.replace(/\n/g, '<br>') }} />
          </div>
        )}
      </div>
      
      {fcHistory.length > 0 && (
        <div className="mb-12">
          <div className="text-[12px] tracking-[0.2em] text-zinc-500 mb-4 font-black font-mono">ANALYSIS ARCHIVE</div>
          <div className="border-2 border-[#222] bg-[#000]">
            {fcHistory.map((item, idx) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 px-6 border-b-2 border-[#111] last:border-b-0 gap-4 hover:bg-[#0a0a0a] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-zinc-600 font-mono font-bold w-[80px]">{item.timestamp}</span>
                  <span className="text-[14px] text-zinc-400 truncate max-w-[300px] md:max-w-[500px] font-mono">"{item.claim}"</span>
                </div>
                <div className={`font-mono text-[11px] font-black tracking-widest px-3 py-1 border-2 ${item.verdictClass}`}>
                  {item.verdict}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

// -------------------------------------------------------------
// Live Command Dashboard Component
// -------------------------------------------------------------
const CommandDashboard = memo(() => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const messages = [
      "Voter reg ping: region_alpha ok",
      "Network latency nominal",
      "Tabulation sync initialized",
      "Audit trail verifiable",
      "No anomalies detected in segment 4",
      "Security protocol 8 active"
    ];

    const int = setInterval(() => {
      setLogs(prev => {
        const newLog = `[${new Date().toISOString().split('T')[1].substring(0, 8)}] SYS_EVENT: ${messages[Math.floor(Math.random() * messages.length)]}`;
        return [newLog, ...prev].slice(0, 8);
      });
    }, 2500);

    return () => clearInterval(int);
  }, []);

  return (
    <div className="border-4 border-[#111] p-10 bg-[#000] shadow-[12px_12px_0px_#ff3b30] mb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff3b30] opacity-5 blur-[100px] rounded-full"></div>
      <div className="relative z-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Column: Hero */}
        <div className="flex-1">
          <div className="text-[13px] tracking-[0.2em] text-[#ff3b30] mb-6 font-black font-mono bg-[#111] inline-block px-3 py-1">SYS.BOOT_SUCCESS // V3.0</div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8 text-white uppercase">
            Data Over<br/><span className="text-[#ff3b30]">Rhetoric.</span>
          </h1>
          <p className="text-[16px] text-zinc-400 mb-8 leading-relaxed font-mono max-w-[400px]">
            Civic education terminal expanded. New modules: Security Audits, Tabulation Processing, and Command Level AI.
          </p>
          <div className="grid grid-cols-2 gap-4 font-mono mb-6">
            <div className="bg-[#111] p-4 border-l-4 border-[#00ff41]">
               <div className="text-zinc-500 text-[10px] tracking-widest mb-1">SYSTEM THREAT LEVEL</div>
               <div className="text-[#00ff41] text-2xl font-black">ZERO</div>
            </div>
            <div className="bg-[#111] p-4 border-l-4 border-[#ff3b30]">
               <div className="text-zinc-500 text-[10px] tracking-widest mb-1">DATA INTEGRITY</div>
               <div className="text-[#ff3b30] text-2xl font-black">100%</div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Logs */}
        <div className="flex-1 border-2 border-[#222] bg-[#050505] p-4 flex flex-col">
          <div className="text-[10px] tracking-[0.2em] text-zinc-500 mb-4 font-bold font-mono border-b-2 border-[#111] pb-2 uppercase">
            Live Feed Diagnostics
          </div>
          <div className="flex-1 font-mono text-[12px] text-[#00ff41] flex flex-col gap-2 overflow-hidden opacity-80">
            {logs.length === 0 ? <span className="animate-pulse">Awaiting data stream...</span> : logs.map((log, i) => (
              <div key={i} className={i === 0 ? "text-white font-bold" : ""}>{log}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
});

// -------------------------------------------------------------
// Reading Library Component (Extreme Content)
// -------------------------------------------------------------
const ReadingLibrary = memo(() => {
  return (
    <div className="max-w-[1140px] mx-auto px-6">
      <div className="border-b-4 border-[#111] pb-8 mb-12">
         <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] mb-4 font-black font-mono">MODULE 05</div>
         <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">Master Curriculum</h2>
         <p className="text-lg text-zinc-400 max-w-[600px] font-mono">Encyclopedia-grade deep dives into the technical mechanics of the State.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <article className="border-4 border-[#111] bg-[#000] p-8 shadow-[12px_12px_0px_#111] flex flex-col h-[600px]">
          <div className="text-[10px] text-[#ff3b30] tracking-[0.2em] font-mono mb-4 font-bold border-b-2 border-[#222] pb-4">FILE: 001 // CONSTITUTIONAL ARCHITECTURE</div>
          <h3 className="text-2xl font-black text-white uppercase mb-6 leading-tight">The Separation of Powers</h3>
          <div className="text-[14px] text-zinc-300 leading-relaxed space-y-4 font-sans flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <p>To prevent the concentration of absolute power and the inevitable descent into authoritarianism, modern democratic states employ a strict <strong>Separation of Powers</strong> framework. The state's power is fractured into three distinct, co-equal branches.</p>
            <div className="text-[#00ff41] font-mono text-[12px] p-3 bg-[#111] border-l-2 border-[#00ff41]">
              <strong>1. THE LEGISLATURE:</strong> The lawmakers. Comprising elected officials (Parliament/Congress), their sole duty is to draft, debate, and pass the legal code of the nation. They hold the "power of the purse," meaning they alone can authorize taxation and government spending.
            </div>
            <div className="text-[#00ffff] font-mono text-[12px] p-3 bg-[#111] border-l-2 border-[#00ffff]">
              <strong>2. THE EXECUTIVE:</strong> The operators. Led by the Prime Minister/President and their cabinet, this branch executes the laws passed by the legislature. They command the military, direct the police, and manage the sprawling bureaucracy of government agencies.
            </div>
            <div className="text-[#ff3b30] font-mono text-[12px] p-3 bg-[#111] border-l-2 border-[#ff3b30]">
              <strong>3. THE JUDICIARY:</strong> The arbiters. The network of courts, capped by a Supreme Court. They interpret the laws. Crucially, they possess the power of <em>Judicial Review</em>—the authority to strike down laws passed by the Legislature if they violate the fundamental Constitution.
            </div>
            <p className="mt-4">This tripartite system operates on intense <strong>Checks and Balances</strong>. The Legislature can impeach the Executive; the Executive can veto the Legislature; the Judiciary can declare both unconstitutional. This deliberate friction guarantees that no single entity can execute sovereign authority without resistance.</p>
          </div>
        </article>

        <article className="border-4 border-[#111] bg-[#000] p-8 shadow-[12px_12px_0px_#111] flex flex-col h-[600px]">
          <div className="text-[10px] text-[#ff3b30] tracking-[0.2em] font-mono mb-4 font-bold border-b-2 border-[#222] pb-4">FILE: 002 // PROCEDURAL LOGIC</div>
          <h3 className="text-2xl font-black text-white uppercase mb-6 leading-tight">The Lifecycle of Legislation</h3>
          <div className="text-[14px] text-zinc-300 leading-relaxed space-y-4 font-sans flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <p>How does a conceptual idea transition into the enforceable law of the land? The legislative pipeline is a rigorous, multi-stage filtration system designed to eliminate flawed policies.</p>
            <ol className="list-decimal pl-6 space-y-4 marker:text-[#ff3b30] marker:font-bold">
              <li><strong>The Draft (The Bill):</strong> Legislation begins as a "Bill." It can be introduced by a sitting government minister (a Public Bill) or a regular member (a Private Member's Bill). It contains the exact legal language proposed.</li>
              <li><strong>First Reading:</strong> A formal introduction. The Bill's title is read on the floor of the assembly. No debate occurs here; it is merely injected into the legislative queue.</li>
              <li><strong>Committee Stage (The Crucible):</strong> The Bill is routed to a specialized Parliamentary Committee (e.g., the Defense Committee or Finance Committee). Here, experts, bureaucrats, and rival politicians dissect the text line-by-line, exposing loopholes and proposing amendments.</li>
              <li><strong>Second Reading & Debate:</strong> The amended Bill returns to the main floor. This is where ideological warfare occurs. Opposing parties debate the fundamental merits of the Bill. Modifications are voted upon.</li>
              <li><strong>Third Reading & Final Vote:</strong> The final, finalized text is presented. A simple majority (50% + 1) must vote "YEA" for the Bill to survive.</li>
              <li><strong>Executive Assent:</strong> If it passes all legislative chambers, the Head of State (President/Monarch) must officially sign it. Only upon this signature does the Bill permanently mutate into an enforceable <strong>Act</strong>.</li>
            </ol>
          </div>
        </article>
      </div>

    </div>
  );
});

// -------------------------------------------------------------
// Main App Component
// -------------------------------------------------------------
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [processTab, setProcessTab] = useState('local');

  return (
    <div className="bg-[#050505] text-zinc-300 font-sans min-h-screen flex flex-col theme-brutalist">
      <TelemetryTicker />
      
      <header className="sticky top-0 z-50 bg-[#000000] border-b-2 border-[#111]">
        <div className="max-w-[1140px] mx-auto px-6 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[18px] font-black tracking-widest text-white">
            <span className="text-[#ff3b30] text-[16px]">■</span>
            <span>CIVIC<strong className="text-[#ff3b30]">ED</strong></span>
            <span className="ml-3 text-[10px] border border-[#ff3b30] text-[#ff3b30] px-1.5 py-0.5 tracking-tighter">v4.0_CMD</span>
          </div>
          <nav className="hidden md:flex flex-1 ml-8 h-full">
            {['home', 'process', 'myths', 'faq', 'library'].map((sec) => (
              <button 
                key={sec}
                className={`block px-6 h-full text-[13px] font-black font-mono transition-colors tracking-widest uppercase border-x-2 border-[#111] -ml-[2px] ${activeSection === sec ? 'bg-[#ff3b30] text-black' : 'text-zinc-500 hover:bg-[#111] hover:text-white'}`}
                onClick={() => setActiveSection(sec)}
              >
                {sec === 'home' ? 'Sys.Overview' : sec === 'process' ? 'Mechanics' : sec === 'myths' ? 'Fact Matrix' : sec === 'faq' ? 'AI Terminal' : 'Library'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 md:py-20">
        {activeSection === 'home' && (
          <section className="animate-fade-in">
            <div className="max-w-[1140px] mx-auto px-6">
              <CommandDashboard />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-[#111] bg-[#000]">
                {[
                  { stat: '18+', desc: 'UNIVERSAL VOTING AGE' },
                  { stat: '0%', desc: 'POLITICAL BIAS DETECTED' },
                  { stat: '100%', desc: 'LOGIC ENFORCEMENT' },
                  { stat: '256', desc: 'ENCRYPTION PROTOCOL' }
                ].map((item, i) => (
                  <div key={i} className="p-8 border-b-2 border-[#111] md:border-b-0 md:border-r-2 last:border-r-0 hover:bg-[#0a0a0a] transition-colors group cursor-pointer" onClick={() => setActiveSection('process')}>
                    <div className="text-5xl font-black text-[#ff3b30] mb-2 font-mono group-hover:scale-110 transition-transform origin-left">{item.stat}</div>
                    <div className="text-[11px] text-zinc-500 font-bold tracking-[0.1em] font-mono">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'process' && (
          <section className="animate-fade-in">
             <div className="max-w-[1140px] mx-auto px-6">
                <div className="border-b-4 border-[#111] pb-8 mb-12">
                   <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] mb-4 font-black font-mono">MODULE 02</div>
                   <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">System Mechanics</h2>
                   <p className="text-lg text-zinc-400 max-w-[600px] font-mono">Procedural breakdown of democratic election protocols.</p>
                </div>
                
                <div className="flex flex-wrap border-b-2 border-[#111] mb-12 bg-[#000]">
                  {[
                    { id: 'local', label: 'LOCAL (CITY)' },
                    { id: 'state', label: 'STATE LEVEL' },
                    { id: 'national', label: 'NATIONAL LEVEL' }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      className={`px-6 py-4 font-mono text-[13px] font-black tracking-widest border-b-4 transition-colors uppercase ${processTab === tab.id ? 'border-[#ff3b30] text-white bg-[#111]' : 'border-transparent text-zinc-600 hover:text-zinc-300 hover:bg-[#0a0a0a]'}`}
                      onClick={() => setProcessTab(tab.id)}
                    >{tab.label}</button>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  {processTab === 'local' && (
                    <div className="bg-[#000] border-l-4 border-[#ff3b30] p-8 border-y-2 border-r-2 border-[#111] shadow-[8px_8px_0px_#111]">
                      <div className="text-[12px] font-black text-[#ff3b30] tracking-[0.2em] font-mono mb-4">LEVEL 1: MUNICIPAL ADMINISTRATION</div>
                      <h3 className="text-3xl font-black text-white uppercase mb-6">Corporators & Mayoral Authority</h3>
                      <p className="text-zinc-300 font-sans text-lg leading-relaxed mb-8">
                        The bedrock of democratic infrastructure occurs at the municipal grid level. The urban geography is mathematically partitioned into electoral zones designated as <strong>Wards</strong>. The electorate delegates localized sovereignty to a single representative per ward, classified as the <strong>Corporator</strong>. 
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#111] border-l-2 border-[#00ff41] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#00ff41] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Executive Functions</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Sanitation and waste management grid execution.</li>
                            <li>Maintenance of micro-infrastructure (potable water pipelines, localized roadways).</li>
                            <li>Zoning enforcement and localized urban planning authorization.</li>
                          </ul>
                        </div>
                        <div className="bg-[#111] border-l-2 border-[#ff3b30] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#ff3b30] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Financial Authority</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Authorization of municipal property tax brackets.</li>
                            <li>Allocation of the hyper-local ward development fund.</li>
                            <li>Approval of municipal bond issuances for civic projects.</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-zinc-400 font-mono text-[12px] leading-relaxed border-t border-[#333] pt-6">
                        <strong>MAYORAL PROTOCOL:</strong> The aggregate body of Corporators forms the Municipal Corporation. This body executes an internal secondary election to appoint the <strong>Mayor</strong>, who serves as the bureaucratic executive and ceremonial head of the urban grid.
                      </p>
                    </div>
                  )}
                  {processTab === 'state' && (
                    <div className="bg-[#000] border-l-4 border-[#ff3b30] p-8 border-y-2 border-r-2 border-[#111] shadow-[8px_8px_0px_#111]">
                      <div className="text-[12px] font-black text-[#ff3b30] tracking-[0.2em] font-mono mb-4">LEVEL 2: PROVINCIAL SOVEREIGNTY</div>
                      <h3 className="text-3xl font-black text-white uppercase mb-6">Legislative Assembly & Chief Minister</h3>
                      <p className="text-zinc-300 font-sans text-lg leading-relaxed mb-8">
                        State territories are subdivided into macro-districts termed <strong>Constituencies</strong>. The electorate mandates a <strong>Member of Legislative Assembly (MLA)</strong> to represent their demographic block in the State Legislature, drafting and executing provincial law.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#111] border-l-2 border-[#00ff41] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#00ff41] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Legislative Matrix (State List)</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Formulation of the State Police and internal security protocols.</li>
                            <li>Establishment of the provincial public healthcare and hospital network.</li>
                            <li>Regulation of agriculture, state-level commerce, and land tenure.</li>
                          </ul>
                        </div>
                        <div className="bg-[#111] border-l-2 border-[#ff3b30] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#ff3b30] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Executive & Financial Core</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Drafting and ratifying the multi-billion dollar state budget.</li>
                            <li>Management of Value Added Tax (VAT) and state excise duties.</li>
                            <li>Appointment of top-level state bureaucrats and departmental secretaries.</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-zinc-400 font-mono text-[12px] leading-relaxed border-t border-[#333] pt-6">
                        <strong>CHIEF MINISTER PROTOCOL:</strong> The political faction securing a &gt;50% majority of MLA seats assumes executive control. The dominant faction selects an apex leader, formally appointed by the Governor as the <strong>Chief Minister</strong>, who holds supreme operational authority over state machinery.
                      </p>
                    </div>
                  )}
                  {processTab === 'national' && (
                    <div className="bg-[#000] border-l-4 border-[#ff3b30] p-8 border-y-2 border-r-2 border-[#111] shadow-[8px_8px_0px_#111]">
                      <div className="text-[12px] font-black text-[#ff3b30] tracking-[0.2em] font-mono mb-4">LEVEL 3: FEDERAL SUPREMACY</div>
                      <h3 className="text-3xl font-black text-white uppercase mb-6">Parliament & Prime Minister</h3>
                      <p className="text-zinc-300 font-sans text-lg leading-relaxed mb-8">
                        The ultimate tier of democratic architecture. The nation is segmented into massive geopolitical zones. Citizens elect a <strong>Member of Parliament (MP)</strong> to the lower house. This body controls the existential mechanisms of the nation-state.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#111] border-l-2 border-[#00ff41] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#00ff41] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Federal Jurisdiction (Union List)</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Commanding National Defense Forces, Intelligence Agencies, and Nuclear Posture.</li>
                            <li>Executing Foreign Policy, international treaties, and diplomacy.</li>
                            <li>Controlling the Central Bank, currency minting, and interstate commerce.</li>
                          </ul>
                        </div>
                        <div className="bg-[#111] border-l-2 border-[#ff3b30] p-6 shadow-[4px_4px_0px_#000]">
                          <h4 className="text-[#ff3b30] font-bold font-mono text-[11px] mb-3 tracking-widest uppercase">Macro-Economic Authority</h4>
                          <ul className="text-zinc-400 text-[13px] list-disc pl-4 space-y-2 font-sans">
                            <li>Passing the National Budget and determining Income Tax codes.</li>
                            <li>Funding federal infrastructure (National Highways, Railways, Airways).</li>
                            <li>Enacting supreme federal laws that override state legislation in conflicts.</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-zinc-400 font-mono text-[12px] leading-relaxed border-t border-[#333] pt-6">
                        <strong>PRIME MINISTER PROTOCOL:</strong> Securing a majority in the lower house grants a party total federal mandate. Their chosen leader is sworn in as the <strong>Prime Minister</strong>. The PM commands the executive cabinet, dictating the strategic trajectory of the entire nation.
                      </p>
                    </div>
                  )}
                </div>
             </div>
          </section>
        )}

        {activeSection === 'myths' && (
          <section className="animate-fade-in">
            <FactCheck />
          </section>
        )}

        {activeSection === 'faq' && (
          <section className="animate-fade-in">
             <div className="max-w-[1140px] mx-auto px-6">
                <div className="border-b-4 border-[#111] pb-8 mb-12 flex justify-between items-end">
                   <div>
                     <div className="text-[12px] tracking-[0.2em] text-[#ff3b30] mb-4 font-black font-mono">MODULE 04</div>
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">AI Terminal</h2>
                     <p className="text-lg text-[#00ff41] max-w-[600px] font-mono">Simulated API connection initialized.</p>
                   </div>
                   <div className="hidden md:block text-right">
                     <div className="bg-[#111] text-zinc-500 font-mono text-[10px] p-2 inline-block">Try typing '/help' or '/status'</div>
                   </div>
                </div>
                <ChatTerminal />
              </div>
           </section>
        )}

        {activeSection === 'library' && (
          <section className="animate-fade-in">
            <ReadingLibrary />
          </section>
        )}
      </main>

      <footer className="border-t-4 border-[#111] bg-[#000] py-12 mt-auto">
        <div className="max-w-[1140px] mx-auto px-6 flex flex-col gap-2">
          <div className="text-[14px] tracking-[0.2em] text-white font-black font-mono uppercase">CIVICED // V4.0</div>
          <div className="text-[12px] text-[#ff3b30] font-mono font-bold tracking-widest">NEUTRAL • NON-PARTISAN • FACT-BASED</div>
          <div className="text-[11px] text-zinc-600 tracking-[0.1em] mt-2 font-mono uppercase">System is for educational simulation only. Verify offline.</div>
        </div>
      </footer>
    </div>
  )
}

export default App
