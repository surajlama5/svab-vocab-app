import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, type Palette } from '@/constants/colors';
import type { PracticeSubject, QuestionOutcome, QuizAttempt } from '@/types/study';
import { calculateAccuracy, emptyProgress, getLocalDateKey, getNextReviewSchedule, loadProgress, saveProgress, type SavedStudyProgress } from '@/utils/progress';

type ThemeChoice = 'light' | 'dark' | 'system';
type StudyState = SavedStudyProgress & { themeChoice: ThemeChoice; hydrated: boolean };
type WordOutcome = { wordId: string; correct: boolean };
type Action =
  | { type: 'view-card' }
  | { type: 'finish-quiz'; attempt: QuizAttempt; outcomes: WordOutcome[]; questionOutcomes: QuestionOutcome[] }
  | { type: 'theme'; value: ThemeChoice }
  | { type: 'hydrate'; progress: SavedStudyProgress }
  | { type: 'bookmark'; wordId: string }
  | { type: 'daily-goal'; value: number };
type ContextValue = {
  state: StudyState;
  palette: Palette;
  themeChoice: ThemeChoice;
  recordCard: () => void;
  finishQuiz: (subject: PracticeSubject, correct: number, total: number, outcomes: WordOutcome[], questionOutcomes: QuestionOutcome[]) => void;
  toggleBookmark: (wordId: string) => void;
  setDailyGoal: (value: number) => void;
  setTheme: (value: ThemeChoice) => void;
};

const initial: StudyState = { ...emptyProgress, themeChoice: 'system', hydrated: false };

function reducer(state: StudyState, action: Action): StudyState {
  if (action.type === 'view-card') {
    const today = getLocalDateKey();
    return {
      ...state,
      cardsViewed: state.cardsViewed + 1,
      activityByDate: { ...state.activityByDate, [today]: (state.activityByDate[today] ?? 0) + 1 },
    };
  }
  if (action.type === 'finish-quiz') {
    const { attempt, outcomes, questionOutcomes } = action;
    const today = getLocalDateKey();
    const wordReviews = { ...state.wordReviews };
    const mistakes = new Set(state.mistakeWordIds);
    const missedQuestionsBySubject = { ...state.missedQuestionsBySubject };
    const missedForSubject = new Set(missedQuestionsBySubject[attempt.subject] ?? []);
    for (const outcome of questionOutcomes) {
      if (outcome.correct) missedForSubject.delete(outcome.questionId);
      else missedForSubject.add(outcome.questionId);
    }
    missedQuestionsBySubject[attempt.subject] = [...missedForSubject];
    for (const outcome of outcomes) {
      const schedule = getNextReviewSchedule(wordReviews[outcome.wordId], outcome.correct, today);
      wordReviews[outcome.wordId] = schedule;
      if (outcome.correct && schedule.repetitions >= 2) mistakes.delete(outcome.wordId);
      if (!outcome.correct) mistakes.add(outcome.wordId);
    }
    return {
      ...state,
      quizRuns: state.quizRuns + 1,
      bestScore: Math.max(state.bestScore, attempt.score),
      quizHistory: [...state.quizHistory, attempt].slice(-30),
      mistakeWordIds: [...mistakes],
      missedQuestionsBySubject,
      wordReviews,
      activityByDate: { ...state.activityByDate, [today]: (state.activityByDate[today] ?? 0) + attempt.total },
    };
  }
  if (action.type === 'bookmark') {
    const bookmarks = new Set(state.bookmarkedWordIds);
    if (bookmarks.has(action.wordId)) bookmarks.delete(action.wordId);
    else bookmarks.add(action.wordId);
    return { ...state, bookmarkedWordIds: [...bookmarks] };
  }
  if (action.type === 'daily-goal') return { ...state, dailyGoal: action.value };
  if (action.type === 'hydrate') return { ...state, hydrated: true, ...action.progress };
  if (action.type === 'theme') return { ...state, themeChoice: action.value };
  return state;
}

const StudyContext = createContext<ContextValue | null>(null);

export function StudyStateProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initial);
  const system = useColorScheme();
  const active = state.themeChoice === 'system' ? system : state.themeChoice;
  const palette = palettes[active === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    let progress = emptyProgress;
    if (typeof window !== 'undefined') {
      try { progress = loadProgress(window.localStorage); } catch { /* Browser storage can be unavailable. */ }
    }
    dispatch({ type: 'hydrate', progress });
  }, []);
  useEffect(() => {
    if (!state.hydrated || typeof window === 'undefined') return;
    try {
      const { themeChoice: _themeChoice, hydrated: _hydrated, ...progress } = state;
      saveProgress(window.localStorage, progress);
    } catch { /* The app remains usable when browser storage is disabled. */ }
  }, [state]);

  const value = useMemo<ContextValue>(() => ({
    state,
    palette,
    themeChoice: state.themeChoice,
    recordCard: () => dispatch({ type: 'view-card' }),
    finishQuiz: (subject, correct, total, outcomes, questionOutcomes) => {
      const score = calculateAccuracy(correct, total);
      dispatch({ type: 'finish-quiz', outcomes, questionOutcomes, attempt: { id: `${Date.now()}`, date: getLocalDateKey(), subject, correct, total, score } });
    },
    toggleBookmark: (wordId) => dispatch({ type: 'bookmark', wordId }),
    setDailyGoal: (goal) => dispatch({ type: 'daily-goal', value: goal }),
    setTheme: (value) => dispatch({ type: 'theme', value }),
  }), [state, palette]);

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used inside StudyStateProvider');
  return value;
}
