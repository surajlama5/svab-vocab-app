import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RootCard } from '@/components/RootCard';
import { Body, Card, Page, SectionHeading, Title } from '@/components/StudyUI';
import { useStudy } from '@/state/StudyStateProvider';
import { wordParts } from '@/data/wordParts';

export default function RootsScreen() {
  const { palette } = useStudy();
  return <Page>
    <Title eyebrow="Build your word toolkit" subtitle="Recognize a familiar part, then use context to make a smart guess.">Word Roots & Prefixes</Title>
    <Card style={styles.tip}><Text style={{ fontSize: 22 }}>🔎</Text><View style={{ flex: 1, gap: 4 }}><Text style={[styles.tipTitle, { color: palette.text }]}>A quick decoding habit</Text><Body muted>Spot a word part → recall its meaning → test your guess in the sentence.</Body></View></Card>
    <SectionHeading>Explore word parts</SectionHeading>
    <View style={styles.grid}>{wordParts.map((item) => <Link key={item.id} href={`/decipher/${item.example}`} asChild><Pressable accessibilityRole="button" style={styles.gridItem}><RootCard item={item} /></Pressable></Link>)}</View>
  </Page>;
}

const styles = StyleSheet.create({ tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: '#142A3B' }, tipTitle: { fontSize: 15, fontWeight: '800' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, gridItem: { width: '48%' } });
