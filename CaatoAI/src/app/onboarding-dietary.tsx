import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type DietaryRestriction =
  | "none"
  | "dairy"
  | "gluten"
  | "eggs"
  | "nuts"
  | "seafood"
  | "vegetarian"
  | "other";

const OPTIONS: {
  id: DietaryRestriction;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "none",
    emoji: "🌿",
    title: "Waxba ma jiro",
    description: "Ma lihi cunto aan u baahanahay inaan si gaar ah uga fogaado.",
  },
  {
    id: "dairy",
    emoji: "🥛",
    title: "Caanaha / Dairy",
    description:
      "Waxaan iska ilaaliyaa caanaha ama waxyaabaha caanaha laga sameeyo.",
  },
  {
    id: "gluten",
    emoji: "🌾",
    title: "Gluten",
    description: "Waxaan iska ilaaliyaa cuntooyinka gluten-ka leh.",
  },
  {
    id: "eggs",
    emoji: "🥚",
    title: "Ukun",
    description: "Waxaan iska ilaaliyaa ukunta ama cuntooyinka ukunta leh.",
  },
  {
    id: "nuts",
    emoji: "🥜",
    title: "Laws / Nuts",
    description: "Waxaan iska ilaaliyaa lawska ama nuts-ka qaarkood.",
  },
  {
    id: "seafood",
    emoji: "🦐",
    title: "Seafood",
    description: "Waxaan iska ilaaliyaa kalluunka ama seafood-ka qaarkood.",
  },
  {
    id: "vegetarian",
    emoji: "🥦",
    title: "Vegetarian",
    description: "Ma cuno hilib, qorshahana waxaan rabaa inuu taas tixgeliyo.",
  },
  {
    id: "other",
    emoji: "✍️",
    title: "Wax kale",
    description: "Waxaan leeyahay cunto kale oo aan iska ilaaliyo.",
  },
];

export default function OnboardingDietaryScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [selected, setSelected] = useState<DietaryRestriction[]>([]);
  const [otherRestriction, setOtherRestriction] = useState("");

  const toggleOption = (id: DietaryRestriction) => {
    setSelected((current) => {
      // "None" is exclusive
      if (id === "none") {
        if (current.includes("none")) {
          return [];
        }

        setOtherRestriction("");
        return ["none"];
      }

      // Remove "none" when another restriction is selected
      const withoutNone = current.filter((item) => item !== "none");

      if (withoutNone.includes(id)) {
        return withoutNone.filter((item) => item !== id);
      }

      return [...withoutNone, id];
    });
  };

  const canContinue =
    selected.length > 0 &&
    (!selected.includes("other") || otherRestriction.trim().length > 0);

  const continueNext = () => {
    if (!canContinue) return;

    const labels = OPTIONS.filter((option) => selected.includes(option.id)).map(
      (option) =>
        option.id === "other" && otherRestriction.trim()
          ? otherRestriction.trim()
          : option.title,
    );

    router.push({
      pathname: "/onboarding-eating-style",
      params: {
        ...params,
        dietaryRestrictions: selected.join(","),
        dietaryRestrictionLabels: labels.join("|"),
        otherRestriction: otherRestriction.trim(),
      },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
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

          <View style={styles.coachTextArea}>
            <Text style={styles.coachName}>CaatoAI</Text>

            <Text style={styles.coachLabel}>
              Aan qorshahaaga ka dhigno mid adiga kuu shaqeeya
            </Text>
          </View>
        </View>

        {/* PERSONAL */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, waxaan rabnaa inaan ogaano cuntooyinka aad noo sheegto
              inaan qorshahaaga ka ilaalino.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>CUNTADA AAD ISKA ILAALISO</Text>
          </View>

          <Text style={styles.title}>
            Ma jiraan cuntooyin aad{"\n"}
            <Text style={styles.titleGreen}>iska ilaaliso?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Dooro dhammaan kuwa ku khuseeya. Tani waxay noqon kartaa allergy,
            intolerance, ama cunto aad dooratay inaadan cunin.
          </Text>

          <View style={styles.multiBadge}>
            <Text style={styles.multiBadgeText}>
              ✓ Waxaad dooran kartaa dhowr
            </Text>
          </View>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {OPTIONS.map((option) => {
            const isSelected = selected.includes(option.id);

            return (
              <Pressable
                key={option.id}
                onPress={() => toggleOption(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    isSelected && styles.optionIconSelected,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text
                    style={[
                      styles.optionTitle,
                      isSelected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.checkBox,
                    isSelected && styles.checkBoxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* OTHER INPUT */}

        {selected.includes("other") && (
          <View style={styles.otherCard}>
            <Text style={styles.otherLabel}>
              Maxaad kale oo aad iska ilaalisaa?
            </Text>

            <TextInput
              value={otherRestriction}
              onChangeText={setOtherRestriction}
              placeholder="Tusaale: cunto ama ingredient gaar ah..."
              placeholderTextColor="#9A9F9B"
              style={styles.otherInput}
              multiline
              maxLength={150}
            />

            <Text style={styles.characterCount}>
              {otherRestriction.length}/150
            </Text>
          </View>
        )}

        {/* SAFETY */}

        <View style={styles.safetyCard}>
          <View style={styles.safetyIcon}>
            <Text style={styles.safetyEmoji}>🛡️</Text>
          </View>

          <View style={styles.safetyTextArea}>
            <Text style={styles.safetyLabel}>BADBAADO</Text>

            <Text style={styles.safetyTitle}>
              Allergy-gaaga si cad noo sheeg
            </Text>

            <Text style={styles.safetyText}>
              Haddii cunto ay kuu keento allergic reaction, ku dar halkan.
              CaatoAI wuxuu xogtan u isticmaali doonaa inuu ka fogaado inuu
              cuntadaas kuu soo jeediyo.
            </Text>
          </View>
        </View>

        {/* COACHING */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoEmoji}>🍽️</Text>
          </View>

          <View style={styles.infoTextArea}>
            <Text style={styles.infoTitle}>
              Qorshahaagu weli wuxuu yeelan karaa kala duwanaansho
            </Text>

            <Text style={styles.infoText}>
              Waxaan isku dayi doonaa inaan kuu helno beddel ku habboon marka
              cunto ama ingredient laga saaro qorshahaaga.
            </Text>
          </View>
        </View>

        {/* PRIVACY */}

        <View style={styles.privacyCard}>
          <Text style={styles.privacyEmoji}>🔒</Text>

          <View style={styles.privacyTextArea}>
            <Text style={styles.privacyTitle}>Xogtan waa kuu gaar</Text>

            <Text style={styles.privacyDescription}>
              Waxaa loo isticmaalaa shakhsiyeynta qorshahaaga cuntada iyo
              talooyinka CaatoAI.
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
            💚 Waxaad mar dambe beddeli kartaa cuntooyinka aad iska ilaaliso.
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
    width: "68%",
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

  multiBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F0F4ED",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 11,
  },

  multiBadgeText: {
    color: "#657069",
    fontSize: 9,
    fontWeight: "800",
  },

  optionsArea: {
    gap: 10,
  },

  optionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E0E6E0",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  optionCardSelected: {
    backgroundColor: "#F1F7F0",
    borderColor: "#79A783",
  },

  optionPressed: {
    opacity: 0.88,
  },

  optionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#F2F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionIconSelected: {
    backgroundColor: "#DDEDDD",
  },

  optionEmoji: {
    fontSize: 20,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    color: "#303A33",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  optionTitleSelected: {
    color: "#28563A",
  },

  optionDescription: {
    color: "#818A83",
    fontSize: 10,
    lineHeight: 15,
  },

  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#CCD4CD",
    alignItems: "center",
    justifyContent: "center",
  },

  checkBoxSelected: {
    backgroundColor: "#4F7C5B",
    borderColor: "#4F7C5B",
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  otherCard: {
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6E0",
    borderRadius: 19,
    padding: 14,
  },

  otherLabel: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 9,
  },

  otherInput: {
    minHeight: 82,
    backgroundColor: "#F7F8F5",
    borderWidth: 1,
    borderColor: "#E1E6DF",
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: "#303A33",
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: "top",
  },

  characterCount: {
    color: "#9A9F9B",
    fontSize: 8,
    textAlign: "right",
    marginTop: 5,
  },

  safetyCard: {
    marginTop: 13,
    backgroundColor: "#173F2A",
    borderRadius: 21,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  safetyIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  safetyEmoji: {
    fontSize: 18,
  },

  safetyTextArea: {
    flex: 1,
  },

  safetyLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  safetyTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  safetyText: {
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

  privacyDescription: {
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
