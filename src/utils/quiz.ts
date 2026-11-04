import { quizQuestions } from '@/data/quizQuestions';

export function getQuizSet(count = 10) {
  return quizQuestions.slice(0, count);
}
