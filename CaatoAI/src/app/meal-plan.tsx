import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function MealPlanScreen() {
  const params = useLocalSearchParams();

  const MEAL_TRACKER_KEY = "caatoai-meal-tracker";

  const eatingStyle =
    typeof params.eatingStyle === "string" ? params.eatingStyle : "regular";

  const fastingStartTime =
    typeof params.fastingStartTime === "string"
      ? params.fastingStartTime
      : "12:00";

  const fastingEndTime =
    typeof params.fastingEndTime === "string" ? params.fastingEndTime : "20:00";
  const omadMealTime =
    typeof params.omadMealTime === "string" ? params.omadMealTime : "18:00";

  const getOneHourBefore = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return time;
    }

    const newHour = (hour - 1 + 24) % 24;

    return `${String(newHour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0",
    )}`;
  };

  const fastingDinnerTime = getOneHourBefore(fastingEndTime);
  const [mealsEaten, setMealsEaten] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [proteinConsumed, setProteinConsumed] = useState(0);

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const saved = await AsyncStorage.getItem(MEAL_TRACKER_KEY);

        if (!saved) {
          console.log("No saved meals found");
          return;
        }

        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();

        console.log("Saved meal tracker:", parsed);

        if (parsed.date !== today) {
          await AsyncStorage.removeItem(MEAL_TRACKER_KEY);
          return;
        }

        const savedMeals = {
          breakfast: parsed.meals?.breakfast ?? false,
          lunch: parsed.meals?.lunch ?? false,
          dinner: parsed.meals?.dinner ?? false,
        };

        setMealsEaten(savedMeals);

        let calories = 0;
        let protein = 0;

        if (savedMeals.breakfast) {
          calories += 390;
          protein += 24;
        }

        if (savedMeals.lunch) {
          calories += 420;
          protein += 35;
        }

        if (savedMeals.dinner) {
          calories += 460;
          protein += 42;
        }

        setCaloriesConsumed(calories);
        setProteinConsumed(protein);
      } catch (error) {
        console.log("Meal tracker load error:", error);
      }
    };

    loadMeals();
  }, []);

  const completeMeal = async (
    meal: keyof typeof mealsEaten,
    calories: number,
    protein: number,
  ) => {
    if (mealsEaten[meal]) return;

    const updatedMeals = {
      ...mealsEaten,
      [meal]: true,
    };

    const updatedCalories = caloriesConsumed + calories;
    const updatedProtein = proteinConsumed + protein;

    try {
      const data = {
        date: new Date().toDateString(),
        meals: updatedMeals,
        calories: updatedCalories,
        protein: updatedProtein,
      };

      await AsyncStorage.setItem(MEAL_TRACKER_KEY, JSON.stringify(data));
      console.log("Meal saved:", data);

      setMealsEaten(updatedMeals);
      setCaloriesConsumed(updatedCalories);
      setProteinConsumed(updatedProtein);
    } catch (error) {
      console.log("Meal tracker save error:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.title}>Qorshaha cuntada maanta 🍽️</Text>

        <Text style={styles.subtitle}>
          CaatoAI wuxuu kuu diyaariyay cuntooyin fudud oo kaa caawinaya
          hadafyada calories-ka iyo protein-ka maanta.
        </Text>

        {/* AI COACH */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/ai-coach",
              params,
            })
          }
          style={styles.aiCoachButton}
        >
          <View>
            <Text style={styles.aiCoachTitle}>✨ La hadal CaatoAI</Text>
            <Text style={styles.aiCoachText}>
              U sheeg waxa aad cuntay ama su'aal weydii
            </Text>
          </View>

          <Text style={styles.aiCoachMic}>🎤</Text>
        </Pressable>

        {/* BREAKFAST */}
        {eatingStyle === "regular" && (
          <View style={styles.mealCard}>
            <Image
              source={require("../../assets/images/breakfast.jpg")}
              style={styles.mealImage}
            />

            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <View style={styles.mealHeaderText}>
                  <Text style={styles.mealName}>🌅 Quraac</Text>
                  <Text style={styles.mealMacros}>
                    390 calories • 24g protein
                  </Text>
                </View>

                <View style={styles.timeBadge}>
                  <Text style={styles.time}>8:00 AM</Text>
                </View>
              </View>

              <View style={styles.foodList}>
                <Text style={styles.food}>• ½ cup oats</Text>
                <Text style={styles.food}>• 1 banana</Text>
                <Text style={styles.food}>• 1 cup low-fat milk</Text>
                <Text style={styles.food}>• 2 boiled eggs</Text>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => completeMeal("breakfast", 390, 24)}
                  disabled={mealsEaten.breakfast}
                  style={[
                    styles.doneButton,
                    mealsEaten.breakfast && styles.doneButtonCompleted,
                  ]}
                >
                  <Text style={styles.doneButtonText}>
                    {mealsEaten.breakfast ? "✓ Waa la cunay" : "✓ Waan cunay"}
                  </Text>
                </Pressable>

                <Pressable style={styles.swapButton}>
                  <Text style={styles.swapButtonText}>↻ Beddel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* LUNCH */}
        <View style={styles.mealCard}>
          <Image
            source={require("../../assets/images/lunch.jpg")}
            style={styles.mealImage}
          />

          <View style={styles.mealContent}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderText}>
                <Text style={styles.mealName}>☀️ Qado</Text>
                <Text style={styles.mealMacros}>
                  420 calories • 35g protein
                </Text>
              </View>

              <View style={styles.timeBadge}>
                <Text style={styles.time}>
                  {eatingStyle === "fasting" ? fastingStartTime : "1:00 PM"}
                </Text>
              </View>
            </View>

            <View style={styles.foodList}>
              <Text style={styles.food}>• 1 can tuna</Text>
              <Text style={styles.food}>• Lettuce salad</Text>
              <Text style={styles.food}>• Cucumber</Text>
              <Text style={styles.food}>• Tomato</Text>
              <Text style={styles.food}>• 1 apple</Text>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.doneButton}>
                <Text style={styles.doneButtonText}>✓ Waan cunay</Text>
              </Pressable>

              <Pressable style={styles.swapButton}>
                <Text style={styles.swapButtonText}>↻ Beddel</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* DINNER */}
        <View style={styles.mealCard}>
          <Image
            source={require("../../assets/images/dinner.jpg")}
            style={styles.mealImage}
          />

          <View style={styles.mealContent}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderText}>
                <Text style={styles.mealName}>🌙 Casho</Text>

                <Text style={styles.mealMacros}>
                  460 calories • 42g protein
                </Text>
              </View>

              <View style={styles.timeBadge}>
                <Text style={styles.time}>
                  {eatingStyle === "fasting" ? fastingDinnerTime : "6:30 PM"}
                </Text>
              </View>
            </View>

            <View style={styles.foodList}>
              <Text style={styles.food}>• 5 oz grilled chicken</Text>
              <Text style={styles.food}>• ½ cup rice</Text>
              <Text style={styles.food}>• 1 cup vegetables</Text>
              <Text style={styles.food}>• Small salad</Text>
            </View>

            <View style={styles.actions}>
              <Pressable style={styles.doneButton}>
                <Text style={styles.doneButtonText}>✓ Waan cunay</Text>
              </Pressable>

              <Pressable style={styles.swapButton}>
                <Text style={styles.swapButtonText}>↻ Beddel</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* GREEN TEA */}
        <View style={styles.teaCard}>
          <View>
            <Text style={styles.teaTitle}>🍵 Green Tea</Text>
            <Text style={styles.teaText}>
              Haddii aad jeceshahay, cab 1 koob maanta.
            </Text>
          </View>

          <Pressable style={styles.teaButton}>
            <Text style={styles.teaButtonText}>✓ Waan cabay</Text>
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hadafka cuntada maanta</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🔥 Calories</Text>
            <Text style={styles.summaryValue}>{caloriesConsumed} / 1400</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>💪 Protein</Text>
            <Text style={styles.summaryValue}>{proteinConsumed}g / 114g</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    maxWidth: 650,
    width: "100%",
    alignSelf: "center",
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 8,
  },

  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#6D28D9",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 22,
  },

  teaCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teaTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#166534",
    marginBottom: 4,
  },

  teaText: {
    fontSize: 12,
    color: "#4B5563",
    maxWidth: 220,
  },

  teaButton: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },

  teaButtonText: {
    color: "#166534",
    fontWeight: "800",
    fontSize: 12,
  },

  summaryCard: {
    backgroundColor: "#F3E8FF",
    borderRadius: 18,
    padding: 17,
    marginTop: 4,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#6D28D9",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#4B5563",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#BE185D",
  },

  mealCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 22,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },

  mealImage: {
    width: 145,
    height: 145,
    borderRadius: 16,
    marginLeft: 12,
    marginVertical: 12,
    resizeMode: "cover",
  },

  mealContent: {
    flex: 1,
    padding: 15,
  },

  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  mealHeaderText: {
    flex: 1,
    paddingRight: 6,
  },

  mealName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3B0764",
    marginBottom: 4,
  },

  mealMacros: {
    fontSize: 13,
    fontWeight: "800",
    color: "#DB2777",
  },

  timeBadge: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
  },

  time: {
    fontSize: 12,
    fontWeight: "800",
    color: "#7C3AED",
  },

  foodList: {
    gap: 5,
    marginTop: 6,
    marginBottom: 14,
  },

  food: {
    fontSize: 14,
    lineHeight: 19,
    color: "#4B5563",
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
  },

  doneButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: "center",
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  doneButtonCompleted: {
    backgroundColor: "#16A34A",
  },

  swapButton: {
    flex: 1,
    backgroundColor: "#FCE7F3",
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: "center",
  },

  swapButtonText: {
    color: "#BE185D",
    fontWeight: "900",
    fontSize: 13,
  },

  aiCoachButton: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  aiCoachTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#6D28D9",
    marginBottom: 4,
  },

  aiCoachText: {
    fontSize: 12,
    color: "#6B7280",
  },

  aiCoachMic: {
    fontSize: 26,
  },
});
