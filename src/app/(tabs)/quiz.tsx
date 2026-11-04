import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, Body, Card, Page, Title } from '@/components/StudyUI';
import { QuizOption } from '@/components/QuizOption';
import { getWord } from '@/data/vocabulary';
import { useStudy } from '@/state/StudyStateProvider';

export default function QuizScreen() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { palette, finishQuiz, newQuiz, state } = useStudy();
  const questions = state.quizQuestions;
  const question = questions[index];
  const target = question ? getWord(question.wordId) : undefined;
  const correct = selected === question?.wordId;
  const answer = (id: string) => {
    if (selected || !question) return;
    setSelected(id);
    if (id === question.wordId) setScore((value) => value + 1);
  };
  const advance = () => {
    if (index + 1 === questions.length) {
      const totalCorrect = score;
      finishQuiz(Math.round((totalCorrect / questions.length) * 100));
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };
  const restart = () => { newQuiz(); setIndex(0); setSelected(null); setScore(0); setFinished(false); };

  return <Page>
    <Title eyebrow="Practice quiz" subtitle="Choose the meaning that best fits the word in context.">Word Knowledge check</Title>
    {finished ? <Card style={styles.result}>
      <Text style={{ fontSize: 46 }}>🎯</Text><Text style={[styles.score, { color: palette.text }]}>{score} / {questions.length}</Text><Body muted>You got {Math.round((score / questions.length) * 100)}% correct.</Body><Body>{score >= 7 ? 'Strong work. Keep building your vocabulary.' : 'Good practice. Review the tricky words and try again.'}</Body><ActionButton label="Try another round" onPress={restart} />
    </Card> : question && target ? <>
      <View style={styles.progress}><View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}><View style={[styles.fill, { backgroundColor: palette.primary, width: `${((index + 1) / questions.length) * 100}%` }]} /></View><Text style={{ color: palette.muted, fontWeight: '700' }}>{index + 1} / {questions.length}</Text></View>
      <Card style={styles.prompt}><Text style={[styles.kicker, { color: palette.primary }]}>WHAT DOES THIS WORD MEAN?</Text><Text style={[styles.term, { color: palette.text }]}>{target.term}</Text><Text style={[styles.sentence, { color: palette.muted }]}>{target.sentence}</Text></Card>
      <View style={{ gap: 10 }}>{question.optionIds.map((id) => { const option = getWord(id); if (!option) return null; return <QuizOption key={id} label={option.definition} selected={selected === id} correct={id === question.wordId} reveal={selected !== null} onPress={() => answer(id)} />; })}</View>
      {selected ? <Card style={[styles.feedback, { backgroundColor: correct ? palette.successWash : palette.dangerWash }]}><Text style={{ color: correct ? palette.success : palette.danger, fontWeight: '800' }}>{correct ? 'That’s right!' : `Not quite. ${target.definition}`}</Text><Body muted>{target.sentence}</Body><ActionButton label={index + 1 === questions.length ? 'See results' : 'Next question'} onPress={advance} /></Card> : <Body muted style={{ textAlign: 'center' }}>Your score: {score} correct so far</Body>}
    </> : null}
  </Page>;
}

const styles = StyleSheet.create({ progress: { flexDirection: 'row', alignItems: 'center', gap: 12 }, track: { flex: 1, height: 6, borderRadius: 6, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 6 }, prompt: { padding: 22, gap: 12 }, kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, term: { fontSize: 30, fontWeight: '800' }, sentence: { fontSize: 16, lineHeight: 24 }, feedback: { gap: 10 }, result: { alignItems: 'center', padding: 28, marginTop: 12 }, score: { fontSize: 40, fontWeight: '900' } });
