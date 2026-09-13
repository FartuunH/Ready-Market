import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ActivityLevel = "not-active" | "light" | "active" | "very-active";

const activityOptions = [
  {
    id: "not-active" as ActivityLevel,
    emoji: "🌱",
    title: "Dhaqdhaqaaq yar",
    description: "Inta badan waan fadhiistaa, socod badanna ma sameeyo.",
    steps: 5000,
  },
  {
    id: "light" as ActivityLevel,
    emoji: "🚶",
    title: "Wax yar ayaan dhaqaaqaa",
    description: "Maalintii waan socdaa, laakiin jimicsi joogto ah ma sameeyo.",
    steps: 7000,
  },
  {
    id: "active" as ActivityLevel,
    emoji: "🏃‍♀️",
    title: "Waan firfircoonahay",
    description: "Si joogto ah ayaan u socdaa ama jimicsi u sameeyaa.",
    steps: 8500,
  },
  {
    id: "very-active" as ActivityLevel,
    emoji: "⚡",
    title: "Aad ayaan u firfircoonahay",
    description: "Dhaqdhaqaaq ama jimicsi badan ayaan sameeyaa inta badan.",
    steps: 10000,
  },
];

export default function OnboardingMovementScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [activity, setActivity] = useState<ActivityLevel | null>(null);

  const selectedActivity = activityOptions.find((item) => item.id === activity);

  const continueNext = () => {
    if (!selectedActivity) return;

    router.push({
      // Temporary until we create the next onboarding screen.
      pathname: "/onboarding-exercise",
      params: {
        ...params,
        activity: selectedActivity.id,
        activityLabel: selectedActivity.title,
        suggestedSteps: String(selectedActivity.steps),
      },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.coachRow}>
          <View style={styles.coachIcon}>
            <Text style={styles.coachEmoji}>🌿</Text>
          </View>

          <View style={styles.coachTextArea}>
            <Text style={styles.coachName}>CaatoAI</Text>

            <Text style={styles.coachLabel}>Aan fahanno maalintaada</Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          ma jiro jawaab sax ama khalad ah 💚
        </Text>

        <Text style={styles.title}>
          Maalintii intee ayaad{"\n"}
          <Text style={styles.titleHighlight}>dhaqaaqdaa?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Dooro midka sida ugu dhow u sharaxaya maalintaada caadiga ah. Waxaan
          tan u isticmaali doonaa oo keliya inaan kuu sameyno meel fiican oo aad
          ka bilowdo.
        </Text>

        <View style={styles.options}>
          {activityOptions.map((item) => {
            const selected = activity === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setActivity(item.id)}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
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

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {selectedActivity ? (
          <View style={styles.responseCard}>
            <Text style={styles.responseEmoji}>✨</Text>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseTitle}>
                Meel fiican ayaan ka bilaabi karnaa.
              </Text>

              <Text style={styles.responseText}>
                Tani ma aha xad joogto ah. CaatoAI wuxuu hadafkaaga dhaqdhaqaaqa
                si tartiib ah ula qabsan doonaa horumarkaaga.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.healthCard}>
          <View style={styles.healthIcon}>
            <Text style={styles.healthEmoji}>❤️</Text>
          </View>

          <View style={styles.healthTextArea}>
            <Text style={styles.healthTitle}>Apple Health</Text>

            <Text style={styles.healthText}>
              Mar dambe waxaad dooran kartaa inaad ku xirto Apple Health.
              Markaas CaatoAI wuxuu isticmaali karaa tallaabooyinkaaga dhabta ah
              halkii uu ka isticmaali lahaa qiyaas.
            </Text>

            <Text style={styles.healthOptional}>
              Ikhtiyaari • Looma baahna inaad hadda xirto
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedActivity}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedActivity && styles.buttonDisabled,
              pressed && selectedActivity && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Dhaqdhaqaaqaaga waa xog gaar ah. Adiga ayaa go'aaminaya waxa aad
            la wadaagto.
          </Text>
        </View>
      </View>
    </ScrollView>
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
    flexGrow: 1,
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
    width: "62%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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

  coachTextArea: {
    flex: 1,
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

  smallGreeting: {
    color: "#15803D",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    color: "#1F2937",
    fontSize: 32,
    lineHeight: 39,
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
    marginBottom: 20,
  },

  options: {
    gap: 10,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DDE8DE",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  optionIconSelected: {
    backgroundColor: "#DCFCE7",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#14532D",
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 15,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#16A34A",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  responseCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 14,
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

  healthCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  healthIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  healthEmoji: {
    fontSize: 18,
  },

  healthTextArea: {
    flex: 1,
  },

  healthTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  healthText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
  },

  healthOptional: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 6,
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 25,
  },

  button: {
    width: "100%",
    minHeight: 56,
    backgroundColor: "#14532D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  privacyText: {
    marginTop: 13,
    paddingHorizontal: 12,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "600",
  },
});
