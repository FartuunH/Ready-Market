import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const steps = [
  "Hadafkaaga ayaan eegayaa",
  "Dhaqdhaqaaqaaga ayaan waafajinayaa",
  "Cuntadaada iyo budget-ka ayaan isku darayaa",
  "Qaabka cuntada ayaan hubinayaa",
  "Qorshahaaga bilowga ah ayaan diyaarinayaa",
];

export default function OnboardingBuildingPlanScreen() {
  const params = useLocalSearchParams();
  const [completedSteps, setCompletedSteps] = useState(0);
  const [ready, setReady] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep += 1;
      setCompletedSteps(currentStep);
      if (currentStep >= steps.length) {
        clearInterval(stepInterval);
        setReady(true);
      }
    }, 300);

    // First-time onboarding now goes to the weekly food setup before meal generation.
    const navigationTimer = setTimeout(() => {
      router.replace({
        pathname: "/weekly-food-setup",
        params: { ...params, onboarding: "complete" },
      });
    }, 2200);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🌿</Text>
        </View>
        <Text style={styles.brand}>CaatoAI</Text>
        {!ready ? (
          <>
            <Text style={styles.title}>Qorshahaaga ayaan dhisayaa...</Text>
            <Text style={styles.subtitle}>
              Jawaabahaaga waxaan isku darayaa si aan kuugu sameeyo qorshe bilow
              ah oo kuu gaar ah.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.readyEmoji}>✨</Text>
            <Text style={styles.title}>Qorshahaaga waa diyaar</Text>
            <Text style={styles.subtitle}>
              Hadda noo sheeg cuntooyinka aad haysato ama aad iibsan karto si
              CaatoAI kuu sameeyo qorshaha toddobaadkan.
            </Text>
          </>
        )}
        <View style={styles.stepsCard}>
          {steps.map((step, index) => {
            const completed = index < completedSteps;
            return (
              <View key={step} style={styles.stepRow}>
                <View
                  style={[
                    styles.stepIcon,
                    completed && styles.stepIconComplete,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepIconText,
                      completed && styles.stepIconTextComplete,
                    ]}
                  >
                    {completed ? "✓" : index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepText,
                    completed && styles.stepTextComplete,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>
        {!ready ? (
          <View style={styles.loadingArea}>
            <View style={styles.loadingTrack}>
              <View
                style={[
                  styles.loadingFill,
                  { width: `${(completedSteps / steps.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>
              CaatoAI wuxuu diyaarinayaa qorshahaaga 💚
            </Text>
          </View>
        ) : (
          <View style={styles.readyCard}>
            <Text style={styles.readyCardTitle}>
              🛒 Tallaabada xigta: cuntada toddobaadka
            </Text>
            <Text style={styles.readyCardText}>
              Waxaad dooran doontaa waxa aad haysato, waxa aad iibsan karto, iyo
              heerka carbs-ka toddobaadkan.
            </Text>
          </View>
        )}
        <Text style={styles.privacyText}>
          🔒 Xogtaada onboarding-ka waxaa loo isticmaalaa shakhsiyeynta
          qorshahaaga.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFBF5", justifyContent: "center" },
  content: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  logoEmoji: { fontSize: 29 },
  brand: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 22,
  },
  readyEmoji: { fontSize: 30, textAlign: "center", marginBottom: 6 },
  title: {
    color: "#1F2937",
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 9,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 25,
  },
  stepsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 22,
    padding: 17,
  },
  stepRow: { minHeight: 48, flexDirection: "row", alignItems: "center" },
  stepIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  stepIconComplete: { backgroundColor: "#DCFCE7" },
  stepIconText: { color: "#9CA3AF", fontSize: 11, fontWeight: "900" },
  stepIconTextComplete: { color: "#15803D" },
  stepText: {
    flex: 1,
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  stepTextComplete: { color: "#1F2937" },
  loadingArea: { marginTop: 22 },
  loadingTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },
  loadingText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 9,
  },
  readyCard: {
    marginTop: 20,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
  },
  readyCardTitle: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 5,
  },
  readyCardText: {
    color: "#4B5563",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
  },
  privacyText: {
    color: "#9CA3AF",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
    paddingHorizontal: 18,
    marginTop: 20,
  },
});
