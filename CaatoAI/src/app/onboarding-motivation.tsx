import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Motivation = "weight-loss" | "health" | "energy" | "confidence" | "habits";

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
    description:
      "Waxaan rabaa inaan si tartiib ah ugu shaqeeyo miisaan caafimaad leh.",
  },
  {
    id: "health",
    emoji: "❤️",
    title: "Waxaan rabaa caafimaad wanaagsan",
    description: "Waxaan rabaa inaan daryeelo jirkeyga iyo caafimaadkayga.",
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
    description: "Waxaan rabaa inaan naftayda iyo horumarkayga ku kalsoonaado.",
  },
  {
    id: "habits",
    emoji: "🌱",
    title: "Waxaan rabaa caadooyin caafimaad leh",
    description: "Waxaan rabaa inaan dhiso caadooyin aan sii wadi karo.",
  },
];

export default function OnboardingMotivationScreen() {
  const params = useLocalSearchParams<{
    name?: string;
  }>();

  const [selected, setSelected] = useState<Motivation | null>(null);

  const canContinue = selected !== null;

  const continueNext = () => {
    if (!selected) return;

    router.push({
      pathname: "/onboarding-barriers",
      params: {
        ...params,
        motivation: selected,
      },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Top */}
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            <View style={styles.progressArea}>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>

              <Text style={styles.progressText}>
                Waxaan baranaynaa waxa adiga muhiimka kuu ah
              </Text>
            </View>
          </View>

          {/* Coach */}
          <View style={styles.coachRow}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan fahanno hadafkaaga</Text>
            </View>
          </View>

          {/* Greeting */}
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              {params.name
                ? `${params.name}, jawaabtaadu waxay naga caawinaysaa inaan kuu dhisno safar adiga kuu gaar ah.`
                : "Jawaabtaadu waxay naga caawinaysaa inaan kuu dhisno safar adiga kuu gaar ah."}
            </Text>
          </View>

          {/* Question */}
          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>WAXA KUGU DHIIRRIGELIYA</Text>
            </View>

            <Text style={styles.title}>
              Maxaa kuu keenay{"\n"}
              <Text style={styles.titleGreen}>CaatoAI?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Dooro waxa hadda kuugu muhiimsan. Mar dambe waad beddeli kartaa
              hadafkaaga.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            {motivations.map((item) => {
              const isSelected = selected === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelected(item.id)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      isSelected && styles.optionIconSelected,
                    ]}
                  >
                    <Text style={styles.optionEmoji}>{item.emoji}</Text>
                  </View>

                  <View style={styles.optionTextArea}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.optionDescription,
                        isSelected && styles.optionDescriptionSelected,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>

                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Coaching response */}
          {selected && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>
                  Waa meel fiican oo laga bilaabo.
                </Text>

                <Text style={styles.responseText}>
                  CaatoAI wuxuu qorshahaaga, casharradaada iyo talooyinkaaga ku
                  waafajin doonaa waxa adiga kuu muhiimsan.
                </Text>
              </View>
            </View>
          )}

          {/* Bottom */}
          <View style={styles.bottomArea}>
            <Pressable
              disabled={!canContinue}
              onPress={continueNext}
              style={({ pressed }) => [
                styles.button,
                !canContinue && styles.buttonDisabled,
                pressed && canContinue && styles.buttonPressed,
              ]}
            >
              <Text style={styles.buttonText}>Sii wad</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </Pressable>

            <Text style={styles.bottomText}>
              🌱 Ma jiro hadaf yar. Waxaan ka bilaabaynaa meesha aad maanta
              joogto.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBF8F1",
  },

  scrollContent: {
    flexGrow: 1,
    paddingVertical: 18,
  },

  container: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  backArrow: {
    color: "#173F2A",
    fontSize: 30,
    lineHeight: 31,
    fontWeight: "500",
    marginTop: -2,
  },

  pressed: {
    opacity: 0.75,
  },

  progressArea: {
    flex: 1,
  },

  progressTrack: {
    height: 5,
    backgroundColor: "#E2E7E2",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    width: "14%",
    height: "100%",
    backgroundColor: "#4F7C5B",
    borderRadius: 999,
  },

  progressText: {
    color: "#8A938C",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 6,
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  coachIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#E3F1E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  coachEmoji: {
    fontSize: 22,
  },

  coachName: {
    color: "#173F2A",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#7B857E",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  greeting: {
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 23,
  },

  greetingText: {
    color: "#52685A",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  hero: {
    marginBottom: 20,
  },

  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF4EA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },

  stepBadgeText: {
    color: "#477253",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  title: {
    color: "#202923",
    fontSize: 33,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: 11,
  },

  titleGreen: {
    color: "#28623B",
  },

  subtitle: {
    color: "#68736B",
    fontSize: 14,
    lineHeight: 21,
  },

  options: {
    gap: 10,
  },

  optionCard: {
    minHeight: 78,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E7E0",
    borderRadius: 19,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    backgroundColor: "#173F2A",
    borderColor: "#173F2A",
  },

  optionPressed: {
    opacity: 0.88,
  },

  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EEF5ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIconSelected: {
    backgroundColor: "#2A553A",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#263129",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#FFFFFF",
  },

  optionDescription: {
    color: "#7A837C",
    fontSize: 10,
    lineHeight: 15,
  },

  optionDescriptionSelected: {
    color: "#CFE0D2",
  },

  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#C9D3CA",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#A7CEAF",
  },

  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#B9DDBF",
  },

  responseCard: {
    marginTop: 14,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  responseEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  responseTextArea: {
    flex: 1,
  },

  responseTitle: {
    color: "#28563A",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  responseText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 16,
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 24,
    paddingBottom: 8,
  },

  button: {
    minHeight: 58,
    backgroundColor: "#28623B",
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  buttonDisabled: {
    backgroundColor: "#C9D5CB",
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  buttonArrow: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 9,
  },

  bottomText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },
});
