import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Card, Page, Title } from '@/components/StudyUI';
import { getWord } from '@/data/vocabulary';
import { wordParts } from '@/data/wordParts';
import { useStudy } from '@/state/StudyStateProvider';

export default function DecipherScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const word = getWord(id ?? '');
  const { palette } = useStudy();
  if (!word) return <Page><Stack.Screen options={{ title: 'Decipher Engine' }} /><Title>Word not found</Title><Body muted>Try opening a word from the vocabulary deck.</Body><Link href="/(tabs)/flashcards">Back to flashcards</Link></Page>;
  const relatedParts = wordParts.filter((part) => part.example === word.id);
  return <Page>
    <Stack.Screen options={{ title: 'Decipher Engine', headerShown: true, headerBackTitle: 'Back', headerStyle: { backgroundColor: palette.background }, headerTintColor: palette.text, headerTitleStyle: { color: palette.text } }} />
    <Title eyebrow="Decipher Engine" subtitle="Use word parts as clues, then check your guess against the sentence.">Take the word apart</Title>
    <Card style={styles.wordCard}><Text style={[styles.word, { color: palette.text }]}>{word.term}</Text><Text style={[styles.definition, { color: palette.primary }]}>{word.definition}</Text><Text style={[styles.sentence, { color: palette.muted }]}>{word.sentence}</Text></Card>
    <View style={styles.parts}>{word.breakdown.map((part, index) => <View key={`${part}-${index}`} style={[styles.part, { backgroundColor: palette.surface, borderColor: palette.line }]}><Text style={[styles.partText, { color: palette.primary }]}>{part}</Text>{index < word.breakdown.length - 1 ? <Text style={{ color: palette.muted, fontWeight: '800' }}>+</Text> : null}</View>)}</View>
    <Card style={styles.lesson}><Text style={[styles.lessonTitle, { color: palette.text }]}>How the clue works</Text><Body>{word.decipher}</Body>{relatedParts.map((part) => <View key={part.id} style={[styles.rootHint, { backgroundColor: palette.accentWash }]}><Text style={{ fontSize: 11, fontWeight: '800', color: palette.accent }}>{part.kind.toUpperCase()} • {part.form}</Text><Text style={{ color: palette.text, fontSize: 14, marginTop: 4 }}>{part.meaning}</Text></View>)}</Card>
    <Card style={styles.method}><Text style={[styles.lessonTitle, { color: palette.text }]}>Try this on the test</Text><Body muted>1. Circle any familiar prefix, root, or suffix.{ '\n' }2. Use its meaning to predict the whole word.{ '\n' }3. Read the surrounding sentence to confirm the best answer.</Body></Card>
    <Link href="/(tabs)/flashcards" asChild><Pressable style={StyleSheet.flatten([styles.back, { borderColor: palette.line }])}><Text style={{ color: palette.primary, fontWeight: '700' }}>Back to flashcards</Text></Pressable></Link>
  </Page>;
}

const styles = StyleSheet.create({ wordCard: { padding: 24, backgroundColor: '#172844' }, word: { fontSize: 36, fontWeight: '900', color: '#fff' }, definition: { fontSize: 18, fontWeight: '700' }, sentence: { color: '#B5C3D8', lineHeight: 22 }, parts: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }, part: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 8 }, partText: { fontWeight: '700', fontSize: 13 }, lesson: { gap: 12 }, lessonTitle: { fontSize: 17, fontWeight: '800' }, rootHint: { padding: 12, borderRadius: 13 }, method: { gap: 8 }, back: { padding: 15, borderWidth: 1, borderRadius: 15, alignItems: 'center' } });
