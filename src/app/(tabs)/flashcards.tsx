import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { VocabularyCard } from '@/components/VocabularyCard';
import { ActionButton, Body, Page, Title } from '@/components/StudyUI';
import { vocabulary } from '@/data/vocabulary';
import { useStudy } from '@/state/StudyStateProvider';

export default function FlashcardsScreen() {
  const [index, setIndex] = useState(0);
  const { palette, recordCard } = useStudy();
  const word = vocabulary[index];
  const next = () => { setIndex((index + 1) % vocabulary.length); recordCard(); };
  const previous = () => setIndex((index - 1 + vocabulary.length) % vocabulary.length);
  return <Page>
    <Title eyebrow="Flashcard deck" subtitle="Tap a card to reveal the meaning and word parts.">Learn in small steps</Title>
    <View style={styles.progress}><View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}><View style={[styles.fill, { backgroundColor: palette.primary, width: `${((index + 1) / vocabulary.length) * 100}%` }]} /></View><Text style={{ color: palette.muted, fontSize: 12, fontWeight: '700' }}>{index + 1} / {vocabulary.length}</Text></View>
    <VocabularyCard key={word.id} word={word} />
    <ActionButton label="Break down this word" secondary onPress={() => router.push(`/decipher/${word.id}`)} />
    <Body muted style={{ textAlign: 'center' }}>Use the sentence to help remember the word.</Body>
    <View style={styles.controls}><Pressable accessibilityRole="button" onPress={previous} style={[styles.arrow, { borderColor: palette.line, backgroundColor: palette.surface }]}><Text style={{ color: palette.text, fontSize: 20 }}>‹</Text></Pressable><View style={{ flex: 1 }}><ActionButton label="Next card  →" onPress={next} /></View><Pressable accessibilityRole="button" onPress={next} style={[styles.arrow, { borderColor: palette.line, backgroundColor: palette.surface }]}><Text style={{ color: palette.text, fontSize: 20 }}>›</Text></Pressable></View>
  </Page>;
}

const styles = StyleSheet.create({ progress: { flexDirection: 'row', alignItems: 'center', gap: 12 }, track: { flex: 1, height: 6, borderRadius: 6, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 6 }, controls: { flexDirection: 'row', alignItems: 'center', gap: 10 }, arrow: { width: 48, height: 48, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center' } });
