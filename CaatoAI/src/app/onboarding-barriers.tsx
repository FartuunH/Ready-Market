import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Barrier =
  | "cravings"
  | "night-eating"
  | "stress"
  | "portions"
  | "time"
  | "consistency"
  | "food-confusion"
  | "other";

const barriers: {
  id: Barrier;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "cravings",
    emoji: "🍫",
    title: "Cravings",
    description: "Mararka qaar rabitaanka cunto gaar ah ayaa igu adkaada.",
  },
  {
    id: "night-eating",
    emoji: "🌙",
    title: "Cunista habeenkii",
    description: "Waxaan inta badan wax cunaa fiidkii ama habeenkii.",
  },
  {
    id: "stress",
    emoji: "😟",
    title: "Stress ama dareen",
    description:
      "Waxaan mararka qaar wax cunaa marka aan walwalsanahay ama murugaysanahay.",
  },
  {
    id: "portions",
    emoji: "🍽️",
    title: "Portions waaweyn",
    description: "Way igu adag tahay inaan ogaado inta igu filan.",
  },
  {
    id: "time",
    emoji: "⏰",
    title: "Waqti la'aan",
    description: "Mashquulka ayaa iga dhigaya qorshe caafimaad leh mid adag.",
  },
  {
    id: "consistency",
    emoji: "🔄",
    title: "Waan bilaabaa, kadibna waan joojiyaa",
    description:
      "Bilowgu waa ii fudud yahay, laakiin joogtayntu way igu adkaataa.",
  },
  {
    id: "food-confusion",
    emoji: "🤷‍♀️",
    title: "Ma hubo waxa aan cuno",
    description: "Waxaan rabaa hagitaan iga caawiya doorashada cuntada.",
  },
  {
    id: "other",
    emoji: "✨",
    title: "Wax kale",
    description: "Waxa i hortaagan kuma jiro liiskan.",
  },
];

export default function OnboardingBarriersScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    motivation?: string;
  }>();

  const [selected, setSelected] = useState<Barrier[]>([]);

  const canContinue = selected.length > 0;

  const toggleBarrier = (id: Barrier) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  const continueNext = () => {
    if (!canContinue) return;

    router.push({
      pathname: "/onboarding-goal",
      params: {
        ...params,
        barriers: selected.join(","),
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
          {/* Top navigation */}
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
                Waxaan baranaynaa caadooyinkaaga
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
              <Text style={styles.coachLabel}>
                Ma jiro xukun — waxaan rabnaa inaan ku fahanno
              </Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>CAADOYINKAAGA</Text>
            </View>

            <Text style={styles.title}>
              Maxaa inta badan kaa{"\n"}
              <Text style={styles.titleGreen}>hor istaaga hadafkaaga?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Waxaad dooran kartaa wax ka badan hal. Jawaabahaagu waxay naga
              caawinayaan inaan kuu dooranno casharro iyo talooyin ku anfaca.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.options}>
            {barriers.map((item) => {
              const isSelected = selected.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleBarrier(item.id)}
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
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Selection feedback */}
          {selected.length > 0 && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>
                  Waad dooratay {selected.length}{" "}
                  {selected.length === 1 ? "arrin" : "arrimood"}.
                </Text>

                <Text style={styles.responseText}>
                  Tani ma aha liis khaladaad ah. Waxay CaatoAI ka caawinaysaa
                  inuu fahmo halka taageeradaadu ugu badan tahay.
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
              🔒 Jawaabahani waa qayb ka mid ah qorshahaaga gaarka ah.
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
    width: "20%",
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
    marginBottom: 24,
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
    fontSize: 32,
    lineHeight: 39,
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

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#C9D3CA",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#B9DDBF",
    borderColor: "#B9DDBF",
  },

  checkmark: {
    color: "#173F2A",
    fontSize: 14,
    fontWeight: "900",
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
