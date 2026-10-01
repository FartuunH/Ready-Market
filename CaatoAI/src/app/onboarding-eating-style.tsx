import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type EatingStyle =
  | "regular-meals"
  | "skip-meals"
  | "snacking"
  | "night-eating"
  | "changing-schedule";

const OPTIONS: {
  id: EatingStyle;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "regular-meals",
    emoji: "🍽️",
    title: "Badanaa 3 jeer ayaan wax cunaa",
    description: "Quraac, qado iyo casho ayaan inta badan leeyahay.",
  },
  {
    id: "skip-meals",
    emoji: "⏰",
    title: "Mararka qaar cuntada waan ka boodaa",
    description:
      "Waxaan seegaa quraac, qado ama cunto kale marka aan mashquulo.",
  },
  {
    id: "snacking",
    emoji: "🍎",
    title: "Wax yar-yar ayaan marar badan cunaa",
    description: "Snacks ama cunto yar ayaan cunaa dhowr jeer maalintii.",
  },
  {
    id: "night-eating",
    emoji: "🌙",
    title: "Habeenkii ayaan wax badan cunaa",
    description:
      "Gaajada ama rabitaanka cuntadu badanaa habeenkii ayuu ii bato.",
  },
  {
    id: "changing-schedule",
    emoji: "🔄",
    title: "Jadwalkayga cuntadu wuu is beddelaa",
    description: "Maalin kasta isku waqti wax ma cuno.",
  },
];

export default function OnboardingEatingStyleScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [selected, setSelected] = useState<EatingStyle[]>([]);

  const toggleOption = (id: EatingStyle) => {
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  const canContinue = selected.length > 0;

  const continueNext = () => {
    if (!canContinue) return;

    const labels = OPTIONS.filter((option) => selected.includes(option.id)).map(
      (option) => option.title,
    );

    router.push({
      pathname: "/onboarding-eating-behavior",
      params: {
        ...params,
        eatingStyles: selected.join(","),
        eatingStyleLabels: labels.join("|"),
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

            <Text style={styles.coachLabel}>
              Aan fahanno sida cuntadu maalintaada ugu jirto
            </Text>
          </View>
        </View>

        {/* PERSONAL MESSAGE */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, ma jiro jadwal qof walba u shaqeeya. Waxaan rabnaa inaan
              marka hore fahanno sida adigu hadda wax u cunto.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>CAADOOYINKA CUNTADA</Text>
          </View>

          <Text style={styles.title}>
            Sidee ayaad inta badan{"\n"}
            <Text style={styles.titleGreen}>wax u cuntaa?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Dooro dhammaan kuwa ku khuseeya. Jawaab sax ama khalad ah ma jiro —
            waxaan rabnaa inaan fahanno maalintaada caadiga ah.
          </Text>

          <View style={styles.multiBadge}>
            <Text style={styles.multiBadgeText}>
              ✓ Waxaad dooran kartaa dhowr
            </Text>
          </View>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option.id);

            return (
              <Pressable
                key={option.id}
                onPress={() => toggleOption(option.id)}
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
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.checkBox,
                    isSelected && styles.checkBoxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* AI INSIGHT */}

        {selected.length > 0 && (
          <View style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiEmoji}>🧠</Text>
            </View>

            <View style={styles.aiTextArea}>
              <Text style={styles.aiLabel}>CAATOAI</Text>

              <Text style={styles.aiTitle}>Uma baahnid jadwal qumman</Text>

              <Text style={styles.aiText}>
                Waxaan qorshahaaga ku waafajin doonaa noloshaada. Tallaabada ugu
                horreysa waa inaan fahanno waxa hadda dhacaya — kadib ayaan si
                tartiib ah u dhiseynaa caadooyin kuu shaqeeya.
              </Text>
            </View>
          </View>
        )}

        {/* LESSON */}

        <View style={styles.lessonCard}>
          <View style={styles.lessonIcon}>
            <Text style={styles.lessonEmoji}>🌱</Text>
          </View>

          <View style={styles.lessonTextArea}>
            <Text style={styles.lessonTitle}>
              Isbeddel yar ayaa ka fiican qorshe adag
            </Text>

            <Text style={styles.lessonText}>
              Haddii jadwalkaaga cuntadu mararka qaar is beddelo, CaatoAI kuma
              weydiin doono inaad hal maalin wax walba beddesho. Waxaan ka
              bilaabi doonaa waxa kuu fudud.
            </Text>
          </View>
        </View>

        {/* WHY */}

        <View style={styles.whyCard}>
          <Text style={styles.whyEmoji}>💡</Text>

          <View style={styles.whyTextArea}>
            <Text style={styles.whyTitle}>Maxaan tan kuu weydiinaynaa?</Text>

            <Text style={styles.whyText}>
              Qaabka aad hadda wax u cunto wuxuu naga caawinayaa inaan kuu
              diyaarinno meal timing, reminders iyo talooyin noloshaada la
              jaanqaadaya.
            </Text>
          </View>
        </View>

        {/* BUTTON */}

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
            💚 Ujeeddadu waa inaan fahanno caadooyinkaaga, ma aha inaan ku
            xukumno.
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
    width: "74%",
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
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  personalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    padding: 13,
    marginBottom: 21,
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
    marginBottom: 18,
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
    letterSpacing: 0.8,
  },

  title: {
    color: "#202923",
    fontSize: 30,
    lineHeight: 37,
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

  multiBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F4ED",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 11,
  },

  multiBadgeText: {
    color: "#657069",
    fontSize: 9,
    fontWeight: "800",
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

  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CCD4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  checkBoxSelected: {
    backgroundColor: "#4F7C5B",
    borderColor: "#4F7C5B",
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  aiCard: {
    marginTop: 13,
    backgroundColor: "#173F2A",
    borderRadius: 21,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  aiIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  aiEmoji: {
    fontSize: 18,
  },

  aiTextArea: {
    flex: 1,
  },

  aiLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  aiTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  aiText: {
    color: "#C9D9CC",
    fontSize: 10,
    lineHeight: 16,
  },

  lessonCard: {
    marginTop: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  lessonIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  lessonEmoji: {
    fontSize: 17,
  },

  lessonTextArea: {
    flex: 1,
  },

  lessonTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  lessonText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  whyCard: {
    marginTop: 11,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  whyEmoji: {
    fontSize: 17,
    marginRight: 10,
  },

  whyTextArea: {
    flex: 1,
  },

  whyTitle: {
    color: "#28563A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  whyText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 15,
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

  bottomText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },
});
