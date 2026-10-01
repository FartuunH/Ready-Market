import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type FoodStatus = "none" | "have" | "buy";

type FoodItem = {
  id: string;

  name: string;

  status: FoodStatus;
};

type FoodSection = {
  id: string;

  title: string;

  emoji: string;

  foods: FoodItem[];
};

const STORAGE_KEY = "caatoai-weekly-food-selection";
const CARB_STYLE_KEY = "caatoai-weekly-carb-style";
const WEEK_SETUP_KEY = "caatoai-weekly-setup-v1";

const DEFAULT_SECTIONS: FoodSection[] = [
  {
    id: "protein",

    title: "Protein",

    emoji: "🥩",

    foods: [
      { id: "chicken", name: "Digaag", status: "none" },

      { id: "eggs", name: "Ukun", status: "none" },

      { id: "tuna", name: "Tuunno", status: "none" },

      { id: "fish", name: "Kalluun", status: "none" },

      { id: "beef", name: "Hilib lo'aad", status: "none" },

      { id: "turkey", name: "Turkey", status: "none" },

      { id: "beans", name: "Digir / misir", status: "none" },
    ],
  },

  {
    id: "vegetables",

    title: "Khudaar",

    emoji: "🥬",

    foods: [
      { id: "broccoli", name: "Broccoli", status: "none" },

      { id: "spinach", name: "Isbinaaj", status: "none" },

      { id: "cucumber", name: "Qajaar", status: "none" },

      { id: "tomato", name: "Yaanyo", status: "none" },

      { id: "cabbage", name: "Kaabash", status: "none" },

      { id: "carrot", name: "Karootada", status: "none" },

      { id: "zucchini", name: "Zucchini", status: "none" },
    ],
  },

  {
    id: "fruit",

    title: "Miro",

    emoji: "🍎",

    foods: [
      { id: "apple", name: "Tufaax", status: "none" },

      { id: "banana", name: "Moos", status: "none" },

      { id: "berries", name: "Berry", status: "none" },

      { id: "orange", name: "Liin macaan", status: "none" },

      { id: "avocado", name: "Avocado", status: "none" },
    ],
  },

  {
    id: "carbs",

    title: "Carbs",

    emoji: "🌾",

    foods: [
      { id: "rice", name: "Bariis", status: "none" },

      { id: "oats", name: "Boorash oats", status: "none" },

      { id: "potato", name: "Baradho", status: "none" },

      { id: "pasta", name: "Baasto qamadi-dhan", status: "none" },

      { id: "bread", name: "Rooti qamadi-dhan", status: "none" },
    ],
  },

  {
    id: "dairy",

    title: "Caano & Dairy",

    emoji: "🥛",

    foods: [
      { id: "greek-yogurt", name: "Yoogurt Giriig", status: "none" },

      { id: "cottage-cheese", name: "Cottage cheese", status: "none" },

      { id: "milk", name: "Caano", status: "none" },
    ],
  },
];

export default function WeeklyFoodSetupScreen() {
  const params = useLocalSearchParams();
  const [sections, setSections] = useState<FoodSection[]>(DEFAULT_SECTIONS);

  const [customFood, setCustomFood] = useState("");

  const [showCustomFood, setShowCustomFood] = useState(false);

  const [customCategory, setCustomCategory] = useState("protein");

  const [customStatus, setCustomStatus] = useState<FoodStatus>("have");
  const [carbStyle, setCarbStyle] = useState("low-carb");

  useEffect(() => {
    loadSavedFoods();
  }, []);

  async function loadSavedFoods() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const savedCarbStyle = await AsyncStorage.getItem(CARB_STYLE_KEY);
      if (savedCarbStyle) setCarbStyle(savedCarbStyle);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setSections(parsed);
        }
      }
    } catch (error) {
      console.log("Weekly food load error:", error);
    }
  }

  function nextStatus(status: FoodStatus): FoodStatus {
    if (status === "none") return "have";

    if (status === "have") return "buy";

    return "none";
  }

  function changeFoodStatus(sectionId: string, foodId: string) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,

          foods: section.foods.map((food) =>
            food.id === foodId
              ? {
                  ...food,

                  status: nextStatus(food.status),
                }
              : food,
          ),
        };
      }),
    );
  }

  function addCustomFood() {
    const name = customFood.trim();
    if (!name) return;

    const id = `custom-${Date.now()}`;
    setSections((current) =>
      current.map((section) =>
        section.id === customCategory
          ? {
              ...section,
              foods: [...section.foods, { id, name, status: customStatus }],
            }
          : section,
      ),
    );
    setCustomFood("");
    setShowCustomFood(false);
  }

  const selectedCount = sections.reduce(
    (total, section) =>
      total + section.foods.filter((food) => food.status !== "none").length,

    0,
  );

  async function saveAndContinue() {
    try {
      const selectedFoods = sections.flatMap((section) =>
        section.foods
          .filter((food) => food.status !== "none")
          .map((food) => ({
            id: food.id,
            name: food.name,
            category: section.id,
            status: food.status,
          })),
      );

      const now = new Date();
      const day = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((day + 6) % 7));
      const weekId = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;

      await AsyncStorage.multiSet([
        [STORAGE_KEY, JSON.stringify(sections)],
        [CARB_STYLE_KEY, carbStyle],
        ["caatoai-last-planned-week", weekId],
        [
          WEEK_SETUP_KEY,
          JSON.stringify({
            weekId,
            updatedAt: now.toISOString(),
            selectedFoods,
            carbStyle,
          }),
        ],
      ]);

      router.replace({
        pathname: "/meal-plan",
        params: { ...params, carbStyle, weeklySetup: "ready" },
      });
    } catch (error) {
      console.log("Weekly food save error:", error);
    }
  }

  function getStatusText(status: FoodStatus) {
    if (status === "have") {
      return "🏠 Waan hayaa";
    }

    if (status === "buy") {
      return "🛒 Waan iibsan karaa";
    }

    return "○ Dooro";
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.eyebrow}>CAATOAI • QORSHAHA TODDOBAADKA</Text>

        <Text style={styles.title}>Maxaad haysataa toddobaadkan? 🛒</Text>

        <Text style={styles.subtitle}>
          Dooro cuntooyinka aad guriga ku haysato ama aad iibsan karto. CaatoAI
          wuxuu ku isticmaali doonaa qorshaha cuntada toddobaadkan.
        </Text>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Sida loo doorto</Text>

          <Text style={styles.helpText}>Taabo cuntada si aad u beddesho:</Text>

          <View style={styles.legendRow}>
            <Text style={styles.legend}>○ Dooro</Text>

            <Text style={styles.legend}>🏠 Waan hayaa</Text>

            <Text style={styles.legend}>🛒 Waan iibsan karaa</Text>
          </View>
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>{section.emoji}</Text>

              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.foodGrid}>
              {section.foods.map((food) => (
                <Pressable
                  key={food.id}
                  onPress={() => changeFoodStatus(section.id, food.id)}
                  style={[
                    styles.foodCard,

                    food.status === "have" && styles.foodCardHave,

                    food.status === "buy" && styles.foodCardBuy,
                  ]}
                >
                  <Text style={styles.foodName}>{food.name}</Text>

                  <Text
                    style={[
                      styles.foodStatus,

                      food.status !== "none" && styles.foodStatusSelected,
                    ]}
                  >
                    {getStatusText(food.status)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {!showCustomFood ? (
          <Pressable
            onPress={() => setShowCustomFood(true)}
            style={styles.addFoodButton}
          >
            <Text style={styles.addFoodButtonText}>+ Ku dar cunto kale</Text>
          </Pressable>
        ) : (
          <View style={styles.customCard}>
            <Text style={styles.customTitle}>Ku dar cunto kale</Text>

            <Text style={styles.customLabel}>
              Qaybtee ayay ka tirsan tahay?
            </Text>

            <View style={styles.customOptions}>
              {[
                { id: "protein", label: "🥩 Protein" },

                { id: "vegetables", label: "🥬 Khudaar" },

                { id: "fruit", label: "🍎 Miro" },

                { id: "carbs", label: "🌾 Carbs" },

                { id: "dairy", label: "🥛 Dairy" },
              ].map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setCustomCategory(item.id)}
                  style={[
                    styles.optionChip,

                    customCategory === item.id && styles.optionChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionChipText,

                      customCategory === item.id &&
                        styles.optionChipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.customLabel}>
              Ma haysataa mise waad iibsan kartaa?
            </Text>

            <View style={styles.customOptions}>
              <Pressable
                onPress={() => setCustomStatus("have")}
                style={[
                  styles.optionChip,

                  customStatus === "have" && styles.optionChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,

                    customStatus === "have" && styles.optionChipTextSelected,
                  ]}
                >
                  🏠 Waan hayaa
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setCustomStatus("buy")}
                style={[
                  styles.optionChip,

                  customStatus === "buy" && styles.optionChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,

                    customStatus === "buy" && styles.optionChipTextSelected,
                  ]}
                >
                  🛒 Waan iibsan karaa
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={customFood}
              onChangeText={setCustomFood}
              placeholder="Tusaale: shrimp"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />

            <View style={styles.customButtons}>
              <Pressable
                onPress={() => {
                  setShowCustomFood(false);

                  setCustomFood("");
                }}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Jooji</Text>
              </Pressable>

              <Pressable onPress={addCustomFood} style={styles.saveFoodButton}>
                <Text style={styles.saveFoodButtonText}>Ku dar</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.carbCard}>
          <Text style={styles.carbTitle}>Carbs-ka toddobaadkan 🌿</Text>
          <Text style={styles.carbSubtitle}>
            Dooro sida aad rabto in CaatoAI u habeeyo carbs-ka qorshahaaga.
          </Text>
          {[
            {
              id: "balanced",
              title: "🥗 Caadi",
              text: "Carbs dheellitiran oo qayb ka ah qorshaha.",
            },
            {
              id: "low-carb",
              title: "🌿 Carbs yar",
              text: "Bariis, baasto, rooti iyo baradho waa la yareeyaa.",
            },
            {
              id: "very-low-carb",
              title: "🥩 Carbs aad u yar",
              text: "Qorshuhu wuxuu xoogga saaraa protein iyo khudaar; carbs-ka si weyn ayaa loo yareeyaa.",
            },
          ].map((option) => (
            <Pressable
              key={option.id}
              onPress={() => setCarbStyle(option.id)}
              style={[
                styles.carbOption,
                carbStyle === option.id && styles.carbOptionSelected,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  carbStyle === option.id && styles.radioOuterSelected,
                ]}
              >
                {carbStyle === option.id ? (
                  <View style={styles.radioInner} />
                ) : null}
              </View>
              <View style={styles.carbOptionTextWrap}>
                <Text style={styles.carbOptionTitle}>{option.title}</Text>
                <Text style={styles.carbOptionText}>{option.text}</Text>
              </View>
            </Pressable>
          ))}
          <Text style={styles.carbNote}>
            CaatoAI weli wuxuu ilaalinayaa calories-ka, protein-ka iyo nafaqo ku
            filan.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{selectedCount}</Text>

          <Text style={styles.summaryText}>
            cunto ayaa loo doortay toddobaadkan
          </Text>
        </View>

        <Pressable
          onPress={() => {
            console.log("WEEKLY PLAN BUTTON CLICKED");
            saveAndContinue();
          }}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>
            Samee qorshahayga toddobaadka →
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Waxaad mar kasta dib u beddeli kartaa cuntooyinka toddobaadka.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFBF5",
  },

  content: {
    width: "100%",

    maxWidth: 700,

    alignSelf: "center",

    paddingHorizontal: 22,

    paddingTop: 18,

    paddingBottom: 60,
  },

  backButton: {
    alignSelf: "flex-start",

    paddingVertical: 8,

    paddingRight: 20,

    marginBottom: 8,
  },

  backText: {
    color: "#166534",

    fontSize: 16,

    fontWeight: "800",
  },

  eyebrow: {
    color: "#15803D",

    fontSize: 11,

    fontWeight: "900",

    letterSpacing: 1,

    marginBottom: 8,
  },

  title: {
    color: "#1F2937",

    fontSize: 28,

    lineHeight: 35,

    fontWeight: "900",
  },

  subtitle: {
    color: "#6B7280",

    fontSize: 14,

    lineHeight: 21,

    marginTop: 8,

    marginBottom: 18,
  },

  helpCard: {
    backgroundColor: "#F0FDF4",

    borderWidth: 1,

    borderColor: "#BBF7D0",

    borderRadius: 20,

    padding: 16,

    marginBottom: 18,
  },

  helpTitle: {
    color: "#166534",

    fontSize: 15,

    fontWeight: "900",
  },

  helpText: {
    color: "#4B5563",

    fontSize: 12,

    marginTop: 5,

    marginBottom: 10,
  },

  legendRow: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 8,
  },

  legend: {
    color: "#166534",

    fontSize: 11,

    fontWeight: "800",

    backgroundColor: "#FFFFFF",

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 999,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 22,

    padding: 17,

    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 13,
  },

  sectionEmoji: {
    fontSize: 22,

    marginRight: 8,
  },

  sectionTitle: {
    color: "#1F2937",

    fontSize: 18,

    fontWeight: "900",
  },

  foodGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 9,
  },

  foodCard: {
    width: "48%",

    minHeight: 72,

    backgroundColor: "#FAFAF9",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 15,

    padding: 12,

    justifyContent: "center",
  },

  foodCardHave: {
    backgroundColor: "#F0FDF4",

    borderColor: "#86EFAC",
  },

  foodCardBuy: {
    backgroundColor: "#FFF7ED",

    borderColor: "#FDBA74",
  },

  foodName: {
    color: "#1F2937",

    fontSize: 13,

    fontWeight: "900",
  },

  foodStatus: {
    color: "#9CA3AF",

    fontSize: 10,

    fontWeight: "700",

    marginTop: 6,
  },

  foodStatusSelected: {
    color: "#166534",
  },

  addFoodButton: {
    borderWidth: 1,

    borderColor: "#86EFAC",

    borderStyle: "dashed",

    borderRadius: 16,

    paddingVertical: 14,

    alignItems: "center",

    marginTop: 2,

    marginBottom: 16,
  },

  addFoodButtonText: {
    color: "#166534",

    fontSize: 14,

    fontWeight: "900",
  },

  customCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 18,

    padding: 16,

    marginBottom: 16,
  },

  customTitle: {
    color: "#1F2937",

    fontSize: 15,

    fontWeight: "900",

    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FAFAF9",

    borderWidth: 1,

    borderColor: "#D6D3D1",

    borderRadius: 13,

    paddingHorizontal: 13,

    paddingVertical: 12,

    color: "#1F2937",

    fontSize: 14,
  },

  customButtons: {
    flexDirection: "row",

    gap: 9,

    marginTop: 11,
  },

  cancelButton: {
    flex: 1,

    backgroundColor: "#F5F5F4",

    borderRadius: 13,

    paddingVertical: 12,

    alignItems: "center",
  },

  cancelButtonText: {
    color: "#57534E",

    fontWeight: "800",
  },

  saveFoodButton: {
    flex: 1,

    backgroundColor: "#166534",

    borderRadius: 13,

    paddingVertical: 12,

    alignItems: "center",
  },

  saveFoodButtonText: {
    color: "#FFFFFF",

    fontWeight: "900",
  },

  carbCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  carbTitle: { color: "#1F2937", fontSize: 17, fontWeight: "900" },
  carbSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 12,
  },
  carbOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderRadius: 15,
    padding: 12,
    marginBottom: 9,
    backgroundColor: "#FAFAF9",
  },
  carbOptionSelected: { borderColor: "#86EFAC", backgroundColor: "#F0FDF4" },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#A8A29E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
  },
  radioOuterSelected: { borderColor: "#16A34A" },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  carbOptionTextWrap: { flex: 1 },
  carbOptionTitle: { color: "#1F2937", fontSize: 13, fontWeight: "900" },
  carbOptionText: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },
  carbNote: {
    color: "#15803D",
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  summaryCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 17,

    padding: 14,

    marginBottom: 12,
  },

  summaryNumber: {
    color: "#166534",

    fontSize: 24,

    fontWeight: "900",

    marginRight: 8,
  },

  summaryText: {
    flex: 1,

    color: "#6B7280",

    fontSize: 12,

    fontWeight: "700",
  },

  continueButton: {
    backgroundColor: "#166534",

    borderRadius: 17,

    paddingVertical: 16,

    alignItems: "center",
  },

  continueButtonDisabled: {
    opacity: 0.4,
  },

  continueButtonText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "900",
  },

  footerText: {
    color: "#9CA3AF",

    fontSize: 11,

    lineHeight: 17,

    textAlign: "center",

    marginTop: 11,
  },

  customLabel: {
    color: "#57534E",

    fontSize: 12,

    fontWeight: "800",

    marginBottom: 8,

    marginTop: 4,
  },

  customOptions: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 7,

    marginBottom: 14,
  },

  optionChip: {
    backgroundColor: "#F5F5F4",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 999,

    paddingHorizontal: 11,

    paddingVertical: 8,
  },

  optionChipSelected: {
    backgroundColor: "#166534",

    borderColor: "#166534",
  },

  optionChipText: {
    color: "#57534E",

    fontSize: 11,

    fontWeight: "800",
  },

  optionChipTextSelected: {
    color: "#FFFFFF",
  },
});
