import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { VocabularyCard } from '@/components/VocabularyCard';
import { ActionButton, Body, Page, Title } from '@/components/StudyUI';
import { vocabulary } from '@/data/vocabulary';
import { useStudy } from '@/state/StudyStateProvider';
import { getDueReviewWordIds, getLocalDateKey } from '@/utils/progress';

type DeckFilter = 'all' | 'bookmarked' | 'review' | 'due' | 'learning' | 'familiar' | 'mastered';

export default function FlashcardsScreen() {
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DeckFilter>('all');
  const { palette, recordCard, state, toggleBookmark } = useStudy();
  const dueIds = getDueReviewWordIds(state.mistakeWordIds, state.wordReviews, getLocalDateKey());
  const deck = vocabulary.filter((word) => {
    const matchesSearch = `${word.term} ${word.definition}`.toLowerCase().includes(search.trim().toLowerCase());
    const review = state.wordReviews[word.id];
    const wordStatus = !review ? 'new' : state.mistakeWordIds.includes(word.id) ? 'learning' : review.repetitions >= 2 ? 'mastered' : 'familiar';
    const matchesFilter = filter === 'all' ||
      (filter === 'bookmarked' && state.bookmarkedWordIds.includes(word.id)) ||
      (filter === 'review' && state.mistakeWordIds.includes(word.id)) ||
      (filter === 'due' && dueIds.includes(word.id)) ||
      (filter === 'learning' && wordStatus === 'learning') ||
      (filter === 'familiar' && wordStatus === 'familiar') ||
      (filter === 'mastered' && wordStatus === 'mastered');
    return matchesSearch && matchesFilter;
  });
  const safeIndex = Math.min(index, Math.max(0, deck.length - 1));
  const word = deck[safeIndex];
  const next = () => { setIndex((safeIndex + 1) % deck.length); recordCard(); };
  const previous = () => setIndex((safeIndex - 1 + deck.length) % deck.length);

  return <Page>
    <Title eyebrow="Flashcard deck" subtitle="Search words, save difficult cards, or review missed quiz words.">Learn in small steps</Title>
    <TextInput accessibilityLabel="Search vocabulary" value={search} onChangeText={(value) => { setSearch(value); setIndex(0); }} placeholder="Search words or meanings" placeholderTextColor={palette.muted} returnKeyType="search" style={[styles.search, { color: palette.text, borderColor: palette.line, backgroundColor: palette.surface }]} />
    <View style={styles.filters}>{(['all', 'bookmarked', 'review', 'due', 'learning', 'familiar', 'mastered'] as const).map((value) => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: filter === value }} onPress={() => { setFilter(value); setIndex(0); }} style={[styles.filter, { backgroundColor: filter === value ? palette.primary : palette.surface, borderColor: palette.line }]}><Text style={{ color: filter === value ? '#fff' : palette.text, fontWeight: '700', textTransform: 'capitalize' }}>{value === 'all' ? 'All words' : value === 'bookmarked' ? `Saved (${state.bookmarkedWordIds.length})` : value === 'review' ? `Missed (${state.mistakeWordIds.length})` : value === 'due' ? `Due (${dueIds.length})` : value}</Text></Pressable>)}</View>
    {word ? <>
      <View style={styles.progress}><View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}><View style={[styles.fill, { backgroundColor: palette.primary, width: `${((safeIndex + 1) / deck.length) * 100}%` }]} /></View><Text style={{ color: palette.muted, fontSize: 12, fontWeight: '700' }}>{safeIndex + 1} / {deck.length}</Text></View>
      <VocabularyCard key={word.id} word={word} />
      <View style={styles.controls}><View style={{ flex: 1 }}><ActionButton label="Break down this word" secondary onPress={() => router.push(`/decipher/${word.id}`)} /></View><Pressable accessibilityRole="button" accessibilityLabel={state.bookmarkedWordIds.includes(word.id) ? `Remove ${word.term} from saved words` : `Save ${word.term}`} onPress={() => toggleBookmark(word.id)} style={[styles.save, { borderColor: palette.line, backgroundColor: palette.surface }]}><Text style={{ color: palette.primary, fontSize: 19 }}>{state.bookmarkedWordIds.includes(word.id) ? '★' : '☆'}</Text></Pressable></View>
      <Body muted style={{ textAlign: 'center' }}>Use the sentence to help remember the word.</Body>
      <View style={styles.controls}><Pressable accessibilityRole="button" onPress={previous} disabled={deck.length < 2} style={[styles.arrow, { borderColor: palette.line, backgroundColor: palette.surface }]}><Text style={{ color: palette.text, fontSize: 20 }}>‹</Text></Pressable><View style={{ flex: 1 }}><ActionButton label="Next card  →" onPress={next} disabled={deck.length < 2} /></View><Pressable accessibilityRole="button" onPress={next} disabled={deck.length < 2} style={[styles.arrow, { borderColor: palette.line, backgroundColor: palette.surface }]}><Text style={{ color: palette.text, fontSize: 20 }}>›</Text></Pressable></View>
    </> : <Body muted style={{ textAlign: 'center' }}>{filter === 'review' ? 'No missed words yet. Complete a quiz to build your review list.' : filter === 'due' ? 'No missed words are due today. Check back tomorrow.' : filter === 'bookmarked' ? 'No saved words yet. Save a word from the full deck.' : filter === 'mastered' ? 'Words become mastered after two successful reviews.' : 'No vocabulary words match your search.'}</Body>}
  </Page>;
}

const styles = StyleSheet.create({ search: { height: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 15 }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, filter: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 }, progress: { flexDirection: 'row', alignItems: 'center', gap: 12 }, track: { flex: 1, height: 6, borderRadius: 6, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 6 }, controls: { flexDirection: 'row', alignItems: 'center', gap: 10 }, save: { width: 48, height: 48, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }, arrow: { width: 48, height: 48, borderWidth: 1, borderRadius: 15, alignItems: 'center', justifyContent: 'center' } });
