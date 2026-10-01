import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#FFF7FC",
        },
        headerLeft: () => (
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
            style={styles.backButton}
            hitSlop={10}
          >
            <Text style={styles.backText}>‹ Dib u noqo</Text>
          </Pressable>
        ),
      }}
    >
      {/* Welcome */}
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      {/* Onboarding */}
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="onboarding-goal" />
      <Stack.Screen name="onboarding-body" />
      <Stack.Screen name="onboarding-activity" />
      <Stack.Screen name="onboarding-life" />
      <Stack.Screen name="onboarding-food" />
      <Stack.Screen name="onboarding-weight" />
      <Stack.Screen name="onboarding-goal-weight" />
      <Stack.Screen name="onboarding-movement" />
      <Stack.Screen name="onboarding-exercise" />

      {/* Eating habits */}
      <Stack.Screen name="onboarding-eating-style" />
      <Stack.Screen name="onboarding-eating-behavior" />
      <Stack.Screen name="onboarding-food-culture" />

      {/* Personalization */}
      <Stack.Screen name="onboarding-womens-health" />
      <Stack.Screen name="onboarding-food-access" />

      {/* Final plan setup */}
      <Stack.Screen name="onboarding-plan-style" />
      <Stack.Screen name="onboarding-plan-preview" />

      {/* Older screens we are keeping for now */}
      <Stack.Screen name="onboarding-summary" />

      <Stack.Screen
        name="onboarding-building-plan"
        options={{ headerShown: false }}
      />

      <Stack.Screen name="meal-plan" />
      <Stack.Screen
        name="weekly-meal-plan"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="weight-progress" options={{ headerShown: false }} />

      <Stack.Screen name="daily-lesson" options={{ headerShown: false }} />

      <Stack.Screen name="ai-coach" />

      <Stack.Screen name="reminders" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: 8,
    paddingRight: 12,
  },

  backText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "800",
  },
});
