import { useCallback, useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton, Body, Card, Page, Title } from '@/components/StudyUI';
import { QuizOption } from '@/components/QuizOption';
import { getSubjectTitle, subjects } from '@/data/practiceQuestions';
import { useStudy } from '@/state/StudyStateProvider';
import { createPracticeRound } from '@/utils/practice';
import type { PracticeQuestion, PracticeSubject } from '@/types/study';

const validSubjects = new Set(subjects.map((subject) => subject.id));

export default function QuizScreen() {
  const params = useLocalSearchParams<{ subject?: string; mode?: string }>();
  const selectedSubject = validSubjects.has(params.subject as PracticeSubject) ? params.subject as PracticeSubject : null;
  const reviewMode = params.mode === 'review';
  return <QuizSession key={`${selectedSubject ?? 'catalog'}-${reviewMode ? 'review' : 'normal'}`} selectedSubject={selectedSubject} reviewMode={reviewMode} />;
}

function QuizSession({ selectedSubject, reviewMode }: { selectedSubject: PracticeSubject | null; reviewMode: boolean }) {
  const { palette, finishQuiz, state } = useStudy();
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [outcomes, setOutcomes] = useState<{ wordId: string; correct: boolean }[]>([]);
  const [questionOutcomes, setQuestionOutcomes] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const completionRecorded = useRef(false);
  const subject: PracticeSubject = selectedSubject ?? 'word-knowledge';
  const question = round[index];

  const completeRound = useCallback(() => {
    if (completionRecorded.current || !selectedSubject || round.length === 0) return;
    completionRecorded.current = true;
    const finalQuestions = round.map((item) => questionOutcomes.find((outcome) => outcome.questionId === item.id) ?? { questionId: item.id, correct: false });
    const finalWords = [...outcomes];
    for (const item of round) {
      if (item.wordId && !finalWords.some((outcome) => outcome.wordId === item.wordId)) finalWords.push({ wordId: item.wordId, correct: false });
    }
    finishQuiz(subject, correctCount, round.length, finalWords, finalQuestions);
    setFinished(true);
  }, [correctCount, finishQuiz, outcomes, questionOutcomes, round, selectedSubject, subject]);

  useEffect(() => {
    if (!started || !timed || finished) return;
    const timer = setTimeout(() => setTimeLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [finished, started, timeLeft, timed]);

  useEffect(() => {
    if (started && timed && timeLeft === 0) completeRound();
  }, [completeRound, started, timed, timeLeft]);

  const start = () => {
    const reviewIds = reviewMode && subject === 'word-knowledge' ? state.mistakeWordIds : [];
    const missedQuestions = reviewMode ? state.missedQuestionsBySubject[subject] ?? [] : [];
    const nextRound = createPracticeRound(subject, count, reviewIds, missedQuestions);
    setRound(nextRound);
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setOutcomes([]);
    setQuestionOutcomes([]);
    setTimeLeft(count * 12);
    setFinished(false);
    completionRecorded.current = false;
    setStarted(true);
  };

  const answer = (choiceId: string) => {
    if (selected || !question) return;
    setSelected(choiceId);
    const isCorrect = choiceId === question.correctChoiceId;
    if (isCorrect) setCorrectCount((value) => value + 1);
    setQuestionOutcomes((value) => [...value, { questionId: question.id, correct: isCorrect }]);
    if (question.wordId) setOutcomes((value) => [...value, { wordId: question.wordId!, correct: isCorrect }]);
  };

  const advance = () => {
    if (index + 1 >= round.length) completeRound();
    else {
      setIndex((value) => value + 1);
      setSelected(null);
    }
  };

  if (!selectedSubject) return <Page>
    <Title eyebrow="Practice" subtitle="Choose a subject. Practice questions are original study material, not official ASVAB questions.">Build test-day skills</Title>
    {subjects.map((item) => <Pressable key={item.id} accessibilityRole="button" onPress={() => router.push(`/(tabs)/quiz?subject=${item.id}`)}><Card style={styles.subjectCard}><Text style={[styles.subjectTitle, { color: palette.text }]}>{item.title}</Text><Body muted>{item.description}</Body><Text style={{ color: palette.primary, fontWeight: '800' }}>Practice this subject →</Text></Card></Pressable>)}
    {subjects.map((item) => {
      const missed = item.id === 'word-knowledge' ? state.mistakeWordIds.length : (state.missedQuestionsBySubject[item.id]?.length ?? 0);
      return missed > 0 ? <ActionButton key={item.id} label={`Review ${missed} missed ${item.id === 'word-knowledge' ? 'words' : 'questions'} · ${item.title}`} secondary onPress={() => router.push(`/(tabs)/quiz?subject=${item.id}&mode=review`)} /> : null;
    })}
  </Page>;

  if (!started) return <Page>
    <Title eyebrow="Practice setup" subtitle={subjects.find((item) => item.id === subject)?.description}>{getSubjectTitle(subject)}</Title>
    {reviewMode ? <Card><Body>{subject === 'word-knowledge' ? (state.mistakeWordIds.length ? `${state.mistakeWordIds.length} words are in your review notebook.` : 'Your review notebook is empty. Take a Word Knowledge quiz to add missed words.') : `${state.missedQuestionsBySubject[subject]?.length ?? 0} missed questions are ready to retry.`}</Body></Card> : null}
    <Card><Text style={[styles.settingTitle, { color: palette.text }]}>Questions</Text><View style={styles.choices}>{[5, 10].map((value) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: count === value }} onPress={() => setCount(value)} style={[styles.choice, { backgroundColor: count === value ? palette.primary : palette.surfaceAlt }]}><Text style={{ color: count === value ? '#fff' : palette.text, fontWeight: '800' }}>{value}</Text></Pressable>)}</View><Text style={[styles.settingTitle, { color: palette.text }]}>Pace</Text><View style={styles.choices}>{[false, true].map((value) => <Pressable key={`${value}`} accessibilityRole="button" accessibilityState={{ selected: timed === value }} onPress={() => setTimed(value)} style={[styles.pace, { backgroundColor: timed === value ? palette.primary : palette.surfaceAlt }]}><Text style={{ color: timed === value ? '#fff' : palette.text, fontWeight: '700' }}>{value ? 'Timed · 12 sec/question' : 'Untimed'}</Text></Pressable>)}</View></Card>
    <ActionButton label={reviewMode && (subject === 'word-knowledge' ? state.mistakeWordIds.length === 0 : (state.missedQuestionsBySubject[subject]?.length ?? 0) === 0) ? 'Back to subjects' : reviewMode ? 'Retry missed questions' : 'Start practice'} onPress={reviewMode && (subject === 'word-knowledge' ? state.mistakeWordIds.length === 0 : (state.missedQuestionsBySubject[subject]?.length ?? 0) === 0) ? () => router.replace('/(tabs)/quiz') : start} />
  </Page>;

  if (finished) return <Page>
    <Title eyebrow="Round complete">Nice work</Title>
    <Card style={styles.result}><Text style={[styles.resultScore, { color: palette.text }]}>{correctCount} / {round.length}</Text><Body muted>{round.length ? Math.round((correctCount / round.length) * 100) : 0}% correct · {getSubjectTitle(subject)}</Body><Body>Your best score is saved on this device. Review missed vocabulary to help it stick.</Body>{state.mistakeWordIds.length > 0 ? <ActionButton label={`Review missed words (${state.mistakeWordIds.length})`} secondary onPress={() => router.replace('/(tabs)/quiz?subject=word-knowledge&mode=review')} /> : null}<ActionButton label="Try another round" onPress={start} /><ActionButton label="Choose another subject" secondary onPress={() => router.replace('/(tabs)/quiz')} /></Card>
  </Page>;

  if (!question) return <Page><Title>Practice questions unavailable</Title><Body muted>Try choosing another subject.</Body><ActionButton label="Choose a subject" onPress={() => router.replace('/(tabs)/quiz')} /></Page>;
  const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId);
  const selectedChoice = question.choices.find((choice) => choice.id === selected);
  return <Page>
    <Title eyebrow={getSubjectTitle(subject)} subtitle={timed ? `${Math.floor(timeLeft / 60)}:${`${timeLeft % 60}`.padStart(2, '0')} remaining` : undefined}>Question {index + 1} of {round.length}</Title>
    <View style={styles.progress}><View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}><View style={[styles.fill, { backgroundColor: palette.primary, width: `${((index + 1) / round.length) * 100}%` }]} /></View><Text style={{ color: palette.muted, fontWeight: '700' }}>{correctCount} correct</Text></View>
    {question.passage ? <Card style={styles.passage}><Body>{question.passage}</Body></Card> : null}
    <Card style={styles.prompt}><Text style={[styles.promptText, { color: palette.text }]}>{subject === 'word-knowledge' ? `What does “${question.prompt}” mean in this context?` : question.prompt}</Text></Card>
    <View style={{ gap: 10 }}>{question.choices.map((choice) => <QuizOption key={choice.id} label={choice.label} selected={selected === choice.id} correct={choice.id === question.correctChoiceId} reveal={selected !== null} onPress={() => answer(choice.id)} />)}</View>
    {selected ? <Card style={styles.feedback}><Text style={{ color: selected === question.correctChoiceId ? palette.success : palette.danger, fontWeight: '800' }}>{selected === question.correctChoiceId ? 'Correct' : `Correct answer: ${correctChoice?.label}`}</Text><Body>{question.explanation}</Body>{selectedChoice && selected !== question.correctChoiceId ? <Body muted>Your choice: {selectedChoice.label}</Body> : null}<ActionButton label={index + 1 === round.length ? 'Finish round' : 'Next question'} onPress={advance} /></Card> : null}
  </Page>;
}

const styles = StyleSheet.create({ subjectCard: { padding: 17 }, subjectTitle: { fontSize: 17, fontWeight: '800' }, settingTitle: { fontWeight: '800', fontSize: 15 }, choices: { flexDirection: 'row', gap: 10 }, choice: { width: 52, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, pace: { flex: 1, minHeight: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }, result: { alignItems: 'center', padding: 25 }, resultScore: { fontSize: 42, fontWeight: '900' }, progress: { flexDirection: 'row', alignItems: 'center', gap: 12 }, track: { flex: 1, height: 6, borderRadius: 6, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 6 }, passage: { backgroundColor: '#172844' }, prompt: { padding: 22 }, promptText: { fontSize: 20, lineHeight: 28, fontWeight: '700' }, feedback: { gap: 10 } });
