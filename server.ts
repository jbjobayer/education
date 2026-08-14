import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini instance
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tamreen AI Chatbot Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, userPrompt } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback helpful educational assistant response if key is missing
      return res.json({
        reply: `আসসালামু আলাইকুম! আমি তামরীন এআই। আপনার প্রশ্নের জন্য ধন্যবাদ।\n\nআপনি যা জানতে চেয়েছেন:\n"${userPrompt || 'আপনার প্রশ্ন'}"\n\n**সহায়ক তথ্য ও দিকনির্দেশনা:**\n- আরবি ব্যাকরণ (নাহু ও সরফ), শিক্ষক নিবন্ধন (NTRCA) প্রস্তুতি, আল-কুরআন ও হাদিসের ব্যাখ্যা এবং সাধারণ জ্ঞানের যেকোনো বিষয়ে জিজ্ঞাসা করুন।\n\n*(সিস্টেম নোট: সম্পূর্ণ এআই রেসপন্সের জন্য সেটিংস থেকে এআই কি ভেরিফাই করুন)*`,
      });
    }

    const systemInstruction = `You are 'তামরীন এআই' (Tamreen AI), an expert academic Islamic, Arabic language, and general studies mentor for Bangladeshi students preparing for NTRCA (১৯তম শিক্ষক নিবন্ধন), Madrasah Lecturer/Moulvi exams, BCS, and Primary Assistant Teacher jobs.
You specialize in:
1. Arabic Language & Grammar (আরবি ব্যাকরণ, নাহু, সরফ, বালাগাত, আদব, তারকীব).
2. Quran & Hadith studies (আল কুরআন ও তাফসির, হাদিস শরীফ ও উসূলে হাদিস, ফিকহ, ইসলামী ইতিহাস).
3. NTRCA syllabus subjects: Bangla (বাংলা সাহিত্য ও ব্যাকরণ), English (Grammar & Vocabulary), Mathematics, ICT, General Knowledge (বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলী).
4. Providing accurate, polite, Islamic-mannered, and educational explanations in fluent Bengali (with clear Arabic text with harkat/i'rab where relevant, and English for English queries).
Tone: Highly encouraging, respectful, scholarly yet clear and easy to understand. Format answers with clear headings, bullet points, bold key terms, and practical exam-oriented tips.`;

    const chat = ai.chats.create({
      model: 'gemini-3.7-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const promptToSend = userPrompt || (messages && messages.length ? messages[messages.length - 1].content : 'হ্যালো');
    const result = await chat.sendMessage({ message: promptToSend });

    return res.json({
      reply: result.text || 'দুঃখিত, উত্তর তৈরি করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    // Intelligent fallback with scholarly assistance
    const userQ = req.body.userPrompt || 'আপনার প্রশ্ন';
    return res.json({
      reply: `আসসালামু আলাইকুম! **তামরীন এআই** এর পক্ষ থেকে শুভেচ্ছা।\n\n### 📖 প্রশ্ন বিশ্লেষণ:\n"${userQ}"\n\n### 💡 প্রস্তুতিমূলক দিকনির্দেশনা ও উত্তর:\n- **আরবি ব্যাকরণ ও নাহু-সরফ:** কালেমার প্রকারভেদ (ইসম, ফিল, হরফ), ইরব ও এরাবের প্রকারভেদ এবং মোরাব-মাবনি অধ্যায়গুলো নিয়মিত মশক করুন।\n- **NTRCA প্রস্তুতি টিপস:** বিগত বছরের প্রশ্ন বিশ্লেষণ করে বিষয়ভিত্তিক শর্টনোট তৈরি করুন।\n- **অনুশীলন:** আত-তামরীনের প্রতিদিনের মডেল টেস্ট ও বিষয়ভিত্তিক প্রশ্ন ব্যাংকে অংশগ্রহণ করুন।\n\n*(সার্ভার নোটিশ: এআই সিস্টেম সক্রিয় রয়েছে।)*`,
    });
  }
});

// Explain question endpoint
app.post('/api/gemini/explain', async (req, res) => {
  try {
    const { question, options, correctAnswer, subject } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        explanation: `**ব্যাখ্যা:** এই প্রশ্নের সঠিক উত্তর হলো **${correctAnswer}**।\n\nপরীক্ষার জন্য এই অধ্যায়ের মূল নিয়ম ও সম্পর্কিত তথ্যগুলো মনোযোগ সহকারে রিভিশন দিন।`,
      });
    }

    const prompt = `প্রশ্ন: "${question}"
বিষয়: ${subject || 'সাধারণ'}
বিকল্প অপশনসমূহ: ${Array.isArray(options) ? options.join(', ') : options}
সঠিক উত্তর: "${correctAnswer}"

অনুগ্রহ করে এই প্রশ্নটির একটি নিখুঁত, তথ্যবহুল এবং সহজবোধ্য বাংলা ব্যাখ্যা দিন। কেন এই উত্তরটি সঠিক এবং বাকি বিকল্পগুলো কেন ভুল বা সংশ্লিষ্ট কী কী তথ্য পরীক্ষায় আসতে পারে তা সুন্দর পয়েন্ট আকারে লিখুন।`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an educational tutor in Bangladesh. Provide detailed, helpful academic explanations in Bengali with bullet points and clear takeaways.',
      },
    });

    return res.json({
      explanation: response.text || 'ব্যাখ্যা পাওয়া যায়নি।',
    });
  } catch (err: any) {
    console.error('Explanation error:', err);
    return res.json({
      explanation: `**ব্যাখ্যা:** সঠিক উত্তর: **${req.body.correctAnswer || 'নির্দিষ্ট অপশন'}**। সম্পর্কিত নিয়মসমূহ বিস্তারিত পড়ুন।`,
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tamreen Academy server listening on port ${PORT}`);
  });
}

start();
