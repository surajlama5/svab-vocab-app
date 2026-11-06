import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton, Body, Card, Page, SectionHeading } from '@/components/StudyUI';
import { useStudy } from '@/state/StudyStateProvider';
import { vocabulary } from '@/data/vocabulary';
import { wordParts } from '@/data/wordParts';
import { getDueReviewWordIds, getLocalDateKey, getStudyStreak, getWeeklyActivity } from '@/utils/progress';
import { getSubjectTitle, subjects } from '@/data/practiceQuestions';

const GOALS = [5, 10, 20, 30];

export default function HomeScreen() {
  const { palette, state, themeChoice, setTheme, setDailyGoal } = useStudy();
  const cycleTheme = () => setTheme(themeChoice === 'system' ? 'dark' : themeChoice === 'dark' ? 'light' : 'system');
  const todayCount = state.activityByDate[getLocalDateKey()] ?? 0;
  const streak = getStudyStreak(state.activityByDate);
  const weeklyCount = getWeeklyActivity(state.activityByDate);
  const dueWordCount = getDueReviewWordIds(state.mistakeWordIds, state.wordReviews).length;
  const latest = state.quizHistory[state.quizHistory.length - 1];
  const masteredCount = Object.values(state.wordReviews).filter((review) => review.repetitions >= 2).length;
  const nextSubject = latest && latest.score < 70 ? latest.subject : 'word-knowledge';
  const subjectWithMistakes = subjects.find((subject) => (state.missedQuestionsBySubject[subject.id]?.length ?? 0) > 0);
  const recommendation = state.mistakeWordIds.length > 0
    ? { label: `Review ${state.mistakeWordIds.length} missed words`, action: () => router.push('/(tabs)/quiz?subject=word-knowledge&mode=review') }
    : subjectWithMistakes
      ? { label: `Review ${state.missedQuestionsBySubject[subjectWithMistakes.id]?.length ?? 0} missed questions`, action: () => router.push(`/(tabs)/quiz?subject=${subjectWithMistakes.id}&mode=review`) }
      : { label: `Practice ${getSubjectTitle(nextSubject)}`, action: () => router.push(`/(tabs)/quiz?subject=${nextSubject}`) };
  const featured = vocabulary[0];
  const goalIndex = GOALS.indexOf(state.dailyGoal);
  const changeGoal = () => setDailyGoal(GOALS[(goalIndex + 1) % GOALS.length]);

  return <Page>
    <View style={styles.topline}><Text style={[styles.brand, { color: palette.muted }]}>ASVAB • STUDY DASHBOARD</Text><Pressable accessibilityRole="button" accessibilityLabel="Change color theme" onPress={cycleTheme} style={[styles.themeButton, { backgroundColor: palette.surface, borderColor: palette.line }]}><Text style={{ color: palette.text }}>{themeChoice === 'system' ? '◐' : themeChoice === 'dark' ? '☾' : '☀'}  Theme</Text></Pressable></View>
    <View style={styles.hero}><View style={styles.heroMark}><Text style={{ color: '#fff', fontSize: 26, fontWeight: '900' }}>A</Text></View><View style={{ flex: 1, gap: 6 }}><Text style={[styles.heroTitle, { color: palette.text }]}>Words unlock{ '\n' }understanding.</Text><Text style={[styles.heroText, { color: palette.muted }]}>Build confidence for Word Knowledge & Paragraph Comprehension.</Text></View></View>

    <Card style={styles.goalCard}><View style={styles.goalHeader}><View><Text style={[styles.cardTitle, { color: palette.text }]}>Today’s goal</Text><Text style={{ color: palette.muted }}>{todayCount} of {state.dailyGoal} study questions/cards</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Change daily study goal" onPress={changeGoal}><Text style={{ color: palette.primary, fontWeight: '800' }}>Change</Text></Pressable></View><View style={[styles.goalTrack, { backgroundColor: palette.surfaceAlt }]}><View style={[styles.goalFill, { backgroundColor: palette.accent, width: `${Math.min(100, (todayCount / state.dailyGoal) * 100)}%` }]} /></View><Text style={{ color: palette.muted, fontSize: 12 }}>Daily target: {state.dailyGoal} · tap Change to adjust</Text></Card>
    {dueWordCount > 0 ? <Card style={styles.recommendation}><Text style={[styles.cardTitle, { color: palette.text }]}>{dueWordCount} spaced review{dueWordCount === 1 ? '' : 's'} due</Text><Body muted>Revisit these words when they’re due to strengthen recall.</Body><ActionButton label="Open due words" secondary onPress={() => router.push('/(tabs)/flashcards')} /></Card> : null}

    <View style={styles.stats}><Card style={styles.stat}><Text style={[styles.statNumber, { color: palette.text }]}>{streak} 🔥</Text><Text style={{ color: palette.muted }}>day streak</Text></Card><Card style={styles.stat}><Text style={[styles.statNumber, { color: palette.text }]}>{state.bestScore}%</Text><Text style={{ color: palette.muted }}>best accuracy</Text></Card><Card style={styles.stat}><Text style={[styles.statNumber, { color: palette.text }]}>{masteredCount}</Text><Text style={{ color: palette.muted }}>words mastered</Text></Card></View>

    <SectionHeading>Pick up where you left off</SectionHeading>
    <ActionButton label={state.cardsViewed > 0 ? 'Continue flashcards' : 'Start Word Knowledge'} onPress={() => router.push(state.cardsViewed > 0 ? '/(tabs)/flashcards' : '/(tabs)/quiz?subject=word-knowledge')} />
    <Card style={styles.recommendation}><Text style={[styles.cardTitle, { color: palette.text }]}>Recommended next</Text><Body muted>{state.mistakeWordIds.length > 0 ? 'A short review of missed words is ready.' : subjectWithMistakes ? 'Retry questions you missed in your recent practice.' : latest && latest.score < 70 ? `Your last ${getSubjectTitle(latest.subject)} round scored ${latest.score}%. Try another practice round.` : 'Keep building Word Knowledge and try a new subject when you’re ready.'}</Body><ActionButton label={recommendation.label} secondary onPress={recommendation.action} /></Card>

    <SectionHeading trailing={<Text style={{ color: palette.muted, fontSize: 12 }}>{weeklyCount} items this week</Text>}>Recent activity</SectionHeading>
    {latest ? <Card style={styles.activity}><View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: palette.text }]}>{getSubjectTitle(latest.subject)}</Text><Text style={{ color: palette.muted }}>{latest.date} · {latest.correct}/{latest.total} correct</Text></View><Text style={[styles.activityScore, { color: latest.score >= 70 ? palette.success : palette.danger }]}>{latest.score}%</Text></Card> : <Card><Body muted>Complete a practice round to see your results here.</Body></Card>}

    <SectionHeading>Study by subject</SectionHeading>
    <View style={styles.subjects}>{subjects.map((subject) => {
      const attempts = state.quizHistory.filter((attempt) => attempt.subject === subject.id);
      const accuracy = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : null;
      return <Pressable key={subject.id} accessibilityRole="button" onPress={() => router.push(`/(tabs)/quiz?subject=${subject.id}`)} style={[styles.subject, { backgroundColor: palette.surface, borderColor: palette.line }]}><Text style={[styles.subjectTitle, { color: palette.text }]}>{subject.title}</Text><Text style={{ color: palette.muted, fontSize: 12 }}>{accuracy === null ? 'Not practiced' : `${accuracy}% avg accuracy`}</Text></Pressable>;
    })}</View>

    <SectionHeading>Choose your study path</SectionHeading>
    <Pressable onPress={() => router.push('/(tabs)/roots')}><Card style={styles.pillar}><View style={[styles.pillarIcon, { backgroundColor: palette.accentWash }]}><Text style={{ fontSize: 23 }}>🧩</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[styles.pillarTitle, { color: palette.text }]}>Word Roots & Prefixes</Text><Body muted>Decode unfamiliar words from their parts.</Body></View><Text style={{ color: palette.muted, fontSize: 20 }}>›</Text></Card></Pressable>
    <Pressable onPress={() => router.push('/(tabs)/flashcards')}><Card style={styles.pillar}><View style={[styles.pillarIcon, { backgroundColor: palette.goldWash }]}><Text style={{ fontSize: 23 }}>🗂️</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[styles.pillarTitle, { color: palette.text }]}>Flashcard Deck</Text><Body muted>Search, save, and review vocabulary.</Body></View><Text style={{ color: palette.muted, fontSize: 20 }}>›</Text></Card></Pressable>
    <SectionHeading>Today’s decipher</SectionHeading>
    <Card style={styles.decipher}><Text style={[styles.decipherTag, { color: palette.accent }]}>DECIPHER ENGINE • {wordParts.length} WORD PARTS</Text><Text style={[styles.pillarTitle, { color: palette.text }]}>{featured.term}</Text><Body muted>{featured.breakdown.join('   +   ')}</Body><Body>{featured.decipher}</Body><ActionButton label="See how it works" onPress={() => router.push(`/decipher/${featured.id}`)} /></Card>
    <Body muted style={{ textAlign: 'center', fontSize: 12 }}>Practice questions are original study material and are not official ASVAB questions.</Body>
  </Page>;
}

const styles = StyleSheet.create({
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, themeButton: { borderWidth: 1, borderRadius: 30, paddingHorizontal: 12, paddingVertical: 8 },
  hero: { minHeight: 170, borderRadius: 27, backgroundColor: '#172844', padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16, overflow: 'hidden' }, heroMark: { width: 58, height: 58, borderRadius: 19, backgroundColor: '#3159C7', alignItems: 'center', justifyContent: 'center' }, heroTitle: { fontSize: 27, lineHeight: 31, fontWeight: '800', letterSpacing: -0.6 }, heroText: { fontSize: 13, lineHeight: 19 },
  goalCard: { padding: 16 }, goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cardTitle: { fontSize: 15, fontWeight: '800' }, goalTrack: { height: 8, overflow: 'hidden', borderRadius: 8 }, goalFill: { height: '100%', borderRadius: 8 }, stats: { flexDirection: 'row', gap: 8 }, stat: { flex: 1, padding: 12, alignItems: 'center', justifyContent: 'center' }, statNumber: { fontSize: 20, fontWeight: '900' },
  recommendation: { padding: 16 }, activity: { flexDirection: 'row', alignItems: 'center' }, activityScore: { fontSize: 20, fontWeight: '900' }, subjects: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, subject: { width: '48%', minHeight: 75, borderWidth: 1, borderRadius: 16, padding: 13, justifyContent: 'center', gap: 6 }, subjectTitle: { fontSize: 14, fontWeight: '800' },
  pillar: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }, pillarIcon: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }, pillarTitle: { fontSize: 16, fontWeight: '800' }, decipher: { padding: 19 }, decipherTag: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
