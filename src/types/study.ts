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
