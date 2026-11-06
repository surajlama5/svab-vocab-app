import { getWord, vocabulary } from '../data/vocabulary.ts';
import { nonVocabularyQuestions } from '../data/practiceQuestions.ts';
import { generateQuizQuestions } from './quiz.ts';
import type { PracticeQuestion, PracticeSubject } from '../types/study';

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
}

export function createPracticeRound(subject: PracticeSubject, count: number, reviewWordIds: readonly string[] = [], reviewQuestionIds: readonly string[] = []): PracticeQuestion[] {
  if (subject === 'word-knowledge') {
    const sourceWords = reviewWordIds.length > 0
      ? reviewWordIds.map((id) => getWord(id)).filter((word) => word !== undefined)
      : vocabulary;
    return generateQuizQuestions(sourceWords, count).flatMap((question) => {
      const target = getWord(question.wordId);
      if (!target) return [];
      return [{
        id: question.id,
        subject,
        prompt: target.term,
        passage: target.sentence,
        choices: shuffled(question.optionIds.flatMap((id) => {
          const word = getWord(id);
          return word ? [{ id, label: word.definition }] : [];
        })),
        correctChoiceId: target.id,
        explanation: `${target.term}: ${target.definition}`,
        wordId: target.id,
      }];
    });
  }

  const availableQuestions = nonVocabularyQuestions[subject] ?? [];
  const sourceQuestions = reviewQuestionIds.length > 0
    ? availableQuestions.filter((question) => reviewQuestionIds.includes(question.id))
    : availableQuestions;
  return shuffled(sourceQuestions).slice(0, count).map((question) => ({
    ...question,
    choices: shuffled(question.choices),
  }));
}
