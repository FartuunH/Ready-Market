import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function textValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function numberValue(value?: string | string[]) {
  const valueText = textValue(value);
  const parsed = Number(valueText);

  return Number.isFinite(parsed) ? parsed : 0;
}

export default function OnboardingSummaryScreen() {
  const params = useLocalSearchParams();

  const name = textValue(params.name) || "Saaxiib";

  const currentWeight = numberValue(params.currentWeight);
  const goalWeight = numberValue(params.goalWeight);

  const weightUnit = textValue(params.weightUnit) || "lb";

  const amountToLose =
    currentWeight > 0 && goalWeight > 0 && currentWeight > goalWeight
      ? Math.round((currentWeight - goalWeight) * 10) / 10
      : 0;

  const activityLabel =
    textValue(params.activityLabel) || "dhaqdhaqaaqaaga hadda";

  const suggestedSteps = numberValue(params.suggestedSteps);

  const workoutLabel =
    textValue(params.workoutLabel) ||
    textValue(params.exerciseLabel) ||
    textValue(params.workoutPreferenceLabel) ||
    "jimicsi kuu fudud";

  const eatingBehaviorLabel =
    textValue(params.eatingBehaviorLabel) ||
    textValue(params.behaviorLabel) ||
    "caadooyinkaaga cuntada";

  const foodCultureLabel =
    textValue(params.foodCultureLabel) ||
    textValue(params.foodPreferenceLabel) ||
    "cuntooyinka aad jeceshahay";

  const eatingStyleLabel =
    textValue(params.eatingStyleLabel) || "Qorshe caadi ah";

  const country = textValue(params.country);

  const city = textValue(params.city);

  const budgetLabel = textValue(params.budgetLabel);

  const locationText = city && country ? `${city}, ${country}` : country || "";

  const continueNext = () => {
    router.push({
      // Temporary.
      // After this screen is tested, we will build the
      // "CaatoAI is building your plan" screen.
      pathname: "/plan-ready",
      params: {
        ...params,
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

            <Text style={styles.coachLabel}>Hadda waan ku bartay</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>💚</Text>

          <Text style={styles.heroTitle}>
            {name}, hadda waxaan si fiican kuu fahmay.
          </Text>

          <Text style={styles.heroText}>
            Jawaabahaaga waxaan u isticmaali doonaa inaan kuu dhiso qorshe adiga
            iyo noloshaada ku habboon.
          </Text>
        </View>

        <Text style={styles.sectionEyebrow}>WAXAAN KAA BARTAY</Text>

        <Text style={styles.title}>
          Qorshahaagu ma noqon doono{" "}
          <Text style={styles.titleHighlight}>qorshe qof walba la siiyo.</Text>
        </Text>

        {/* Goal */}
        {amountToLose > 0 ? (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryEmoji}>🎯</Text>
            </View>

            <View style={styles.summaryTextArea}>
              <Text style={styles.summaryLabel}>Hadafkaaga</Text>

              <Text style={styles.summaryTitle}>
                Waxaad rabtaa inaad lumiso {amountToLose} {weightUnit}
              </Text>

              <Text style={styles.summaryDescription}>
                Waxaan hadafka weyn u kala qaybin doonaa milestones yar-yar oo
                la gaari karo.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Movement */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🚶</Text>
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryLabel}>Dhaqdhaqaaq</Text>

            <Text style={styles.summaryTitle}>
              {suggestedSteps > 0
                ? `${suggestedSteps.toLocaleString()} tallaabo maalintii`
                : activityLabel}
            </Text>

            <Text style={styles.summaryDescription}>
              Tani waa bilow. Mustaqbalka Apple Health ama xogta tallaabooyinka
              dhabta ah ayaa naga caawin karta inaan hadafka si fiican kuu
              waafajino.
            </Text>
          </View>
        </View>

        {/* Workout */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🏃‍♀️</Text>
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryLabel}>Jimicsigaaga</Text>

            <Text style={styles.summaryTitle}>{workoutLabel}</Text>

            <Text style={styles.summaryDescription}>
              Waxaan ku bilaabi doonaa heerka kuu fudud, halkii aan kugu qasbi
              lahayn workout aad u adag.
            </Text>
          </View>
        </View>

        {/* Eating behavior */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🧠</Text>
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryLabel}>Caadooyinka cuntada</Text>

            <Text style={styles.summaryTitle}>{eatingBehaviorLabel}</Text>

            <Text style={styles.summaryDescription}>
              CaatoAI kaliya calories ma tirinayo. Waxaan sidoo kale kaa caawin
              doonaa cravings, stress iyo caadooyinka saameeya cuntadaada.
            </Text>
          </View>
        </View>

        {/* Food culture */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🍲</Text>
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryLabel}>Cuntada aad doorbidayso</Text>

            <Text style={styles.summaryTitle}>{foodCultureLabel}</Text>

            <Text style={styles.summaryDescription}>
              Ma aha inaad ka tagto cuntooyinka aad jeceshahay. Waxaan hagaajin
              doonaa portions, protein iyo isku-dheelitirka.
            </Text>
          </View>
        </View>

        {/* Eating style */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>⏳</Text>
          </View>

          <View style={styles.summaryTextArea}>
            <Text style={styles.summaryLabel}>Qaabka cuntada</Text>

            <Text style={styles.summaryTitle}>{eatingStyleLabel}</Text>

            <Text style={styles.summaryDescription}>
              Qorshaha cuntada waxaa lagu waafajin doonaa qaabka aad dooratay
              iyo xogta badbaadada ee aad bixisay.
            </Text>
          </View>
        </View>

        {/* Location / budget */}
        {locationText || budgetLabel ? (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryEmoji}>🛒</Text>
            </View>

            <View style={styles.summaryTextArea}>
              <Text style={styles.summaryLabel}>Cuntooyinka kuu diyaar ah</Text>

              {locationText ? (
                <Text style={styles.summaryTitle}>{locationText}</Text>
              ) : null}

              {budgetLabel ? (
                <Text style={styles.summaryDescription}>
                  Miisaaniyadda: {budgetLabel}
                </Text>
              ) : null}

              <Text style={styles.summaryDescription}>
                Waxaan isku dayi doonaa inaan talooyinka ka dhigno kuwo aad heli
                karto oo aad awoodi karto.
              </Text>
            </View>
          </View>
        ) : null}

        {/* AI explanation */}
        <View style={styles.aiCard}>
          <Text style={styles.aiEmoji}>✨</Text>

          <View style={styles.aiTextArea}>
            <Text style={styles.aiTitle}>
              Tani waa sababta CaatoAI kuu gaar yahay
            </Text>

            <Text style={styles.aiText}>
              Qorshahaaga wuxuu isku dari doonaa hadafkaaga, dhaqdhaqaaqaaga,
              cuntadaada, miisaaniyaddaada, qaabka aad u cunto iyo caadooyinka
              noloshaada.
            </Text>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privateCard}>
          <Text style={styles.privateEmoji}>🔒</Text>

          <View style={styles.privateTextArea}>
            <Text style={styles.privateTitle}>
              Safarkaaga adiga ayaa iska leh
            </Text>

            <Text style={styles.privateText}>
              Uma baahnid inaad qofna u sheegto inaad miisaan dhimayso.
              Miisaankaaga, hadafyadaada iyo xogtaada gaarka ah saaxiibbada
              looma tusayo si otomaatig ah.
            </Text>
          </View>
        </View>

        <View style={styles.finalMessage}>
          <Text style={styles.finalEmoji}>🌱</Text>

          <Text style={styles.finalTitle}>Hal tallaabo ayaa naga xigta.</Text>

          <Text style={styles.finalText}>
            Hadda CaatoAI wuxuu diyaar u yahay inuu jawaabahaaga ka dhiso
            qorshahaaga bilowga ah.
          </Text>
        </View>

        <Pressable
          onPress={continueNext}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Samee qorshahayga</Text>

          <Text style={styles.buttonArrow}>→</Text>
        </Pressable>

        <Text style={styles.bottomText}>
          💚 Waxaad qorshahaaga beddeli kartaa marka noloshaadu isbeddesho.
        </Text>
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
    paddingVertical: 20,
  },

  content: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
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
    width: "98%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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

  heroCard: {
    backgroundColor: "#14532D",
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
  },

  heroEmoji: {
    fontSize: 24,
    marginBottom: 12,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    lineHeight: 30,
    fontWeight: "900",
    marginBottom: 8,
  },

  heroText: {
    color: "#DCFCE7",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },

  sectionEyebrow: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  title: {
    color: "#1F2937",
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "900",
    marginBottom: 19,
  },

  titleHighlight: {
    color: "#14532D",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    marginBottom: 10,
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  summaryEmoji: {
    fontSize: 19,
  },

  summaryTextArea: {
    flex: 1,
  },

  summaryLabel: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.4,
    marginBottom: 3,
  },

  summaryTitle: {
    color: "#1F2937",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  summaryDescription: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 2,
  },

  aiCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    marginTop: 7,
  },

  aiEmoji: {
    fontSize: 20,
    marginRight: 10,
  },

  aiTextArea: {
    flex: 1,
  },

  aiTitle: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 5,
  },

  aiText: {
    color: "#4B5563",
    fontSize: 10,
    lineHeight: 16,
  },

  privateCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    marginTop: 11,
  },

  privateEmoji: {
    fontSize: 19,
    marginRight: 10,
  },

  privateTextArea: {
    flex: 1,
  },

  privateTitle: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  privateText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
  },

  finalMessage: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 26,
  },

  finalEmoji: {
    fontSize: 29,
    marginBottom: 8,
  },

  finalTitle: {
    color: "#14532D",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  finalText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
  },

  button: {
    width: "100%",
    minHeight: 58,
    backgroundColor: "#14532D",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 21,
    fontWeight: "900",
    marginLeft: 8,
  },

  bottomText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: 13,
  },
});
