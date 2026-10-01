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
  const params = useLocalSearchParams<{
    name?: string;
    motivation?: string;
    barriers?: string;
  }>();

  const [age, setAge] = useState("");

  const ageNumber = Number(age);

  const hasAge = age.trim().length > 0;
  const isAdult = hasAge && ageNumber >= 18;
  const canContinue = isAdult;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-body",
      params: {
        ...params,
        age,
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
          {/* Top */}
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

          {/* Coach */}
          <View style={styles.coachRow}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View>
              <Text style={styles.coachName}>CaatoAI</Text>
              <Text style={styles.coachLabel}>Aan wax yar kaa sii baranno</Text>
            </View>
          </View>

          {/* Personal message */}
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {params.name
                ? `${params.name}, hadda waxaan bilaabaynaa xogta naga caawinaysa inaan qorshahaaga si fiican kuu waafajino.`
                : "Hadda waxaan bilaabaynaa xogta naga caawinaysa inaan qorshahaaga si fiican kuu waafajino."}
            </Text>
          </View>

          {/* Question */}
          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>ADIGA</Text>
            </View>

            <Text style={styles.title}>
              Immisa jir{"\n"}
              <Text style={styles.titleGreen}>ayaad tahay?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Da'daadu waxay naga caawinaysaa inaan talooyinka iyo qorshaha
              bilowga ah ku waafajino marxaladda noloshaada.
            </Text>
          </View>

          {/* Age input */}
          <View
            style={[
              styles.inputCard,
              hasAge && !isAdult && styles.inputCardError,
              isAdult && styles.inputCardValid,
            ]}
          >
            <View style={styles.inputTopRow}>
              <View>
                <Text style={styles.inputLabel}>DA'DAADA</Text>
                <Text style={styles.inputHint}>Geli da'daada hadda</Text>
              </View>

              <View style={styles.ageIcon}>
                <Text style={styles.ageEmoji}>🎂</Text>
              </View>
            </View>

            <View style={styles.ageInputRow}>
              <TextInput
                value={age}
                onChangeText={(value) => {
                  const cleanAge = value.replace(/[^0-9]/g, "").slice(0, 3);

                  setAge(cleanAge);
                }}
                placeholder="32"
                placeholderTextColor="#B1B8B2"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={continueNext}
                maxLength={3}
                style={styles.input}
              />

              <Text style={styles.yearText}>jir</Text>

              {hasAge && (
                <View
                  style={[
                    styles.statusCircle,
                    isAdult
                      ? styles.statusCircleValid
                      : styles.statusCircleInvalid,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isAdult
                        ? styles.statusTextValid
                        : styles.statusTextInvalid,
                    ]}
                  >
                    {isAdult ? "✓" : "18+"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Under 18 */}
          {hasAge && !isAdult && (
            <View style={styles.warningCard}>
              <Text style={styles.warningEmoji}>🌱</Text>

              <View style={styles.warningTextArea}>
                <Text style={styles.warningTitle}>CaatoAI hadda waa 18+</Text>

                <Text style={styles.warningText}>
                  Qorshayaasha CaatoAI hadda waxaa loogu talagalay dadka waaweyn
                  ee 18 jir iyo ka weyn.
                </Text>
              </View>
            </View>
          )}

          {/* Valid response */}
          {isAdult && (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>Mahadsanid.</Text>

                <Text style={styles.responseText}>
                  Waxaan xogtan ku dari doonaa macluumaadka kale ee aad na
                  siisay si qorshahaagu adiga kuugu habboonaado.
                </Text>
              </View>
            </View>
          )}

          {/* Why we ask */}
          <View style={styles.whyCard}>
            <View style={styles.whyIcon}>
              <Text style={styles.whyEmoji}>🧠</Text>
            </View>

            <View style={styles.whyTextArea}>
              <Text style={styles.whyTitle}>Maxaan tan kuu weydiinaynaa?</Text>

              <Text style={styles.whyText}>
                Da'du waa mid ka mid ah xogaha CaatoAI isticmaalo marka uu
                diyaarinayo talooyin ku habboon qofka.
              </Text>
            </View>
          </View>

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
              🔒 Da'daada iyo jawaabahaaga waxaa loo isticmaalaa shakhsiyeynta
              khibraddaada CaatoAI.
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
    width: "26%",
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
    marginBottom: 17,
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

  personalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    padding: 13,
    marginBottom: 23,
  },

  personalEmoji: {
    fontSize: 17,
    marginRight: 9,
  },

  personalText: {
    flex: 1,
    color: "#52685A",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  hero: {
    marginBottom: 21,
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
    letterSpacing: 1,
  },

  title: {
    color: "#202923",
    fontSize: 33,
    lineHeight: 40,
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

  inputCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E7E0",
    borderRadius: 22,
    padding: 17,
  },

  inputCardValid: {
    borderColor: "#AFCDB5",
  },

  inputCardError: {
    borderColor: "#E7C3C3",
  },

  inputTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  inputLabel: {
    color: "#477253",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  inputHint: {
    color: "#929A94",
    fontSize: 10,
    marginTop: 3,
  },

  ageIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF5ED",
    alignItems: "center",
    justifyContent: "center",
  },

  ageEmoji: {
    fontSize: 19,
  },

  ageInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    minHeight: 62,
    backgroundColor: "#F8FAF7",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 16,
    paddingHorizontal: 17,
    color: "#202923",
    fontSize: 25,
    fontWeight: "900",
  },

  yearText: {
    color: "#667169",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 10,
  },

  statusCircle: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  statusCircleValid: {
    backgroundColor: "#E0F1E3",
  },

  statusCircleInvalid: {
    backgroundColor: "#FCEAEA",
  },

  statusText: {
    fontWeight: "900",
  },

  statusTextValid: {
    color: "#347147",
    fontSize: 18,
  },

  statusTextInvalid: {
    color: "#B95C5C",
    fontSize: 11,
  },

  warningCard: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F2",
    borderRadius: 18,
    padding: 14,
  },

  warningEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  warningTextArea: {
    flex: 1,
  },

  warningTitle: {
    color: "#8F4949",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  warningText: {
    color: "#826565",
    fontSize: 10,
    lineHeight: 16,
  },

  responseCard: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
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

  whyCard: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
  },

  whyIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0F4ED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  whyEmoji: {
    fontSize: 17,
  },

  whyTextArea: {
    flex: 1,
  },

  whyTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  whyText: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 15,
  },

  bottomArea: {
    marginTop: "auto",
    paddingTop: 27,
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

  privacyText: {
    color: "#8A928C",
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },
});
