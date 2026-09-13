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

type Country =
  | "united-states"
  | "somalia"
  | "kenya"
  | "canada"
  | "united-kingdom"
  | "other";

type Budget = "affordable" | "medium" | "flexible";

const countryOptions = [
  {
    id: "united-states" as Country,
    emoji: "🇺🇸",
    title: "United States",
  },
  {
    id: "somalia" as Country,
    emoji: "🇸🇴",
    title: "Somalia",
  },
  {
    id: "kenya" as Country,
    emoji: "🇰🇪",
    title: "Kenya",
  },
  {
    id: "canada" as Country,
    emoji: "🇨🇦",
    title: "Canada",
  },
  {
    id: "united-kingdom" as Country,
    emoji: "🇬🇧",
    title: "United Kingdom",
  },
  {
    id: "other" as Country,
    emoji: "🌍",
    title: "Meel kale",
  },
];

const citySuggestions: Record<Country, string[]> = {
  "united-states": [
    "Minneapolis",
    "St. Cloud",
    "Seattle",
    "Columbus",
    "Atlanta",
  ],

  somalia: ["Mogadishu", "Hargeisa", "Bosaso", "Kismayo", "Garowe"],

  kenya: ["Nairobi", "Mombasa", "Garissa", "Eastleigh"],

  canada: ["Toronto", "Ottawa", "Edmonton", "Calgary"],

  "united-kingdom": ["London", "Birmingham", "Leicester", "Manchester"],

  other: [],
};
const budgetOptions = [
  {
    id: "affordable" as Budget,
    emoji: "💚",
    title: "Qiimo jaban",
    description:
      "Waxaan rabaa cuntooyin caafimaad leh oo miisaaniyad yar ku shaqeeya.",
  },
  {
    id: "medium" as Budget,
    emoji: "🛒",
    title: "Dhexdhexaad",
    description:
      "Waxaan rabaa isku dheelitirnaan u dhexeysa qiimaha iyo kala duwanaanta.",
  },
  {
    id: "flexible" as Budget,
    emoji: "✨",
    title: "Miisaaniyad dabacsan",
    description: "Qiimuhu ma aha waxa ugu muhiimsan marka aan cunto dooranayo.",
  },
];

export default function OnboardingFoodAccessScreen() {
  const params = useLocalSearchParams();

  const name = typeof params.name === "string" ? params.name : "";

  const [country, setCountry] = useState<Country | null>(null);

  const [city, setCity] = useState("");

  const [budget, setBudget] = useState<Budget | null>(null);

  const selectedCountry = countryOptions.find((item) => item.id === country);

  const selectedBudget = budgetOptions.find((item) => item.id === budget);

  const suggestedCities = country ? citySuggestions[country] : [];

  const canContinue = Boolean(selectedCountry) && Boolean(selectedBudget);

  const continueNext = () => {
    if (!selectedCountry || !selectedBudget) return;

    Keyboard.dismiss();

    router.push({
      // Temporary until the next onboarding screen is built.
      pathname: "/onboarding-summary",
      params: {
        ...params,

        country: selectedCountry.title,
        countryCode: selectedCountry.id,

        city: city.trim(),

        budget: selectedBudget.id,
        budgetLabel: selectedBudget.title,
      },
    });
  };

  const getCoachMessage = () => {
    if (!selectedCountry || !selectedBudget) return null;

    if (selectedBudget.id === "affordable") {
      return {
        title: "Cunto caafimaad leh khasab ma aha inay qaali noqoto.",
        text: "CaatoAI wuxuu mudnaan siin doonaa cuntooyin la awoodi karo sida ukun, digir, lentils, tuna, yogurt iyo protein kale oo deegaankaaga laga heli karo.",
      };
    }

    if (selectedBudget.id === "medium") {
      return {
        title: "Waxaan isku dheelitiri doonaa qiimaha iyo nafaqada.",
        text: "CaatoAI wuxuu kuu soo jeedin doonaa cuntooyin sahlan oo protein iyo nafaqo leh iyadoo la tixgelinayo waxa deegaankaaga laga heli karo.",
      };
    }

    return {
      title: "Waxaan kuu samayn karnaa doorashooyin kala duwan.",
      text: "CaatoAI wuxuu qorshahaaga ku dari karaa cuntooyin badan oo kala duwan, laakiin weli wuxuu diiradda saari doonaa waxyaabaha kuu sahlan inaad sii waddo.",
    };
  };

  const coachMessage = getCoachMessage();

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
                Qorshaha cuntadu waa inuu ku shaqeeyaa meesha aad joogto
              </Text>
            </View>
          </View>

          <Text style={styles.smallGreeting}>
            {name ? `${name}, ` : ""}
            aan qorshaha ka dhigno mid noloshaada dhab ahaan ku shaqeeya 💚
          </Text>

          <Text style={styles.title}>
            Xaggee ayaad inta badan{"\n"}
            <Text style={styles.titleHighlight}>cuntada ka iibsataa?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Dalka aad joogto wuxuu naga caawinayaa inaan kuu soo jeedinno
            cuntooyin aad dhab ahaan heli karto.
          </Text>

          {/* Countries */}
          <View style={styles.countryGrid}>
            {countryOptions.map((item) => {
              const selected = country === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setCountry(item.id)}
                  style={[
                    styles.countryCard,
                    selected && styles.countryCardSelected,
                  ]}
                >
                  <Text style={styles.countryEmoji}>{item.emoji}</Text>

                  <Text
                    style={[
                      styles.countryTitle,
                      selected && styles.countryTitleSelected,
                    ]}
                  >
                    {item.title}
                  </Text>

                  {selected ? (
                    <View style={styles.countryCheck}>
                      <Text style={styles.countryCheckText}>✓</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {/* City */}
          {selectedCountry ? (
            <View style={styles.cityCard}>
              <Text style={styles.inputLabel}>Magaaladaada</Text>

              <Text style={styles.optionalText}>Ikhtiyaari</Text>

              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Raadi ama geli magaaladaada"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                style={styles.cityInput}
              />

              {suggestedCities.length > 0 ? (
                <View style={styles.citySuggestions}>
                  {suggestedCities.map((suggestedCity) => {
                    const selected =
                      city.trim().toLowerCase() === suggestedCity.toLowerCase();

                    return (
                      <Pressable
                        key={suggestedCity}
                        onPress={() => {
                          setCity(suggestedCity);
                          Keyboard.dismiss();
                        }}
                        style={[
                          styles.cityChip,
                          selected && styles.cityChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.cityChipText,
                            selected && styles.cityChipTextSelected,
                          ]}
                        >
                          {suggestedCity}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              <Text style={styles.cityHint}>
                Haddii magaaladaadu liiska ku jirin, magaca magaalada si toos ah
                ayaad u qori kartaa.
              </Text>
            </View>
          ) : null}

          {/* Budget */}
          <View style={styles.budgetSection}>
            <Text style={styles.sectionEyebrow}>HAL SU'AAL OO KALE</Text>

            <Text style={styles.sectionTitle}>
              Miisaaniyadda cuntada sidee tahay?
            </Text>

            <Text style={styles.sectionSubtitle}>
              Ma jiro budget sax ama khalad ah. Waxaan rabnaa qorshe aad awoodi
              karto inaad sii waddo.
            </Text>

            <View style={styles.budgetOptions}>
              {budgetOptions.map((item) => {
                const selected = budget === item.id;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setBudget(item.id)}
                    style={[
                      styles.budgetCard,
                      selected && styles.budgetCardSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.budgetIcon,
                        selected && styles.budgetIconSelected,
                      ]}
                    >
                      <Text style={styles.budgetEmoji}>{item.emoji}</Text>
                    </View>

                    <View style={styles.budgetTextArea}>
                      <Text
                        style={[
                          styles.budgetTitle,
                          selected && styles.budgetTitleSelected,
                        ]}
                      >
                        {item.title}
                      </Text>

                      <Text style={styles.budgetDescription}>
                        {item.description}
                      </Text>
                    </View>

                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Personalized response */}
          {coachMessage ? (
            <View style={styles.responseCard}>
              <Text style={styles.responseEmoji}>✨</Text>

              <View style={styles.responseTextArea}>
                <Text style={styles.responseTitle}>{coachMessage.title}</Text>

                <Text style={styles.responseText}>{coachMessage.text}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.exampleCard}>
            <Text style={styles.exampleEmoji}>🛒</Text>

            <View style={styles.exampleTextArea}>
              <Text style={styles.exampleTitle}>
                CaatoAI wuxuu ku shaqayn doonaa waxa aad heli karto
              </Text>

              <Text style={styles.exampleText}>
                Tusaale ahaan, qorshahaaga wuxuu isticmaali karaa digir, ukun,
                kalluun, caano fadhi, hilib ama cuntooyin kale iyadoo lagu
                salaynayo meesha aad joogto iyo miisaaniyaddaada.
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
              🔒 Goobtaada saxda ah looma baahna. Dalka iyo magaalada aad
              doorato waxaa loo isticmaalaa oo keliya shakhsiyeynta qorshaha
              cuntada.
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
    width: "94%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#16A34A",
  },

  coachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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

  coachTextArea: {
    flex: 1,
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
    marginBottom: 20,
  },

  countryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  countryCard: {
    width: "48%",
    minHeight: 92,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 13,
    justifyContent: "center",
    position: "relative",
  },

  countryCardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },

  countryEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },

  countryTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
  },

  countryTitleSelected: {
    color: "#14532D",
  },

  countryCheck: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },

  countryCheckText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  cityCard: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 19,
    padding: 15,
  },

  inputLabel: {
    color: "#14532D",
    fontSize: 12,
    fontWeight: "900",
  },

  optionalText: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    marginBottom: 9,
  },

  cityInput: {
    width: "100%",
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: "#D6E8D9",
    borderRadius: 14,
    backgroundColor: "#F9FCF9",
    paddingHorizontal: 14,
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "700",
  },

  cityHint: {
    color: "#9CA3AF",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 8,
  },

  budgetSection: {
    marginTop: 28,
  },

  sectionEyebrow: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 5,
  },

  sectionTitle: {
    color: "#1F2937",
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "900",
    marginBottom: 6,
  },

  sectionSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },

  budgetOptions: {
    gap: 10,
  },

  budgetCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  budgetCardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },

  budgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  budgetIconSelected: {
    backgroundColor: "#DCFCE7",
  },

  budgetEmoji: {
    fontSize: 18,
  },

  budgetTextArea: {
    flex: 1,
    paddingRight: 8,
  },

  budgetTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 3,
  },

  budgetTitleSelected: {
    color: "#14532D",
  },

  budgetDescription: {
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 15,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#16A34A",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
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

  exampleCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    marginTop: 12,
  },

  exampleEmoji: {
    fontSize: 18,
    marginRight: 9,
  },

  exampleTextArea: {
    flex: 1,
  },

  exampleTitle: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },

  exampleText: {
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

  citySuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cityChipSelected: {
    backgroundColor: "#DCFCE7",
    borderColor: "#16A34A",
  },

  cityChipText: {
    color: "#4B5563",
    fontSize: 10,
    fontWeight: "800",
  },

  cityChipTextSelected: {
    color: "#14532D",
  },
});
