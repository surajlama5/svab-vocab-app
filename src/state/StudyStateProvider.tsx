import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, type Palette } from '@/constants/colors';
import type { QuizQuestion } from '@/types/study';
import { generateQuizQuestions } from '@/utils/quiz';

type ThemeChoice = 'light' | 'dark' | 'system';
type StudyState = { cardsViewed: number; quizRuns: number; bestScore: number; themeChoice: ThemeChoice; quizQuestions: QuizQuestion[] };
type Action = { type: 'view-card' } | { type: 'finish-quiz'; score: number } | { type: 'new-quiz'; questions: QuizQuestion[] } | { type: 'theme'; value: ThemeChoice };
type ContextValue = { state: StudyState; palette: Palette; themeChoice: ThemeChoice; recordCard: () => void; finishQuiz: (score: number) => void; newQuiz: () => void; setTheme: (value: ThemeChoice) => void };

const initial: StudyState = { cardsViewed: 0, quizRuns: 0, bestScore: 0, themeChoice: 'system', quizQuestions: generateQuizQuestions() };
function reducer(state: StudyState, action: Action): StudyState {
  if (action.type === 'view-card') return { ...state, cardsViewed: state.cardsViewed + 1 };
  if (action.type === 'finish-quiz') return { ...state, quizRuns: state.quizRuns + 1, bestScore: Math.max(state.bestScore, action.score) };
  if (action.type === 'new-quiz') return { ...state, quizQuestions: action.questions };
  return { ...state, themeChoice: action.value };
}

const StudyContext = createContext<ContextValue | null>(null);
export function StudyStateProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initial);
  const system = useColorScheme();
  const active = state.themeChoice === 'system' ? system : state.themeChoice;
  const palette = palettes[active === 'dark' ? 'dark' : 'light'];
  const value = useMemo<ContextValue>(() => ({
    state, palette, themeChoice: state.themeChoice,
    recordCard: () => dispatch({ type: 'view-card' }),
    finishQuiz: (score) => dispatch({ type: 'finish-quiz', score }),
    newQuiz: () => dispatch({ type: 'new-quiz', questions: generateQuizQuestions() }),
    setTheme: (themeChoice) => dispatch({ type: 'theme', value: themeChoice }),
  }), [state, palette]);
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used inside StudyStateProvider');
  return value;
}
