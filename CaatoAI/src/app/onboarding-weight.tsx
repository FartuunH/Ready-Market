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

type WeightUnit = "lb" | "kg";

export default function OnboardingWeightScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");

  const [currentWeight, setCurrentWeight] = useState("");

  const weightNumber = Number(currentWeight);

  const validLb =
    currentWeight.trim().length > 0 &&
    weightNumber >= 70 &&
    weightNumber <= 700;

  const validKg =
    currentWeight.trim().length > 0 &&
    weightNumber >= 32 &&
    weightNumber <= 318;

  const canContinue = weightUnit === "lb" ? validLb : validKg;

  const switchUnit = (unit: WeightUnit) => {
    Keyboard.dismiss();

    if (unit === weightUnit) return;

    setWeightUnit(unit);
    setCurrentWeight("");
  };

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-goal-weight",
      params: {
        ...params,
        currentWeight,
        weightUnit,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
                Waxaan dhiseynaa sawirkaaga bilowga ah
              </Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionArea}>
            <Text style={styles.smallGreeting}>
              {name ? `${name}, ` : ""}
              hal su'aal oo kale 💚
            </Text>

            <Text style={styles.title}>
              Miisaankaagu hadda{"\n"}
              <Text style={styles.titleHighlight}>waa imisa?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Miisaankan wuxuu noqonayaa meesha aan ka bilaabayno. CaatoAI wuxuu
              diiradda saari doonaa horumar tartiib ah iyo caadooyin aad sii
              wadi karto.
            </Text>
          </View>

          {/* Unit toggle */}
          <View style={styles.toggleContainer}>
            <Pressable
              onPress={() => switchUnit("lb")}
              style={[
                styles.toggleButton,
                weightUnit === "lb" && styles.toggleButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  weightUnit === "lb" && styles.toggleTextSelected,
                ]}
              >
                lb
              </Text>
            </Pressable>

            <Pressable
              onPress={() => switchUnit("kg")}
              style={[
                styles.toggleButton,
                weightUnit === "kg" && styles.toggleButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  weightUnit === "kg" && styles.toggleTextSelected,
                ]}
              >
                kg
              </Text>
            </Pressable>
          </View>

          {/* Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Miisaankaaga hadda</Text>

            <View style={styles.weightInputBox}>
              <TextInput
                value={currentWeight}
                onChangeText={(value) => {
                  const cleanValue = value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1")
                    .slice(0, 6);

                  setCurrentWeight(cleanValue);
                }}
                placeholder={
                  weightUnit === "lb" ? "Tusaale: 180" : "Tusaale: 82"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                style={styles.weightInput}
              />

              <Text style={styles.unitText}>{weightUnit}</Text>
            </View>

            <Text style={styles.inputHint}>
              Waxaad dooran kartaa pounds ama kilograms.
            </Text>
          </View>

          {/* Confirmation */}
          {canContinue && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>
                  Waan helay — {currentWeight} {weightUnit}.
                </Text>

                <Text style={styles.responseText}>
                  Tani waa meesha aad maanta ka bilaabayso. Ma aha qiimeyn adiga
                  kugu saabsan — waa xog naga caawinaysa inaan kuu samayno
                  qorshe kugu habboon.
                </Text>
              </View>
            </View>
          )}

          {/* Continue */}
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

            <Text style={styles.privacyText}>
              🔒 Miisaankaaga waa xog gaar ah waxaana loo isticmaalaa
              shakhsiyeynta qorshahaaga.
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
    width: "50%",
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
    marginBottom: 23,
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
  },

  toggleContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#D1E7D5",
    marginBottom: 13,
  },

  toggleButton: {
    minWidth: 76,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: "center",
  },

  toggleButtonSelected: {
    backgroundColor: "#14532D",
  },

  toggleText: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "900",
  },

  toggleTextSelected: {
    color: "#FFFFFF",
  },

  inputCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 22,
    padding: 17,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  inputLabel: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 11,
  },

  weightInputBox: {
    width: "100%",
    minHeight: 60,
    backgroundColor: "#F9FCF9",
    borderWidth: 1.5,
    borderColor: "#D6E8D9",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  weightInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#1F2937",
    fontSize: 22,
    fontWeight: "900",
  },

  unitText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "900",
    paddingRight: 16,
  },

  inputHint: {
    color: "#9CA3AF",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 10,
  },

  responseCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 15,
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

  bottomArea: {
    marginTop: "auto",
    paddingTop: 28,
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
