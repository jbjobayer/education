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
  GraduationCap,
  MessageSquare,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../../types';

export const TamreenAIView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! 🌸\n\nআমি **তামরীন এআই (Tamreen AI)** — আপনার সার্বক্ষণিক আরবি ভাষা, মাদ্রাসা শিক্ষা ও NTRCA শিক্ষক নিবন্ধন প্রস্তুতি সহকারী।\n\n### 🎓 আমি যেসব বিষয়ে সাহায্য করতে পারি:\n- 📖 **আরবি ব্যাকরণ ও সাহিত্য:** নাহু, সরফ, বালাগাত, আদব ও তারকিব সমাধান।\n- 🕌 **ইসলামিক স্টাডিজ:** কুরআন তাফসির, হাদিস শরীফ, উসূলে হাদিস ও ফিকহ।\n- 🎯 **১৯তম শিক্ষক নিবন্ধন (NTRCA):** বাংলা সাহিত্য, ইংরেজি ব্যাকরণ, গণিত শর্টকাট ও বাংলাদেশ-আন্তর্জাতিক সাধারণ জ্ঞান।\n- 💡 **ডাউট সলভ ও প্রশ্ন ব্যাংক:** যেকোনো জটিল প্রশ্নের একাডেমিক ব্যাখ্যা ও টেকনিক।\n\nনিচের সাজেস্টেড বিষয়ভিত্তিক বাটনে ক্লিক করুন অথবা যেকোনো প্রশ্ন লিখুন!`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'arabic' | 'ntrca' | 'islamic'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptCategories = {
    all: [
      'নাহু ও সরফের মধ্যে মূল পার্থক্য কী?',
      '১৯তম NTRCA প্রভাষক আরবি সিলেবাস ও নম্বর বণ্টন',
      'কালেমার প্রকারভেদ ও ইরব নির্ণয়ের নিয়ম বুঝিয়ে দাও',
      'English: Important Preposition Rules for NTRCA',
      'লাভ-ক্ষতি ও শতকরার অংক দ্রুত সমাধানের শর্টকাট',
    ],
    arabic: [
      'মাবনি ও মোরাব ইসমে মুতামাক্কিনের পার্থক্য কী?',
      'বালাগাত ও ফাসাহাতের মধ্যে সম্পর্ক কী?',
      'জুমলাতুল ইসমিয়্যাহ ও জুমলাতুল ফেলিয়্যাহ চেনার নিয়ম',
      'সরফের গুরুত্বপূর্ণ বাবসমূহের বৈশিষ্ট্য',
    ],
    ntrca: [
      '১৯তম শিক্ষক নিবন্ধনে প্রিলির পাশ মার্ক ও বিষয়ভিত্তিক প্রস্তুতি',
      'বাংলা ব্যাকরণ: ণ-ত্ব ও ষ-ত্ব বিধানের প্রধান নিয়ম',
      'বাংলাদেশের সংবিধান ও মুক্তিযুদ্ধ থেকে কমন আসার মতো টপিক',
      'Right Form of Verbs এর ৫টি গোল্ডেন রুল',
    ],
    islamic: [
      'উসূলে হাদিসের পরিভাষাসমূহ (সহিহ, হাসান, জয়িফ)',
      'কুরআন সংকলনের ঐতিহাসিক পর্যায়সমূহ',
      'চার মাযহাবের উসূল ও ফিকহি মতপার্থক্যের হেকমত',
    ],
  };

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
        text: `### 💡 প্রস্তুতিমূলক দিকনির্দেশনা ও উত্তর:\n"${query}" সম্পর্কিত গুরুত্বপূর্ণ তথ্যসমূহ:\n\n- **আরবি ব্যাকরণ ও শিক্ষক নিবন্ধন প্রস্তুতি:** সংশ্লিষ্ট নিয়মাবলি ও বিগত বছরের প্রশ্নসমূহ বারবার রিভিশন করুন।\n- তামরীন অনলাইন মডেল টেস্টে নিয়মিত অংশ নিয়ে নিজের প্রস্তুতি যাচাই করুন।`,
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

  const activePrompts = promptCategories[activeCategory] || promptCategories.all;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[820px] rounded-3xl neu-card overflow-hidden animate-fadeIn">
      {/* Neumorphic AI Assistant Header */}
      <div className="p-4 px-5 flex items-center justify-between border-b border-white/60 dark:border-slate-700 shrink-0 bg-[#e9edf5] dark:bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                তামরীন এআই মেন্টর
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-700">
                সক্রিয় ২৪/৭
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              আরবি ব্যাকরণ, মাদ্রাসা শিক্ষা ও ১৯তম NTRCA প্রিলি-লিখিত বিশেষজ্ঞ
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ai',
                text: 'আসসালামু আলাইকুম! নতুন সেশনে আপনাকে স্বাগতম। আপনার যেকোনো একাডেমিক বা পরীক্ষার প্রশ্ন লিখুন।',
                timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }}
          className="p-2.5 rounded-xl neu-btn text-slate-600 dark:text-slate-300 hover:text-slate-950 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          title="নতুন চ্যাট শুরু করুন"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">নতুন সেশন</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="px-4 py-2 bg-[#e2e8f2] dark:bg-[#131d2e] border-b border-white/60 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
          টপিক:
        </span>
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          সকল প্রশ্ন
        </button>
        <button
          onClick={() => setActiveCategory('arabic')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'arabic'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          📖 আরবি ও ব্যাকরণ
        </button>
        <button
          onClick={() => setActiveCategory('ntrca')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'ntrca'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          🎯 NTRCA শিক্ষক নিবন্ধন
        </button>
        <button
          onClick={() => setActiveCategory('islamic')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeCategory === 'islamic'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          🕌 ইসলামিক স্টাডিজ
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#e5ebf4] dark:bg-[#0b1320] shadow-inner">
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

              <div className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                isUser
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-tr-none shadow-md'
                  : 'neu-card rounded-tl-none text-slate-800 dark:text-slate-100 font-sans'
              }`}>
                {!isUser ? (
                  <div className="space-y-2 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                <div className={`mt-2.5 flex items-center justify-between gap-2 text-[10px] pt-1.5 border-t ${
                  isUser ? 'border-emerald-700 text-emerald-200' : 'border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                      title="কপি করুন"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">কপি হয়েছে</span>
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
            <div className="neu-card rounded-3xl rounded-tl-none p-4 text-xs text-emerald-900 dark:text-emerald-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>তামরীন এআই উত্তর তৈরি করছে...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Inset Carousel */}
      <div className="px-4 py-2 bg-[#e9edf5] dark:bg-[#0f172a] border-t border-white/60 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> সাজেস্টেড:
        </span>
        {activePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl neu-btn text-slate-700 dark:text-slate-300 hover:text-emerald-900 text-xs whitespace-nowrap font-semibold disabled:opacity-50 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-[#e9edf5] dark:bg-[#0f172a] border-t border-white/60 dark:border-slate-800 shrink-0">
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
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 sm:px-5 sm:py-2.5 neu-btn-primary rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-md text-white"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">পাঠান</span>
          </button>
        </form>
      </div>
    </div>
  );
};
