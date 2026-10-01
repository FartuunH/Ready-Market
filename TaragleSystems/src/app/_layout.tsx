import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useColorScheme } from "react-native";

import { HiringApplicationProvider } from "@/context/HiringApplicationContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <HiringApplicationProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </HiringApplicationProvider>
  );
}
