import test from 'node:test';
import assert from 'node:assert/strict';
import { nonVocabularyQuestions, subjects } from '../src/data/practiceQuestions.ts';
import { calculateAccuracy, emptyProgress, getDueReviewWordIds, getNextReviewSchedule, getStudyStreak, getWeeklyActivity, loadProgress, saveProgress } from '../src/utils/progress.ts';
import { createPracticeRound } from '../src/utils/practice.ts';

test('accuracy is bounded and handles an empty round', () => {
  assert.equal(calculateAccuracy(7, 10), 70);
  assert.equal(calculateAccuracy(12, 10), 100);
  assert.equal(calculateAccuracy(-2, 10), 0);
  assert.equal(calculateAccuracy(0, 0), 0);
});

test('review scheduling moves a missed word forward and grows successful intervals', () => {
  const firstMiss = getNextReviewSchedule(undefined, false, '2026-11-06');
  assert.deepEqual(firstMiss, { repetitions: 0, intervalDays: 1, dueDate: '2026-11-07' });
  const firstSuccess = getNextReviewSchedule(firstMiss, true, '2026-11-07');
  assert.deepEqual(firstSuccess, { repetitions: 1, intervalDays: 1, dueDate: '2026-11-08' });
  const secondSuccess = getNextReviewSchedule(firstSuccess, true, '2026-11-08');
  assert.deepEqual(secondSuccess, { repetitions: 2, intervalDays: 3, dueDate: '2026-11-11' });
  const thirdSuccess = getNextReviewSchedule(secondSuccess, true, '2026-11-11');
  assert.equal(thirdSuccess.intervalDays, 7);
});

test('study streak counts consecutive days and tolerates a day without activity yet', () => {
  assert.equal(getStudyStreak({ '2026-11-06': 3, '2026-11-05': 1, '2026-11-04': 4 }, '2026-11-06'), 3);
  assert.equal(getStudyStreak({ '2026-11-05': 1, '2026-11-03': 4 }, '2026-11-06'), 1);
  assert.equal(getStudyStreak({}, '2026-11-06'), 0);
});

test('weekly activity totals the last seven local dates', () => {
  assert.equal(getWeeklyActivity({ '2026-11-06': 3, '2026-11-03': 5, '2026-10-30': 10 }, '2026-11-06'), 8);
});

test('progress persists and reloads through a browser-storage-shaped adapter', () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const progress = { ...emptyProgress, cardsViewed: 12, bestScore: 80, bookmarkedWordIds: ['abate'], dailyGoal: 20 };
  assert.equal(saveProgress(storage, progress), true);
  const loaded = loadProgress(storage);
  assert.equal(loaded.cardsViewed, 12);
  assert.equal(loaded.bestScore, 80);
  assert.deepEqual(loaded.bookmarkedWordIds, ['abate']);
  assert.equal(loaded.dailyGoal, 20);
});

test('invalid stored progress is safely discarded and review dates determine due words', () => {
  assert.equal(loadProgress({ getItem: () => '{bad json', setItem: () => {} }).cardsViewed, 0);
  const due = getDueReviewWordIds(['late', 'today'], {
    late: { repetitions: 0, intervalDays: 1, dueDate: '2026-11-07' },
    today: { repetitions: 0, intervalDays: 1, dueDate: '2026-11-06' },
  }, '2026-11-06');
  assert.deepEqual(due, ['today']);
});

test('every new subject has original, answer-keyed questions', () => {
  assert.deepEqual(subjects.map((subject) => subject.id), [
    'word-knowledge', 'paragraph-comprehension', 'arithmetic-reasoning', 'mathematics-knowledge',
  ]);
  for (const subject of subjects.slice(1)) {
    const questions = nonVocabularyQuestions[subject.id];
    assert.equal(questions.length, 10);
    for (const question of questions) {
      assert.equal(question.choices.length, 4);
      assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4);
      assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId));
      assert.ok(question.explanation.length > 0);
    }
  }
});

test('generated Word Knowledge rounds contain unique words and four unique choices per question', () => {
  const round = createPracticeRound('word-knowledge', 10);
  assert.equal(round.length, 10);
  assert.equal(new Set(round.map((question) => question.wordId)).size, 10);
  for (const question of round) {
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4);
    assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId));
  }
});

test('configurable rounds honor length and retry only missed subject questions', () => {
  const fullRound = createPracticeRound('arithmetic-reasoning', 5);
  assert.equal(fullRound.length, 5);
  const questionIds = nonVocabularyQuestions['arithmetic-reasoning'].slice(0, 2).map((question) => question.id);
  const reviewRound = createPracticeRound('arithmetic-reasoning', 10, [], questionIds);
  assert.deepEqual(new Set(reviewRound.map((question) => question.id)), new Set(questionIds));
});
