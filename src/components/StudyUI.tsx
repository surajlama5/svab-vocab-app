import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useStudy } from '@/state/StudyStateProvider';

export function Page({ children, scroll = true }: React.PropsWithChildren<{ scroll?: boolean }>) {
  const { palette } = useStudy();
  if (!scroll) return <View style={[styles.page, { backgroundColor: palette.background }]}>{children}</View>;
  return <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function Title({ eyebrow, children, subtitle }: { eyebrow?: string; children: React.ReactNode; subtitle?: string }) {
  const { palette } = useStudy();
  return <View style={{ gap: 6, marginBottom: 18 }}>
    {eyebrow ? <Text style={[styles.eyebrow, { color: palette.primary }]}>{eyebrow}</Text> : null}
    <Text style={[styles.title, { color: palette.text }]}>{children}</Text>
    {subtitle ? <Text style={[styles.subtitle, { color: palette.muted }]}>{subtitle}</Text> : null}
  </View>;
}

export function Card({ children, style }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { palette } = useStudy();
  return <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.line }, style]}>{children}</View>;
}

export function Body({ children, style, muted = false }: React.PropsWithChildren<{ style?: object; muted?: boolean }>) {
  const { palette } = useStudy();
  return <Text style={[styles.body, { color: muted ? palette.muted : palette.text }, style]}>{children}</Text>;
}

export function ActionButton({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const { palette } = useStudy();
  return <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor: secondary ? palette.surfaceAlt : palette.primary, opacity: disabled ? 0.5 : pressed ? 0.82 : 1 }]}>
    <Text style={[styles.buttonText, { color: secondary ? palette.text : '#FFFFFF' }]}>{label}</Text>
  </Pressable>;
}

export function SectionHeading({ children, trailing }: { children: React.ReactNode; trailing?: React.ReactNode }) {
  const { palette } = useStudy();
  return <View style={styles.sectionHeading}><Text style={[styles.sectionTitle, { color: palette.text }]}>{children}</Text>{trailing}</View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 16 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36, gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 14, lineHeight: 21 },
  card: { borderWidth: 1, borderRadius: 22, padding: 18, gap: 12 },
  body: { fontSize: 15, lineHeight: 22 },
  button: { minHeight: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  buttonText: { fontSize: 14, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
});
