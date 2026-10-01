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

export default function OnboardingLocationScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const canContinue = country.trim().length >= 2 && city.trim().length >= 2;

  const continueNext = () => {
    if (!canContinue) return;

    Keyboard.dismiss();

    router.push({
      pathname: "/onboarding-food-access",
      params: {
        ...params,
        country: country.trim(),
        city: city.trim(),
        locationLabel: `${city.trim()}, ${country.trim()}`,
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
                Waxaan ku dhow nahay qorshahaaga
              </Text>
            </View>
          </View>

          {/* COACH */}

          <View style={styles.coachRow}>
            <View style={styles.coachIcon}>
              <Text style={styles.coachEmoji}>🌿</Text>
            </View>

            <View style={styles.coachTextArea}>
              <Text style={styles.coachName}>CaatoAI</Text>

              <Text style={styles.coachLabel}>
                Aan qorshahaaga ku waafajino meesha aad joogto
              </Text>
            </View>
          </View>

          {/* PERSONAL */}

          {name ? (
            <View style={styles.personalCard}>
              <Text style={styles.personalEmoji}>💚</Text>

              <Text style={styles.personalText}>
                {name}, ma doonayo inaan kuu soo jeediyo cuntooyin adag in laga
                helo meesha aad joogto. Aan ogaano deegaankaaga.
              </Text>
            </View>
          ) : null}

          {/* HERO */}

          <View style={styles.hero}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>DEEGAANKAAGA</Text>
            </View>

            <Text style={styles.title}>
              Xaggee ayaad{"\n"}
              <Text style={styles.titleGreen}>ku nooshahay?</Text>
            </Text>

            <Text style={styles.subtitle}>
              Magaalada iyo dalkaaga waxay naga caawinayaan inaan kuu soo
              jeedino cuntooyin iyo ingredients si fudud looga heli karo
              deegaankaaga.
            </Text>
          </View>

          {/* LOCATION FORM */}

          <View style={styles.formCard}>
            <View style={styles.formIcon}>
              <Text style={styles.formEmoji}>📍</Text>
            </View>

            <Text style={styles.formTitle}>Goobtaada</Text>

            <Text style={styles.formDescription}>
              Uma baahnin cinwaanka gurigaaga. Magaalada iyo dalka ayaa nagu
              filan.
            </Text>

            <View style={styles.fieldArea}>
              <Text style={styles.label}>Dalka</Text>

              <TextInput
                value={country}
                onChangeText={setCountry}
                placeholder="Tusaale: United States"
                placeholderTextColor="#A0A7A1"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldArea}>
              <Text style={styles.label}>Magaalada</Text>

              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Tusaale: St. Cloud"
                placeholderTextColor="#A0A7A1"
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={continueNext}
              />
            </View>
          </View>

          {/* PREVIEW */}

          {canContinue && (
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <Text style={styles.locationEmoji}>✨</Text>
              </View>

              <View style={styles.locationTextArea}>
                <Text style={styles.locationLabel}>QORSHAHAAGA</Text>

                <Text style={styles.locationTitle}>
                  {city.trim()}, {country.trim()}
                </Text>

                <Text style={styles.locationText}>
                  CaatoAI wuxuu isku dayi doonaa inuu qorshahaaga ku saleeyo
                  cuntooyin iyo doorashooyin macquul ka ah deegaankaaga.
                </Text>
              </View>
            </View>
          )}

          {/* WHY */}

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoEmoji}>🛒</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoTitle}>Cunto aad heli karto</Text>

              <Text style={styles.infoText}>
                Qorshe caafimaad leh waa inuu ku shaqeeyaa nolosha dhabta ah.
                Waxaan rabnaa inaan dooranno cuntooyin aad si dhab ah uga heli
                karto dukaamada kuu dhow.
              </Text>
            </View>
          </View>

          {/* CULTURAL FOOD */}

          <View style={styles.cultureCard}>
            <Text style={styles.cultureEmoji}>🍲</Text>

            <View style={styles.cultureTextArea}>
              <Text style={styles.cultureTitle}>
                Cuntada aad taqaan weli way ku jiri kartaa
              </Text>

              <Text style={styles.cultureText}>
                Meesha aad joogto ma beddelayso dhaqankaaga. CaatoAI wuxuu isku
                dari karaa cuntooyinka aad jeceshahay iyo ingredients-ka
                deegaankaaga laga heli karo.
              </Text>
            </View>
          </View>

          {/* PRIVACY */}

          <View style={styles.privacyCard}>
            <Text style={styles.privacyEmoji}>🔒</Text>

            <View style={styles.privacyTextArea}>
              <Text style={styles.privacyTitle}>
                Cinwaan gaar ah ma weydiinayno
              </Text>

              <Text style={styles.privacyText}>
                Magaalada iyo dalka oo keliya ayaa loogu talagalay shakhsiyeynta
                qorshaha cuntada.
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
              🌿 Hal tallaabo oo kale ayaan ugu dhowaanaynaa qorshahaaga.
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
    width: "91%",
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
    marginBottom: 16,
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

  coachTextArea: {
    flex: 1,
  },

  coachName: {
    color: "#173F2A",
    fontSize: 15,
    fontWeight: "900",
  },

  coachLabel: {
    color: "#7B857E",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "600",
    marginTop: 2,
  },

  personalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDF5EC",
    borderRadius: 16,
    padding: 13,
    marginBottom: 21,
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
    marginBottom: 18,
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
    letterSpacing: 0.8,
  },

  title: {
    color: "#202923",
    fontSize: 30,
    lineHeight: 37,
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

  formCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6E0",
    borderRadius: 22,
    padding: 17,
  },

  formIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EAF4EA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  formEmoji: {
    fontSize: 21,
  },

  formTitle: {
    color: "#303A33",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  formDescription: {
    color: "#7B847D",
    fontSize: 10,
    lineHeight: 16,
    marginBottom: 17,
  },

  fieldArea: {
    marginBottom: 14,
  },

  label: {
    color: "#405347",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    minHeight: 54,
    backgroundColor: "#F8FAF7",
    borderWidth: 1.5,
    borderColor: "#DDE5DD",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#27332B",
    fontSize: 14,
    fontWeight: "700",
  },

  locationCard: {
    marginTop: 12,
    backgroundColor: "#173F2A",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  locationEmoji: {
    fontSize: 18,
  },

  locationTextArea: {
    flex: 1,
  },

  locationLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  locationTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  locationText: {
    color: "#C9D9CC",
    fontSize: 10,
    lineHeight: 16,
  },

  infoCard: {
    marginTop: 11,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E7E1",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoIcon: {
    width: 39,
    height: 39,
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

  cultureCard: {
    marginTop: 11,
    backgroundColor: "#EAF4EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  cultureEmoji: {
    fontSize: 18,
    marginRight: 10,
  },

  cultureTextArea: {
    flex: 1,
  },

  cultureTitle: {
    color: "#28563A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  cultureText: {
    color: "#607067",
    fontSize: 10,
    lineHeight: 15,
  },

  privacyCard: {
    marginTop: 11,
    backgroundColor: "#F3F1EA",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  privacyEmoji: {
    fontSize: 16,
    marginRight: 9,
  },

  privacyTextArea: {
    flex: 1,
  },

  privacyTitle: {
    color: "#4C5D50",
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 2,
  },

  privacyText: {
    color: "#818A83",
    fontSize: 9,
    lineHeight: 14,
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
