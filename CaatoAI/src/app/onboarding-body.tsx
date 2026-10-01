import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type HeightUnit = "imperial" | "metric";
type WeightUnit = "lbs" | "kg";

export default function OnboardingBodyScreen() {
  const params = useLocalSearchParams<{
    name?: string;
    motivation?: string;
    barriers?: string;
    age?: string;
  }>();

  const [heightUnit, setHeightUnit] = useState<HeightUnit>("imperial");

  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lbs");

  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [centimeters, setCentimeters] = useState("");
  const [weight, setWeight] = useState("");

  const cleanNumber = (value: string, maxLength = 3) =>
    value.replace(/[^0-9]/g, "").slice(0, maxLength);

  const feetNumber = Number(feet);
  const inchesNumber = Number(inches);
  const cmNumber = Number(centimeters);
  const weightNumber = Number(weight);

  const validImperialHeight =
    feet.length > 0 &&
    feetNumber >= 3 &&
    feetNumber <= 8 &&
    inches.length > 0 &&
    inchesNumber >= 0 &&
    inchesNumber <= 11;

  const validMetricHeight =
    centimeters.length > 0 && cmNumber >= 90 && cmNumber <= 250;

  const validHeight =
    heightUnit === "imperial" ? validImperialHeight : validMetricHeight;

  const validWeight =
    weight.length > 0 &&
    (weightUnit === "lbs"
      ? weightNumber >= 60 && weightNumber <= 700
      : weightNumber >= 27 && weightNumber <= 320);

  const canContinue = validHeight && validWeight;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    let heightCm = cmNumber;

    if (heightUnit === "imperial") {
      heightCm = Math.round(feetNumber * 30.48 + inchesNumber * 2.54);
    }

    const weightKg =
      weightUnit === "lbs"
        ? Math.round(weightNumber * 0.453592 * 10) / 10
        : weightNumber;

    router.push({
      pathname: "/onboarding-goal-weight",
      params: {
        ...params,

        heightUnit,
        weightUnit,

        feet: heightUnit === "imperial" ? feet : "",
        inches: heightUnit === "imperial" ? inches : "",
        centimeters: heightUnit === "metric" ? centimeters : "",

        currentWeight: weight,

        // Standardized values for later calculations
        heightCm: String(heightCm),
        currentWeightKg: String(weightKg),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>

              <Text style={styles.coachLabel}>Aan fahanno jirkaaga</Text>
            </View>
          </View>

          {/* HERO */}

          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>JIRKAAGA</Text>
            </View>

            <Text style={styles.title}>
              Aan wax yar ka{"\n"}
              <Text style={styles.titleGreen}>baranno jirkaaga.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Dhererkaaga iyo miisaankaaga hadda waxay CaatoAI ka caawinayaan
              inuu kuu diyaariyo qorshe bilow ah oo adiga kugu habboon.
            </Text>
          </View>

          {/* HEIGHT */}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>DHERERKAAGA</Text>

                <Text style={styles.sectionHint}>Geli dhererkaaga hadda</Text>
              </View>

              <View style={styles.sectionIcon}>
                <Text style={styles.sectionEmoji}>📏</Text>
              </View>
            </View>

            {/* HEIGHT UNIT */}

            <View style={styles.segment}>
              <Pressable
                onPress={() => setHeightUnit("imperial")}
                style={[
                  styles.segmentButton,
                  heightUnit === "imperial" && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    heightUnit === "imperial" && styles.segmentTextActive,
                  ]}
                >
                  ft / in
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setHeightUnit("metric")}
                style={[
                  styles.segmentButton,
                  heightUnit === "metric" && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    heightUnit === "metric" && styles.segmentTextActive,
                  ]}
                >
                  cm
                </Text>
              </Pressable>
            </View>

            {heightUnit === "imperial" ? (
              <View style={styles.measurementRow}>
                <View style={styles.measurementField}>
                  <TextInput
                    value={feet}
                    onChangeText={(value) => setFeet(cleanNumber(value, 1))}
                    placeholder="5"
                    placeholderTextColor="#B1B8B2"
                    keyboardType="number-pad"
                    style={styles.input}
                  />

                  <Text style={styles.unitLabel}>ft</Text>
                </View>

                <View style={styles.measurementField}>
                  <TextInput
                    value={inches}
                    onChangeText={(value) => setInches(cleanNumber(value, 2))}
                    placeholder="4"
                    placeholderTextColor="#B1B8B2"
                    keyboardType="number-pad"
                    style={styles.input}
                  />

                  <Text style={styles.unitLabel}>in</Text>
                </View>
              </View>
            ) : (
              <View style={styles.singleMeasurement}>
                <TextInput
                  value={centimeters}
                  onChangeText={(value) =>
                    setCentimeters(cleanNumber(value, 3))
                  }
                  placeholder="163"
                  placeholderTextColor="#B1B8B2"
                  keyboardType="number-pad"
                  style={styles.input}
                />

                <Text style={styles.unitLabel}>cm</Text>
              </View>
            )}

            {heightUnit === "imperial" &&
              feet.length > 0 &&
              inches.length > 0 &&
              !validImperialHeight && (
                <Text style={styles.errorText}>Fadlan geli dherer sax ah.</Text>
              )}

            {heightUnit === "metric" &&
              centimeters.length > 0 &&
              !validMetricHeight && (
                <Text style={styles.errorText}>Fadlan geli dherer sax ah.</Text>
              )}
          </View>

          {/* WEIGHT */}

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>MIISAANKAAGA HADDA</Text>

                <Text style={styles.sectionHint}>Geli miisaankaaga hadda</Text>
              </View>

              <View style={styles.sectionIcon}>
                <Text style={styles.sectionEmoji}>⚖️</Text>
              </View>
            </View>

            <View style={styles.segment}>
              <Pressable
                onPress={() => setWeightUnit("lbs")}
                style={[
                  styles.segmentButton,
                  weightUnit === "lbs" && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    weightUnit === "lbs" && styles.segmentTextActive,
                  ]}
                >
                  lbs
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setWeightUnit("kg")}
                style={[
                  styles.segmentButton,
                  weightUnit === "kg" && styles.segmentButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    weightUnit === "kg" && styles.segmentTextActive,
                  ]}
                >
                  kg
                </Text>
              </Pressable>
            </View>

            <View style={styles.singleMeasurement}>
              <TextInput
                value={weight}
                onChangeText={(value) => setWeight(cleanNumber(value, 3))}
                placeholder={weightUnit === "lbs" ? "180" : "82"}
                placeholderTextColor="#B1B8B2"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={continueNext}
                style={styles.input}
              />

              <Text style={styles.unitLabel}>{weightUnit}</Text>
            </View>

            {weight.length > 0 && !validWeight && (
              <Text style={styles.errorText}>Fadlan geli miisaan sax ah.</Text>
            )}
          </View>

          {/* COACH MESSAGE */}

          {canContinue && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>Waan helnay.</Text>

                <Text style={styles.responseText}>
                  Tallaabada xigta waxaan ku weydiin doonaa miisaanka aad rabto
                  inaad gaarto.
                </Text>
              </View>
            </View>
          )}

          {/* PRIVACY CARD */}

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoEmoji}>🔒</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoTitle}>Xogtaada waa kuu gaar</Text>

              <Text style={styles.infoText}>
                Dhererkaaga iyo miisaankaaga waxaa loo isticmaalaa shakhsiyeynta
                qorshahaaga CaatoAI.
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
              🌿 Uma baahnid inaad noqoto perfect — waxaan rabnaa oo keliya
              inaan fahanno halka aad maanta joogto.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: "32%",
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
    fontSize: 32,
    lineHeight: 39,
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

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE6DE",
    borderRadius: 22,
    padding: 17,
    marginBottom: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionLabel: {
    color: "#477253",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  sectionHint: {
    color: "#929A94",
    fontSize: 10,
    marginTop: 3,
  },

  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF5ED",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionEmoji: {
    fontSize: 19,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#F1F4F0",
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },

  segmentButton: {
    flex: 1,
    minHeight: 39,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  segmentButtonActive: {
    backgroundColor: "#28623B",
  },

  segmentText: {
    color: "#78817A",
    fontSize: 12,
    fontWeight: "800",
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  measurementRow: {
    flexDirection: "row",
    gap: 11,
  },

  measurementField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  singleMeasurement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    minWidth: 0,
    height: 58,
    backgroundColor: "#F8FAF7",
    borderWidth: 1.5,
    borderColor: "#DDE5DD",
    borderRadius: 16,
    paddingHorizontal: 16,
    color: "#202923",
    fontSize: 22,
    fontWeight: "900",
  },

  unitLabel: {
    color: "#5F6D63",
    fontSize: 12,
    fontWeight: "900",
  },

  errorText: {
    color: "#B65B5B",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 9,
  },

  responseCard: {
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 13,
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
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  responseText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 16,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  infoEmoji: {
    fontSize: 17,
  },

  infoTextArea: {
    flex: 1,
  },

  infoTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  infoText: {
    color: "#7B847D",
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
