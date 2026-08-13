import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  HelpCircle, 
  RefreshCw, 
  Lightbulb, 
  Copy, 
  Check,
  GraduationCap
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../../types';

export const TamreenAIView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! 🌸\n\nআমি **তামরীন এআই (Tamreen AI)** — আপনার সার্বক্ষণিক আরবি, মাদ্রাসা শিক্ষা ও NTRCA শিক্ষক নিবন্ধন প্রস্তুতি সহকারী।\n\n**আমি যেসব বিষয়ে সাহায্য করতে পারি:**\n- 📖 **আরবি ব্যাকরণ:** নাহু, সরফ, বালাগাত ও তারকিব সমাধান।\n- 🕌 **ইসলামিক স্টাডিজ:** কুরআন তাফসির, হাদিস শরীফ, উসূলে হাদিস ও ফিকহ।\n- 🎓 **১৯তম শিক্ষক নিবন্ধন (NTRCA):** বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান।\n- 💡 **ডাউট সলভ:** যেকোনো পরীক্ষার প্রশ্নের ব্যাখ্যা ও শর্টকাট নিয়ম।\n\nনিচের সাজেস্টেড প্রশ্নগুলোতে ক্লিক করুন অথবা যেকোনো প্রশ্ন বাংলায় বা আরবিতে লিখুন!`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'নাহু ও সরফের মধ্যে মূল পার্থক্য কী?',
    '১৮তম NTRCA প্রভাষক আরবি সিলেবাস ও নম্বর বণ্টন',
    'কালেমার প্রকারভেদ ও ইরব নির্ণয়ের নিয়ম বুঝিয়ে দাও',
    'English: Important Preposition Rules for NTRCA',
    'লাভ-ক্ষতি ও শতকরার অংক দ্রুত সমাধানের শর্টকাট',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: query,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'দুঃখিত, উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Tamreen AI chat error:', err);
      const errorReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'ইন্টারনেট বা সার্ভার সংযোগে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[820px] rounded-3xl neu-card overflow-hidden animate-fadeIn">
      {/* Neumorphic AI Assistant Header */}
      <div className="p-4 px-5 flex items-center justify-between border-b border-white/60 shrink-0 bg-[#e9edf5]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm sm:text-base text-slate-900">
                তামরীন এআই মেন্টর
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                অনলাইন ২৪/৭
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              আরবি ব্যাকরণ, মাদ্রাসা শিক্ষা ও NTRCA প্রিলি-লিখিত বিশেষজ্ঞ
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ai',
                text: 'আসসালামু আলাইকুম! নতুন সেশনে আপনাকে স্বাগতম। আপনার প্রশ্নটি লিখুন।',
                timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="p-2.5 rounded-xl neu-btn text-slate-600 hover:text-slate-950"
          title="নতুন চ্যাট শুরু করুন"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Body with Inset Tray */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#e5ebf4] shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                isUser ? 'bg-emerald-800 text-white' : 'bg-amber-400 text-slate-950'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                isUser
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-tr-none shadow-md'
                  : 'neu-card rounded-tl-none text-slate-800 font-sans'
              }`}>
                {!isUser ? (
                  <div className="space-y-2 leading-relaxed">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                <div className={`mt-2.5 flex items-center justify-between gap-2 text-[10px] pt-1.5 border-t ${
                  isUser ? 'border-emerald-700 text-emerald-200' : 'border-slate-200 text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                      title="কপি করুন"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">কপি</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="neu-card rounded-3xl rounded-tl-none p-4 text-xs text-emerald-900 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>তামরীন এআই উত্তর তৈরি করছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Inset Carousel */}
      <div className="px-4 py-2 bg-[#e9edf5] border-t border-white/60 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-emerald-900 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> সাজেস্টেড:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl neu-btn text-slate-700 hover:text-emerald-900 text-xs whitespace-nowrap font-semibold disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-[#e9edf5] border-t border-white/60 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="আপনার প্রশ্নটি লিখুন (বাংলা, আরবি বা ইংরেজিতে)..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 sm:px-5 sm:py-2.5 neu-btn-primary rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">পাঠান</span>
          </button>
        </form>
      </div>
    </div>
  );
};
