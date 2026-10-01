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

  const cleanName = name.trim();

  const displayName =
    cleanName.length > 0
      ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
      : "";

  const canContinue = cleanName.length > 0;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-motivation",
      params: {
        name: displayName,
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
          {/* Top navigation */}
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

              <Text style={styles.progressText}>Bilowga safarkaaga</Text>
            </View>
          </View>

          {/* CaatoAI identity */}
          <View style={styles.coachRow}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan is baranno</Text>
            </View>
          </View>

          {/* Main question */}
          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>TALLAABADA 1</Text>
            </View>

            <Text style={styles.title}>
              Marka hore,{"\n"}
              <Text style={styles.titleGreen}>maxaan kuugu yeeraa?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Safarkan adiga ayuu kaa hadlayaa. Magacaaga wuxuu naga caawinayaa
              inaan CaatoAI ka dhigno mid kuu gaar ah.
            </Text>
          </View>

          {/* Name input */}
          <View style={styles.inputCard}>
            <View style={styles.inputIcon}>
              <Text style={styles.personEmoji}>😊</Text>
            </View>

            <View style={styles.inputArea}>
              <Text style={styles.inputLabel}>Magacaaga</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tusaale: Farta"
                placeholderTextColor="#A2AAA4"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={continueNext}
              />
            </View>
          </View>

          {/* Personalized response */}
          {canContinue ? (
            <View style={styles.responseCard}>
              <View style={styles.responseIcon}>
                <Text style={styles.responseEmoji}>💚</Text>
              </View>

              <View style={styles.responseContent}>
                <Text style={styles.responseTitle}>
                  Waan ku faraxsanahay inaan kula kulmo, {displayName}.
                </Text>

                <Text style={styles.responseText}>
                  Hadda waxaan bilaabaynaa inaan fahanno waxa adiga muhiimka kuu
                  ah.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.tipCard}>
              <Text style={styles.tipEmoji}>🌱</Text>

              <Text style={styles.tipText}>
                Ma jiro jawaab sax ama khalad ah. Waxaan rabnaa inaan ku baranno
                adiga sida aad tahay.
              </Text>
            </View>
          )}

          {/* Bottom */}
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
              🔒 Jawaabahaaga waxaa loo isticmaalaa oo keliya in khibraddaada
              CaatoAI laguu waafajiyo.
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
    marginBottom: 28,
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
    width: "8%",
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
    marginBottom: 30,
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
    marginBottom: 27,
  },

  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF4EA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },

  stepBadgeText: {
    color: "#477253",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
  },

  title: {
    color: "#202923",
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "900",
    letterSpacing: -0.6,
    marginBottom: 13,
  },

  titleGreen: {
    color: "#28623B",
  },

  subtitle: {
    color: "#68736B",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 470,
  },

  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE6DE",
    borderRadius: 22,
    padding: 15,
  },

  inputIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EEF5ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  personEmoji: {
    fontSize: 23,
  },

  inputArea: {
    flex: 1,
  },

  inputLabel: {
    color: "#45624D",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  input: {
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 0,
    color: "#202923",
    fontSize: 18,
    fontWeight: "800",
    outlineStyle: "none",
  } as any,

  responseCard: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#173F2A",
    borderRadius: 20,
    padding: 15,
  },

  responseIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#28543A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  responseEmoji: {
    fontSize: 18,
  },

  responseContent: {
    flex: 1,
  },

  responseTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    marginBottom: 3,
  },

  responseText: {
    color: "#CFE1D2",
    fontSize: 11,
    lineHeight: 16,
  },

  tipCard: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF5ED",
    borderRadius: 18,
    padding: 14,
  },

  tipEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  tipText: {
    flex: 1,
    color: "#607067",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 34,
    paddingBottom: 8,
  },

  button: {
    width: "100%",
    minHeight: 58,
    borderRadius: 19,
    backgroundColor: "#28623B",
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

  privacyText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 16,
  },
});
