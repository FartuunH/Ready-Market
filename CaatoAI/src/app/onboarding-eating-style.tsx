import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type EatingStyle = "regular" | "fasting" | "omad";

const eatingOptions = [
  {
    id: "regular" as EatingStyle,
    emoji: "🍽️",
    title: "Qorshe caadi ah",
    description:
      "Waxaan rabaa cuntooyin iyo meals caadi ah maalintii anigoon fasting samayn.",
  },
  {
    id: "fasting" as EatingStyle,
    emoji: "⏳",
    title: "Intermittent Fasting",
    description:
      "Waxaan rabaa inaan cunto ku koobnaado waqtiyo gaar ah oo maalinta ah.",
  },
  {
    id: "omad" as EatingStyle,
    emoji: "🥣",
    title: "OMAD",
    description: "Waxaan doorbidayaa hal meal oo weyn maalintii.",
  },
];

export default function OnboardingEatingStyleScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const breastfeeding =
    typeof params.breastfeeding === "string"
      ? params.breastfeeding
      : "not-breastfeeding";

  const pregnant =
    typeof params.pregnant === "string" ? params.pregnant === "true" : false;

  const womensHealthStatus =
    typeof params.womensHealthStatus === "string"
      ? params.womensHealthStatus
      : "";

  const healthNotDisclosed = womensHealthStatus === "prefer-not-to-say";

  const fastingBlocked =
    pregnant ||
    breastfeeding === "partial" ||
    breastfeeding === "exclusive" ||
    healthNotDisclosed;

  const [eatingStyle, setEatingStyle] = useState<EatingStyle | null>(
    fastingBlocked ? "regular" : null,
  );

  const selectedStyle = eatingOptions.find((item) => item.id === eatingStyle);

  const handleSelect = (style: EatingStyle) => {
    if (fastingBlocked && (style === "fasting" || style === "omad")) {
      return;
    }

    setEatingStyle(style);
  };

  const continueNext = () => {
    if (!selectedStyle) return;

    router.push({
      // Temporary until we build the next onboarding screen.
      pathname: "/onboarding-food-access",
      params: {
        ...params,
        eatingStyle: selectedStyle.id,
        eatingStyleLabel: selectedStyle.title,
      },
    });
  };

  const getCoachResponse = () => {
    if (!selectedStyle) return null;

    if (selectedStyle.id === "regular") {
      return {
        title: "Qorshe caadi ah waa doorasho fiican.",
        text: "CaatoAI wuxuu kaa caawin doonaa meals isku dheelitiran, protein ku filan iyo portions kuu shaqeeya adigoon fasting samayn.",
      };
    }

    if (selectedStyle.id === "fasting") {
      return {
        title: "Waxaan fasting-ka ka dhigi doonaa mid taxaddar leh.",
        text: "CaatoAI ma isticmaali doono fasting-ka sidii tartan ama hab aad u cunto wax aad u yar. Waxaan diiradda saari doonaa jadwal aad dooratay iyo cunto ku filan marka aad wax cunayso.",
      };
    }

    return {
      title: "OMAD wuxuu u baahan yahay taxaddar dheeraad ah.",
      text: "Haddii OMAD kuu habboon yahay, CaatoAI wuxuu hubin doonaa in meal-kaagu yahay mid nafaqo leh oo ku filan, halkii uu kaa dhiirrigelin lahaa inaad si xad dhaaf ah wax u yarayso.",
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
              Qaabka cuntada waa inuu ku habboonaadaa noloshaada
            </Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          adiga ayaa dooranaya qaabka kuu shaqeeya 💚
        </Text>

        <Text style={styles.title}>
          Sidee ayaad rabtaa{"\n"}
          <Text style={styles.titleHighlight}>inaad u cunto?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Dooro qaabka aad doorbidayso. CaatoAI wuxuu qorshaha cuntada ku
          waafajin doonaa doorashadaada iyo xogta badbaadada ee aad hore u
          bixisay.
        </Text>

        {fastingBlocked ? (
          <View style={styles.blockedNotice}>
            <Text style={styles.blockedEmoji}>🛡️</Text>

            <View style={styles.blockedTextArea}>
              <Text style={styles.blockedTitle}>
                Fasting iyo OMAD hadda lama heli karo
              </Text>

              <Text style={styles.blockedText}>
                {healthNotDisclosed
                  ? "Sababta oo ah waxaad dooratay inaadan sheegin xaaladda uurka ama naasnuujinta, CaatoAI wuxuu hadda kuu bilaabi doonaa qorshe caadi ah oo taxaddar badan. Waxaad tan beddeli kartaa marka aad profile-kaaga cusboonaysiiso."
                  : "Sababtoo ah waxaad sheegtay inaad uur leedahay ama naasnuujinayso, CaatoAI wuxuu kuu isticmaali doonaa qorshe caadi ah oo taxaddar badan."}
              </Text>
            </View>
          </View>
        ) : null}

        {healthNotDisclosed && !fastingBlocked ? (
          <View style={styles.cautionCard}>
            <Text style={styles.cautionEmoji}>💛</Text>

            <View style={styles.cautionTextArea}>
              <Text style={styles.cautionTitle}>
                Xogta caafimaadka lama dhamaystirin
              </Text>

              <Text style={styles.cautionText}>
                Waxaad weli dooran kartaa qaabka cuntada, laakiin qorshaha
                caadiga ah ayaa ah doorashada ugu taxaddarka badan ilaa aad
                profile-kaaga ka cusboonaysiiso xogtaas.
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.options}>
          {eatingOptions.map((item) => {
            const selected = eatingStyle === item.id;

            const disabled =
              fastingBlocked && (item.id === "fasting" || item.id === "omad");

            return (
              <Pressable
                key={item.id}
                disabled={disabled}
                onPress={() => handleSelect(item.id)}
                style={[
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                  disabled && styles.optionCardDisabled,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    selected && styles.optionIconSelected,
                    disabled && styles.optionIconDisabled,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{item.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <View style={styles.optionTitleRow}>
                    <Text
                      style={[
                        styles.optionTitle,
                        selected && styles.optionTitleSelected,
                        disabled && styles.optionTitleDisabled,
                      ]}
                    >
                      {item.title}
                    </Text>

                    {disabled ? <Text style={styles.lockText}>🔒</Text> : null}
                  </View>

                  <Text
                    style={[
                      styles.optionDescription,
                      disabled && styles.optionDescriptionDisabled,
                    ]}
                  >
                    {item.description}
                  </Text>

                  {disabled ? (
                    <Text style={styles.unavailableText}>
                      Hadda kuguma habboona
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                    disabled && styles.radioDisabled,
                  ]}
                >
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
          <Text style={styles.safetyEmoji}>🌱</Text>

          <View style={styles.safetyTextArea}>
            <Text style={styles.safetyTitle}>
              Cunista yar ma aha hadafka CaatoAI
            </Text>

            <Text style={styles.safetyText}>
              Hadafku waa inaad hesho qaab cunto oo aad sii wadi karto, aad
              hesho nafaqo ku filan, oo aad si tartiib ah ugu shaqayso
              hadafkaaga.
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedStyle}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedStyle && styles.buttonDisabled,
              pressed && selectedStyle && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Qaabka cuntadaada waa kuu gaar. Saaxiibbada ama challenges-ka
            looma tusayo ilaa aad adigu doorato.
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
    width: "89%",
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
    marginBottom: 18,
  },

  blockedNotice: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginBottom: 12,
  },

  blockedEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  blockedTextArea: {
    flex: 1,
  },

  blockedTitle: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  blockedText: {
    color: "#4B5563",
    fontSize: 10,
    lineHeight: 16,
  },

  cautionCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginBottom: 12,
  },

  cautionEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  cautionTextArea: {
    flex: 1,
  },

  cautionTitle: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  cautionText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
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

  optionCardDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    opacity: 0.7,
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

  optionIconDisabled: {
    backgroundColor: "#F3F4F6",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
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

  optionTitleDisabled: {
    color: "#9CA3AF",
  },

  lockText: {
    fontSize: 11,
    marginLeft: 6,
    marginBottom: 3,
  },

  optionDescription: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 15,
  },

  optionDescriptionDisabled: {
    color: "#9CA3AF",
  },

  unavailableText: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "800",
    marginTop: 5,
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

  radioDisabled: {
    borderColor: "#E5E7EB",
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
