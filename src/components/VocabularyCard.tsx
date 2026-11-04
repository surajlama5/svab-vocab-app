import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { VocabularyWord } from '@/types/study';
import { useStudy } from '@/state/StudyStateProvider';

export function VocabularyCard({ word }: { word: VocabularyWord }) {
  const [flipped, setFlipped] = useState(false);
  const { palette } = useStudy();
  return <Pressable accessibilityRole="button" accessibilityLabel={flipped ? `${word.term}, definition: ${word.definition}` : `${word.term}, tap to reveal definition`} onPress={() => setFlipped((value) => !value)} style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }]}>
    <Text style={[styles.kicker, { color: palette.primary }]}>{flipped ? 'DEFINITION' : 'TAP TO REVEAL'}</Text>
    {flipped ? <>
      <Text style={[styles.definition, { color: palette.text }]}>{word.definition}</Text>
      <Text style={[styles.sentence, { color: palette.muted }]}>{word.sentence}</Text>
      <View style={styles.breakdown}>{word.breakdown.map((part, index) => <Text key={`${part}-${index}`} style={[styles.part, { color: palette.primary, backgroundColor: palette.surfaceAlt }]}>{part}</Text>)}</View>
    </> : <>
      <Text style={[styles.term, { color: palette.text }]}>{word.term}</Text>
      <Text style={[styles.sentence, { color: palette.muted }]}>{word.sentence}</Text>
    </>}
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { minHeight: 300, width: '100%', borderWidth: 1, borderRadius: 28, padding: 24, justifyContent: 'center', gap: 17 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  term: { fontSize: 40, fontWeight: '800', letterSpacing: -1.4 },
  definition: { fontSize: 24, fontWeight: '700', lineHeight: 31 },
  sentence: { fontSize: 15, lineHeight: 22 },
  breakdown: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  part: { overflow: 'hidden', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, fontWeight: '700' },
});
