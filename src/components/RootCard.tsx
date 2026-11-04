import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { WordPart } from '@/types/study';
import { useStudy } from '@/state/StudyStateProvider';

export function RootCard({ item }: { item: WordPart }) {
  const { palette } = useStudy();
  const color = item.kind === 'prefix' ? palette.accent : item.kind === 'suffix' ? palette.purple : palette.gold;
  return <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }]}>
    <View style={styles.top}><Text style={[styles.kind, { color }]}>{item.kind.toUpperCase()}</Text><Text style={{ color: palette.muted, fontSize: 18 }}>↗</Text></View>
    <Text style={[styles.form, { color: palette.text }]}>{item.form}</Text>
    <Text style={[styles.meaning, { color: palette.muted }]}>{item.meaning}</Text>
    <Text style={[styles.example, { color: palette.primary }]}>Example: {item.example}</Text>
  </View>;
}

const styles = StyleSheet.create({ card: { flex: 1, minWidth: '46%', borderWidth: 1, borderRadius: 19, padding: 15, gap: 8 }, top: { flexDirection: 'row', justifyContent: 'space-between' }, kind: { fontSize: 10, fontWeight: '800', letterSpacing: 1 }, form: { fontSize: 20, fontWeight: '800' }, meaning: { fontSize: 13, lineHeight: 18, minHeight: 36 }, example: { fontSize: 12, fontWeight: '700' } });
