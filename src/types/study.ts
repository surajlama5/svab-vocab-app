export type WordPart = {
  id: string;
  kind: 'prefix' | 'root' | 'suffix';
  form: string;
  meaning: string;
  example: string;
};

export type VocabularyWord = {
  id: string;
  term: string;
  definition: string;
  sentence: string;
  breakdown: string[];
  decipher: string;
};

export type QuizQuestion = {
  id: string;
  wordId: string;
  optionIds: string[];
};

export type PracticeSubject = 'word-knowledge' | 'paragraph-comprehension' | 'arithmetic-reasoning' | 'mathematics-knowledge';

export type PracticeChoice = { id: string; label: string };

export type PracticeQuestion = {
  id: string;
  subject: PracticeSubject;
  prompt: string;
  choices: PracticeChoice[];
  correctChoiceId: string;
  explanation: string;
  passage?: string;
  wordId?: string;
};

export type QuizAttempt = {
  id: string;
  date: string;
  subject: PracticeSubject;
  correct: number;
  total: number;
  score: number;
};

export type WordReview = {
  repetitions: number;
  intervalDays: number;
  dueDate: string;
};

export type QuestionOutcome = { questionId: string; correct: boolean };
