import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type EatingBehavior =
  | "night"
  | "stress"
  | "tired"
  | "cravings"
  | "portions"
  | "unsure"
  | "no-major-issue";

const behaviorOptions = [
  {
    id: "night" as EatingBehavior,
    emoji: "🌙",
    title: "Habeenkii",
    description:
      "Habeenkii ayaan u badanahay inaan wax badan cuno ama snack sameeyo.",
  },
  {
    id: "stress" as EatingBehavior,
    emoji: "😟",
    title: "Marka aan walwalsanahay",
    description:
      "Walwalka ama dareenkayga ayaa mararka qaar iga dhiga inaan cuno.",
  },
  {
    id: "tired" as EatingBehavior,
    emoji: "😴",
    title: "Marka aan daalanahay",
    description:
      "Marka aan daalo waxaan u janjeeraa cunto fudud ama wax badan inaan cuno.",
  },
  {
    id: "cravings" as EatingBehavior,
    emoji: "🍫",
    title: "Marka cravings igu dhacaan",
    description:
      "Mararka qaar rabitaanka cunto gaar ah ayaa igu adkaada inaan xakameeyo.",
  },
  {
    id: "portions" as EatingBehavior,
    emoji: "🍽️",
    title: "Marka qaybaha cuntadu igu bataan",
    description:
      "Mararka qaar way igu adag tahay inaan ogaado inta cunto ee igu habboon.",
  },
  {
    id: "unsure" as EatingBehavior,
    emoji: "🤷‍♀️",
    title: "Mararka qaar ma garanayo sababta aan u cunayo",
    description:
      "Waxaan isku arkaa inaan cunayo xitaa marka aanan hubin inaan gaajaysanahay.",
  },
  {
    id: "no-major-issue" as EatingBehavior,
    emoji: "🌿",
    title: "Dhib badan kuma qabo cuntada",
    description:
      "Waxaan inta badan dareemaa inaan si fiican u maamulo cunistayda.",
  },
];

export default function OnboardingEatingBehaviorScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [eatingBehavior, setEatingBehavior] = useState<EatingBehavior | null>(
    null,
  );

  const selectedBehavior = behaviorOptions.find(
    (item) => item.id === eatingBehavior,
  );

  const continueNext = () => {
    if (!selectedBehavior) return;

    router.push({
      // Temporary until the next onboarding screen is created.
      pathname: "/onboarding-food-culture",
      params: {
        ...params,
        eatingBehavior: selectedBehavior.id,
        eatingBehaviorLabel: selectedBehavior.title,
      },
    });
  };

  const getCoachResponse = () => {
    if (!selectedBehavior) return null;

    switch (selectedBehavior.id) {
      case "night":
        return {
          title: "Habeenkii waan kula shaqayn karnaa.",
          text: "CaatoAI wuxuu kaa caawin karaa inaad ogaato waxa kugu kiciya cunista habeenkii oo aad samaysato qorshe fudud oo kaa caawiya.",
        };

      case "stress":
        return {
          title: "Walwalku wuxuu saameyn karaa cunista.",
          text: "Waxaan ku siin doonaa check-ins iyo farsamooyin fudud oo kaa caawiya inaad marka hore ogaato dareenkaaga ka hor intaadan si toos ah cunto ugu leexan.",
        };

      case "tired":
        return {
          title: "Daalka iyo cunistu way isku xirnaan karaan.",
          text: "Waxaan kaa caawin doonaa inaad qorshayso cuntooyin fudud oo diyaar ah si daalku uusan kuu gelin doorasho aanad rabin.",
        };

      case "cravings":
        return {
          title: "Cravings-ku waa wax caadi ah.",
          text: "Ujeeddadu ma aha inaad mamnuucdo cuntooyinka aad jeceshahay. Waxaan kaa caawin doonaa portions, substitutions iyo mindful choices.",
        };

      case "portions":
        return {
          title: "Uma baahnid inaad wax walba cabbirto.",
          text: "CaatoAI wuxuu ku bari doonaa habab fudud oo aad ku fahmi karto portions-ka cuntada adigoon noloshaada ka dhigin xisaab joogto ah.",
        };

      case "unsure":
        return {
          title: "Waxaan kaa caawin doonaa inaad barato calaamadahaaga.",
          text: "Check-ins-ka gaaban waxay kaa caawin doonaan inaad kala garato gaajo, caajis, walwal iyo caado.",
        };

      default:
        return {
          title: "Taasi waa bilow fiican.",
          text: "Waxaan diiradda saari doonaa inaan ilaalino caadooyinka kuu shaqeeya oo aan si tartiib ah u hagaajino meelaha kale.",
        };
    }
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
              Aan fahanno caadooyinkaaga cuntada
            </Text>
          </View>
        </View>

        <Text style={styles.smallGreeting}>
          {name ? `${name}, ` : ""}
          tani waa xog naga caawinaysa inaan ku fahanno 💚
        </Text>

        <Text style={styles.title}>
          Goorma ayay cuntadu{"\n"}
          <Text style={styles.titleHighlight}>kugu adkaataa?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Dooro midka sida ugu dhow kuu sharaxaya. Ma jiro jawaab sax ama khalad
          ah.
        </Text>

        <View style={styles.options}>
          {behaviorOptions.map((item) => {
            const selected = eatingBehavior === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setEatingBehavior(item.id)}
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

        <View style={styles.lessonCard}>
          <Text style={styles.lessonEmoji}>🧠</Text>

          <View style={styles.lessonTextArea}>
            <Text style={styles.lessonTitle}>
              CaatoAI kaliya calories ma tirinayo
            </Text>

            <Text style={styles.lessonText}>
              Waxaan sidoo kale kaa caawin doonaa inaad fahanto cravings-ka,
              walwalka, caadooyinka iyo sababta aad mararka qaar u cunto marka
              aadan gaajaysanayn.
            </Text>
          </View>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!selectedBehavior}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !selectedBehavior && styles.buttonDisabled,
              pressed && selectedBehavior && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            🔒 Caadooyinkaaga cuntada waa xog gaar ah. Qofna lama wadaagayo ilaa
            aad adigu doorato.
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
    width: "73%",
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

  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  lessonEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  lessonTextArea: {
    flex: 1,
  },

  lessonTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  lessonText: {
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
