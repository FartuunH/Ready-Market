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

export default function OnboardingGoalWeightScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const weightUnit: WeightUnit = params.weightUnit === "kg" ? "kg" : "lb";

  const currentWeight =
    typeof params.currentWeight === "string" ? Number(params.currentWeight) : 0;

  const [goalWeight, setGoalWeight] = useState("");

  const goalWeightNumber = Number(goalWeight);

  const minimumWeight = weightUnit === "lb" ? 70 : 32;
  const maximumWeight = weightUnit === "lb" ? 700 : 318;

  const canContinue =
    goalWeight.trim().length > 0 &&
    Number.isFinite(goalWeightNumber) &&
    goalWeightNumber >= minimumWeight &&
    goalWeightNumber <= maximumWeight &&
    goalWeightNumber < currentWeight;

  const amountToLose =
    canContinue && currentWeight > 0 ? currentWeight - goalWeightNumber : 0;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-womens-health",
      params: {
        ...params,
        goalWeight,
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
                Hadda aan ogaano halka aad rabto inaad gaarto
              </Text>
            </View>
          </View>

          <View style={styles.questionArea}>
            <Text style={styles.smallGreeting}>
              {name ? `${name}, ` : ""}
              hadafkaaga adiga ayaa leh 💚
            </Text>

            <Text style={styles.title}>
              Miisaankee ayaad rabtaa{"\n"}
              <Text style={styles.titleHighlight}>inaad gaarto?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Geli miisaanka aad jeclaan lahayd inaad gaarto. CaatoAI wuxuu
              qorshahaaga u kala qaybin doonaa tallaabooyin yaryar oo la gaari
              karo.
            </Text>
          </View>

          <View style={styles.currentCard}>
            <View>
              <Text style={styles.currentLabel}>Miisaankaaga hadda</Text>

              <Text style={styles.currentValue}>
                {currentWeight || "--"} {weightUnit}
              </Text>
            </View>

            <Text style={styles.currentEmoji}>⚖️</Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Miisaanka hadafkaaga</Text>

            <View style={styles.weightInputBox}>
              <TextInput
                value={goalWeight}
                onChangeText={(value) => {
                  const cleanValue = value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1")
                    .slice(0, 6);

                  setGoalWeight(cleanValue);
                }}
                placeholder={
                  weightUnit === "lb" ? "Tusaale: 160" : "Tusaale: 73"
                }
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                style={styles.weightInput}
              />

              <Text style={styles.unitText}>{weightUnit}</Text>
            </View>

            {goalWeight.trim().length > 0 && !canContinue && (
              <Text style={styles.errorText}>
                Geli hadaf ka hooseeya miisaankaaga hadda oo sax ah.
              </Text>
            )}
          </View>

          {canContinue && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>
                  Hadafkaagu waa {goalWeight} {weightUnit}.
                </Text>

                <Text style={styles.responseText}>
                  Taasi waxay ka dhigan tahay inaad rabto inaad dhinto qiyaastii{" "}
                  {Number(amountToLose.toFixed(1))} {weightUnit}. Uma baahnid
                  inaad hal mar wada gaarto — waxaan u kala qaadi doonaa
                  tallaabooyin yaryar.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.milestoneCard}>
            <Text style={styles.milestoneEmoji}>🌱</Text>

            <View style={styles.milestoneTextArea}>
              <Text style={styles.milestoneTitle}>
                Marka hore waxaan diiradda saari doonaa guulo yar-yar
              </Text>

              <Text style={styles.milestoneText}>
                CaatoAI wuxuu kuu samayn doonaa milestones si horumarkaagu u
                dareemo mid la gaari karo, halkii hadafka oo dhan hal mar lagu
                eegi lahaa.
              </Text>
            </View>
          </View>

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
              🔒 Miisaankaaga iyo hadafkaaga waa xog gaar ah.
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
    width: "56%",
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
    marginBottom: 20,
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

  currentCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  currentLabel: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 2,
  },

  currentValue: {
    color: "#14532D",
    fontSize: 18,
    fontWeight: "900",
  },

  currentEmoji: {
    fontSize: 22,
  },

  inputCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 22,
    padding: 17,
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

  errorText: {
    color: "#B91C1C",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 9,
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

  milestoneCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  milestoneEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  milestoneTextArea: {
    flex: 1,
  },

  milestoneTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  milestoneText: {
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
    paddingHorizontal: 18,
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
