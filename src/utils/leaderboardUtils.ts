import { Exam, ExamResult, LeaderboardEntry, UserProfile } from '../types';

export interface MockStudent {
  name: string;
  avatar: string;
  institution: string;
  district: string;
  speedFactor: number; // 0.8 (fast) to 1.3 (slower)
  proficiency: number; // 0.65 to 1.0 (accuracy capability)
}

const CANDIDATE_STUDENTS: MockStudent[] = [
  {
    name: 'মাওলানা তাওহীদুল ইসলাম',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution: 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা',
    district: 'ঢাকা',
    speedFactor: 0.85,
    proficiency: 1.0,
  },
  {
    name: 'মুহাম্মদ জোবায়ের হোসাইন',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    institution: 'দারুল উলুম হাটহাজারী, চট্টগ্রাম',
    district: 'চট্টগ্রাম',
    speedFactor: 0.90,
    proficiency: 1.0,
  },
  {
    name: 'আব্দুল করিম আল-মাদানী',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    institution: 'শাহজালাল জামেয়া ইসলামিয়া, সিলেট',
    district: 'সিলেট',
    speedFactor: 0.95,
    proficiency: 0.92,
  },
  {
    name: 'ফাতেমা আক্তার সুরভী',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution: 'রাজশাহী বিশ্ববিদ্যালয় (আরবি বিভাগ)',
    district: 'রাজশাহী',
    speedFactor: 1.0,
    proficiency: 0.90,
  },
  {
    name: 'ইসমাইল হোসেন ফাহিম',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    institution: 'খুলনা আলিয়া কামিল মাদ্রাসা',
    district: 'খুলনা',
    speedFactor: 1.05,
    proficiency: 0.82,
  },
  {
    name: 'তাসনিম জাহান নাদিয়া',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    institution: 'কারমাইকেল কলেজ, রংপুর',
    district: 'রংপুর',
    speedFactor: 1.10,
    proficiency: 0.78,
  },
  {
    name: 'আরিফুর রহমান সাকিব',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    institution: 'মুমেনশাহী জামিয়া ইসলামিয়া, ময়মনসিংহ',
    district: 'ময়মনসিংহ',
    speedFactor: 1.15,
    proficiency: 0.72,
  },
  {
    name: 'মাহমুদুল হাসান তামিম',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    institution: 'ছারছীনা দারুসসুন্নাত কামিল মাদ্রাসা',
    district: 'বরিশাল',
    speedFactor: 1.18,
    proficiency: 0.68,
  },
  {
    name: 'খাদিজাতুল কুবরা',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    institution: 'কুমিল্লা আলিয়া মাদ্রাসা',
    district: 'কুমিল্লা',
    speedFactor: 1.20,
    proficiency: 0.65,
  },
  {
    name: 'উবাইদুল্লাহ বিন সাঈদ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    institution: 'জামিয়া মাদানিয়া বারিধারা, ঢাকা',
    district: 'গাজীপুর',
    speedFactor: 1.25,
    proficiency: 0.60,
  }
];

/**
 * Generate an accurate, realistic leaderboard strictly matching the target exam's
 * totalQuestions, totalMarks, negativeMarking, and question pool.
 */
export function generateExamLeaderboard(
  exam: Exam,
  userResult?: ExamResult | null,
  userProfile?: UserProfile
): LeaderboardEntry[] {
  const totalQ = exam.totalQuestions || (exam.questions ? exam.questions.length : 5);
  const totalM = exam.totalMarks || totalQ;
  const markPerQuestion = totalM / totalQ;
  const negMark = exam.negativeMarking ?? 0.25;

  // Base base duration per question in seconds
  const avgSecondsPerQ = Math.max(6, Math.min(25, Math.floor((exam.durationMinutes * 60) / totalQ / 2.5)));

  const list: LeaderboardEntry[] = CANDIDATE_STUDENTS.map((student, idx) => {
    let correct = 0;
    let wrong = 0;

    if (idx === 0) {
      // Top student gets 100% correct
      correct = totalQ;
      wrong = 0;
    } else if (idx === 1) {
      // 2nd student also gets 100% (or totalQ - 1 if > 10 questions)
      correct = totalQ > 15 ? totalQ - 1 : totalQ;
      wrong = totalQ - correct;
    } else if (idx === 2) {
      correct = Math.max(1, totalQ - 1);
      wrong = 1;
    } else if (idx === 3) {
      correct = Math.max(1, totalQ - 1);
      wrong = 1;
    } else {
      const targetCorrect = Math.round(totalQ * student.proficiency);
      correct = Math.max(1, Math.min(totalQ, targetCorrect));
      const remaining = totalQ - correct;
      wrong = Math.min(remaining, Math.max(1, Math.round(remaining * 0.7)));
    }

    // Safety checks
    if (correct + wrong > totalQ) {
      wrong = totalQ - correct;
    }

    const calculatedScore = Math.max(
      0,
      Number(((correct * markPerQuestion) - (wrong * negMark * markPerQuestion)).toFixed(2))
    );

    const timeSpent = Math.max(
      15,
      Math.round(totalQ * avgSecondsPerQ * student.speedFactor + (idx * 3))
    );

    return {
      id: `mock-lb-${exam.id}-${idx}`,
      rank: idx + 1,
      name: student.name,
      avatar: student.avatar,
      institution: student.institution,
      correctAnswers: correct,
      wrongAnswers: wrong,
      score: calculatedScore,
      totalMarks: totalM,
      timeSpentSeconds: timeSpent,
      isCurrentUser: false,
    };
  });

  // If user completed this exam, merge user result
  if (userResult && userResult.examId === exam.id) {
    const userEntry: LeaderboardEntry = {
      id: 'current-user-res',
      rank: 1,
      name: userResult.participantName || userProfile?.name || 'মুহাম্মদ শিক্ষার্থী',
      avatar: userProfile?.avatar || '',
      institution: userResult.participantInstitution || userProfile?.institution || 'মাদ্রাসা / কলেজ',
      correctAnswers: userResult.correctAnswers,
      wrongAnswers: userResult.wrongAnswers,
      score: userResult.score,
      totalMarks: userResult.totalMarks || totalM,
      timeSpentSeconds: userResult.timeSpentSeconds || 45,
      isCurrentUser: true,
    };

    // Filter out mock duplicates with the same name if any
    const filtered = list.filter((item) => item.name !== userEntry.name);
    filtered.push(userEntry);

    // Sort by Score DESC, then timeSpent ASC
    filtered.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    });

    // Re-assign ranks
    return filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  // Otherwise sort the mock candidates and assign ranks
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSpentSeconds - b.timeSpentSeconds;
  });

  return list.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
