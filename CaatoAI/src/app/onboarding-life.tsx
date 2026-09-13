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
        title: "Uma baahnid kalsooni buuxda maanta.",
        text: "Waxaan ku bilaabaynaa tallaabooyin yar-yar oo fudud. CaatoAI wuxuu kaa caawin doonaa inaad kalsoonidaada si tartiib ah u dhisto.",
      };
    }

    if (confidence === "3") {
      return {
        title: "Taasi waa meel fiican oo laga bilaabo.",
        text: "Uma baahnid inaad wax walba si qumman u samayso. Waxaan diiradda saari doonaa joogteynta iyo horumar yar oo maalinle ah.",
      };
    }

    return {
      title: "Waa bilow fiican.",
      text: "Waxaan kaa caawin doonaa inaad kalsoonidaas u beddesho caadooyin joogto ah oo noloshaada ku shaqeeya.",
    };
  };

  const coachResponse = getCoachResponse();

  return (
    <View style={styles.screen}>
      <ScrollView
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
                Waxaan rabaa inaan ogaado sida aad hadda dareemayso
              </Text>
            </View>
          </View>

          <View style={styles.questionArea}>
            <Text style={styles.smallGreeting}>
              {name ? `${name}, ` : ""}jawaab sax ama khalad ma jirto 💚
            </Text>

            <Text style={styles.title}>
              Intee ayaad ku kalsoon tahay{"\n"}
              <Text style={styles.titleHighlight}>
                inaad markan sii wadi karto?
              </Text>
            </Text>

            <Text style={styles.subtitle}>
              Tani ma aha imtixaan. Waxaan rabnaa inaan ogaanno inta taageero ee
              CaatoAI kuu baahan yahay inuu ku siiyo bilowga safarkaaga.
            </Text>
          </View>

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

          {selectedConfidence && (
            <View style={styles.selectionCard}>
              <View style={styles.selectionTop}>
                <View style={styles.selectionNumber}>
                  <Text style={styles.selectionNumberText}>
                    {selectedConfidence.number}
                  </Text>
                </View>

                <View style={styles.selectionTextArea}>
                  <Text style={styles.selectionTitle}>
                    {selectedConfidence.title}
                  </Text>

                  <Text style={styles.selectionDescription}>
                    {selectedConfidence.description}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {coachResponse && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>{coachResponse.title}</Text>

                <Text style={styles.responseText}>{coachResponse.text}</Text>
              </View>
            </View>
          )}

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
    width: "36%",
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
    marginBottom: 24,
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

  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
    paddingHorizontal: 2,
  },

  scaleLabel: {
    color: "#9CA3AF",
    fontSize: 10,
    fontWeight: "700",
  },

  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 18,
  },

  numberButton: {
    flex: 1,
    aspectRatio: 1,
    maxHeight: 62,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    alignItems: "center",
    justifyContent: "center",
  },

  numberButtonSelected: {
    backgroundColor: "#14532D",
    borderColor: "#14532D",
  },

  numberButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },

  numberText: {
    color: "#14532D",
    fontSize: 21,
    fontWeight: "900",
  },

  numberTextSelected: {
    color: "#FFFFFF",
  },

  selectionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  selectionTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  selectionNumber: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    flexShrink: 0,
  },

  selectionNumberText: {
    color: "#14532D",
    fontSize: 17,
    fontWeight: "900",
  },

  selectionTextArea: {
    flex: 1,
    minWidth: 0,
  },

  selectionTitle: {
    color: "#14532D",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  selectionDescription: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
  },

  responseCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginBottom: 18,
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
    marginTop: 4,
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
