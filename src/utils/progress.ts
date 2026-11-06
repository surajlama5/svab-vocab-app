import type { PracticeSubject, QuizAttempt, WordReview } from '../types/study';

export type SavedStudyProgress = {
  cardsViewed: number;
  quizRuns: number;
  bestScore: number;
  bookmarkedWordIds: string[];
  mistakeWordIds: string[];
  missedQuestionsBySubject: Partial<Record<PracticeSubject, string[]>>;
  wordReviews: Record<string, WordReview>;
  quizHistory: QuizAttempt[];
  dailyGoal: number;
  activityByDate: Record<string, number>;
};

export type ProgressStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
export const PROGRESS_STORAGE_KEY = 'asvab-vocab-master-progress-v1';

export const emptyProgress: SavedStudyProgress = {
  cardsViewed: 0,
  quizRuns: 0,
  bestScore: 0,
  bookmarkedWordIds: [],
  mistakeWordIds: [],
  missedQuestionsBySubject: {},
  wordReviews: {},
  quizHistory: [],
  dailyGoal: 10,
  activityByDate: {},
};

const validSubjects = new Set<PracticeSubject>(['word-knowledge', 'paragraph-comprehension', 'arithmetic-reasoning', 'mathematics-knowledge']);

export function parseSavedProgress(raw: string | null): SavedStudyProgress {
  if (!raw) return emptyProgress;
  try {
    const parsed = JSON.parse(raw) as Partial<SavedStudyProgress>;
    const activityByDate: Record<string, number> = {};
    if (parsed.activityByDate && typeof parsed.activityByDate === 'object') {
      for (const [date, amount] of Object.entries(parsed.activityByDate)) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(amount) && amount >= 0) activityByDate[date] = amount;
      }
    }
    const wordReviews: Record<string, WordReview> = {};
    if (parsed.wordReviews && typeof parsed.wordReviews === 'object') {
      for (const [wordId, review] of Object.entries(parsed.wordReviews)) {
        if (review && Number.isInteger(review.repetitions) && review.repetitions >= 0 && Number.isInteger(review.intervalDays) && review.intervalDays >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(review.dueDate)) {
          wordReviews[wordId] = review;
        }
      }
    }
    const missedQuestionsBySubject: SavedStudyProgress['missedQuestionsBySubject'] = {};
    if (parsed.missedQuestionsBySubject && typeof parsed.missedQuestionsBySubject === 'object') {
      for (const [subject, ids] of Object.entries(parsed.missedQuestionsBySubject)) {
        if (validSubjects.has(subject as PracticeSubject) && Array.isArray(ids)) missedQuestionsBySubject[subject as PracticeSubject] = ids.filter((id): id is string => typeof id === 'string');
      }
    }
    const quizHistory = Array.isArray(parsed.quizHistory) ? parsed.quizHistory.filter((attempt): attempt is QuizAttempt => Boolean(
      attempt && typeof attempt.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(attempt.date) && validSubjects.has(attempt.subject) &&
      Number.isFinite(attempt.correct) && Number.isFinite(attempt.total) && attempt.total > 0 &&
      Number.isFinite(attempt.score) && attempt.score >= 0 && attempt.score <= 100,
    )).slice(-30) : [];
    return {
      cardsViewed: Number.isFinite(parsed.cardsViewed) ? Math.max(0, parsed.cardsViewed!) : 0,
      quizRuns: Number.isFinite(parsed.quizRuns) ? Math.max(0, parsed.quizRuns!) : 0,
      bestScore: Number.isFinite(parsed.bestScore) ? Math.min(100, Math.max(0, parsed.bestScore!)) : 0,
      bookmarkedWordIds: Array.isArray(parsed.bookmarkedWordIds) ? parsed.bookmarkedWordIds.filter((id): id is string => typeof id === 'string') : [],
      mistakeWordIds: Array.isArray(parsed.mistakeWordIds) ? parsed.mistakeWordIds.filter((id): id is string => typeof id === 'string') : [],
      missedQuestionsBySubject,
      wordReviews,
      quizHistory,
      dailyGoal: [5, 10, 20, 30].includes(parsed.dailyGoal ?? 10) ? parsed.dailyGoal ?? 10 : 10,
      activityByDate,
    };
  } catch {
    return emptyProgress;
  }
}

export function loadProgress(storage: ProgressStorage): SavedStudyProgress {
  try {
    return parseSavedProgress(storage.getItem(PROGRESS_STORAGE_KEY));
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(storage: ProgressStorage, progress: SavedStudyProgress): boolean {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function getLocalDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
}

function shiftDate(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day + days);
  return getLocalDateKey(date);
}

export function getStudyStreak(activityByDate: Record<string, number>, today = getLocalDateKey()): number {
  let currentDate = (activityByDate[today] ?? 0) > 0 ? today : shiftDate(today, -1);
  let streak = 0;
  while ((activityByDate[currentDate] ?? 0) > 0) {
    streak += 1;
    currentDate = shiftDate(currentDate, -1);
  }
  return streak;
}

export function getWeeklyActivity(activityByDate: Record<string, number>, today = getLocalDateKey()): number {
  return Array.from({ length: 7 }, (_, offset) => activityByDate[shiftDate(today, -offset)] ?? 0)
    .reduce((sum, value) => sum + value, 0);
}

export function calculateAccuracy(correct: number, total: number): number {
  if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.round((Math.min(total, Math.max(0, correct)) / total) * 100);
}

export type ReviewSchedule = { repetitions: number; intervalDays: number; dueDate: string };

export function getDueReviewWordIds(missedWordIds: readonly string[], schedules: Record<string, ReviewSchedule>, today = getLocalDateKey()): string[] {
  return missedWordIds.filter((id) => !schedules[id] || schedules[id].dueDate <= today);
}

export function getNextReviewSchedule(previous: ReviewSchedule | undefined, correct: boolean, today = getLocalDateKey()): ReviewSchedule {
  if (!correct) return { repetitions: 0, intervalDays: 1, dueDate: shiftDate(today, 1) };
  const repetitions = (previous?.repetitions ?? 0) + 1;
  const intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.min(30, Math.max(7, (previous?.intervalDays ?? 3) * 2));
  return { repetitions, intervalDays, dueDate: shiftDate(today, intervalDays) };
}
