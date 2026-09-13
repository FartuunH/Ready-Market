import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type WomensHealthStatus =
  | "none"
  | "partial-breastfeeding"
  | "exclusive-breastfeeding"
  | "pregnant"
  | "prefer-not-to-say";

const healthOptions = [
  {
    id: "none" as WomensHealthStatus,
    emoji: "🌿",
    title: "Midkoodna",
    description: "Hadda uur ma lihi, mana naasnuujiyo.",
  },
  {
    id: "partial-breastfeeding" as WomensHealthStatus,
    emoji: "🤱",
    title: "Qayb ahaan ayaan naasnuujiyaa",
    description: "Ilmahayga waxaan siiyaa naas iyo cunto ama caano kale.",
  },
  {
    id: "exclusive-breastfeeding" as WomensHealthStatus,
    emoji: "🤱",
    title: "Si buuxda ayaan naasnuujiyaa",
    description: "Ilmahaygu inta badan wuxuu ku tiirsan yahay naasnuujinta.",
  },
  {
    id: "pregnant" as WomensHealthStatus,
    emoji: "💛",
    title: "Uur ayaan leeyahay",
    description:
      "Waxaan rabaa CaatoAI inuu qorshaha si taxaddar leh ula qabsado.",
  },
  {
    id: "prefer-not-to-say" as WomensHealthStatus,
    emoji: "🔒",
    title: "Ma jecli inaan hadda sheego",
    description: "Waxaan doorbidayaa inaan xogtan ka gudbo hadda.",
  },
];

export default function OnboardingWomensHealthScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [healthStatus, setHealthStatus] = useState<WomensHealthStatus | null>(
    null,
  );

  const selectedHealth = healthOptions.find((item) => item.id === healthStatus);

  const continueNext = () => {
    if (!selectedHealth) return;

    const breastfeeding =
      selectedHealth.id === "partial-breastfeeding"
        ? "partial"
        : selectedHealth.id === "exclusive-breastfeeding"
          ? "exclusive"
          : "not-breastfeeding";

    router.push({
      // Temporary until we create the eating-style screen.
      pathname: "/onboarding-eating-style",
      params: {
        ...params,
        womensHealthStatus: selectedHealth.id,
        womensHealthLabel: selectedHealth.title,
        breastfeeding,
        pregnant: selectedHealth.id === "pregnant" ? "true" : "false",
      },
    });
  };

  const getCoachResponse = () => {
    if (!selectedHealth) return null;

    if (
      selectedHealth.id === "partial-breastfeeding" ||
      selectedHealth.id === "exclusive-breastfeeding"
    ) {
      return {
        title: "Waxaan qorshahaaga ka dhigi doonaa mid taxaddar badan.",
        text: "Naasnuujintu waxay beddeli kartaa baahida tamarta iyo nafaqada. CaatoAI ma isticmaali doono fasting ama OMAD inta Breastfeeding Mode uu shaqaynayo.",
      };
    }

    if (selectedHealth.id === "pregnant") {
      return {
        title: "Badbaadadaada ayaa mudnaanta leh.",
        text: "CaatoAI ma sameyn doono qorshe miisaan-dhimis, fasting ama OMAD inta uurka lagu jiro. Waxaan diiradda saari doonaa caadooyin caafimaad leh iyo talo taxaddar leh.",
      };
    }

    if (selectedHealth.id === "prefer-not-to-say") {
      return {
        title: "Waad ka gudbi kartaa xogtan.",
        text: "Xogtan khasab ma aha. Waxaad mar dambe ka beddeli kartaa profile-kaaga haddii aad rabto.",
      };
    }

    return {
      title: "Waan helay.",
      text: "Waxaan xogtan u isticmaali doonaa inaan qorshahaaga ka dhigno mid ku habboon xaaladdaada hadda.",
    };
  };

  const coachResponse = getCoachResponse();

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

            <Text style={styles.coachLabel}>
              Badbaadadaada ayaa ka horreysa qorshaha
            </Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          su'aashani waxay naga caawinaysaa inaan si ammaan ah kuu taageerno 💚
        </Text>

        <Text style={styles.title}>
          Ma jiraan wax aan{"\n"}
          <Text style={styles.titleHighlight}>qorshahaaga ku tixgelinno?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Dooro midka hadda kugu habboon. Xogtan waxaa loo isticmaalaa in
          CaatoAI uusan kuu soo jeedin qorshe aan xaaladdaada ku habboonayn.
        </Text>

        <View style={styles.options}>
          {healthOptions.map((item) => {
            const selected = healthStatus === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setHealthStatus(item.id)}
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

        {coachResponse ? (
          <View style={styles.responseCard}>
            <Text style={styles.responseEmoji}>✨</Text>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseTitle}>{coachResponse.title}</Text>

              <Text style={styles.responseText}>{coachResponse.text}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.safetyCard}>
          <Text style={styles.safetyEmoji}>🛡️</Text>

          <View style={styles.safetyTextArea}>
            <Text style={styles.safetyTitle}>
              CaatoAI ma mudna miisaan-dhimis marka badbaadadu ka muhiimsan
              tahay
            </Text>

            <Text style={styles.safetyText}>
              Uurka iyo naasnuujinta waxay u baahan karaan qorshe ka duwan
              qorshaha miisaan-dhimista caadiga ah. CaatoAI wuxuu adeegsan
              doonaa xeerar taxaddar leh oo ku salaysan jawaabtaada.
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedHealth}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedHealth && styles.buttonDisabled,
              pressed && selectedHealth && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Xogtan waa gaar. Lama tusayo saaxiibbo, challenges ama dadka
            kale.
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
    width: "84%",
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
    lineHeight: 16,
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

  safetyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  safetyEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  safetyTextArea: {
    flex: 1,
  },

  safetyTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  safetyText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
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
