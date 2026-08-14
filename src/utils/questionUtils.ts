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
 * Determine text direction and alignment for any question, option, or explanation text.
 * Rule: If it contains Bengali (even if it starts with an Arabic word), it must start from left (LTR, text-left).
 * Only 100% pure Arabic starts from the right (RTL, text-right).
 */
export function getTextDirection(text: string | undefined | null): {
  dir: 'ltr' | 'rtl';
  textAlign: 'text-left' | 'text-right';
  isPureArabic: boolean;
} {
  if (!text) {
    return { dir: 'ltr', textAlign: 'text-left', isPureArabic: false };
  }

  const pureAr = isPureArabic(text);
  if (pureAr) {
    return { dir: 'rtl', textAlign: 'text-right', isPureArabic: true };
  }

  return { dir: 'ltr', textAlign: 'text-left', isPureArabic: false };
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
