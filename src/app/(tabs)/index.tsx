import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton, Body, Card, Page, SectionHeading } from '@/components/StudyUI';
import { useStudy } from '@/state/StudyStateProvider';
import { vocabulary } from '@/data/vocabulary';
import { wordParts } from '@/data/wordParts';

export default function HomeScreen() {
  const { palette, state, themeChoice, setTheme } = useStudy();
  const cycleTheme = () => setTheme(themeChoice === 'system' ? 'dark' : themeChoice === 'dark' ? 'light' : 'system');
  const highlight = vocabulary[0];
  return <Page>
    <View style={styles.topline}><Text style={[styles.brand, { color: palette.muted }]}>ASVAB • WORD KNOWLEDGE</Text><Pressable accessibilityRole="button" onPress={cycleTheme} style={[styles.themeButton, { backgroundColor: palette.surface, borderColor: palette.line }]}><Text style={{ color: palette.text }}>{themeChoice === 'system' ? '◐' : themeChoice === 'dark' ? '☾' : '☀'}  Theme</Text></Pressable></View>
    <View style={styles.hero}><Text style={styles.heroMark}>A</Text><View style={{ flex: 1, gap: 6 }}><Text style={[styles.heroTitle, { color: palette.text }]}>Words unlock{ '\n' }understanding.</Text><Text style={[styles.heroText, { color: palette.muted }]}>Build confidence for Word Knowledge & Paragraph Comprehension.</Text></View></View>
    <Card style={styles.progress}><View><Text style={[styles.progressNumber, { color: palette.text }]}>{state.cardsViewed}</Text><Text style={{ color: palette.muted }}>cards reviewed</Text></View><View style={[styles.divider, { backgroundColor: palette.line }]} /><View><Text style={[styles.progressNumber, { color: palette.text }]}>{state.bestScore}%</Text><Text style={{ color: palette.muted }}>best quiz score</Text></View><View style={[styles.divider, { backgroundColor: palette.line }]} /><View><Text style={[styles.progressNumber, { color: palette.text }]}>{vocabulary.length}</Text><Text style={{ color: palette.muted }}>words to learn</Text></View></Card>
    <SectionHeading>Choose your study path</SectionHeading>
    <Link href="/(tabs)/roots" asChild><Pressable><Card style={styles.pillar}><View style={[styles.pillarIcon, { backgroundColor: palette.accentWash }]}><Text style={{ fontSize: 23 }}>🧩</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[styles.pillarTitle, { color: palette.text }]}>Word Roots & Prefixes</Text><Body muted>Decode unfamiliar words from their parts.</Body></View><Text style={{ color: palette.muted, fontSize: 20 }}>›</Text></Card></Pressable></Link>
    <Link href="/(tabs)/flashcards" asChild><Pressable><Card style={styles.pillar}><View style={[styles.pillarIcon, { backgroundColor: palette.goldWash }]}><Text style={{ fontSize: 23 }}>🗂️</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[styles.pillarTitle, { color: palette.text }]}>Flashcard Deck</Text><Body muted>Learn with context sentences and quick flips.</Body></View><Text style={{ color: palette.muted, fontSize: 20 }}>›</Text></Card></Pressable></Link>
    <Link href="/(tabs)/quiz" asChild><Pressable><Card style={styles.pillar}><View style={[styles.pillarIcon, { backgroundColor: palette.purpleWash }]}><Text style={{ fontSize: 23 }}>✍️</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[styles.pillarTitle, { color: palette.text }]}>Practice Quiz</Text><Body muted>Test meanings in sentence context.</Body></View><Text style={{ color: palette.muted, fontSize: 20 }}>›</Text></Card></Pressable></Link>
    <SectionHeading>Today’s decipher</SectionHeading>
    <Card style={styles.decipher}><Text style={[styles.decipherTag, { color: palette.accent }]}>DECIPHER ENGINE • {wordParts.length} WORD PARTS</Text><Text style={[styles.pillarTitle, { color: palette.text }]}>{highlight.term}</Text><Body muted>{highlight.breakdown.join('   +   ')}</Body><Body>{highlight.decipher}</Body><ActionButton label="See how it works" onPress={() => router.push(`/decipher/${highlight.id}`)} /></Card>
  </Page>;
}

const styles = StyleSheet.create({
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, brand: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, themeButton: { borderWidth: 1, borderRadius: 30, paddingHorizontal: 12, paddingVertical: 8 },
  hero: { minHeight: 184, borderRadius: 27, backgroundColor: '#172844', padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16, overflow: 'hidden' }, heroMark: { width: 58, height: 58, lineHeight: 58, textAlign: 'center', borderRadius: 19, backgroundColor: '#3159C7', color: '#fff', fontSize: 31, fontWeight: '900' }, heroTitle: { fontSize: 27, lineHeight: 31, fontWeight: '800', letterSpacing: -0.6 }, heroText: { fontSize: 13, lineHeight: 19 },
  progress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 }, progressNumber: { fontSize: 20, fontWeight: '800', textAlign: 'center' }, divider: { height: 35, width: 1 }, pillar: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }, pillarIcon: { width: 46, height: 46, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }, pillarTitle: { fontSize: 16, fontWeight: '800' }, decipher: { padding: 19 }, decipherTag: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
