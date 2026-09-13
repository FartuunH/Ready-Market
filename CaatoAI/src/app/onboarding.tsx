import { router } from "expo-router";
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

export default function OnboardingScreen() {
  const [name, setName] = useState("");

  const displayName =
    name.trim().charAt(0).toUpperCase() + name.trim().slice(1);

  const canContinue = name.trim().length > 0;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-goal",
      params: {
        name: displayName,
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

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan is baranno</Text>
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionArea}>
            <Text style={styles.title}>
              Maxaan kuugu{"\n"}
              <Text style={styles.titleHighlight}>yeeraa?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Waxaan rabaa inaan safarkan ka dhigo mid adiga kuu gaar ah.
            </Text>
          </View>

          {/* Input */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Magacaaga</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Geli magacaaga"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              returnKeyType="done"
              autoCapitalize="words"
              autoCorrect={false}
              onSubmitEditing={continueNext}
            />
          </View>

          {/* Small coaching message */}
          {name.trim().length > 0 && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>💚</Text>

              <Text style={styles.responseText}>
                Waan ku faraxsanahay inaan kula kulmo,{" "}
                <Text style={styles.responseName}>{displayName}.</Text>
              </Text>
            </View>
          )}

          {/* Button */}
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
              🔒 Jawaabahaaga waxaa loo isticmaalaa in CaatoAI kuu sameeyo
              qorshe kuu gaar ah.
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
    width: "8%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 34,
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

  questionArea: {
    marginBottom: 28,
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
    maxWidth: 420,
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

  input: {
    width: "100%",
    minHeight: 55,
    backgroundColor: "#F9FCF9",
    borderWidth: 1.5,
    borderColor: "#D6E8D9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#1F2937",
    fontSize: 17,
    fontWeight: "700",
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

  responseName: {
    color: "#14532D",
    fontWeight: "900",
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
