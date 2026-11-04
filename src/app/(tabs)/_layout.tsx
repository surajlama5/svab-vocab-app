import { NativeTabs } from 'expo-router/native-tabs';
import { useStudy } from '@/state/StudyStateProvider';

export default function TabsLayout() {
  const { palette } = useStudy();
  return <NativeTabs backgroundColor={palette.surface} indicatorColor={palette.surfaceAlt} iconColor={palette.muted} labelStyle={{ default: { color: palette.muted }, selected: { color: palette.primary } }}>
    <NativeTabs.Trigger name="index"><NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon selectedColor={palette.primary} sf={{ default: 'house', selected: 'house.fill' }} md={{ default: 'home', selected: 'home' }} /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="roots"><NativeTabs.Trigger.Label>Roots</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon selectedColor={palette.primary} sf={{ default: 'leaf', selected: 'leaf.fill' }} md={{ default: 'menu_book', selected: 'menu_book' }} /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="flashcards"><NativeTabs.Trigger.Label>Cards</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon selectedColor={palette.primary} sf={{ default: 'rectangle.stack', selected: 'rectangle.stack.fill' }} md={{ default: 'style', selected: 'style' }} /></NativeTabs.Trigger>
    <NativeTabs.Trigger name="quiz"><NativeTabs.Trigger.Label>Quiz</NativeTabs.Trigger.Label><NativeTabs.Trigger.Icon selectedColor={palette.primary} sf={{ default: 'checkmark.circle', selected: 'checkmark.circle.fill' }} md={{ default: 'quiz', selected: 'quiz' }} /></NativeTabs.Trigger>
  </NativeTabs>;
}
