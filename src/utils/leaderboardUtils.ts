import { Exam, ExamResult, LeaderboardEntry, UserProfile } from '../types';

/**
 * Storage key prefix for locally cached submissions per exam
 */
const STORAGE_PREFIX = 'tamreen_exam_submissions_';

/**
 * Read real cached participant submissions for a given exam from localStorage
 */
export function getStoredExamSubmissions(examId: string): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${examId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Save a real exam participant submission to local storage cache
 */
export function saveExamSubmissionToCache(result: ExamResult, userProfile?: UserProfile): void {
  if (typeof window === 'undefined' || !result.examId) return;
  try {
    const list = getStoredExamSubmissions(result.examId);
    
    // Determine real name and info
    const participantName = result.participantName?.trim() || userProfile?.name?.trim() || 'পরীক্ষার্থী';
    const participantInstitution = result.participantInstitution?.trim() || userProfile?.institution?.trim() || '';
    const avatar = (userProfile?.avatar && !userProfile.avatar.includes('unsplash')) ? userProfile.avatar : '';

    const newEntry: LeaderboardEntry = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      rank: 1,
      name: participantName,
      avatar: avatar,
      institution: participantInstitution,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
      score: result.score,
      totalMarks: result.totalMarks,
      timeSpentSeconds: result.timeSpentSeconds || 45,
      isCurrentUser: true,
    };

    // Remove old submission for the same participant name if any to keep latest/best
    const filtered = list.filter(item => item.name !== participantName);
    filtered.push(newEntry);

    localStorage.setItem(`${STORAGE_PREFIX}${result.examId}`, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to save exam submission to cache:', e);
  }
}

/**
 * Clean & format real participants leaderboard.
 * STRICT: Absolutely NO mock/fake student names are injected.
 * Only real exam participants from database / submissions are displayed.
 */
export function generateExamLeaderboard(
  exam: Exam,
  userResult?: ExamResult | null,
  userProfile?: UserProfile,
  remoteEntries: LeaderboardEntry[] = []
): LeaderboardEntry[] {
  const totalM = exam.totalMarks || exam.totalQuestions || 100;
  
  // 1. Gather all real entries from remote or local storage
  const combinedMap = new Map<string, LeaderboardEntry>();

  // Add remote entries from Supabase first
  if (Array.isArray(remoteEntries)) {
    remoteEntries.forEach((entry) => {
      const key = (entry.name || '').trim().toLowerCase();
      if (key) {
        combinedMap.set(key, { ...entry, isCurrentUser: false });
      }
    });
  }

  // Also include cached submissions for this exam from this browser
  const localSubs = getStoredExamSubmissions(exam.id);
  localSubs.forEach((sub) => {
    const key = (sub.name || '').trim().toLowerCase();
    if (key && !combinedMap.has(key)) {
      combinedMap.set(key, { ...sub, isCurrentUser: false });
    }
  });

  // 2. If user has completed this exam, add/update the user's entry
  if (userResult && userResult.examId === exam.id) {
    const currentName = userResult.participantName?.trim() || userProfile?.name?.trim() || 'আপনি';
    const currentKey = currentName.toLowerCase();

    const userEntry: LeaderboardEntry = {
      id: 'current-user-result',
      rank: 1,
      name: currentName,
      avatar: (userProfile?.avatar && !userProfile.avatar.includes('unsplash')) ? userProfile.avatar : '',
      institution: userResult.participantInstitution?.trim() || userProfile?.institution?.trim() || '',
      correctAnswers: userResult.correctAnswers,
      wrongAnswers: userResult.wrongAnswers,
      score: userResult.score,
      totalMarks: userResult.totalMarks || totalM,
      timeSpentSeconds: userResult.timeSpentSeconds || 45,
      isCurrentUser: true,
    };

    combinedMap.set(currentKey, userEntry);
  }

  const list = Array.from(combinedMap.values());

  // 3. Sort by Score DESC, then timeSpentSeconds ASC (fastest first)
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (a.timeSpentSeconds || 0) - (b.timeSpentSeconds || 0);
  });

  // 4. Assign dynamic numeric ranks (১, ২, ৩...)
  return list.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
