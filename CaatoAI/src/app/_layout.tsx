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
            onPress={() => router.back()}
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
      <Stack.Screen name="onboarding-eating-behavior" />
      <Stack.Screen name="onboarding-food-culture" />
      <Stack.Screen name="onboarding-womens-health" />
      <Stack.Screen name="onboarding-eating-style" />
      <Stack.Screen name="onboarding-food-access" />
      <Stack.Screen name="onboarding-summary" />
      <Stack.Screen
        name="onboarding-building-plan"
        options={{ headerShown: false }}
      />

      {/* Plan */}
      <Stack.Screen name="plan-ready" />

      {/* Main app */}
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen name="meal-plan" />
      <Stack.Screen name="ai-coach" />
      <Stack.Screen name="weight-progress" />
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
