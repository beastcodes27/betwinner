import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { UIProvider } from '@/context/UIContext';
import { AppDataProvider } from '@/context/AppDataContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UIProvider>
        <AppDataProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </AppDataProvider>
      </UIProvider>
    </SafeAreaProvider>
  );
}
