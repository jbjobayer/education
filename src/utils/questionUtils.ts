import { Question } from '../types';

/**
 * Checks if a string contains Bengali characters
 */
export function hasBengaliCharacters(text: string | undefined | null): boolean {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Checks if a string contains Arabic characters
 */
export function hasArabicCharacters(text: string | undefined | null): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Checks if a string is pure Arabic (no Bengali characters and no substantial Latin sentences)
 */
export function isPureArabic(text: string | undefined | null): boolean {
  if (!text) return false;
  // If it contains any Bengali, it is NOT pure Arabic
  if (hasBengaliCharacters(text)) return false;
  // Must contain Arabic characters
  return hasArabicCharacters(text);
}

/**
 * Normalizes question marks in Arabic text to Arabic '؟'
 */
export function formatArabicQuestionPunctuation(text: string | undefined | null): string {
  if (!text) return '';
  let res = text.trim();
  if (res.endsWith('?')) {
    res = res.slice(0, -1).trim() + '؟';
  }
  return res;
}

/**
 * Normalizes question marks and brackets in Bengali translation text
 */
export function formatBengaliTranslationPunctuation(text: string | undefined | null): string {
  if (!text) return '';
  let res = text.trim();
  // Strip outer brackets or leading/trailing punctuation
  res = res.replace(/^[\s\(\[\{—\-–\:]+|[\s\)\]\}\:]+$/g, '').trim();
  if (res.endsWith('؟')) {
    res = res.slice(0, -1).trim() + '?';
  }
  return `(${res})`;
}

/**
 * Parsed question structure providing clean Arabic/Bengali split lines and direction configurations.
 */
export interface ParsedQuestionData {
  isArabicWithBengali: boolean;
  arabicText?: string;
  bengaliTranslation?: string;
  singleText: string;
  primaryDir: 'rtl' | 'ltr';
  primaryTextAlign: 'text-right' | 'text-left';
  isRTL: boolean;
  isPureArabic: boolean;
  isArabicNumbering: boolean;
}

/**
 * Parse question data to accurately separate Arabic question text and bracketed Bengali translation.
 * If Arabic question has a bracketed Bengali translation:
 * - arabicText: Arabic question (with Arabic '؟')
 * - bengaliTranslation: Bengali question (with Bengali '?')
 * Otherwise: singleText with proper direction (LTR for Bengali sentences with 1-2 Arabic words, RTL for pure Arabic).
 */
export function parseQuestionData(q: Partial<Question>): ParsedQuestionData {
  if (!q) {
    return {
      isArabicWithBengali: false,
      singleText: '',
      primaryDir: 'ltr',
      primaryTextAlign: 'text-left',
      isRTL: false,
      isPureArabic: false,
      isArabicNumbering: false,
    };
  }

  const rawArabic = q.arabicQuestion?.trim();
  const rawMain = q.question?.trim() || '';

  // Case 1: Explicit arabicQuestion is provided
  if (rawArabic) {
    if (rawMain && rawMain !== rawArabic) {
      if (hasBengaliCharacters(rawMain)) {
        let cleanBn = rawMain;
        if (cleanBn.includes(rawArabic)) {
          cleanBn = cleanBn.replace(rawArabic, '').trim();
        }
        cleanBn = cleanBn.replace(/^[\s\(\[\{—\-–\:]+|[\s\)\]\}\:]+$/g, '').trim();
        if (cleanBn) {
          return {
            isArabicWithBengali: true,
            arabicText: formatArabicQuestionPunctuation(rawArabic),
            bengaliTranslation: formatBengaliTranslationPunctuation(cleanBn),
            singleText: `${rawArabic} (${cleanBn})`,
            primaryDir: 'rtl',
            primaryTextAlign: 'text-right',
            isRTL: true,
            isPureArabic: false,
            isArabicNumbering: true,
          };
        }
      }
    }

    return {
      isArabicWithBengali: false,
      singleText: formatArabicQuestionPunctuation(rawArabic),
      primaryDir: 'rtl',
      primaryTextAlign: 'text-right',
      isRTL: true,
      isPureArabic: isPureArabic(rawArabic),
      isArabicNumbering: true,
    };
  }

  // Case 2: No explicit arabicQuestion, check if rawMain has Arabic question + bracketed Bengali
  // Example: "لِمَاذَا ذُكِرَ أَنَّ آدَمَ مِنْ تُرَابٍ؟ (আদম (আ.)-কে মাটি থেকে সৃষ্টির কারণ কী বলা হয়েছে?)"
  const bracketMatch = rawMain.match(/^([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\.\,\:\;\؟\!\-\—]+)[\(\[\{（]([^\)\]\}）]+)[\)\]\}）]\s*$/);
  if (bracketMatch) {
    const arabicCandidate = bracketMatch[1].trim();
    const bnCandidate = bracketMatch[2].trim();

    if (hasArabicCharacters(arabicCandidate) && !hasBengaliCharacters(arabicCandidate) && hasBengaliCharacters(bnCandidate)) {
      return {
        isArabicWithBengali: true,
        arabicText: formatArabicQuestionPunctuation(arabicCandidate),
        bengaliTranslation: formatBengaliTranslationPunctuation(bnCandidate),
        singleText: rawMain,
        primaryDir: 'rtl',
        primaryTextAlign: 'text-right',
        isRTL: true,
        isPureArabic: false,
        isArabicNumbering: true,
      };
    }
  }

  // Case 3: Single question (Bengali question with 1-2 Arabic words or pure Bengali or pure Arabic)
  const dirConfig = getTextDirection(rawMain, false);
  return {
    isArabicWithBengali: false,
    singleText: dirConfig.isRTL ? formatArabicQuestionPunctuation(rawMain) : rawMain,
    primaryDir: dirConfig.dir,
    primaryTextAlign: dirConfig.textAlign,
    isRTL: dirConfig.isRTL,
    isPureArabic: dirConfig.isPureArabic,
    isArabicNumbering: dirConfig.isRTL,
  };
}

/**
 * Extracts and formats question text so there is no duplicate Arabic line.
 * If Arabic question exists and there is a Bengali meaning/translation,
 * it formats as: `[Arabic Question] ([Bengali Meaning])`
 */
export function getUnifiedQuestionText(q: Partial<Question>): string {
  if (!q) return '';

  const arabic = q.arabicQuestion?.trim();
  const main = q.question?.trim() || '';

  // Case 1: If explicit arabicQuestion is provided
  if (arabic) {
    // Check if main question is different and has Bengali
    if (main && main !== arabic) {
      if (hasBengaliCharacters(main)) {
        // If main already has the arabic inside it plus brackets, e.g. "لِمَاذَا... (- আদম...)"
        // Extract the bengali text inside or after
        let cleanBangla = main;
        // If main repeats the arabic question, remove it
        if (cleanBangla.includes(arabic)) {
          cleanBangla = cleanBangla.replace(arabic, '').trim();
        }
        // Remove surrounding brackets or dashes if already present
        cleanBangla = cleanBangla.replace(/^[\s\(\[\{—\-–\:]+|[\s\)\]\}\:]+$/g, '').trim();
        
        if (cleanBangla) {
          return `${arabic} (${cleanBangla})`;
        }
      } else if (!hasArabicCharacters(main)) {
        return `${arabic} (${main})`;
      }
    }
    return arabic;
  }

  // Case 2: No arabicQuestion field, inspect main question
  return main;
}

/**
 * Detects if question is full Arabic (or Arabic with bracketed Bengali translation).
 * If question has 1-2 Arabic words with Bengali sentence (e.g., "نحو অর্থ কি?"), it returns FALSE.
 */
export function isArabicDominantQuestion(
  text: string | undefined | null,
  hasExplicitArabicQuestionField: boolean = false
): boolean {
  if (!text) return false;
  if (hasExplicitArabicQuestionField) return true;

  const trimmed = text.trim();

  // If pure Arabic
  if (isPureArabic(trimmed)) return true;

  // If text starts with Arabic sentence and ends with bracketed Bengali translation
  const bracketMatch = trimmed.match(
    /^([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\.\,\:\;\؟\!\-\—]+)[\(\[\{（]([^\)\]\}）]+)[\)\]\}）]\s*$/
  );
  if (bracketMatch) {
    const arabicCandidate = bracketMatch[1].trim();
    if (hasArabicCharacters(arabicCandidate) && !hasBengaliCharacters(arabicCandidate)) {
      return true;
    }
  }

  // Count Arabic words vs Bengali words
  const words = trimmed.split(/[\s,\.\?\!\(\)\[\]\{\}\:;–—\-]+/);
  let arabicWords = 0;
  let bengaliWords = 0;

  for (const w of words) {
    if (hasArabicCharacters(w) && !hasBengaliCharacters(w)) {
      arabicWords++;
    } else if (hasBengaliCharacters(w)) {
      bengaliWords++;
    }
  }

  // If question is primarily Bengali with 1 or 2 Arabic terms (e.g., "نحو অর্থ কি?") -> NOT Arabic dominant
  if (bengaliWords >= 2 && arabicWords <= 3) {
    return false;
  }

  // If Arabic words strictly dominate
  if (arabicWords > bengaliWords && arabicWords >= 2) {
    return true;
  }

  return false;
}

/**
 * Determine text direction and alignment for any question, option, or explanation text.
 * Rule: 
 * - Full Arabic question (with or without bracketed Bengali translation) -> RTL / text-right
 * - Bengali question with 1 or 2 Arabic words (e.g., "نحو অর্থ কি?", "علوم القرآن কাকে বলে?") -> LTR / text-left
 * - Pure Bengali -> LTR / text-left
 */
export function getTextDirection(
  text: string | undefined | null,
  hasExplicitArabicQuestionField: boolean = false
): {
  dir: 'ltr' | 'rtl';
  textAlign: 'text-left' | 'text-right';
  isRTL: boolean;
  isPureArabic: boolean;
  isArabicDominant: boolean;
} {
  if (!text) {
    return {
      dir: 'ltr',
      textAlign: 'text-left',
      isRTL: false,
      isPureArabic: false,
      isArabicDominant: false,
    };
  }

  const pureAr = isPureArabic(text);
  const arDominant = isArabicDominantQuestion(text, hasExplicitArabicQuestionField);

  if (pureAr || arDominant) {
    return {
      dir: 'rtl',
      textAlign: 'text-right',
      isRTL: true,
      isPureArabic: pureAr,
      isArabicDominant: true,
    };
  }

  return {
    dir: 'ltr',
    textAlign: 'text-left',
    isRTL: false,
    isPureArabic: false,
    isArabicDominant: false,
  };
}

/**
 * Determine options majority language and direction.
 * Rule: If 4 options are Arabic -> right. If 4 are Bengali -> left.
 * If 1 Arabic + 3 Bengali -> Bengali priority (left).
 * If 3 Arabic + 1 Bengali -> Arabic priority (right).
 */
export function getOptionsConfig(options: string[] = [], customLabels?: string[]): {
  isRTL: boolean;
  dir: 'rtl' | 'ltr';
  textAlign: 'text-right' | 'text-left';
  labels: string[];
  majority: 'ar' | 'bn' | 'en';
} {
  const defaultBnLabels = ['ক', 'খ', 'গ', 'ঘ', 'ঙ'];
  const defaultArLabels = ['أ', 'ب', 'ج', 'د', 'هـ'];
  const defaultEnLabels = ['A', 'B', 'C', 'D', 'E'];

  if (!options || options.length === 0) {
    return {
      isRTL: false,
      dir: 'ltr',
      textAlign: 'text-left',
      labels: customLabels || defaultBnLabels,
      majority: 'bn',
    };
  }

  let arabicCount = 0;
  let englishCount = 0;
  let bengaliCount = 0;

  options.forEach((opt) => {
    if (isPureArabic(opt)) {
      arabicCount++;
    } else if (hasBengaliCharacters(opt)) {
      bengaliCount++;
    } else if (/[a-zA-Z]/.test(opt)) {
      englishCount++;
    } else {
      bengaliCount++;
    }
  });

  // If majority is Arabic (e.g. 4 vs 0, 3 vs 1)
  if (arabicCount > bengaliCount + englishCount) {
    return {
      isRTL: true,
      dir: 'rtl',
      textAlign: 'text-right',
      labels: customLabels || defaultArLabels,
      majority: 'ar',
    };
  }

  // If majority is English
  if (englishCount > bengaliCount + arabicCount) {
    return {
      isRTL: false,
      dir: 'ltr',
      textAlign: 'text-left',
      labels: customLabels || defaultEnLabels,
      majority: 'en',
    };
  }

  // Default to Bengali priority
  return {
    isRTL: false,
    dir: 'ltr',
    textAlign: 'text-left',
    labels: customLabels || defaultBnLabels,
    majority: 'bn',
  };
}
