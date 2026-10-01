import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type EatingTrigger =
  | "stress"
  | "boredom"
  | "emotional"
  | "very-hungry"
  | "social"
  | "night"
  | "none";

const OPTIONS: {
  id: EatingTrigger;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "stress",
    emoji: "😣",
    title: "Markaan stress dareemo",
    description:
      "Walwalka ama maalmaha adag waxay kordhiyaan rabitaankayga cuntada.",
  },
  {
    id: "boredom",
    emoji: "😴",
    title: "Markaan caajiso",
    description: "Mararka qaar waxaan wax cunaa anigoon si dhab ah u gaajoon.",
  },
  {
    id: "emotional",
    emoji: "💭",
    title: "Markaan murugoodo ama dareen badan qabo",
    description:
      "Dareenkaygu mararka qaar wuxuu saameeyaa sida aan wax u cuno.",
  },
  {
    id: "very-hungry",
    emoji: "🍽️",
    title: "Markaan aad u gaajoodo",
    description:
      "Markaan waqti dheer wax cunin, way igu adkaataa inaan portion-ka xakameeyo.",
  },
  {
    id: "social",
    emoji: "👥",
    title: "Markaan dadka kale la joogo",
    description:
      "Xafladaha, booqashooyinka ama la cunista dadka kale ayaa i saameeya.",
  },
  {
    id: "night",
    emoji: "🌙",
    title: "Habeenkii",
    description:
      "Rabitaanka cunto ama snacks ayaa ii badan fiidkii ama habeenkii.",
  },
  {
    id: "none",
    emoji: "🌿",
    title: "Arrintan badanaa iguma adka",
    description:
      "Ma dareemo xaalad gaar ah oo si joogto ah ii keenta inaan wax badan cuno.",
  },
];

export default function OnboardingChallengesScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [selected, setSelected] = useState<EatingTrigger[]>([]);

  const toggleOption = (id: EatingTrigger) => {
    setSelected((current) => {
      // "None" should be selected by itself.
      if (id === "none") {
        if (current.includes("none")) {
          return [];
        }

        return ["none"];
      }

      // Choosing a trigger removes "none".
      const withoutNone = current.filter((item) => item !== "none");

      if (withoutNone.includes(id)) {
        return withoutNone.filter((item) => item !== id);
      }

      return [...withoutNone, id];
    });
  };

  const canContinue = selected.length > 0;

  const selectedLabels = OPTIONS.filter((option) =>
    selected.includes(option.id),
  ).map((option) => option.title);

  const continueNext = () => {
    if (!canContinue) return;

    router.push({
      pathname: "/onboarding-coaching",
      params: {
        ...params,
        eatingTriggers: selected.join(","),
        eatingTriggerLabels: selectedLabels.join("|"),
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
              Aan fahanno waxa saameeya cuntadaada
            </Text>
          </View>
        </View>

        {/* PERSONAL MESSAGE */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, gaajo keliya ma aha sababta aan mararka qaar wax u cunno.
              Fahamka waxa kugu kiciya cuntada wuxuu naga caawinayaa inaan ku
              siino taageero kuu gaar ah.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>WAXA KUGU KICIYA CUNTADA</Text>
          </View>

          <Text style={styles.title}>
            Goorma ayay kuugu adag tahay{"\n"}
            <Text style={styles.titleGreen}>inaad cuntada xakamayso?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Dooro dhammaan kuwa ku khuseeya. Jawaabahaagu waxay CaatoAI ka
            caawinayaan inuu fahmo xaaladaha aad taageerada ugu baahan karto.
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

        {/* AI RESPONSE */}

        {selected.length > 0 && !selected.includes("none") && (
          <View style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiEmoji}>🧠</Text>
            </View>

            <View style={styles.aiTextArea}>
              <Text style={styles.aiLabel}>CAATOAI</Text>

              <Text style={styles.aiTitle}>
                Marka hore waxaan baranaynaa pattern-ka
              </Text>

              <Text style={styles.aiText}>
                Ujeeddadu ma aha inaad naftaada eedayso. Waxaan baran doonaa
                goorta xaaladahani dhacaan, kadibna waxaan kuu dhisi doonaa
                xeelado yar-yar oo kaa caawiya inaad doorasho samayso.
              </Text>
            </View>
          </View>
        )}

        {selected.includes("none") && (
          <View style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiEmoji}>🌿</Text>
            </View>

            <View style={styles.aiTextArea}>
              <Text style={styles.aiLabel}>CAATOAI</Text>

              <Text style={styles.aiTitle}>Waa hagaag</Text>

              <Text style={styles.aiText}>
                Waxaan diiradda saari karnaa qaybaha kale ee safarkaaga, sida
                portions, dhaqdhaqaaqa iyo caadooyinka kaa caawinaya inaad
                hadafkaaga gaarto.
              </Text>
            </View>
          </View>
        )}

        {/* LESSON */}

        <View style={styles.lessonCard}>
          <View style={styles.lessonIcon}>
            <Text style={styles.lessonEmoji}>💡</Text>
          </View>

          <View style={styles.lessonTextArea}>
            <Text style={styles.lessonTitle}>
              Gaajo iyo rabitaan cunto isku mid ma aha
            </Text>

            <Text style={styles.lessonText}>
              Mararka qaar jirku cunto ayuu u baahan yahay. Mararka qaarna
              stress, caajis, caado ama deegaanka ayaa rabitaanka cuntada kicin
              kara. CaatoAI wuxuu kaa caawin doonaa inaad kala barato.
            </Text>
          </View>
        </View>

        {/* SMALL HABIT CARD */}

        <View style={styles.habitCard}>
          <Text style={styles.habitEmoji}>🌱</Text>

          <View style={styles.habitTextArea}>
            <Text style={styles.habitTitle}>
              Ogaanshaha ayaa ah tallaabada koowaad
            </Text>

            <Text style={styles.habitText}>
              Uma baahnid inaad maanta wax walba xalliso. Marka hore waxaan
              baranaynaa waxa dhacaya iyo goorta uu dhacayo.
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
            💚 Jawaabahaagu waxay naga caawinayaan inaan coaching-ka CaatoAI kuu
            waafajino.
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
    width: "80%",
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

  habitCard: {
    marginTop: 11,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  habitEmoji: {
    fontSize: 17,
    marginRight: 10,
  },

  habitTextArea: {
    flex: 1,
  },

  habitTitle: {
    color: "#28563A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  habitText: {
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
