import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ConfidenceLevel = "1" | "2" | "3" | "4" | "5";

const confidenceOptions: {
  id: ConfidenceLevel;
  number: string;
  title: string;
  description: string;
}[] = [
  {
    id: "1",
    number: "1",
    title: "Aad bay iigu adag tahay",
    description: "Weli kalsooni badan ma qabo inaan sii wadi karo.",
  },
  {
    id: "2",
    number: "2",
    title: "Wax yar ayaan ku kalsoonahay",
    description:
      "Waxaan rabaa inaan isku dayo, laakiin waxaan u baahanahay taageero.",
  },
  {
    id: "3",
    number: "3",
    title: "Dhexdhexaad",
    description:
      "Waxaan dareemayaa inaan awoodo, laakiin mararka qaar way igu adkaan kartaa.",
  },
  {
    id: "4",
    number: "4",
    title: "Aad ayaan ugu dhowahay inaan sii wado",
    description: "Waxaan dareemayaa inaan diyaar u ahay inaan joogteeyo.",
  },
  {
    id: "5",
    number: "5",
    title: "Aad ayaan ugu kalsoonahay",
    description: "Waxaan diyaar u ahay inaan isbeddel dhab ah sameeyo.",
  },
];

export default function OnboardingLifeScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);

  const selectedConfidence = confidenceOptions.find(
    (item) => item.id === confidence,
  );

  const continueNext = () => {
    if (!confidence) return;

    router.push({
      pathname: "/onboarding-food",
      params: {
        ...params,
        confidence,
        confidenceLabel: selectedConfidence?.title ?? "",
      },
    });
  };

  const getCoachResponse = () => {
    if (!confidence) return null;

    if (confidence === "1" || confidence === "2") {
      return {
        emoji: "🌱",
        title: "Uma baahnid kalsooni buuxda maanta.",
        text: "Waxaan ku bilaabaynaa tallaabooyin yar-yar oo fudud. CaatoAI wuxuu kaa caawin doonaa inaad kalsoonidaada si tartiib ah u dhisto.",
      };
    }

    if (confidence === "3") {
      return {
        emoji: "💚",
        title: "Taasi waa meel fiican oo laga bilaabo.",
        text: "Uma baahnid inaad wax walba si qumman u samayso. Waxaan diiradda saari doonaa joogteynta iyo horumar yar oo maalinle ah.",
      };
    }

    return {
      emoji: "✨",
      title: "Waa bilow fiican.",
      text: "Waxaan kaa caawin doonaa inaad kalsoonidaas u beddesho caadooyin joogto ah oo noloshaada ku shaqeeya.",
    };
  };

  const coachResponse = getCoachResponse();

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
              Aan fahanno sida aad hadda dareemayso
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>DIYAAR GAROWGAAGA</Text>
          </View>

          <Text style={styles.title}>
            {name ? `${name}, ` : ""}
            intee ayaad ku{"\n"}
            <Text style={styles.titleGreen}>
              kalsoon tahay inaad sii wadi karto?
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Tani ma aha imtixaan. Waxaan rabnaa inaan fahanno inta taageero ee
            aad u baahan karto marka aad bilaabayso safarkaaga.
          </Text>
        </View>

        {/* SCALE */}

        <View style={styles.scaleCard}>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Kalsooni yar</Text>

            <Text style={styles.scaleLabel}>Kalsooni badan</Text>
          </View>

          <View style={styles.numberRow}>
            {confidenceOptions.map((item) => {
              const selected = confidence === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setConfidence(item.id)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    selected && styles.numberButtonSelected,
                    pressed && styles.numberButtonPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.numberText,
                      selected && styles.numberTextSelected,
                    ]}
                  >
                    {item.number}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.scaleFooter}>
            <Text style={styles.scaleFooterText}>1</Text>

            <View style={styles.scaleLine} />

            <Text style={styles.scaleFooterText}>5</Text>
          </View>
        </View>

        {/* SELECTED ANSWER */}

        {selectedConfidence && (
          <View style={styles.selectionCard}>
            <View style={styles.selectionNumber}>
              <Text style={styles.selectionNumberText}>
                {selectedConfidence.number}
              </Text>
            </View>

            <View style={styles.selectionTextArea}>
              <Text style={styles.selectionLabel}>JAWAABTAADA</Text>

              <Text style={styles.selectionTitle}>
                {selectedConfidence.title}
              </Text>

              <Text style={styles.selectionDescription}>
                {selectedConfidence.description}
              </Text>
            </View>
          </View>
        )}

        {/* AI RESPONSE */}

        {coachResponse && (
          <View style={styles.responseCard}>
            <View style={styles.responseIcon}>
              <Text style={styles.responseEmoji}>{coachResponse.emoji}</Text>
            </View>

            <View style={styles.responseTextArea}>
              <Text style={styles.responseLabel}>CAATOAI</Text>

              <Text style={styles.responseTitle}>{coachResponse.title}</Text>

              <Text style={styles.responseText}>{coachResponse.text}</Text>
            </View>
          </View>
        )}

        {/* NO PERFECTION */}

        <View style={styles.lessonCard}>
          <View style={styles.lessonIcon}>
            <Text style={styles.lessonEmoji}>🧠</Text>
          </View>

          <View style={styles.lessonTextArea}>
            <Text style={styles.lessonTitle}>
              Kalsoonidu ma aha waxa ugu muhiimsan
            </Text>

            <Text style={styles.lessonText}>
              Dad badan waxay bilaabaan iyagoo aan hubin inay sii wadi karaan.
              Waxa muhiimka ahi waa inaan helno tallaabada yar ee maanta kuu
              shaqaynaysa.
            </Text>
          </View>
        </View>

        {/* HABIT MESSAGE */}

        <View style={styles.habitCard}>
          <Text style={styles.habitEmoji}>🌿</Text>

          <View style={styles.habitTextArea}>
            <Text style={styles.habitTitle}>Ma raadinayno perfection</Text>

            <Text style={styles.habitText}>
              Hal maalin oo adag ma burburinayso safarkaaga. CaatoAI wuxuu kaa
              caawin doonaa inaad dib u bilowdo oo aad sii waddo.
            </Text>
          </View>
        </View>

        {/* BUTTON */}

        <View style={styles.bottomArea}>
          <Pressable
            disabled={!confidence}
            onPress={continueNext}
            style={({ pressed }) => [
              styles.button,
              !confidence && styles.buttonDisabled,
              pressed && confidence && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Sii wad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.bottomText}>
            💚 Jawaabtaadu waxay naga caawinaysaa inaan taageerada CaatoAI kuu
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
    width: "56%",
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

  scaleCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6E0",
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },

  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },

  scaleLabel: {
    color: "#8A938C",
    fontSize: 9,
    fontWeight: "800",
  },

  numberRow: {
    flexDirection: "row",
    gap: 7,
  },

  numberButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#F5F7F4",
    borderWidth: 1,
    borderColor: "#DFE5DF",
    alignItems: "center",
    justifyContent: "center",
  },

  numberButtonSelected: {
    backgroundColor: "#28623B",
    borderColor: "#28623B",
  },

  numberButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },

  numberText: {
    color: "#4F6957",
    fontSize: 18,
    fontWeight: "900",
  },

  numberTextSelected: {
    color: "#FFFFFF",
  },

  scaleFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
  },

  scaleFooterText: {
    color: "#A1A8A2",
    fontSize: 8,
    fontWeight: "800",
  },

  scaleLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6EAE6",
    marginHorizontal: 8,
  },

  selectionCard: {
    backgroundColor: "#F1F7F0",
    borderWidth: 1,
    borderColor: "#D7E7D8",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  selectionNumber: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DCEBDD",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  selectionNumberText: {
    color: "#28563A",
    fontSize: 18,
    fontWeight: "900",
  },

  selectionTextArea: {
    flex: 1,
  },

  selectionLabel: {
    color: "#6F8C75",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 2,
  },

  selectionTitle: {
    color: "#28563A",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  selectionDescription: {
    color: "#718077",
    fontSize: 10,
    lineHeight: 15,
  },

  responseCard: {
    backgroundColor: "#173F2A",
    borderRadius: 21,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  responseIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  responseEmoji: {
    fontSize: 18,
  },

  responseTextArea: {
    flex: 1,
  },

  responseLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  responseTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  responseText: {
    color: "#C9D9CC",
    fontSize: 10,
    lineHeight: 16,
  },

  lessonCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 11,
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
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  habitEmoji: {
    fontSize: 18,
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
