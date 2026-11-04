import type { QuizQuestion } from '@/types/study';
import { vocabulary } from '@/data/vocabulary';

export const quizQuestions: QuizQuestion[] = vocabulary.slice(0, 20).map((word, index) => ({
  id: `question-${word.id}`,
  wordId: word.id,
  optionIds: [word.id, vocabulary[(index + 7) % vocabulary.length].id, vocabulary[(index + 19) % vocabulary.length].id, vocabulary[(index + 43) % vocabulary.length].id],
}));
