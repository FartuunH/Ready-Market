import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ActivityLevel = "low" | "light" | "active" | "very-active";

const activityOptions: {
  id: ActivityLevel;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "low",
    emoji: "🌱",
    title: "Dhaqdhaqaaq yar",
    description: "Inta badan waan fadhiistaa, socod badanna ma sameeyo.",
  },
  {
    id: "light",
    emoji: "🚶",
    title: "Wax yar ayaan dhaqaaqaa",
    description: "Maalintii waan socdaa, laakiin jimicsi joogto ah ma sameeyo.",
  },
  {
    id: "active",
    emoji: "🏃‍♀️",
    title: "Waan firfircoonahay",
    description: "Si joogto ah ayaan u socdaa ama jimicsi u sameeyaa.",
  },
  {
    id: "very-active",
    emoji: "⚡",
    title: "Aad ayaan u firfircoonahay",
    description: "Dhaqdhaqaaq ama jimicsi badan ayaan sameeyaa inta badan.",
  },
];

export default function OnboardingActivityScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );

  const selectedActivity = activityOptions.find(
    (item) => item.id === activityLevel,
  );

  const continueNext = () => {
    if (!activityLevel) return;

    router.push({
      pathname: "/onboarding-life",
      params: {
        ...params,
        activityLevel,
        activityLabel: selectedActivity?.title ?? "",
      },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* TOP */}

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
              Waxaan kuu dhisaynaa qorshe kuu gaar ah
            </Text>
          </View>
        </View>

        {/* COACH */}

        <View style={styles.coachRow}>
          <View style={styles.coachIcon}>
            <Text style={styles.coachEmoji}>🌿</Text>
          </View>

          <View style={styles.coachTextArea}>
            <Text style={styles.coachName}>CaatoAI</Text>

            <Text style={styles.coachLabel}>Aan fahanno maalintaada</Text>
          </View>
        </View>

        {/* PERSONAL */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, ma jiro jawaab sax ama khalad ah. Dooro waxa sida ugu dhow
              u sharaxaya maalintaada caadiga ah.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>DHAQDHAQAAQAAGA</Text>
          </View>

          <Text style={styles.title}>
            Maalintaada intee{"\n"}
            <Text style={styles.titleGreen}>ayaad dhaqaaqdaa?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Waxaan tan u isticmaali doonaa inaan fahanno meesha aad maanta ka
            bilaabayso — ma aha inaan ku xukumno inta jimicsi ee aad samayso.
          </Text>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {activityOptions.map((item) => {
            const selected = activityLevel === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setActivityLevel(item.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  selected && styles.optionCardSelected,
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

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* RESPONSE */}

        {selectedActivity && (
          <View style={styles.responseCard}>
            <Text style={styles.responseEmoji}>✨</Text>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseTitle}>
                Waa meel fiican oo laga bilaabo.
              </Text>

              <Text style={styles.responseText}>
                CaatoAI wuxuu qorshahaaga ka bilaabi doonaa heerkaaga hadda,
                kadibna waxaan si tartiib ah u dhisi doonaa caadooyin aad sii
                wadi karto.
              </Text>
            </View>
          </View>
        )}

        {/* STEPS */}

        <View style={styles.stepsCard}>
          <View style={styles.stepsIcon}>
            <Text style={styles.stepsEmoji}>👟</Text>
          </View>

          <View style={styles.stepsTextArea}>
            <Text style={styles.stepsTitle}>
              Tallaabooyinkaaga sidoo kale waan la socon karnaa
            </Text>

            <Text style={styles.stepsText}>
              Marka app-ka la isticmaalo, waxaad la socon kartaa
              tallaabooyinkaaga maalin kasta. Waxaan ka bilaabi karnaa hadaf
              macquul ah oo mustaqbalka la hagaajin karo.
            </Text>
          </View>
        </View>

        {/* HEALTH CONNECTION */}

        <View style={styles.healthCard}>
          <View style={styles.healthTopRow}>
            <View style={styles.healthIcon}>
              <Text style={styles.healthEmoji}>❤️</Text>
            </View>

            <View style={styles.healthTextArea}>
              <Text style={styles.healthTitle}>Health data</Text>

              <Text style={styles.healthSubtitle}>Ikhtiyaari</Text>
            </View>
          </View>

          <Text style={styles.healthText}>
            Mustaqbalka waxaad dooran kartaa inaad CaatoAI ku xirto xogta
            caafimaadka ee qalabkaaga si tallaabooyinkaaga dhabta ah loo
            isticmaalo halkii qiyaas laga isticmaali lahaa.
          </Text>

          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>
              Looma baahna inaad hadda xirto
            </Text>
          </View>
        </View>

        {/* BUTTON */}

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!activityLevel}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !activityLevel && styles.buttonDisabled,
              pressed && activityLevel && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Dhaqdhaqaaqaaga waa xog kuu gaar ah. Adiga ayaa go'aaminaya waxa
            aad la wadaagto.
          </Text>
        </View>
      </View>
    </ScrollView>
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
    width: "50%",
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
    marginBottom: 16,
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

  coachTextArea: {
    flex: 1,
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

  personalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    padding: 13,
    marginBottom: 22,
  },

  personalEmoji: {
    fontSize: 17,
    marginRight: 9,
  },

  personalText: {
    flex: 1,
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
    fontSize: 31,
    lineHeight: 38,
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

  optionsArea: {
    gap: 10,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E6E0",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    backgroundColor: "#F1F7F0",
    borderColor: "#79A783",
  },

  optionPressed: {
    opacity: 0.88,
  },

  optionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#F2F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIconSelected: {
    backgroundColor: "#DDEDDD",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#303A33",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#28563A",
  },

  optionDescription: {
    color: "#818A83",
    fontSize: 10,
    lineHeight: 15,
  },

  radio: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCD4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#4F7C5B",
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#4F7C5B",
  },

  responseCard: {
    marginTop: 13,
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
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  responseText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 16,
  },

  stepsCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  stepsIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  stepsEmoji: {
    fontSize: 17,
  },

  stepsTextArea: {
    flex: 1,
  },

  stepsTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  stepsText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  healthCard: {
    marginTop: 12,
    backgroundColor: "#F4F2EC",
    borderRadius: 18,
    padding: 14,
  },

  healthTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  healthIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  healthEmoji: {
    fontSize: 17,
  },

  healthTextArea: {
    flex: 1,
  },

  healthTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
  },

  healthSubtitle: {
    color: "#8B938D",
    fontSize: 9,
    marginTop: 2,
  },

  healthText: {
    color: "#737D75",
    fontSize: 10,
    lineHeight: 15,
  },

  optionalBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E5EBE3",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 9,
  },

  optionalText: {
    color: "#657069",
    fontSize: 8,
    fontWeight: "800",
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 25,
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

  privacyText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },
});
