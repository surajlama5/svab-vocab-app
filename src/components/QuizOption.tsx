import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useStudy } from '@/state/StudyStateProvider';

export function QuizOption({ label, selected, correct, reveal, onPress }: { label: string; selected: boolean; correct: boolean; reveal: boolean; onPress: () => void }) {
  const { palette } = useStudy();
  const backgroundColor = reveal && correct ? palette.successWash : reveal && selected && !correct ? palette.dangerWash : palette.surface;
  const borderColor = reveal && correct ? palette.success : reveal && selected && !correct ? palette.danger : palette.line;
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={reveal} style={[styles.option, { backgroundColor, borderColor }]}>
    <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    {reveal && correct ? <Text style={{ color: palette.success, fontWeight: '800' }}>✓</Text> : null}
  </Pressable>;
}

const styles = StyleSheet.create({ option: { minHeight: 54, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { fontSize: 15, fontWeight: '600', flex: 1, paddingRight: 8 } });
