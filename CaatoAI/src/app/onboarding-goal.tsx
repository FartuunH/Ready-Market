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

export default function OnboardingGoalScreen() {
  const { name } = useLocalSearchParams<{
    name?: string;
  }>();

  const [age, setAge] = useState("");

  const ageNumber = Number(age);
  const canContinue = age.trim().length > 0 && ageNumber >= 18;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-body",
      params: {
        name,
        age,
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

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan is sii baranno</Text>
            </View>
          </View>

          <View style={styles.greetingCard}>
            <Text style={styles.greetingEmoji}>💚</Text>

            <Text style={styles.greetingText}>
              Waan ku faraxsanahay inaan kula kulmo,{" "}
              <Text style={styles.greetingName}>{name || "saaxiib"}.</Text>
            </Text>
          </View>

          <View style={styles.questionArea}>
            <Text style={styles.title}>
              Immisa jir{"\n"}
              <Text style={styles.titleHighlight}>ayaad tahay?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Da&apos;daadu waxay CaatoAI ka caawinaysaa inuu kuu sameeyo qorshe
              ku habboon jirkaaga iyo marxaladda noloshaada.
            </Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.label}>Da&apos;daada</Text>

            <View style={styles.ageInputRow}>
              <TextInput
                value={age}
                onChangeText={(value) => {
                  const cleanAge = value.replace(/[^0-9]/g, "").slice(0, 3);
                  setAge(cleanAge);
                }}
                placeholder="Tusaale: 32"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={continueNext}
                style={styles.input}
                maxLength={3}
              />

              {age.trim().length > 0 && (
                <View
                  style={[
                    styles.ageStatus,
                    canContinue
                      ? styles.ageStatusValid
                      : styles.ageStatusInvalid,
                  ]}
                >
                  <Text
                    style={[
                      styles.ageStatusText,
                      canContinue
                        ? styles.ageStatusTextValid
                        : styles.ageStatusTextInvalid,
                    ]}
                  >
                    {canContinue ? "✓" : "18+"}
                  </Text>
                </View>
              )}
            </View>

            {age.trim().length > 0 && ageNumber < 18 && (
              <Text style={styles.errorText}>
                CaatoAI hadda waxaa loogu talagalay dadka waaweyn ee 18 jir iyo
                ka weyn.
              </Text>
            )}
          </View>

          {canContinue && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <Text style={styles.responseText}>
                Mahadsanid, {name || "saaxiib"}. Waxaan xogtan u isticmaali
                doonaa inaan qorshahaaga si fiican kuu waafajiyo.
              </Text>
            </View>
          )}

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
              🔒 Jawaabahaaga waxaa loo isticmaalaa shakhsiyeynta qorshahaaga.
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
    marginBottom: 28,
  },

  progressFill: {
    width: "15%",
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

  greetingCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  greetingEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  greetingText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  greetingName: {
    color: "#14532D",
    fontWeight: "900",
  },

  questionArea: {
    marginBottom: 26,
  },

  title: {
    color: "#1F2937",
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "900",
    marginBottom: 12,
  },

  titleHighlight: {
    color: "#14532D",
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 23,
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

  label: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 9,
  },

  ageInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    minHeight: 55,
    backgroundColor: "#F9FCF9",
    borderWidth: 1.5,
    borderColor: "#D6E8D9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "800",
  },

  ageStatus: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  ageStatusValid: {
    backgroundColor: "#DCFCE7",
  },

  ageStatusInvalid: {
    backgroundColor: "#FEF2F2",
  },

  ageStatusText: {
    fontWeight: "900",
  },

  ageStatusTextValid: {
    color: "#16A34A",
    fontSize: 18,
  },

  ageStatusTextInvalid: {
    color: "#DC2626",
    fontSize: 12,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
    fontWeight: "600",
  },

  responseCard: {
    marginTop: 15,
    padding: 14,
    borderRadius: 17,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    flexDirection: "row",
    alignItems: "center",
  },

  responseEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  responseText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 30,
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
