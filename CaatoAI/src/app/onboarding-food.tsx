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

type FoodPreference =
  | "somali"
  | "high-protein"
  | "healthy-simple"
  | "mixed"
  | "vegetarian"
  | "other";

const FOOD_OPTIONS: {
  id: FoodPreference;
  emoji: string;
  title: string;
  description: string;
}[] = [
  {
    id: "somali",
    emoji: "🍚",
    title: "Cunto Soomaali ah",
    description:
      "Bariis, baasto, canjeero, hilib, maraq iyo cuntooyinka aad taqaan.",
  },
  {
    id: "high-protein",
    emoji: "🍗",
    title: "Protein badan",
    description:
      "Digaag, hilib, kalluun, ukun, tuna iyo cuntooyin protein badan leh.",
  },
  {
    id: "healthy-simple",
    emoji: "🥗",
    title: "Cunto fudud oo caafimaad leh",
    description: "Cuntooyin sahlan, nafaqo leh oo aan waqti badan qaadan.",
  },
  {
    id: "mixed",
    emoji: "🌍",
    title: "Cuntooyin kala duwan",
    description: "Somali, American iyo cuntooyin kale oo kala duwan.",
  },
  {
    id: "vegetarian",
    emoji: "🥦",
    title: "Vegetarian",
    description: "Waxaan doorbidaa cunto aan hilib lahayn.",
  },

  {
    id: "other",
    emoji: "✍️",
    title: "Wax kale",
    description: "Waxaan leeyahay doorashooyin kale oo aan rabo inaan sheego.",
  },
];

export default function OnboardingFoodScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [selectedFoods, setSelectedFoods] = useState<FoodPreference[]>([]);
  const [otherFood, setOtherFood] = useState("");

  const toggleFood = (id: FoodPreference) => {
    setSelectedFoods((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  const canContinue =
    selectedFoods.length > 0 &&
    (!selectedFoods.includes("other") || otherFood.trim().length > 0);

  const continueNext = () => {
    if (!canContinue) return;

    const foodLabels = FOOD_OPTIONS.filter((option) =>
      selectedFoods.includes(option.id),
    ).map((option) =>
      option.id === "other" && otherFood.trim()
        ? otherFood.trim()
        : option.title,
    );

    router.push({
      pathname: "/onboarding-dietary",
      params: {
        ...params,
        foodPreferences: selectedFoods.join(","),
        foodPreferenceLabels: foodLabels.join("|"),
        otherFood: otherFood.trim(),
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
              Aan baranno cuntada noloshaada ku habboon
            </Text>
          </View>
        </View>

        {/* PERSONAL MESSAGE */}

        {name ? (
          <View style={styles.personalCard}>
            <Text style={styles.personalEmoji}>💚</Text>

            <Text style={styles.personalText}>
              {name}, qorshahaagu waa inuu ku shaqeeyaa cuntada aad jeceshahay —
              ma aha inuu kaa mamnuuco wax walba.
            </Text>
          </View>
        ) : null}

        {/* HERO */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>CUNTOOYINKAAGA</Text>
          </View>

          <Text style={styles.title}>
            Cunto noocee ah ayaad{"\n"}
            <Text style={styles.titleGreen}>inta badan jeceshahay?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Waxaad dooran kartaa wax ka badan hal. CaatoAI wuxuu isku dayi
            doonaa inuu qorshahaaga ku daro cuntooyinka aad dhab ahaan
            jeceshahay.
          </Text>

          <View style={styles.multiBadge}>
            <Text style={styles.multiBadgeText}>
              ✓ Waxaad dooran kartaa dhowr
            </Text>
          </View>
        </View>

        {/* OPTIONS */}

        <View style={styles.optionsArea}>
          {FOOD_OPTIONS.map((option) => {
            const selected = selectedFoods.includes(option.id);

            return (
              <Pressable
                key={option.id}
                onPress={() => toggleFood(option.id)}
                style={({ pressed }) => [
                  styles.optionCard,
                  selected && styles.optionCardSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <View
                  style={[
                    styles.optionIcon,
                    selected && styles.optionIconSelected,
                  ]}
                >
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                <View
                  style={[styles.checkBox, selected && styles.checkBoxSelected]}
                >
                  {selected && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* OTHER */}

        {selectedFoods.includes("other") && (
          <View style={styles.otherCard}>
            <Text style={styles.otherLabel}>
              Maxaad jeclaan lahayd inaan ogaano?
            </Text>

            <TextInput
              value={otherFood}
              onChangeText={setOtherFood}
              placeholder="Tusaale: cunto gaar ah oo aan jeclahay..."
              placeholderTextColor="#9A9F9B"
              style={styles.otherInput}
              multiline
              maxLength={150}
            />

            <Text style={styles.characterCount}>{otherFood.length}/150</Text>
          </View>
        )}

        {/* NO BAD FOOD */}

        <View style={styles.noBadFoodCard}>
          <View style={styles.noBadFoodIcon}>
            <Text style={styles.noBadFoodEmoji}>🍽️</Text>
          </View>

          <View style={styles.noBadFoodTextArea}>
            <Text style={styles.noBadFoodLabel}>CAATOAI</Text>

            <Text style={styles.noBadFoodTitle}>Ma jiro cunto “xun.”</Text>

            <Text style={styles.noBadFoodText}>
              Ujeeddadu ma aha inaad iska dayso bariiska, baastada, canjeerada
              ama cuntada aad jeceshahay. Waxaan baran doonaa portions, balance
              iyo sida cuntadu uga mid noqon karto qorshahaaga.
            </Text>
          </View>
        </View>

        {/* PLAN EXPLANATION */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoEmoji}>🧠</Text>
          </View>

          <View style={styles.infoTextArea}>
            <Text style={styles.infoTitle}>Maxaan tan kuu weydiinaynaa?</Text>

            <Text style={styles.infoText}>
              Qorshe aad neceb tahay way adag tahay inaad sii waddo. Waxaan
              rabnaa inaan ku dhisno qorshahaaga cunto aad heli karto, aad
              jeceshahay, oo noloshaada ku shaqaysa.
            </Text>
          </View>
        </View>

        {/* NEXT PREVIEW */}

        <View style={styles.nextCard}>
          <Text style={styles.nextEmoji}>→</Text>

          <View style={styles.nextTextArea}>
            <Text style={styles.nextLabel}>TALLAABADA XIGTA</Text>

            <Text style={styles.nextTitle}>Waxyaabaha aad iska ilaaliso</Text>

            <Text style={styles.nextText}>
              Marka xigta waxaan ku weydiin doonaa allergies, dietary
              restrictions iyo cuntooyinka aadan cunin.
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
            💚 Qorshahaaga cuntada waxaa lagu dhisi doonaa doorashooyinkaaga, ma
            aha cunto qof kale loo sameeyay.
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
    width: "62%",
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
    letterSpacing: 0.9,
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

  noBadFoodCard: {
    marginTop: 13,
    backgroundColor: "#173F2A",
    borderRadius: 21,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  noBadFoodIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: "#28563A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  noBadFoodEmoji: {
    fontSize: 19,
  },

  noBadFoodTextArea: {
    flex: 1,
  },

  noBadFoodLabel: {
    color: "#9FC0A7",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.9,
    marginBottom: 3,
  },

  noBadFoodTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  noBadFoodText: {
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

  nextCard: {
    marginTop: 11,
    backgroundColor: "#F3F1EA",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  nextEmoji: {
    color: "#4F7C5B",
    fontSize: 19,
    fontWeight: "900",
    marginRight: 10,
  },

  nextTextArea: {
    flex: 1,
  },

  nextLabel: {
    color: "#7B8B7E",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 3,
  },

  nextTitle: {
    color: "#35473A",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 3,
  },

  nextText: {
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
