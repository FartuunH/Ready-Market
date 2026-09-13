import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Motivation =
  | "weight-loss"
  | "health"
  | "energy"
  | "confidence"
  | "family"
  | "other";

const motivations: {
  id: Motivation;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "weight-loss",
    emoji: "⚖️",
    title: "Waxaan rabaa inaan miisaan dhimo",
    description: "Waxaan rabaa inaan gaaro miisaan ii caafimaad badan.",
  },
  {
    id: "health",
    emoji: "💚",
    title: "Waxaan rabaa caafimaad wanaagsan",
    description: "Waxaan rabaa inaan dhiso caadooyin caafimaad leh.",
  },
  {
    id: "energy",
    emoji: "⚡",
    title: "Waxaan rabaa tamar badan",
    description: "Waxaan rabaa inaan maalintii dareemo firfircooni badan.",
  },
  {
    id: "confidence",
    emoji: "✨",
    title: "Waxaan rabaa inaan naftayda ku fiicnaado",
    description:
      "Waxaan rabaa inaan naftayda iyo jirkeyga si fiican u daryeelo.",
  },
  {
    id: "family",
    emoji: "👨‍👩‍👧",
    title: "Waxaan rabaa inaan caafimaad u ahaado qoyskayga",
    description:
      "Waxaan rabaa caafimaad aan kula raaxaysto dadka aan jeclahay.",
  },
  {
    id: "other",
    emoji: "🌿",
    title: "Sabab kale",
    description: "Waxaan leeyahay sabab kale oo aniga ii gaar ah.",
  },
];

export default function OnboardingBodyScreen() {
  const { name, age } = useLocalSearchParams<{
    name?: string;
    age?: string;
  }>();

  const [motivation, setMotivation] = useState<Motivation | null>(null);

  const selectedMotivation = motivations.find((item) => item.id === motivation);

  const continueNext = () => {
    if (!motivation) return;

    router.push({
      pathname: "/onboarding-activity",
      params: {
        name,
        age,
        motivation,
        motivationLabel: selectedMotivation?.title ?? "",
      },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Progress */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          {/* Coach */}
          <View style={styles.coachRow}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan fahanno sababtaada</Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionArea}>
            <Text style={styles.smallGreeting}>
              {name ? `${name}, ` : ""}
              su’aal muhiim ah 💚
            </Text>

            <Text style={styles.title}>
              Maxaa maanta kuu{"\n"}
              <Text style={styles.titleHighlight}>keenay CaatoAI?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Sababta aad u bilowday waxay naga caawinaysaa inaan qorshahaaga ku
              dhisno waxyaabaha adiga muhiimka kuu ah.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsArea}>
            {motivations.map((item) => {
              const selected = motivation === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setMotivation(item.id)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      selected && styles.optionIconSelected,
                    ]}
                  >
                    <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  </View>

                  <View style={styles.optionTextArea}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selected && styles.optionTitleSelected,
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text style={styles.optionDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      selected && styles.checkCircleSelected,
                    ]}
                  >
                    {selected && <Text style={styles.checkText}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Personalized response */}
          {selectedMotivation && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>
                  Sababtaada waan xasuusan doonaa.
                </Text>

                <Text style={styles.responseText}>
                  Marka safarku adkaado, CaatoAI wuxuu kaa caawin doonaa inaad
                  dib ugu soo noqoto sababta aad maanta u bilowday.
                </Text>
              </View>
            </View>
          )}

          {/* Continue */}
          <Pressable
            disabled={!motivation}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !motivation && styles.buttonDisabled,
              pressed && motivation && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFBF5",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },

  content: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 20,
  },

  progressTrack: {
    width: "100%",
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 26,
  },

  progressFill: {
    width: "22%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  coachIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  coachEmoji: {
    fontSize: 21,
  },

  coachName: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },

  questionArea: {
    marginBottom: 22,
  },

  smallGreeting: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "#1F2937",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "900",
    marginBottom: 11,
  },

  titleHighlight: {
    color: "#14532D",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
  },

  optionsArea: {
    marginBottom: 4,
  },

  option: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 13,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  optionSelected: {
    backgroundColor: "#F0FDF4",
    borderColor: "#16A34A",
    borderWidth: 2,
  },

  optionPressed: {
    opacity: 0.9,
  },

  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F5F7F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    flexShrink: 0,
  },

  optionIconSelected: {
    backgroundColor: "#DCFCE7",
  },

  optionEmoji: {
    fontSize: 21,
  },

  optionTextArea: {
    flex: 1,
    minWidth: 0,
  },

  optionTitle: {
    color: "#1F2937",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#14532D",
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
  },

  checkCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    flexShrink: 0,
  },

  checkCircleSelected: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  checkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  responseCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 17,
  },

  responseEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  responseTextArea: {
    flex: 1,
  },

  responseTitle: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  responseText: {
    color: "#4B5563",
    fontSize: 11,
    lineHeight: 17,
  },

  button: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#14532D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 5,
    marginBottom: 10,

    shadowColor: "#14532D",
    shadowOpacity: 0.15,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },

  buttonDisabled: {
    opacity: 0.35,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 8,
  },
});
