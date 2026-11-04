import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StudyStateProvider, useStudy } from '@/state/StudyStateProvider';

function AppStack() {
  const { palette, themeChoice } = useStudy();
  const dark = themeChoice === 'dark' || (themeChoice === 'system' && palette.background === '#0D1422');
  return <>
    <StatusBar style={dark ? 'light' : 'dark'} />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="decipher/[id]" options={{ presentation: 'card', animation: 'slide_from_right' }} />
    </Stack>
  </>;
}

export default function RootLayout() {
  return <StudyStateProvider><AppStack /></StudyStateProvider>;
}
