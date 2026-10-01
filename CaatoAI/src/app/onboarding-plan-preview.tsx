import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function getParam(value: string | string[] | undefined, fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function OnboardingPlanPreviewScreen() {
  const params = useLocalSearchParams();

  const name = getParam(params.name, "Saaxiib");

  const currentWeight = getParam(params.currentWeight, getParam(params.weight));

  const goalWeight = getParam(params.goalWeight);

  const weightUnit = getParam(params.weightUnit, "lb");

  const planStyle = getParam(params.planStyle, "regular");

  const planStyleLabel = getParam(
    params.planStyleLabel,
    planStyle === "intermittent-fasting"
      ? "Intermittent Fasting"
      : planStyle === "omad"
        ? "OMAD"
        : "Qorshe caadi ah",
  );

  const city = getParam(params.city);
  const country = getParam(params.country);

  const locationLabel = getParam(
    params.locationLabel,
    [city, country].filter(Boolean).join(", "),
  );

  const foodBudgetLabel = getParam(params.foodBudgetLabel, "La waafajin doono");

  const coachingStyleLabel = getParam(
    params.coachingStyleLabel,
    "Taageero kuu gaar ah",
  );

  const activityLabel = getParam(
    params.activityLabel,
    getParam(
      params.movementLabel,
      getParam(params.activityLevelLabel, "Bilow adiga kuu gaar ah"),
    ),
  );

  const foodPreferenceLabels = getParam(
    params.foodPreferenceLabels,
    getParam(params.foodPreferencesLabel),
  );

  const restrictionLabels = getParam(
    params.dietaryRestrictionLabels,
    getParam(
      params.restrictionLabels,
      getParam(params.dietaryRestrictionsLabel),
    ),
  );

  const eatingStyleLabels = getParam(params.eatingStyleLabels);

  const eatingTriggerLabels = getParam(params.eatingTriggerLabels);

  const hasWeightGoal =
    currentWeight.trim().length > 0 && goalWeight.trim().length > 0;

  const finishOnboarding = () => {
    router.replace({
      pathname: "/dashboard",
      params: {
        ...params,
        onboardingComplete: "true",
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
        {/* COMPLETION */}

        <View style={styles.completeRow}>
          <View style={styles.completeIcon}>
            <Text style={styles.completeEmoji}>✓</Text>
          </View>

          <View style={styles.completeTextArea}>
            <Text style={styles.completeLabel}>
              ONBOARDING-KA WAA DHAMMAADAY
            </Text>

            <Text style={styles.completeText}>
              Jawaabahaaga waan isku darnay
            </Text>
          </View>
        </View>

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>

          <Text style={styles.eyebrow}>CAATOAI</Text>

          <Text style={styles.title}>
            {name}, qorshahaaga{"\n"}
            <Text style={styles.titleGreen}>bilowga ah waa diyaar!</Text>
          </Text>

          <Text style={styles.subtitle}>
            Waxaan isticmaalnay jawaabahaaga si aan kuu dhisno meel aad ka
            bilaabi karto. Qorshahaagu wuu is beddeli karaa marka CaatoAI wax
            badan kaa barto.
          </Text>
        </View>

        {/* MAIN PLAN */}

        <View style={styles.mainCard}>
          <View style={styles.mainCardTop}>
            <View>
              <Text style={styles.mainLabel}>QORSHAHAAGA</Text>

              <Text style={styles.mainTitle}>{planStyleLabel}</Text>
            </View>

            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>DIYAAR</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {hasWeightGoal ? (
            <View style={styles.weightArea}>
              <View style={styles.weightBox}>
                <Text style={styles.weightLabel}>HADDA</Text>

                <Text style={styles.weightValue}>{currentWeight}</Text>

                <Text style={styles.weightUnit}>{weightUnit}</Text>
              </View>

              <View style={styles.weightJourney}>
                <Text style={styles.journeyArrow}>→</Text>
                <Text style={styles.journeySmall}>tallaabooyin yar-yar</Text>
              </View>

              <View style={styles.weightBox}>
                <Text style={styles.weightLabel}>HADAFKA</Text>

                <Text style={styles.weightValue}>{goalWeight}</Text>

                <Text style={styles.weightUnit}>{weightUnit}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noWeightArea}>
              <Text style={styles.noWeightEmoji}>🎯</Text>

              <View style={styles.noWeightTextArea}>
                <Text style={styles.noWeightTitle}>
                  Hadafkaaga ayaan la socon doonaa
                </Text>

                <Text style={styles.noWeightText}>
                  CaatoAI wuxuu horumarkaaga u kala qaybin doonaa tallaabooyin
                  yaryar oo la gaari karo.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.planPromise}>
            <Text style={styles.planPromiseEmoji}>💚</Text>

            <Text style={styles.planPromiseText}>
              Hadafku ma aha perfection. Waxaan diiradda saaraynaa horumar aad
              sii wadi karto.
            </Text>
          </View>
        </View>

        {/* STARTING FOCUS */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>HALKA AAN KA BILAABAYNO</Text>

          <Text style={styles.sectionTitle}>Qorshahaaga maalinlaha ah</Text>
        </View>

        <View style={styles.focusGrid}>
          <View style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <Text style={styles.focusEmoji}>🍽️</Text>
            </View>

            <Text style={styles.focusLabel}>CUNTADA</Text>

            <Text style={styles.focusTitle}>Portions + protein</Text>

            <Text style={styles.focusText}>
              Baro cunto isku dheelitiran adigoon cuntada aad jeceshahay
              mamnuucin.
            </Text>
          </View>

          <View style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <Text style={styles.focusEmoji}>🚶</Text>
            </View>

            <Text style={styles.focusLabel}>DHAQDHAQAAQA</Text>

            <Text style={styles.focusTitle}>{activityLabel}</Text>

            <Text style={styles.focusText}>
              Waxaan ka bilaabaynaa heerkaaga hadda oo si tartiib ah ayaan u
              kordhinaynaa.
            </Text>
          </View>

          <View style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <Text style={styles.focusEmoji}>🧠</Text>
            </View>

            <Text style={styles.focusLabel}>MASKAXDA</Text>

            <Text style={styles.focusTitle}>Faham caadooyinka</Text>

            <Text style={styles.focusText}>
              Casharro gaaban ayaa kaa caawin doona inaad barato waxa kugu
              kiciya doorashooyinkaaga.
            </Text>
          </View>

          <View style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <Text style={styles.focusEmoji}>🌱</Text>
            </View>

            <Text style={styles.focusLabel}>CAADOOYINKA</Text>

            <Text style={styles.focusTitle}>Hal tallaabo mar</Text>

            <Text style={styles.focusText}>
              Waxaan dhiseynaa waxyaabo yar-yar oo aad noloshaada ku sii wadi
              karto.
            </Text>
          </View>
        </View>

        {/* FASTING CONTEXT */}

        {planStyle === "intermittent-fasting" && (
          <View style={styles.specialCard}>
            <View style={styles.specialIcon}>
              <Text style={styles.specialEmoji}>⏰</Text>
            </View>

            <View style={styles.specialTextArea}>
              <Text style={styles.specialLabel}>INTERMITTENT FASTING</Text>

              <Text style={styles.specialTitle}>
                Eating window-kaaga ayaan dejin doonaa
              </Text>

              <Text style={styles.specialText}>
                Waxaan ku bilaabi doonaa qaab macquul ah oo aan ilaalinayna
                nafaqada iyo tayada cuntada. Waxaad mar dambe ka beddeli kartaa
                fasting settings-ka.
              </Text>
            </View>
          </View>
        )}

        {planStyle === "omad" && (
          <View style={styles.specialCard}>
            <View style={styles.specialIcon}>
              <Text style={styles.specialEmoji}>🌙</Text>
            </View>

            <View style={styles.specialTextArea}>
              <Text style={styles.specialLabel}>OMAD</Text>

              <Text style={styles.specialTitle}>
                Waxaan u qaadan doonaa si taxaddar leh
              </Text>

              <Text style={styles.specialText}>
                Ka hor inta OMAD laga dhigin routine maalinle ah, CaatoAI wuxuu
                hubin doonaa in qorshaha la waafajiyo xogtaada iyo baahidaada
                nafaqo.
              </Text>
            </View>
          </View>
        )}

        {/* PERSONALIZATION */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>ADIGA AYAA LAGUU SAMEEYAY</Text>

          <Text style={styles.sectionTitle}>Waxa CaatoAI xasuusan doono</Text>
        </View>

        <View style={styles.detailsCard}>
          {locationLabel ? (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Text style={styles.detailEmoji}>📍</Text>
              </View>

              <View style={styles.detailTextArea}>
                <Text style={styles.detailLabel}>Deegaanka</Text>

                <Text style={styles.detailValue}>{locationLabel}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>🛒</Text>
            </View>

            <View style={styles.detailTextArea}>
              <Text style={styles.detailLabel}>Miisaaniyadda cuntada</Text>

              <Text style={styles.detailValue}>{foodBudgetLabel}</Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>💬</Text>
            </View>

            <View style={styles.detailTextArea}>
              <Text style={styles.detailLabel}>Qaabka coaching-ka</Text>

              <Text style={styles.detailValue}>{coachingStyleLabel}</Text>
            </View>
          </View>

          {foodPreferenceLabels ? (
            <>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text style={styles.detailEmoji}>🥗</Text>
                </View>

                <View style={styles.detailTextArea}>
                  <Text style={styles.detailLabel}>
                    Cuntooyinka aad dooratay
                  </Text>

                  <Text style={styles.detailValue}>
                    {foodPreferenceLabels.split("|").join(" • ")}
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          {restrictionLabels ? (
            <>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text style={styles.detailEmoji}>📝</Text>
                </View>

                <View style={styles.detailTextArea}>
                  <Text style={styles.detailLabel}>Xaddidaadaha cuntada</Text>

                  <Text style={styles.detailValue}>
                    {restrictionLabels.split("|").join(" • ")}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* BEHAVIOR */}

        {(eatingStyleLabels || eatingTriggerLabels) && (
          <View style={styles.behaviorCard}>
            <View style={styles.behaviorTop}>
              <View style={styles.behaviorIcon}>
                <Text style={styles.behaviorEmoji}>🧠</Text>
              </View>

              <View style={styles.behaviorHeading}>
                <Text style={styles.behaviorLabel}>COACHING-KAAGA</Text>

                <Text style={styles.behaviorTitle}>
                  Ma aha calories oo keliya
                </Text>
              </View>
            </View>

            <Text style={styles.behaviorText}>
              CaatoAI wuxuu sidoo kale isticmaali doonaa xogta ku saabsan
              jadwalka cuntadaada iyo waxyaabaha kugu kiciya cuntada si
              casharrada iyo check-ins-ku kuu noqdaan kuwo ku khuseeya.
            </Text>
          </View>
        )}

        {/* TARGET ENGINE */}

        <View style={styles.targetCard}>
          <View style={styles.targetIcon}>
            <Text style={styles.targetEmoji}>✨</Text>
          </View>

          <View style={styles.targetTextArea}>
            <Text style={styles.targetTitle}>Targets-kaaga xiga</Text>

            <Text style={styles.targetText}>
              Calories, protein, tallaabooyin iyo biyo waxaan ku xisaabin doonaa
              xogtaada halkii aan qof walba siin lahayn tiro isku mid ah.
            </Text>
          </View>
        </View>

        {/* DAILY EXPERIENCE */}

        <View style={styles.tomorrowCard}>
          <Text style={styles.tomorrowLabel}>MAALIN KASTA</Text>

          <Text style={styles.tomorrowTitle}>
            CaatoAI wuxuu kula socon doonaa safarka
          </Text>

          <View style={styles.tomorrowItem}>
            <Text style={styles.tomorrowCheck}>✓</Text>
            <Text style={styles.tomorrowText}>
              Qorshaha cuntada iyo food logging
            </Text>
          </View>

          <View style={styles.tomorrowItem}>
            <Text style={styles.tomorrowCheck}>✓</Text>
            <Text style={styles.tomorrowText}>
              Cashar gaaban oo ku saabsan caadooyinka
            </Text>
          </View>

          <View style={styles.tomorrowItem}>
            <Text style={styles.tomorrowCheck}>✓</Text>
            <Text style={styles.tomorrowText}>
              Dhaqdhaqaaq iyo check-in maalinle ah
            </Text>
          </View>

          <View style={styles.tomorrowItem}>
            <Text style={styles.tomorrowCheck}>✓</Text>
            <Text style={styles.tomorrowText}>
              Taageerada tababarahaaga CaatoAI
            </Text>
          </View>
        </View>

        {/* FINAL */}

        <View style={styles.finalMessage}>
          <Text style={styles.finalEmoji}>🌿</Text>

          <Text style={styles.finalTitle}>
            Diyaar ma u tahay tallaabada koowaad?
          </Text>

          <Text style={styles.finalText}>
            Uma baahnid inaad maanta wax walba beddesho. Waxaan ku bilaabaynaa
            hal maalin, hal cashar iyo hal caado mar.
          </Text>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            onPress={finishOnboarding}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Bilow maalintayda koowaad</Text>

            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>

          <Text style={styles.bottomText}>
            💚 Qorshahaagu wuu kobci doonaa marka CaatoAI wax badan kaa barto.
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
    paddingVertical: 20,
  },

  container: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 22,
  },

  completeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  completeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#28623B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  completeEmoji: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  completeTextArea: {
    flex: 1,
  },

  completeLabel: {
    color: "#28623B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  completeText: {
    color: "#7A847D",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  hero: {
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#E3F1E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  logoEmoji: {
    fontSize: 29,
  },

  eyebrow: {
    color: "#4F7C5B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 8,
  },

  title: {
    color: "#202923",
    fontSize: 31,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.6,
    marginBottom: 12,
  },

  titleGreen: {
    color: "#28623B",
  },

  subtitle: {
    maxWidth: 470,
    color: "#6F7972",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  mainCard: {
    backgroundColor: "#173F2A",
    borderRadius: 25,
    padding: 19,
  },

  mainCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  mainLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },

  mainTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
  },

  readyBadge: {
    backgroundColor: "#28563A",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  readyBadgeText: {
    color: "#DCEADF",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  divider: {
    height: 1,
    backgroundColor: "#315A3F",
    marginVertical: 17,
  },

  weightArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  weightBox: {
    width: "31%",
    backgroundColor: "#214C34",
    borderRadius: 17,
    paddingVertical: 13,
    alignItems: "center",
  },

  weightLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  weightValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 3,
  },

  weightUnit: {
    color: "#B8CFBD",
    fontSize: 9,
    fontWeight: "700",
  },

  weightJourney: {
    width: "31%",
    alignItems: "center",
  },

  journeyArrow: {
    color: "#B8CFBD",
    fontSize: 24,
    fontWeight: "800",
  },

  journeySmall: {
    color: "#8FAD96",
    fontSize: 7,
    textAlign: "center",
    fontWeight: "700",
    marginTop: 2,
  },

  noWeightArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  noWeightEmoji: {
    fontSize: 25,
    marginRight: 11,
  },

  noWeightTextArea: {
    flex: 1,
  },

  noWeightTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  noWeightText: {
    color: "#BFD2C3",
    fontSize: 10,
    lineHeight: 15,
  },

  planPromise: {
    backgroundColor: "#214C34",
    borderRadius: 15,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  planPromiseEmoji: {
    fontSize: 15,
    marginRight: 8,
  },

  planPromiseText: {
    flex: 1,
    color: "#C9D9CC",
    fontSize: 9,
    lineHeight: 14,
    fontWeight: "600",
  },

  sectionHeader: {
    marginTop: 25,
    marginBottom: 12,
  },

  sectionEyebrow: {
    color: "#4F7C5B",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },

  sectionTitle: {
    color: "#28332B",
    fontSize: 18,
    fontWeight: "900",
  },

  focusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  focusCard: {
    width: "48.5%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 19,
    padding: 14,
  },

  focusIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#EAF4EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  focusEmoji: {
    fontSize: 18,
  },

  focusLabel: {
    color: "#7B897F",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 3,
  },

  focusTitle: {
    color: "#304237",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 4,
  },

  focusText: {
    color: "#7C857E",
    fontSize: 9,
    lineHeight: 14,
  },

  specialCard: {
    marginTop: 12,
    backgroundColor: "#FFF8E8",
    borderWidth: 1,
    borderColor: "#F0E1BA",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  specialIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F8EBCB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  specialEmoji: {
    fontSize: 18,
  },

  specialTextArea: {
    flex: 1,
  },

  specialLabel: {
    color: "#8A733C",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 3,
  },

  specialTitle: {
    color: "#67582E",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  specialText: {
    color: "#7D7355",
    fontSize: 9,
    lineHeight: 14,
  },

  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 21,
    paddingHorizontal: 15,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  detailEmoji: {
    fontSize: 17,
  },

  detailTextArea: {
    flex: 1,
  },

  detailLabel: {
    color: "#89918B",
    fontSize: 8,
    fontWeight: "800",
    marginBottom: 2,
  },

  detailValue: {
    color: "#35473A",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
  },

  detailDivider: {
    height: 1,
    backgroundColor: "#EEF1EE",
    marginLeft: 48,
  },

  behaviorCard: {
    marginTop: 12,
    backgroundColor: "#EAF4EA",
    borderRadius: 20,
    padding: 15,
  },

  behaviorTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  behaviorIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#D8EAD9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  behaviorEmoji: {
    fontSize: 18,
  },

  behaviorHeading: {
    flex: 1,
  },

  behaviorLabel: {
    color: "#5C8065",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  behaviorTitle: {
    color: "#28563A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },

  behaviorText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 16,
  },

  targetCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  targetIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  targetEmoji: {
    fontSize: 18,
  },

  targetTextArea: {
    flex: 1,
  },

  targetTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  targetText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  tomorrowCard: {
    marginTop: 22,
    backgroundColor: "#F3F1EA",
    borderRadius: 21,
    padding: 17,
  },

  tomorrowLabel: {
    color: "#778079",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },

  tomorrowTitle: {
    color: "#354139",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 13,
  },

  tomorrowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  tomorrowCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#DDEDDD",
    color: "#28623B",
    textAlign: "center",
    lineHeight: 22,
    fontSize: 10,
    fontWeight: "900",
    marginRight: 9,
  },

  tomorrowText: {
    flex: 1,
    color: "#5F6962",
    fontSize: 10,
    fontWeight: "700",
  },

  finalMessage: {
    alignItems: "center",
    paddingVertical: 27,
    paddingHorizontal: 18,
  },

  finalEmoji: {
    fontSize: 28,
    marginBottom: 9,
  },

  finalTitle: {
    color: "#28372D",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },

  finalText: {
    color: "#737D76",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
  },

  bottomArea: {
    paddingBottom: 8,
  },

  button: {
    minHeight: 60,
    backgroundColor: "#28623B",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
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
    marginLeft: 8,
  },

  bottomText: {
    color: "#89918B",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 18,
  },
});
