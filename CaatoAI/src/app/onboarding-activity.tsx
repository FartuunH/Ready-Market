import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Struggle =
  | "cravings"
  | "stress"
  | "night-eating"
  | "time"
  | "exercise"
  | "portions"
  | "consistency"
  | "other";

const struggles: {
  id: Struggle;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "cravings",
    emoji: "🍫",
    title: "Rabitaanka cuntada",
    description: "Mararka qaar way igu adag tahay inaan xakameeyo cravings-ka.",
  },
  {
    id: "stress",
    emoji: "😟",
    title: "Waxaan cunaa marka aan walwalsanahay",
    description:
      "Walwalka ama dareenkayga ayaa mararka qaar iga dhiga inaan cuno.",
  },
  {
    id: "night-eating",
    emoji: "🌙",
    title: "Habeenkii ayaan badan cunaa",
    description: "Cunista habeenkii ayaa ka mid ah waxyaabaha igu adag.",
  },
  {
    id: "time",
    emoji: "⏰",
    title: "Waqti igu filan ma hayo",
    description: "Shaqo, qoys ama nolol maalmeedka ayaa iga mashquuliya.",
  },
  {
    id: "exercise",
    emoji: "💪",
    title: "Jimicsiga ayaa igu adag",
    description: "Way igu adag tahay inaan bilaabo ama joogteeyo dhaqdhaqaaqa.",
  },
  {
    id: "portions",
    emoji: "🍽️",
    title: "Qaybaha cuntada ayaa igu badan",
    description: "Mararka qaar ma garanayo inta igu habboon inaan cuno.",
  },
  {
    id: "consistency",
    emoji: "🔁",
    title: "Waan bilaabaa laakiin ma sii wado",
    description:
      "Waxaan bilaabaa qorshe, laakiin way igu adag tahay inaan joogteeyo.",
  },
  {
    id: "other",
    emoji: "🌿",
    title: "Wax kale",
    description: "Waxaa jira caqabad kale oo aniga ii gaar ah.",
  },
];

export default function OnboardingActivityScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [struggle, setStruggle] = useState<Struggle | null>(null);

  const selectedStruggle = struggles.find((item) => item.id === struggle);

  const continueNext = () => {
    if (!struggle) return;

    router.push({
      pathname: "/onboarding-life",
      params: {
        ...params,
        struggle,
        struggleLabel: selectedStruggle?.title ?? "",
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

            <View style={styles.coachTextArea}>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>
                Qorshahaagu waa inuu noloshaada la shaqeeyaa
              </Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionArea}>
            <Text style={styles.smallGreeting}>
              {name ? `${name}, ` : ""}waxaan rabaa inaan ku fahmo 💚
            </Text>

            <Text style={styles.title}>
              Maxaa kuu adkaa markii{"\n"}
              <Text style={styles.titleHighlight}>aad hore isku dayday?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Dadku isku caqabado ma laha. Jawaabtaadu waxay naga caawinaysaa
              inaan CaatoAI kuu waafajino waxa adiga dhab ahaan kugu adag.
            </Text>
          </View>

          {/* Options */}
          <View style={styles.optionsArea}>
            {struggles.map((item) => {
              const selected = struggle === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setStruggle(item.id)}
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

          {/* Coach response */}
          {selectedStruggle && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>Waan fahmay.</Text>

                <Text style={styles.responseText}>
                  Qorshahaaga waxaan ku dhisi doonaa si uu kaaga caawiyo
                  caqabaddan, halkii aan kaa siin lahaa qorshe guud oo qof walba
                  la siiyo.
                </Text>
              </View>
            </View>
          )}

          {/* Continue */}
          <Pressable
            disabled={!struggle}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !struggle && styles.buttonDisabled,
              pressed && struggle && styles.buttonPressed,
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
    width: "29%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
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
    flexShrink: 0,
  },

  coachEmoji: {
    fontSize: 21,
  },

  coachTextArea: {
    flex: 1,
    minWidth: 0,
  },

  coachName: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
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
    fontSize: 30,
    lineHeight: 37,
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
    marginBottom: 10,
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
