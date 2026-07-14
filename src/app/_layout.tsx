import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { queryClient } from '@/lib/query-client';
import { COLORS } from '@/utils/colors';
import { TITLE_FONT_FAMILY } from '@/utils/fonts';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(COLORS.surface);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [TITLE_FONT_FAMILY]: require('../assets/fonts/cal-sans-regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.surface },
        }}
      >
        {/* Full-screen modal over the tabs: no tab bar, slide from bottom
            (docs/ui-conventions.md, "Overlays & modals"). */}
        <Stack.Screen
          name="send-like"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
