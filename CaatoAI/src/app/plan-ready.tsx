import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function numberValue(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
}

function calculatePlan(params: Record<string, string | string[] | undefined>) {
  const age = numberValue(params.age);

  const weightKg =
    numberValue(params.currentWeightKg) ||
    (params.weightUnit === "lbs"
      ? numberValue(params.currentWeight) * 0.453592
      : numberValue(params.currentWeight));

  const heightCm =
    numberValue(params.heightCm) ||
    (params.heightUnit === "imperial"
      ? (numberValue(params.feet) * 12 + numberValue(params.inches)) * 2.54
      : numberValue(params.centimeters));

  const activityMultipliers: Record<string, number> = {
    "not-active": 1.2,
    light: 1.375,
    active: 1.55,
    "very-active": 1.725,
  };

  const activity = Array.isArray(params.activity)
    ? params.activity[0]
    : params.activity;

  const multiplier = activityMultipliers[activity ?? "not-active"] ?? 1.2;

  // Mifflin-St Jeor estimate for adult women
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const maintenanceCalories = bmr * multiplier;

  const breastfeeding = Array.isArray(params.breastfeeding)
    ? params.breastfeeding[0]
    : params.breastfeeding;

  const pregnant =
    params.pregnant === "true" || params.womensHealthStatus === "pregnant";

  let calorieTarget = maintenanceCalories;

  // Regular weight-loss mode
  if (!pregnant && breastfeeding === "not-breastfeeding") {
    // Use a moderate deficit instead of automatically subtracting 400 calories.
    // Maximum deficit: 15% of estimated maintenance.
    const deficit = Math.min(maintenanceCalories * 0.15, 300);

    calorieTarget = maintenanceCalories - deficit;
  }

  // Breastfeeding mode:
  // Do not apply a weight-loss deficit automatically.
  if (breastfeeding === "partial") {
    calorieTarget = maintenanceCalories + 200;
  }

  if (breastfeeding === "exclusive") {
    calorieTarget = maintenanceCalories + 350;
  }

  // Pregnancy mode:
  // CaatoAI should not create a weight-loss calorie deficit.
  if (pregnant) {
    calorieTarget = maintenanceCalories;
  }

  // Round to an easy-to-use number.
  calorieTarget = Math.round(calorieTarget / 10) * 10;
  const goalWeight = numberValue(params.goalWeight);

  let goalWeightKg = goalWeight;

  if (params.weightUnit === "lb") {
    goalWeightKg = goalWeight * 0.453592;
  }

  const proteinReferenceKg =
    goalWeightKg > 0 && goalWeightKg < weightKg ? goalWeightKg : weightKg;

  let proteinTarget = Math.round(proteinReferenceKg * 1.4);

  // General adult starter target.
  proteinTarget = Math.max(70, Math.min(proteinTarget, 140));

  // Pregnancy safety mode:
  // Do not calculate protein from the user's weight-loss goal.
  // Use a conservative pregnancy baseline instead.
  if (breastfeeding === "partial") {
    proteinTarget = 71;
  }

  if (breastfeeding === "exclusive") {
    proteinTarget = 71;
  }
  const suggestedSteps = numberValue(params.suggestedSteps) || 5000;

  // Starter hydration estimate for general adult mode.
  // This is a simple wellness target, not a medical prescription.
  let waterLiters = weightKg * 0.03;

  // Keep the default target within a practical starter range.
  waterLiters = Math.max(1.5, Math.min(waterLiters, 3.0));

  // Round to the nearest 0.1 L.
  // Pregnancy safety mode:
  // Use a pregnancy hydration baseline instead of the
  // general weight-based starter calculation.
  if (pregnant) {
    waterLiters = 2.3;
  }

  if (breastfeeding === "partial" || breastfeeding === "exclusive") {
    waterLiters = 3.1;
  }

  // Round to the nearest 0.1 L.
  waterLiters = Math.round(waterLiters * 10) / 10;

  return {
    calorieTarget,
    proteinTarget,
    suggestedSteps,
    waterLiters: waterLiters.toFixed(1),
  };
}

export default function PlanReadyScreen() {
  const params = useLocalSearchParams();

  const plan = calculatePlan(params);
  const pregnant =
    params.pregnant === "true" || params.womensHealthStatus === "pregnant";

  const breastfeeding =
    typeof params.breastfeeding === "string" ? params.breastfeeding : "";

  const isBreastfeeding =
    breastfeeding === "partial" || breastfeeding === "exclusive";

  const name =
    typeof params.name === "string" && params.name.trim()
      ? params.name
      : "Saaxiib";

  const eatingStyle =
    typeof params.eatingStyle === "string" ? params.eatingStyle : "regular";

  const workout = typeof params.workout === "string" ? params.workout : "";

  const city = typeof params.city === "string" ? params.city : "";

  const country = typeof params.country === "string" ? params.country : "";

  const eatingLabels: Record<string, string> = {
    regular: "Qorshe caadi ah",
    fasting: "Intermittent Fasting",
    omad: "OMAD",
  };

  const workoutLabels: Record<string, string> = {
    walking: "Socod",
    home: "Jimicsiga guriga",
    gym: "Gym",
    mixed: "Isku dhafan",
    difficult: "Bilow fudud",
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandEmoji}>🌿</Text>
          </View>

          <View>
            <Text style={styles.brandName}>CaatoAI</Text>

            <Text style={styles.brandLabel}>Qorshahaaga bilowga ah</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✨ QORSHAHAAGU WAA DIYAAR</Text>
          </View>

          <Text style={styles.title}>
            {name}, tani waa{"\n"}
            <Text style={styles.titleHighlight}>halka aan ka bilaabayno.</Text>
          </Text>

          <Text style={styles.subtitle}>
            CaatoAI wuxuu kuu diyaariyay qorshe bilow ah oo ku salaysan
            macluumaadka aad bixisay.
          </Text>
        </View>

        {/* Daily targets */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>MAALIN KASTA</Text>

            <Text style={styles.sectionTitle}>
              {pregnant || isBreastfeeding
                ? "Hadafyadaada caafimaadka"
                : "Hadafyadaada bilowga ah"}
            </Text>
          </View>

          <View style={styles.startBadge}>
            <Text style={styles.startBadgeText}>Bilow</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {/* Calories */}
          <View style={styles.targetCard}>
            <View style={styles.targetIcon}>
              <Text style={styles.icon}>🔥</Text>
            </View>

            <Text style={styles.targetNumber}>{plan.calorieTarget}</Text>

            <Text style={styles.targetLabel}>
              {pregnant || isBreastfeeding ? "Qiyaasta tamarta" : "Calories"}
            </Text>

            <Text style={styles.targetSubLabel}>
              {pregnant || isBreastfeeding ? "qiyaas bilow ah" : "maalintii"}
            </Text>
          </View>

          {/* Protein */}
          <View style={styles.targetCard}>
            <View style={styles.targetIcon}>
              <Text style={styles.icon}>💪</Text>
            </View>

            <Text style={styles.targetNumber}>{plan.proteinTarget}g</Text>

            <Text style={styles.targetLabel}>Protein</Text>

            <Text style={styles.targetSubLabel}>maalintii</Text>
          </View>

          {/* Steps */}
          <View style={styles.targetCard}>
            <View style={styles.targetIcon}>
              <Text style={styles.icon}>🚶</Text>
            </View>

            <Text style={styles.targetNumber}>
              {plan.suggestedSteps.toLocaleString()}
            </Text>

            <Text style={styles.targetLabel}>Tallaabo</Text>

            <Text style={styles.targetSubLabel}>maalintii</Text>
          </View>

          {/* Water */}
          <View style={styles.targetCard}>
            <View style={styles.targetIcon}>
              <Text style={styles.icon}>💧</Text>
            </View>

            <Text style={styles.targetNumber}>{plan.waterLiters}L</Text>

            <Text style={styles.targetLabel}>Biyo</Text>

            <Text style={styles.targetSubLabel}>maalintii</Text>
          </View>
        </View>

        {/* Plan details */}
        <Text style={styles.detailsTitle}>Qorshahaaga</Text>

        <View style={styles.planCard}>
          <View style={styles.planIcon}>
            <Text style={styles.planEmoji}>🍽️</Text>
          </View>

          <View style={styles.planTextArea}>
            <Text style={styles.planTitle}>Qaabka cuntada</Text>

            <Text style={styles.planValue}>
              {eatingLabels[eatingStyle] ?? "Qorshe caadi ah"}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>
        </View>

        {workout ? (
          <View style={styles.planCard}>
            <View style={styles.planIcon}>
              <Text style={styles.planEmoji}>🏃‍♀️</Text>
            </View>

            <View style={styles.planTextArea}>
              <Text style={styles.planTitle}>Dhaqdhaqaaqa</Text>

              <Text style={styles.planValue}>
                {workoutLabels[workout] ?? workout}
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </View>
        ) : null}

        {city || country ? (
          <View style={styles.planCard}>
            <View style={styles.planIcon}>
              <Text style={styles.planEmoji}>📍</Text>
            </View>

            <View style={styles.planTextArea}>
              <Text style={styles.planTitle}>Cuntada deegaankaaga</Text>

              <Text style={styles.planValue}>
                {[city, country].filter(Boolean).join(", ")}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Coach */}
        <View style={styles.coachCard}>
          <View style={styles.coachTop}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View style={styles.coachHeading}>
              <Text style={styles.coachName}>Talada CaatoAI</Text>

              <Text style={styles.coachSmall}>Bilowgaaga maanta</Text>
            </View>
          </View>

          <Text style={styles.coachText}>
            {pregnant
              ? "Inta aad uurka leedahay, CaatoAI kuma saari doono qorshe miisaan-dhimis ah. Waxaan diiradda saari doonaa caadooyin caafimaad leh, dhaqdhaqaaq ku habboon iyo badbaadadaada."
              : isBreastfeeding
                ? "Inta aad naasnuujinayso, CaatoAI kama isticmaali doono calorie restriction adag, fasting ama OMAD. Waxaan diiradda saari doonaa nafaqo ku filan, tamartaada, protein, biyo iyo caadooyin caafimaad leh."
                : "Si tartiib ah u bilow. Looma baahna inaad wax walba hal mar beddesho. CaatoAI wuxuu la socon doonaa horumarkaaga, gaajadaada, tamartaada iyo miisaankaaga si qorshahaaga mustaqbalka loo hagaajiyo."}
          </Text>
        </View>

        {/* Behavior change */}
        <View style={styles.behaviorCard}>
          <Text style={styles.behaviorEmoji}>🌱</Text>

          <View style={styles.behaviorTextArea}>
            <Text style={styles.behaviorTitle}>Hadafku ma aha perfection</Text>

            <Text style={styles.behaviorText}>
              Maalin kasta waxaad qaadaysaa tallaabo yar. Consistency ayaa ka
              muhiimsan hal maalin oo perfect ah.
            </Text>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privateCard}>
          <Text style={styles.privateEmoji}>🔒</Text>

          <View style={styles.privateTextArea}>
            <Text style={styles.privateTitle}>Qorshahaagu waa kuu gaar</Text>

            <Text style={styles.privateText}>
              Miisaankaaga, hadafyadaada iyo horumarkaaga si otomaatig ah qof
              kale looma tusayo.
            </Text>
          </View>
        </View>

        <Text style={styles.note}>
          Hadafyadani waa qiyaaso bilow ah oo ku salaysan xogta aad bixisay.
          CaatoAI wuxuu qorshahaaga la qabsan karaa marka xogtaada,
          dhaqdhaqaaqaaga ama baahiyahaagu isbedelaan. Haddii aad leedahay
          xaalad caafimaad ama baahi nafaqo oo gaar ah, la tasho xirfadle
          caafimaad.
        </Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/dashboard",
              params: {
                ...params,
                calorieTarget: String(plan.calorieTarget),
                proteinTarget: String(plan.proteinTarget),
                stepTarget: String(plan.suggestedSteps),
                waterTarget: String(plan.waterLiters),
              },
            })
          }
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Bilow qorshahayga</Text>

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
    flexGrow: 1,
    paddingBottom: 42,
  },

  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  brandEmoji: {
    fontSize: 21,
  },

  brandName: {
    color: "#14532D",
    fontSize: 15,
    fontWeight: "900",
  },

  brandLabel: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  hero: {
    marginBottom: 27,
  },

  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 12,
  },

  heroBadgeText: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  title: {
    color: "#1F2937",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "900",
    marginBottom: 10,
  },

  titleHighlight: {
    color: "#14532D",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionEyebrow: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 3,
  },

  sectionTitle: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "900",
  },

  startBadge: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  startBadgeText: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 26,
  },

  targetCard: {
    width: "48%",
    minHeight: 146,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 20,
    padding: 15,
    justifyContent: "center",
  },

  targetIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  icon: {
    fontSize: 18,
  },

  targetNumber: {
    color: "#14532D",
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "900",
  },

  targetLabel: {
    color: "#1F2937",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 3,
  },

  targetSubLabel: {
    color: "#9CA3AF",
    fontSize: 9,
    marginTop: 1,
  },

  detailsTitle: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 11,
  },

  planCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  planEmoji: {
    fontSize: 18,
  },

  planTextArea: {
    flex: 1,
  },

  planTitle: {
    color: "#6B7280",
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 3,
  },

  planValue: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "900",
  },

  chevron: {
    color: "#9CA3AF",
    fontSize: 22,
    fontWeight: "700",
  },

  coachCard: {
    backgroundColor: "#14532D",
    borderRadius: 22,
    padding: 17,
    marginTop: 11,
  },

  coachTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  coachIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  coachEmoji: {
    fontSize: 18,
  },

  coachHeading: {
    flex: 1,
  },

  coachName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  coachSmall: {
    color: "#BBF7D0",
    fontSize: 9,
    marginTop: 2,
  },

  coachText: {
    color: "#ECFDF5",
    fontSize: 11,
    lineHeight: 18,
  },

  behaviorCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  behaviorEmoji: {
    fontSize: 19,
    marginRight: 9,
  },

  behaviorTextArea: {
    flex: 1,
  },

  behaviorTitle: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  behaviorText: {
    color: "#4B5563",
    fontSize: 10,
    lineHeight: 16,
  },

  privateCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 10,
  },

  privateEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  privateTextArea: {
    flex: 1,
  },

  privateTitle: {
    color: "#14532D",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  privateText: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
  },

  note: {
    color: "#9CA3AF",
    fontSize: 9,
    lineHeight: 15,
    textAlign: "center",
    paddingHorizontal: 13,
    marginVertical: 20,
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
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 15,
  },
});
