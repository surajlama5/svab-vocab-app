import type { QuizQuestion, VocabularyWord } from '../types/study.ts';
import { vocabulary } from '../data/vocabulary.ts';

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

/** Creates a fresh round with unique question words and randomized distractors. */
export function generateQuizQuestions(words: readonly VocabularyWord[] = vocabulary, count = 10): QuizQuestion[] {
  const uniqueWords = [...new Map(words.map((word) => [word.id, word])).values()];
  const questionWords = shuffled(uniqueWords).slice(0, Math.max(0, count));

  return questionWords.map((word) => {
    const distractors = shuffled(uniqueWords.filter((candidate) => candidate.id !== word.id)).slice(0, 3);
    return {
      id: `question-${word.id}`,
      wordId: word.id,
      optionIds: shuffled([word.id, ...distractors.map((candidate) => candidate.id)]),
    };
  });
}

export const getQuizSet = generateQuizQuestions;
