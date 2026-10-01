import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useState } from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function MealPlanScreen() {
  const params = useLocalSearchParams();

  const calorieTarget =
    typeof params.calorieTarget === "string"
      ? Number(params.calorieTarget)
      : 1400;

  const proteinTarget =
    typeof params.proteinTarget === "string"
      ? Number(params.proteinTarget)
      : 114;

  const MEAL_TRACKER_KEY = "caatoai-meal-tracker";

  const DAILY_PLAN_KEY = "caatoai-daily-meal-plan-v5";

  const WEEKLY_PLAN_KEY = "caatoai-weekly-meal-plan-v1";

  const PANTRY_KEY = "caatoai-weekly-pantry-v1";

  const WEEKLY_FOOD_SELECTION_KEY = "caatoai-weekly-food-selection";

  const WEEKLY_CARB_STYLE_KEY = "caatoai-weekly-carb-style";

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

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [mealsEaten, setMealsEaten] = useState({
    breakfast: false,

    lunch: false,

    dinner: false,

    snack: false,
  });

  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  const [proteinConsumed, setProteinConsumed] = useState(0);

  const [aiMealPlan, setAiMealPlan] = useState<any>(null);

  const [loadingMealPlan, setLoadingMealPlan] = useState(true);

  const [mealPlanError, setMealPlanError] = useState("");

  const [weeklyMealPlan, setWeeklyMealPlan] = useState<any>(null);

  const [loadingWeeklyPlan, setLoadingWeeklyPlan] = useState(false);

  const [weeklyPlanError, setWeeklyPlanError] = useState("");

  const [breakfastImage, setBreakfastImage] = useState<string | null>(null);

  const [loadingBreakfastImage, setLoadingBreakfastImage] = useState(false);

  const [lunchImage, setLunchImage] = useState<string | null>(null);

  const [loadingLunchImage, setLoadingLunchImage] = useState(false);

  const [dinnerImage, setDinnerImage] = useState<string | null>(null);

  const [loadingDinnerImage, setLoadingDinnerImage] = useState(false);

  const [snackImage, setSnackImage] = useState<string | null>(null);

  const [loadingSnackImage, setLoadingSnackImage] = useState(false);

  const [swappingBreakfast, setSwappingBreakfast] = useState(false);

  const [swappingLunch, setSwappingLunch] = useState(false);

  const [swappingDinner, setSwappingDinner] = useState(false);

  const [swappingSnack, setSwappingSnack] = useState(false);

  const [carbStyle, setCarbStyle] = useState(
    typeof params.carbStyle === "string" ? params.carbStyle : "low-carb",
  );

  // MAIN DASHBOARD: weight progress + daily habits
  const weightUnit = params.weightUnit === "kg" ? "kg" : "lb";
  const startingWeightRaw =
    typeof params.currentWeight === "string"
      ? Number(params.currentWeight)
      : 185;
  const goalWeightRaw =
    typeof params.goalWeight === "string" ? Number(params.goalWeight) : 160;
  const startingWeight = startingWeightRaw > 0 ? startingWeightRaw : 185;
  const goalWeight = goalWeightRaw > 0 ? goalWeightRaw : 160;
  const weightStorageKey = `caatoai-weight-history-${weightUnit}-${startingWeight}-${goalWeight}`;
  const dailyChecksKey = `caatoai-daily-checks-${new Date().toISOString().slice(0, 10)}`;

  const [weightEntries, setWeightEntries] = useState<any[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [showWeightEntry, setShowWeightEntry] = useState(false);
  const [weightError, setWeightError] = useState("");
  const [waterCups, setWaterCups] = useState(0);
  const [steps, setSteps] = useState(0);
  const [dailyChecks, setDailyChecks] = useState({
    meal: false,
    activity: false,
    water: false,
    lesson: false,
  });
  const [weightChartWidth, setWeightChartWidth] = useState(0);

  useEffect(() => {
    const loadDashboardProgress = async () => {
      try {
        const savedWeights = await AsyncStorage.getItem(weightStorageKey);
        const parsedWeights = savedWeights ? JSON.parse(savedWeights) : [];
        setWeightEntries(
          Array.isArray(parsedWeights) && parsedWeights.length
            ? parsedWeights
            : [
                {
                  id: "starting-weight",
                  weight: startingWeight,
                  date: new Date().toISOString(),
                },
              ],
        );

        const savedChecks = await AsyncStorage.getItem(dailyChecksKey);
        if (savedChecks) {
          const parsed = JSON.parse(savedChecks);
          const savedWaterCups = parsed.waterCups ?? 0;
          const savedSteps = parsed.steps ?? 0;
          setDailyChecks({
            meal: parsed.checks?.meal ?? false,
            activity:
              savedSteps >= 5000 ? (parsed.checks?.activity ?? false) : false,
            water:
              savedWaterCups >= 8 ? (parsed.checks?.water ?? false) : false,
            lesson: parsed.checks?.lesson ?? false,
          });
          setWaterCups(savedWaterCups);
          setSteps(savedSteps);
        }
      } catch (error) {
        console.log("Dashboard progress load error:", error);
      }
    };

    loadDashboardProgress();
  }, []);

  const sortedWeightEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const currentWeight = sortedWeightEntries.length
    ? Number(sortedWeightEntries[sortedWeightEntries.length - 1].weight)
    : startingWeight;
  const totalWeightGoal = startingWeight - goalWeight;
  const weightProgress =
    totalWeightGoal > 0
      ? Math.max(
          0,
          Math.min(
            ((startingWeight - currentWeight) / totalWeightGoal) * 100,
            100,
          ),
        )
      : 0;
  const remainingWeight = Math.max(currentWeight - goalWeight, 0);
  const completedToday =
    Number(dailyChecks.meal) +
    Number(dailyChecks.activity) +
    Number(dailyChecks.water) +
    Number(dailyChecks.lesson);

  const weightChartEntries = sortedWeightEntries.slice(-7);
  const weightChartValues = weightChartEntries.map((entry) =>
    Number(entry.weight),
  );
  const weightChartMin = weightChartValues.length
    ? Math.min(...weightChartValues)
    : 0;
  const weightChartMax = weightChartValues.length
    ? Math.max(...weightChartValues)
    : 0;
  const weightChartRange = Math.max(weightChartMax - weightChartMin, 1);
  const weightChartHeight = 92;
  const weightChartPadding = 10;
  const weightChartPoints = weightChartEntries.map((entry, index) => {
    const usableWidth = Math.max(weightChartWidth - weightChartPadding * 2, 0);
    const x =
      weightChartEntries.length <= 1
        ? weightChartPadding + usableWidth / 2
        : weightChartPadding +
          (usableWidth * index) / (weightChartEntries.length - 1);
    const normalized =
      (Number(entry.weight) - weightChartMin) / weightChartRange;
    const y =
      weightChartPadding +
      (1 - normalized) * (weightChartHeight - weightChartPadding * 2);
    return { ...entry, x, y };
  });

  const saveDailyProgress = async (
    checks = dailyChecks,
    water = waterCups,
    nextSteps = steps,
  ) => {
    await AsyncStorage.setItem(
      dailyChecksKey,
      JSON.stringify({ checks, waterCups: water, steps: nextSteps }),
    );
  };

  const saveWeightFromDashboard = async () => {
    const value = Number(newWeight);
    if (!Number.isFinite(value) || value <= 0) {
      setWeightError("Fadlan geli miisaan sax ah.");
      return;
    }
    if (
      (weightUnit === "lb" && (value < 50 || value > 700)) ||
      (weightUnit === "kg" && (value < 20 || value > 320))
    ) {
      setWeightError("Fadlan hubi miisaanka aad gelisay.");
      return;
    }
    const updated = [
      ...weightEntries.filter(
        (entry) =>
          entry.id !== "starting-weight" || entry.weight === startingWeight,
      ),
      {
        id: `weight-${Date.now()}`,
        weight: value,
        date: new Date().toISOString(),
      },
    ];
    setWeightEntries(updated);
    await AsyncStorage.setItem(weightStorageKey, JSON.stringify(updated));
    setNewWeight("");
    setWeightError("");
    setShowWeightEntry(false);
  };

  useEffect(() => {
    const generateMealPlan = async () => {
      try {
        setLoadingMealPlan(true);

        setMealPlanError("");

        const today = new Date().toDateString();

        const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

        if (savedDailyPlan) {
          const parsedDailyPlan = JSON.parse(savedDailyPlan);

          if (parsedDailyPlan.date === today && parsedDailyPlan.meal_plan) {
            console.log("Using saved daily meal plan");

            setAiMealPlan(parsedDailyPlan.meal_plan);

            if (parsedDailyPlan.breakfast_image) {
              setBreakfastImage(parsedDailyPlan.breakfast_image);
            }

            if (parsedDailyPlan.lunch_image) {
              setLunchImage(parsedDailyPlan.lunch_image);
            }

            if (parsedDailyPlan.dinner_image) {
              setDinnerImage(parsedDailyPlan.dinner_image);
            }

            if (parsedDailyPlan.snack_image) {
              setSnackImage(parsedDailyPlan.snack_image);
            }

            setLoadingMealPlan(false);

            return;
          }
        }

        const savedWeeklyFoods = await AsyncStorage.getItem(
          WEEKLY_FOOD_SELECTION_KEY,
        );

        const weeklySections = savedWeeklyFoods
          ? JSON.parse(savedWeeklyFoods)
          : [];

        const weeklyFoods = Array.isArray(weeklySections)
          ? weeklySections.flatMap((section: any) =>
              (section.foods || [])

                .filter((food: any) => food.status !== "none")

                .map((food: any) => food.name),
            )
          : [];

        const savedCarbStyle =
          (await AsyncStorage.getItem(WEEKLY_CARB_STYLE_KEY)) || carbStyle;

        const baseFoodPreferences =
          typeof params.foodPreferenceLabel === "string"
            ? params.foodPreferenceLabel
            : "Somali food, simple meals";

        const weeklyFoodInstruction = weeklyFoods.length
          ? ` Prioritize these foods available this week: ${weeklyFoods.join(", ")}. Carb style: ${savedCarbStyle}.`
          : ` Carb style: ${savedCarbStyle}.`;

        const response = await fetch(
          "http://127.0.0.1:8001/meal-plan/generate",

          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              calorie_target: calorieTarget,

              protein_target: proteinTarget,

              food_preferences: `${baseFoodPreferences}${weeklyFoodInstruction}`,

              food_restrictions:
                typeof params.foodRestrictionLabel === "string"
                  ? params.foodRestrictionLabel
                  : "",

              food_culture:
                typeof params.foodCultureLabel === "string"
                  ? params.foodCultureLabel
                  : "Somali",

              budget:
                typeof params.budgetLabel === "string"
                  ? params.budgetLabel
                  : "flexible",

              location:
                typeof params.location === "string" ? params.location : "",

              eating_style: eatingStyle,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`Meal plan request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("AI MEAL PLAN:", data);

        // BREAKFAST IMAGE

        if (data.meal_plan?.breakfast) {
          try {
            setLoadingBreakfastImage(true);

            const imageResponse = await fetch(
              "http://127.0.0.1:8001/meal-image/generate",

              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  meal_name: data.meal_plan.breakfast.name,

                  meal_items: data.meal_plan.breakfast.items,
                }),
              },
            );

            if (!imageResponse.ok) {
              throw new Error(
                `Breakfast image request failed: ${imageResponse.status}`,
              );
            }

            const imageData = await imageResponse.json();

            if (imageData.image_base64) {
              const generatedBreakfastImage = `data:image/jpeg;base64,${imageData.image_base64}`;

              setBreakfastImage(generatedBreakfastImage);

              await AsyncStorage.setItem(
                DAILY_PLAN_KEY,

                JSON.stringify({
                  date: new Date().toDateString(),

                  meal_plan: data.meal_plan,

                  breakfast_image: generatedBreakfastImage,
                }),
              );

              console.log("Daily meal plan and breakfast image saved");
            }
          } catch (imageError) {
            console.log("Breakfast image error:", imageError);
          } finally {
            setLoadingBreakfastImage(false);
          }
        }

        // LUNCH IMAGE

        if (data.meal_plan?.lunch) {
          try {
            setLoadingLunchImage(true);

            const imageResponse = await fetch(
              "http://127.0.0.1:8001/meal-image/generate",

              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  meal_name: data.meal_plan.lunch.name,

                  meal_items: data.meal_plan.lunch.items,
                }),
              },
            );

            if (!imageResponse.ok) {
              throw new Error(
                `Lunch image request failed: ${imageResponse.status}`,
              );
            }

            const imageData = await imageResponse.json();

            if (imageData.image_base64) {
              const generatedLunchImage = `data:image/jpeg;base64,${imageData.image_base64}`;

              setLunchImage(generatedLunchImage);

              const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

              const parsedDailyPlan = savedDailyPlan
                ? JSON.parse(savedDailyPlan)
                : {
                    date: new Date().toDateString(),

                    meal_plan: data.meal_plan,
                  };

              await AsyncStorage.setItem(
                DAILY_PLAN_KEY,

                JSON.stringify({
                  ...parsedDailyPlan,

                  date: new Date().toDateString(),

                  meal_plan: data.meal_plan,

                  lunch_image: generatedLunchImage,
                }),
              );

              console.log("Lunch image saved");
            }
          } catch (imageError) {
            console.log("Lunch image error:", imageError);
          } finally {
            setLoadingLunchImage(false);
          }
        }

        // DINNER IMAGE

        if (data.meal_plan?.dinner) {
          try {
            setLoadingDinnerImage(true);

            const imageResponse = await fetch(
              "http://127.0.0.1:8001/meal-image/generate",

              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  meal_name: data.meal_plan.dinner.name,

                  meal_items: data.meal_plan.dinner.items,
                }),
              },
            );

            if (!imageResponse.ok) {
              throw new Error(
                `Dinner image request failed: ${imageResponse.status}`,
              );
            }

            const imageData = await imageResponse.json();

            if (imageData.image_base64) {
              const generatedDinnerImage = `data:image/jpeg;base64,${imageData.image_base64}`;

              setDinnerImage(generatedDinnerImage);

              const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

              const parsedDailyPlan = savedDailyPlan
                ? JSON.parse(savedDailyPlan)
                : {
                    date: new Date().toDateString(),

                    meal_plan: data.meal_plan,
                  };

              await AsyncStorage.setItem(
                DAILY_PLAN_KEY,

                JSON.stringify({
                  ...parsedDailyPlan,

                  date: new Date().toDateString(),

                  meal_plan: data.meal_plan,

                  dinner_image: generatedDinnerImage,
                }),
              );

              console.log("Dinner image saved");
            }
          } catch (imageError) {
            console.log("Dinner image error:", imageError);
          } finally {
            setLoadingDinnerImage(false);
          }
        }

        // SNACK IMAGE

        if (data.meal_plan?.snacks?.[0]) {
          try {
            setLoadingSnackImage(true);

            const snack = data.meal_plan.snacks[0];

            const imageResponse = await fetch(
              "http://127.0.0.1:8001/meal-image/generate",

              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify({
                  meal_name: snack.name,

                  meal_items: snack.items,
                }),
              },
            );

            if (!imageResponse.ok) {
              throw new Error(
                `Snack image request failed: ${imageResponse.status}`,
              );
            }

            const imageData = await imageResponse.json();

            if (imageData.image_base64) {
              const generatedSnackImage = `data:image/jpeg;base64,${imageData.image_base64}`;

              setSnackImage(generatedSnackImage);

              const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

              const parsedDailyPlan = savedDailyPlan
                ? JSON.parse(savedDailyPlan)
                : {
                    date: new Date().toDateString(),

                    meal_plan: data.meal_plan,
                  };

              await AsyncStorage.setItem(
                DAILY_PLAN_KEY,

                JSON.stringify({
                  ...parsedDailyPlan,

                  date: new Date().toDateString(),

                  meal_plan: data.meal_plan,

                  snack_image: generatedSnackImage,
                }),
              );

              console.log("Snack image saved");
            }
          } catch (imageError) {
            console.log("Snack image error:", imageError);
          } finally {
            setLoadingSnackImage(false);
          }
        }
      } catch (error) {
        console.log("AI meal plan error:", error);

        setMealPlanError("Qorshaha cuntada lama soo saari karin.");
      } finally {
        setLoadingMealPlan(false);
      }
    };

    generateMealPlan();
  }, []);

  const generateWeeklyMealPlan = async () => {
    try {
      setLoadingWeeklyPlan(true);

      setWeeklyPlanError("");

      const savedPantry = await AsyncStorage.getItem(PANTRY_KEY);

      const pantryMap: Record<string, boolean> = savedPantry
        ? JSON.parse(savedPantry)
        : {};

      const oldPantryItems = Object.entries(pantryMap)

        .filter(([, checked]) => checked)

        .map(([key]) =>
          key.includes("::") ? key.split("::").slice(1).join("::") : key,
        );

      const savedWeeklyFoods = await AsyncStorage.getItem(
        WEEKLY_FOOD_SELECTION_KEY,
      );

      const weeklySections = savedWeeklyFoods
        ? JSON.parse(savedWeeklyFoods)
        : [];

      const selectedWeeklyFoods = Array.isArray(weeklySections)
        ? weeklySections.flatMap((section: any) =>
            (section.foods || [])

              .filter((food: any) => food.status !== "none")

              .map((food: any) => food.name),
          )
        : [];

      const savedCarbStyle =
        (await AsyncStorage.getItem(WEEKLY_CARB_STYLE_KEY)) || carbStyle;

      if (savedCarbStyle !== carbStyle) setCarbStyle(savedCarbStyle);

      const pantryItems = Array.from(
        new Set([...oldPantryItems, ...selectedWeeklyFoods]),
      ).sort();

      const pantrySignature = JSON.stringify(pantryItems);

      const savedWeeklyPlan = await AsyncStorage.getItem(WEEKLY_PLAN_KEY);

      if (savedWeeklyPlan) {
        const parsedWeeklyPlan = JSON.parse(savedWeeklyPlan);

        if (
          parsedWeeklyPlan.start_date === getTodayDate() &&
          parsedWeeklyPlan.carb_style === savedCarbStyle &&
          parsedWeeklyPlan.pantry_signature === pantrySignature &&
          parsedWeeklyPlan.weekly_plan
        ) {
          console.log("Using saved weekly meal plan");

          setWeeklyMealPlan(parsedWeeklyPlan.weekly_plan);

          return;
        }
      }

      console.log("Weekly meal plan start date:", getTodayDate());

      const response = await fetch("http://127.0.0.1:8001/meal-plan/weekly", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          calorie_target: calorieTarget,

          protein_target: proteinTarget,

          food_preferences:
            typeof params.foodPreferenceLabel === "string"
              ? params.foodPreferenceLabel
              : "healthy simple food",

          food_restrictions:
            typeof params.foodRestrictionLabel === "string"
              ? params.foodRestrictionLabel
              : "",

          food_culture:
            typeof params.foodCultureLabel === "string"
              ? params.foodCultureLabel
              : "Somali",

          budget:
            typeof params.budgetLabel === "string"
              ? params.budgetLabel
              : "flexible",

          location: typeof params.location === "string" ? params.location : "",

          eating_style: eatingStyle,

          start_date: getTodayDate(),

          carb_style: savedCarbStyle,

          pantry_items: pantryItems,
        }),
      });

      const data = await response.json();

      console.log("Weekly meal plan response:", data);

      if (response.ok && data.weekly_plan) {
        setWeeklyMealPlan(data.weekly_plan);
      }

      if (response.ok && data.weekly_plan) {
        setWeeklyMealPlan(data.weekly_plan);

        await AsyncStorage.setItem(
          WEEKLY_PLAN_KEY,

          JSON.stringify({
            start_date: getTodayDate(),

            carb_style: savedCarbStyle,

            pantry_signature: pantrySignature,

            weekly_plan: data.weekly_plan,
          }),
        );

        console.log("Weekly meal plan saved");
      }
    } catch (error) {
      console.log("Weekly meal plan error:", error);

      setWeeklyPlanError("Qorshaha toddobaadka lama soo saari karin.");
    } finally {
      setLoadingWeeklyPlan(false);
    }
  };

  useEffect(() => {
    if (params.weeklySetup !== "ready") return;

    const buildWeeklyPlan = async () => {
      console.log("Weekly setup ready — generating weekly plan");

      await generateWeeklyMealPlan();

      router.replace({
        pathname: "/weekly-meal-plan",

        params: {
          ...params,

          weeklySetup: undefined,
        },
      });
    };

    buildWeeklyPlan();
  }, [params.weeklySetup]);

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

          snack: parsed.meals?.snack ?? false,
        };

        setMealsEaten(savedMeals);

        const savedCalories =
          typeof parsed.calories === "number" ? parsed.calories : 0;

        const savedProtein =
          typeof parsed.protein === "number" ? parsed.protein : 0;

        setCaloriesConsumed(savedCalories);

        setProteinConsumed(savedProtein);
      } catch (error) {
        console.log("Meal tracker load error:", error);
      }
    };

    loadMeals();
  }, []);

  // Mark the food goal complete automatically when all meals shown today are eaten.
  useEffect(() => {
    const requiredMeals: (keyof typeof mealsEaten)[] = [];

    if (eatingStyle === "regular" && aiMealPlan?.breakfast) {
      requiredMeals.push("breakfast");
    }
    if (aiMealPlan?.lunch) requiredMeals.push("lunch");
    if (aiMealPlan?.dinner) requiredMeals.push("dinner");
    if (aiMealPlan?.snacks?.[0]) requiredMeals.push("snack");

    if (requiredMeals.length === 0) return;

    const allMealsFinished = requiredMeals.every((meal) => mealsEaten[meal]);
    if (dailyChecks.meal === allMealsFinished) return;

    const next = { ...dailyChecks, meal: allMealsFinished };
    setDailyChecks(next);
    saveDailyProgress(next, waterCups, steps).catch((error) =>
      console.log("Food goal save error:", error),
    );
  }, [
    mealsEaten.breakfast,
    mealsEaten.lunch,
    mealsEaten.dinner,
    mealsEaten.snack,
    aiMealPlan,
    eatingStyle,
  ]);

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

  const swapBreakfast = async () => {
    if (!aiMealPlan?.breakfast || swappingBreakfast) return;

    try {
      setSwappingBreakfast(true);

      // 1. Ask CaatoAI for a different breakfast

      const swapResponse = await fetch("http://127.0.0.1:8001/meal/swap", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          meal_type: "breakfast",

          current_meal_name: aiMealPlan.breakfast.name,

          calorie_target: calorieTarget,

          protein_target: proteinTarget,

          food_preferences: "Somali food, high protein, simple meals",

          food_restrictions: "",

          food_culture: "Somali",

          budget: "flexible",

          location: "St. Cloud, Minnesota",
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Breakfast swap failed: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();

      const newBreakfast = swapData.meal;

      // Keep the normal breakfast time on the app.

      newBreakfast.time = "8:00 AM";

      // 2. Generate an image matching the NEW breakfast

      const imageResponse = await fetch(
        "http://127.0.0.1:8001/meal-image/generate",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            meal_name: newBreakfast.name,

            meal_items: newBreakfast.items,
          }),
        },
      );

      if (!imageResponse.ok) {
        throw new Error(`Breakfast image failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();

      const newBreakfastImage = imageData.image_base64
        ? `data:image/jpeg;base64,${imageData.image_base64}`
        : breakfastImage;

      // 3. Replace ONLY breakfast

      const updatedMealPlan = {
        ...aiMealPlan,

        breakfast: newBreakfast,
      };

      setAiMealPlan(updatedMealPlan);

      if (newBreakfastImage) {
        setBreakfastImage(newBreakfastImage);
      }

      // 4. Save the changed breakfast + image

      const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

      const parsedDailyPlan = savedDailyPlan ? JSON.parse(savedDailyPlan) : {};

      await AsyncStorage.setItem(
        DAILY_PLAN_KEY,

        JSON.stringify({
          ...parsedDailyPlan,

          date: new Date().toDateString(),

          meal_plan: updatedMealPlan,

          breakfast_image: newBreakfastImage,
        }),
      );

      console.log("Breakfast swapped and saved");
    } catch (error) {
      console.log("Breakfast swap error:", error);
    } finally {
      setSwappingBreakfast(false);
    }
  };

  const swapLunch = async () => {
    if (!aiMealPlan?.lunch || swappingLunch) return;

    try {
      setSwappingLunch(true);

      // 1. Ask CaatoAI for a different lunch

      const swapResponse = await fetch("http://127.0.0.1:8001/meal/swap", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          meal_type: "lunch",

          current_meal_name: aiMealPlan.lunch.name,

          calorie_target: calorieTarget,

          protein_target: proteinTarget,

          food_preferences: "Somali food, high protein, simple meals",

          food_restrictions: "",

          food_culture: "Somali",

          budget: "flexible",

          location: "St. Cloud, Minnesota",
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Lunch swap failed: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();

      const newLunch = swapData.meal;

      // Keep the normal lunch time

      newLunch.time = eatingStyle === "fasting" ? fastingStartTime : "1:00 PM";

      // 2. Generate an image matching the NEW lunch

      const imageResponse = await fetch(
        "http://127.0.0.1:8001/meal-image/generate",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            meal_name: newLunch.name,

            meal_items: newLunch.items,
          }),
        },
      );

      if (!imageResponse.ok) {
        throw new Error(`Lunch image failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();

      const newLunchImage = imageData.image_base64
        ? `data:image/jpeg;base64,${imageData.image_base64}`
        : lunchImage;

      // 3. Replace ONLY lunch

      const updatedMealPlan = {
        ...aiMealPlan,

        lunch: newLunch,
      };

      setAiMealPlan(updatedMealPlan);

      if (newLunchImage) {
        setLunchImage(newLunchImage);
      }

      // 4. Save the changed lunch + image

      const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

      const parsedDailyPlan = savedDailyPlan ? JSON.parse(savedDailyPlan) : {};

      await AsyncStorage.setItem(
        DAILY_PLAN_KEY,

        JSON.stringify({
          ...parsedDailyPlan,

          date: new Date().toDateString(),

          meal_plan: updatedMealPlan,

          lunch_image: newLunchImage,
        }),
      );

      console.log("Lunch swapped and saved");
    } catch (error) {
      console.log("Lunch swap error:", error);
    } finally {
      setSwappingLunch(false);
    }
  };

  const swapDinner = async () => {
    if (!aiMealPlan?.dinner || swappingDinner) return;

    try {
      setSwappingDinner(true);

      // 1. Ask CaatoAI for a different dinner

      const swapResponse = await fetch("http://127.0.0.1:8001/meal/swap", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          meal_type: "dinner",

          current_meal_name: aiMealPlan.dinner.name,

          calorie_target: calorieTarget,

          protein_target: proteinTarget,

          food_preferences: "Somali food, high protein, simple meals",

          food_restrictions: "",

          food_culture: "Somali",

          budget: "flexible",

          location: "St. Cloud, Minnesota",
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Dinner swap failed: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();

      const newDinner = swapData.meal;

      // Keep the normal dinner time

      newDinner.time = "6:30 PM";

      // 2. Generate an image matching the NEW dinner

      const imageResponse = await fetch(
        "http://127.0.0.1:8001/meal-image/generate",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            meal_name: newDinner.name,

            meal_items: newDinner.items,
          }),
        },
      );

      if (!imageResponse.ok) {
        throw new Error(`Dinner image failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();

      const newDinnerImage = imageData.image_base64
        ? `data:image/jpeg;base64,${imageData.image_base64}`
        : dinnerImage;

      // 3. Replace ONLY dinner

      const updatedMealPlan = {
        ...aiMealPlan,

        dinner: newDinner,
      };

      setAiMealPlan(updatedMealPlan);

      if (newDinnerImage) {
        setDinnerImage(newDinnerImage);
      }

      // 4. Save the changed dinner + image

      const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

      const parsedDailyPlan = savedDailyPlan ? JSON.parse(savedDailyPlan) : {};

      await AsyncStorage.setItem(
        DAILY_PLAN_KEY,

        JSON.stringify({
          ...parsedDailyPlan,

          date: new Date().toDateString(),

          meal_plan: updatedMealPlan,

          dinner_image: newDinnerImage,
        }),
      );

      console.log("Dinner swapped and saved");
    } catch (error) {
      console.log("Dinner swap error:", error);
    } finally {
      setSwappingDinner(false);
    }
  };

  const swapSnack = async () => {
    if (!aiMealPlan?.snacks?.[0] || swappingSnack) return;

    try {
      setSwappingSnack(true);

      const currentSnack = aiMealPlan.snacks[0];

      // 1. Ask CaatoAI for a different snack

      const swapResponse = await fetch("http://127.0.0.1:8001/meal/swap", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          meal_type: "snack",

          current_meal_name: currentSnack.name,

          calorie_target: calorieTarget,

          protein_target: proteinTarget,

          food_preferences: "Somali food, high protein, simple meals",

          food_restrictions: "",

          food_culture: "Somali",

          budget: "flexible",

          location: "St. Cloud, Minnesota",
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Snack swap failed: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();

      const newSnack = swapData.meal;

      // Keep the current snack time

      newSnack.time = currentSnack.time || "3:30 PM";

      // 2. Generate a matching image

      const imageResponse = await fetch(
        "http://127.0.0.1:8001/meal-image/generate",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            meal_name: newSnack.name,

            meal_items: newSnack.items,
          }),
        },
      );

      if (!imageResponse.ok) {
        throw new Error(`Snack image failed: ${imageResponse.status}`);
      }

      const imageData = await imageResponse.json();

      const newSnackImage = imageData.image_base64
        ? `data:image/jpeg;base64,${imageData.image_base64}`
        : snackImage;

      // 3. Replace ONLY the first snack

      const updatedMealPlan = {
        ...aiMealPlan,

        snacks: [newSnack, ...(aiMealPlan.snacks?.slice(1) || [])],
      };

      setAiMealPlan(updatedMealPlan);

      if (newSnackImage) {
        setSnackImage(newSnackImage);
      }

      // 4. Save the changed snack + image

      const savedDailyPlan = await AsyncStorage.getItem(DAILY_PLAN_KEY);

      const parsedDailyPlan = savedDailyPlan ? JSON.parse(savedDailyPlan) : {};

      await AsyncStorage.setItem(
        DAILY_PLAN_KEY,

        JSON.stringify({
          ...parsedDailyPlan,

          date: new Date().toDateString(),

          meal_plan: updatedMealPlan,

          snack_image: newSnackImage,
        }),
      );

      console.log("Snack swapped and saved");
    } catch (error) {
      console.log("Snack swap error:", error);
    } finally {
      setSwappingSnack(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/meal-plan");
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.title}>Qorshaha cuntada maanta 🍽️</Text>

        <Text style={styles.subtitle}>
          CaatoAI wuxuu kuu diyaariyay cuntooyin fudud oo kaa caawinaya
          hadafyada calories-ka iyo protein-ka maanta.
        </Text>

        <View style={styles.weeklySetupCard}>
          <View style={styles.weeklySetupTop}>
            <View style={styles.weeklySetupIcon}>
              <Text style={styles.weeklySetupIconText}>🛒</Text>
            </View>

            <View style={styles.weeklySetupContent}>
              <Text style={styles.weeklySetupTitle}>Qorshaha toddobaadka</Text>

              <Text style={styles.weeklySetupText}>
                Eeg ama beddel cuntooyinka aad haysato, waxaad iibsan karto iyo
                carbs-ka toddobaadkan.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.weeklySetupButton}
            onPress={() =>
              router.push({
                pathname: "/weekly-food-setup",

                params,
              })
            }
          >
            <Text style={styles.weeklySetupButtonText}>
              Eeg / wax ka beddel toddobaadka →
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/ai-chat",

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

        {eatingStyle === "regular" && (
          <View style={styles.mealCard}>
            <Image
              source={
                breakfastImage
                  ? { uri: breakfastImage }
                  : require("../../assets/images/breakfast.jpg")
              }
              style={styles.mealImage}
            />

            <View style={styles.mealContent}>
              <View style={styles.mealHeader}>
                <View style={styles.mealHeaderText}>
                  <Text style={styles.mealName}>
                    🌅 {aiMealPlan?.breakfast?.name || "Quraac"}
                  </Text>

                  <Text style={styles.mealMacros}>
                    {aiMealPlan?.breakfast?.calories ?? 0} calories •{" "}
                    {aiMealPlan?.breakfast?.protein ?? 0}g protein
                  </Text>
                </View>

                <View style={styles.timeBadge}>
                  <Text style={styles.time}>
                    {aiMealPlan?.breakfast?.time || "8:00 AM"}
                  </Text>
                </View>
              </View>

              <View style={styles.foodList}>
                {loadingMealPlan ? (
                  <Text style={styles.food}>
                    CaatoAI wuxuu diyaarinayaa quraacdaada...
                  </Text>
                ) : mealPlanError ? (
                  <Text style={styles.food}>{mealPlanError}</Text>
                ) : (
                  aiMealPlan?.breakfast?.items?.map(
                    (item: string, index: number) => (
                      <Text key={index} style={styles.food}>
                        • {item}
                      </Text>
                    ),
                  )
                )}
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() =>
                    completeMeal(
                      "breakfast",

                      aiMealPlan?.breakfast?.calories ?? 0,

                      aiMealPlan?.breakfast?.protein ?? 0,
                    )
                  }
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

                <Pressable
                  style={styles.swapButton}
                  onPress={swapBreakfast}
                  disabled={swappingBreakfast}
                >
                  <Text style={styles.swapButtonText}>
                    {swappingBreakfast ? "CaatoAI..." : "↻ Beddel"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={styles.mealCard}>
          <Image
            source={
              lunchImage
                ? { uri: lunchImage }
                : require("../../assets/images/lunch.jpg")
            }
            style={styles.mealImage}
          />

          <View style={styles.mealContent}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderText}>
                <Text style={styles.mealName}>
                  ☀️ {aiMealPlan?.lunch?.name || "Qado"}
                </Text>

                <Text style={styles.mealMacros}>
                  {aiMealPlan?.lunch?.calories ?? 0} calories •{" "}
                  {aiMealPlan?.lunch?.protein ?? 0}g protein
                </Text>
              </View>

              <View style={styles.timeBadge}>
                <Text style={styles.time}>
                  {aiMealPlan?.lunch?.time ||
                    (eatingStyle === "fasting" ? fastingStartTime : "1:00 PM")}
                </Text>
              </View>
            </View>

            <View style={styles.foodList}>
              {loadingMealPlan ? (
                <Text style={styles.food}>
                  CaatoAI wuxuu diyaarinayaa qadadaada...
                </Text>
              ) : mealPlanError ? (
                <Text style={styles.food}>{mealPlanError}</Text>
              ) : (
                aiMealPlan?.lunch?.items?.map((item: string, index: number) => (
                  <Text key={index} style={styles.food}>
                    • {item}
                  </Text>
                ))
              )}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  completeMeal(
                    "lunch",

                    aiMealPlan?.lunch?.calories ?? 0,

                    aiMealPlan?.lunch?.protein ?? 0,
                  )
                }
                disabled={mealsEaten.lunch}
                style={[
                  styles.doneButton,

                  mealsEaten.lunch && styles.doneButtonCompleted,
                ]}
              >
                <Text style={styles.doneButtonText}>
                  {mealsEaten.lunch ? "✓ Waa la cunay" : "✓ Waan cunay"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.swapButton}
                onPress={swapLunch}
                disabled={swappingLunch}
              >
                <Text style={styles.swapButtonText}>
                  {swappingLunch ? "CaatoAI..." : "↻ Beddel"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.mealCard}>
          <Image
            source={
              dinnerImage
                ? { uri: dinnerImage }
                : require("../../assets/images/dinner.jpg")
            }
            style={styles.mealImage}
          />

          <View style={styles.mealContent}>
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderText}>
                <Text style={styles.mealName}>
                  🌙 {aiMealPlan?.dinner?.name || "Casho"}
                </Text>

                <Text style={styles.mealMacros}>
                  {aiMealPlan?.dinner?.calories ?? 0} calories •{" "}
                  {aiMealPlan?.dinner?.protein ?? 0}g protein
                </Text>
              </View>

              <View style={styles.timeBadge}>
                <Text style={styles.time}>
                  {aiMealPlan?.dinner?.time || "6:30 PM"}
                </Text>
              </View>
            </View>

            <View style={styles.foodList}>
              {loadingMealPlan ? (
                <Text style={styles.food}>
                  CaatoAI wuxuu diyaarinayaa cashadaada...
                </Text>
              ) : mealPlanError ? (
                <Text style={styles.food}>{mealPlanError}</Text>
              ) : (
                aiMealPlan?.dinner?.items?.map(
                  (item: string, index: number) => (
                    <Text key={index} style={styles.food}>
                      • {item}
                    </Text>
                  ),
                )
              )}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  completeMeal(
                    "dinner",

                    aiMealPlan?.dinner?.calories ?? 0,

                    aiMealPlan?.dinner?.protein ?? 0,
                  )
                }
                disabled={mealsEaten.dinner}
                style={[
                  styles.doneButton,

                  mealsEaten.dinner && styles.doneButtonCompleted,
                ]}
              >
                <Text style={styles.doneButtonText}>
                  {mealsEaten.dinner ? "✓ Waa la cunay" : "✓ Waan cunay"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.swapButton}
                onPress={swapDinner}
                disabled={swappingDinner}
              >
                <Text style={styles.swapButtonText}>
                  {swappingDinner ? "CaatoAI..." : "↻ Beddel"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {aiMealPlan?.snacks?.[0] && (
          <View style={styles.teaCard}>
            {snackImage && (
              <Image source={{ uri: snackImage }} style={styles.snackImage} />
            )}

            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.teaTitle}>
                🍎 {aiMealPlan.snacks[0].name}
              </Text>

              <Text style={styles.mealMacros}>
                {aiMealPlan.snacks[0].calories} calories •{" "}
                {aiMealPlan.snacks[0].protein}g protein
              </Text>

              {!!aiMealPlan.snacks[0].time && (
                <Text style={styles.teaText}>
                  ⏰ {aiMealPlan.snacks[0].time}
                </Text>
              )}

              <View style={{ marginTop: 8 }}>
                {aiMealPlan.snacks[0].items?.map(
                  (item: string, index: number) => (
                    <Text key={index} style={styles.teaText}>
                      • {item}
                    </Text>
                  ),
                )}
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <Pressable
                style={styles.teaButton}
                onPress={() =>
                  completeMeal(
                    "snack",

                    aiMealPlan?.snacks?.[0]?.calories ?? 0,

                    aiMealPlan?.snacks?.[0]?.protein ?? 0,
                  )
                }
                disabled={mealsEaten.snack}
              >
                <Text style={styles.teaButtonText}>
                  {mealsEaten.snack ? "✓ Waa la cunay" : "✓ Waan cunay"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.teaButton}
                onPress={swapSnack}
                disabled={swappingSnack}
              >
                <Text style={styles.teaButtonText}>
                  {swappingSnack ? "CaatoAI..." : "↻ Beddel"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hadafka cuntada maanta</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🔥 Calories</Text>

            <Text style={styles.summaryValue}>
              {caloriesConsumed} / {calorieTarget}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>💪 Protein</Text>

            <Text style={styles.summaryValue}>
              {proteinConsumed}g / {proteinTarget}g
            </Text>
          </View>
        </View>

        <View style={styles.progressDashboardCard}>
          <View style={styles.progressDashboardHeader}>
            <View>
              <Text style={styles.progressEyebrow}>CAATOAI • SAFARKAAGA</Text>
              <Text style={styles.progressDashboardTitle}>Maanta 🌿</Text>
            </View>
          </View>

          <View style={styles.weightHero}>
            <Text style={styles.weightLabel}>Miisaanka hadda</Text>
            <View style={styles.weightValueRow}>
              <Text style={styles.weightValue}>{currentWeight}</Text>
              <Text style={styles.weightUnitText}>{weightUnit}</Text>
            </View>
            <View style={styles.weightStatsRow}>
              <Text style={styles.weightStat}>
                Bilowga: {startingWeight} {weightUnit}
              </Text>
              <Text style={styles.weightStat}>
                Hadafka: {goalWeight} {weightUnit}
              </Text>
            </View>

            <View style={styles.weightChartSection}>
              <View style={styles.weightChartHeader}>
                <Text style={styles.weightChartTitle}>
                  📈 Horumarka miisaanka
                </Text>
                {weightChartEntries.length > 1 ? (
                  <Text style={styles.weightChartLatest}>
                    {currentWeight} {weightUnit}
                  </Text>
                ) : null}
              </View>
              {weightChartEntries.length > 1 ? (
                <>
                  <View
                    style={styles.weightChart}
                    onLayout={(event) =>
                      setWeightChartWidth(event.nativeEvent.layout.width)
                    }
                  >
                    {weightChartWidth > 0 &&
                      weightChartPoints.slice(0, -1).map((point, index) => {
                        const next = weightChartPoints[index + 1];
                        const dx = next.x - point.x;
                        const dy = next.y - point.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                        return (
                          <View
                            key={`weight-line-${index}`}
                            style={[
                              styles.weightChartLine,
                              {
                                width: length,
                                left: (point.x + next.x) / 2 - length / 2,
                                top: (point.y + next.y) / 2 - 1.5,
                                transform: [{ rotate: `${angle}deg` }],
                              },
                            ]}
                          />
                        );
                      })}
                    {weightChartWidth > 0 &&
                      weightChartPoints.map((point, index) => (
                        <View
                          key={`weight-point-${point.id ?? index}`}
                          style={[
                            styles.weightChartPoint,
                            { left: point.x - 5, top: point.y - 5 },
                          ]}
                        />
                      ))}
                  </View>
                  <View style={styles.weightChartLabels}>
                    <Text style={styles.weightChartLabel}>
                      {new Date(weightChartEntries[0].date).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" },
                      )}
                    </Text>
                    <Text style={styles.weightChartLabel}>
                      {new Date(
                        weightChartEntries[weightChartEntries.length - 1].date,
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.weightChartEmpty}>
                  <View style={styles.weightChartSinglePoint} />
                  <Text style={styles.weightChartEmptyText}>
                    Geli miisaankaaga xiga si aad u aragto isbeddelka.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${weightProgress}%` }]}
              />
            </View>
            <Text style={styles.remainingWeightText}>
              {remainingWeight > 0
                ? `${remainingWeight.toFixed(1)} ${weightUnit} ayaa kuu haray`
                : "Hadafkaaga waad gaartay 🎉"}
            </Text>

            {!showWeightEntry ? (
              <Pressable
                style={styles.addWeightButton}
                onPress={() => setShowWeightEntry(true)}
              >
                <Text style={styles.addWeightButtonText}>
                  + Geli miisaanka maanta
                </Text>
              </Pressable>
            ) : (
              <View style={styles.weightEntryBox}>
                <View style={styles.weightInputRow}>
                  <TextInput
                    value={newWeight}
                    onChangeText={setNewWeight}
                    keyboardType="decimal-pad"
                    placeholder={
                      weightUnit === "lb" ? "Tusaale: 184" : "Tusaale: 83"
                    }
                    style={styles.weightInput}
                  />
                  <Text style={styles.weightInputUnit}>{weightUnit}</Text>
                </View>
                {!!weightError && (
                  <Text style={styles.weightError}>{weightError}</Text>
                )}
                <View style={styles.weightEntryActions}>
                  <Pressable
                    style={styles.cancelWeightButton}
                    onPress={() => {
                      setShowWeightEntry(false);
                      setNewWeight("");
                      setWeightError("");
                    }}
                  >
                    <Text style={styles.cancelWeightButtonText}>Jooji</Text>
                  </Pressable>
                  <Pressable
                    style={styles.saveWeightButton}
                    onPress={saveWeightFromDashboard}
                  >
                    <Text style={styles.saveWeightButtonText}>Kaydi</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <View style={styles.habitsHeader}>
            <View>
              <Text style={styles.habitsTitle}>Hadafyada maanta</Text>
              <Text style={styles.habitsSubtitle}>
                Caadooyinkaaga maalinlaha ah
              </Text>
            </View>
            <Text style={styles.habitsCount}>{completedToday}/4</Text>
          </View>
          <View style={styles.habitsCard}>
            <View
              style={[
                styles.habitRow,
                dailyChecks.meal && styles.habitRowCompleted,
              ]}
            >
              <Text style={styles.habitCheck}>
                {dailyChecks.meal ? "✓" : "○"}
              </Text>
              <View style={styles.habitTextBox}>
                <Text style={styles.habitTitle}>🥗 Raac qorshaha cuntada</Text>
                <Text style={styles.habitSub}>
                  {dailyChecks.meal
                    ? "✓ Waa la dhammeeyay"
                    : "Cun dhammaan cuntooyinka qorshaha maanta"}
                </Text>
              </View>
            </View>

            <View style={styles.habitDivider} />
            <View
              style={[
                styles.habitRow,
                dailyChecks.activity && styles.habitRowCompleted,
              ]}
            >
              <Text style={styles.habitCheck}>
                {dailyChecks.activity ? "✓" : "○"}
              </Text>
              <View style={styles.habitTextBox}>
                <Text style={styles.habitTitle}>🚶 Dhaqdhaqaaq</Text>
                <Text style={styles.habitSub}>
                  {steps.toLocaleString()} / 5,000 tallaabo
                </Text>
              </View>
              {!dailyChecks.activity ? (
                <View style={styles.habitActions}>
                  <Pressable
                    style={styles.habitMiniButton}
                    onPress={async () => {
                      const next = Math.min(5000, steps + 500);
                      setSteps(next);
                      await saveDailyProgress(dailyChecks, waterCups, next);
                    }}
                  >
                    <Text style={styles.habitMiniButtonText}>+500</Text>
                  </Pressable>
                  <Pressable
                    style={styles.completeHabitButton}
                    onPress={async () => {
                      const next = { ...dailyChecks, activity: true };
                      setDailyChecks(next);
                      await saveDailyProgress(next, waterCups, steps);
                    }}
                  >
                    <Text style={styles.completeHabitButtonText}>
                      ✓ Waan dhammeeyay
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.completedHabitText}>
                  ✓ Waa la dhammeeyay
                </Text>
              )}
            </View>

            <View style={styles.habitDivider} />
            <View
              style={[
                styles.habitRow,
                dailyChecks.water && styles.habitRowCompleted,
              ]}
            >
              <Text style={styles.habitCheck}>
                {dailyChecks.water ? "✓" : "○"}
              </Text>
              <View style={styles.habitTextBox}>
                <Text style={styles.habitTitle}>💧 Biyo</Text>
                <Text style={styles.habitSub}>{waterCups}/8 koob</Text>
                <Pressable
                  onPress={() => router.push("/reminders")}
                  style={styles.reminderLink}
                >
                  <Text style={styles.reminderLinkText}>
                    🔔 Maamul xasuusiyeyaasha →
                  </Text>
                </Pressable>
              </View>
              {!dailyChecks.water ? (
                <View style={styles.habitActions}>
                  <View style={styles.waterButtons}>
                    <Pressable
                      style={styles.waterButton}
                      onPress={async () => {
                        const next = Math.max(0, waterCups - 1);
                        setWaterCups(next);
                        await saveDailyProgress(dailyChecks, next, steps);
                      }}
                    >
                      <Text style={styles.waterButtonText}>−</Text>
                    </Pressable>
                    <Pressable
                      style={styles.waterButton}
                      onPress={async () => {
                        const next = Math.min(8, waterCups + 1);
                        setWaterCups(next);
                        await saveDailyProgress(dailyChecks, next, steps);
                      }}
                    >
                      <Text style={styles.waterButtonText}>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={styles.completeHabitButton}
                    onPress={async () => {
                      const next = { ...dailyChecks, water: true };
                      setDailyChecks(next);
                      await saveDailyProgress(next, waterCups, steps);
                    }}
                  >
                    <Text style={styles.completeHabitButtonText}>
                      ✓ Waan dhammeeyay
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.completedHabitText}>
                  ✓ Waa la dhammeeyay
                </Text>
              )}
            </View>

            <View style={styles.habitDivider} />
            <Pressable
              style={[
                styles.habitRow,
                dailyChecks.lesson && styles.habitRowCompleted,
              ]}
              onPress={() => router.push("/daily-lesson")}
            >
              <Text style={styles.habitCheck}>
                {dailyChecks.lesson ? "✓" : "○"}
              </Text>
              <View style={styles.habitTextBox}>
                <Text style={styles.habitTitle}>📖 Casharka maanta</Text>
                <Text style={styles.habitSub}>
                  3–5 daqiiqo • Baro caado yar maanta
                </Text>
              </View>
              <Text style={styles.lessonActionText}>
                {dailyChecks.lesson ? "Eeg →" : "Bilow →"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.dailyLessonCard}>
            <Text style={styles.dailyLessonTag}>
              CASHARKA MAANTA • 3–5 DAQIIQO
            </Text>
            <Text style={styles.dailyLessonTitle}>Hal caado yar maanta 🌿</Text>
            <Text style={styles.dailyLessonText}>
              Baro gaajada, rabitaanka cuntada iyo caadooyinka si tartiib ah.
            </Text>
            <Pressable
              style={styles.dailyLessonButton}
              onPress={() => router.push("/daily-lesson")}
            >
              <Text style={styles.dailyLessonButtonText}>
                {dailyChecks.lesson
                  ? "✓ Eeg casharka maanta"
                  : "Bilow casharka →"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFBF5",
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

    color: "#166534",
  },

  title: {
    fontSize: 26,

    fontWeight: "900",

    color: "#1F2937",

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
    backgroundColor: "#F0FDF4",

    borderRadius: 18,

    padding: 17,

    marginTop: 4,
  },

  summaryTitle: {
    fontSize: 17,

    fontWeight: "900",

    color: "#14532D",

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

    color: "#15803D",
  },

  mealCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#DDE8DE",

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

    color: "#1F2937",

    marginBottom: 4,
  },

  mealMacros: {
    fontSize: 13,

    fontWeight: "800",

    color: "#15803D",
  },

  timeBadge: {
    backgroundColor: "#F0FDF4",

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderRadius: 14,
  },

  time: {
    fontSize: 12,

    fontWeight: "800",

    color: "#166534",
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

    backgroundColor: "#16A34A",

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

    backgroundColor: "#F0FDF4",

    paddingVertical: 11,

    borderRadius: 13,

    alignItems: "center",
  },

  swapButtonText: {
    color: "#15803D",

    fontWeight: "900",

    fontSize: 13,
  },

  aiCoachButton: {
    backgroundColor: "#F0FDF4",

    borderWidth: 1,

    borderColor: "#BBF7D0",

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

    color: "#166534",

    marginBottom: 4,
  },

  aiCoachText: {
    fontSize: 12,

    color: "#6B7280",
  },

  aiCoachMic: {
    fontSize: 26,
  },

  snackImage: {
    width: 90,

    height: 90,

    borderRadius: 14,

    marginRight: 12,

    resizeMode: "cover",
  },

  weeklyPlanButton: {
    backgroundColor: "#ECFDF5",

    borderWidth: 1,

    borderColor: "#BBF7D0",

    borderRadius: 16,

    paddingVertical: 13,

    paddingHorizontal: 16,

    marginBottom: 16,

    alignItems: "center",
  },

  weeklyPlanButtonText: {
    fontSize: 14,

    fontWeight: "900",

    color: "#166534",
  },

  weeklyProteinSection: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#DDE8DE",

    borderRadius: 18,

    padding: 16,

    marginBottom: 16,
  },

  weeklyProteinTitle: {
    fontSize: 17,

    fontWeight: "900",

    color: "#1F2937",

    marginBottom: 5,
  },

  weeklyProteinSubtitle: {
    fontSize: 13,

    lineHeight: 19,

    color: "#6B7280",

    marginBottom: 14,
  },

  weeklyProteinOptions: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 8,

    marginBottom: 12,
  },

  weeklyProteinOption: {
    backgroundColor: "#F9FAFB",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,
  },

  weeklyProteinOptionSelected: {
    backgroundColor: "#DCFCE7",

    borderColor: "#16A34A",
  },

  weeklyProteinOptionText: {
    fontSize: 13,

    fontWeight: "800",

    color: "#4B5563",
  },

  weeklyProteinOptionTextSelected: {
    color: "#166534",
  },

  carbTitle: {
    fontSize: 15,

    fontWeight: "900",

    color: "#1F2937",

    marginTop: 16,

    marginBottom: 5,
  },

  carbSubtitle: {
    fontSize: 12,

    lineHeight: 18,

    color: "#6B7280",

    marginBottom: 10,
  },

  carbOptions: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 8,

    marginBottom: 14,
  },

  carbOption: {
    backgroundColor: "#F9FAFB",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 12,

    paddingHorizontal: 12,

    paddingVertical: 10,
  },

  carbOptionSelected: {
    backgroundColor: "#ECFDF5",

    borderColor: "#16A34A",
  },

  carbOptionText: {
    fontSize: 13,

    fontWeight: "800",

    color: "#4B5563",
  },

  carbOptionTextSelected: {
    color: "#166534",
  },

  tunaOption: {
    backgroundColor: "#F9FAFB",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 12,

    paddingHorizontal: 14,

    paddingVertical: 11,

    alignSelf: "flex-start",
  },

  tunaOptionSelected: {
    backgroundColor: "#ECFDF5",

    borderColor: "#16A34A",
  },

  tunaOptionText: {
    fontSize: 13,

    fontWeight: "800",

    color: "#166534",
  },

  progressDashboardCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  progressDashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  progressEyebrow: {
    fontSize: 11,
    fontWeight: "900",
    color: "#166534",
    letterSpacing: 0.5,
  },
  progressDashboardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 3,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: "900",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  weightHero: {
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  weightLabel: { fontSize: 13, fontWeight: "800", color: "#6B7280" },
  weightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  weightValue: { fontSize: 38, fontWeight: "900", color: "#1F2937" },
  weightUnitText: { fontSize: 16, fontWeight: "800", color: "#166534" },
  weightStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 10,
  },
  weightStat: { fontSize: 12, fontWeight: "700", color: "#6B7280" },
  progressTrack: {
    height: 9,
    borderRadius: 99,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    backgroundColor: "#16A34A",
  },
  remainingWeightText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 8,
  },
  addWeightButton: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  addWeightButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 13 },
  weightEntryBox: { marginTop: 14 },
  weightInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  weightInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  weightInputUnit: { fontWeight: "900", color: "#166534" },
  weightError: { color: "#B91C1C", fontSize: 12, marginTop: 6 },
  weightEntryActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  cancelWeightButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelWeightButtonText: { color: "#374151", fontWeight: "800" },
  saveWeightButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  saveWeightButtonText: { color: "#FFFFFF", fontWeight: "900" },
  weightChartSection: {
    marginTop: 4,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  weightChartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  weightChartTitle: { fontSize: 13, fontWeight: "900", color: "#1F2937" },
  weightChartLatest: { fontSize: 12, fontWeight: "900", color: "#166534" },
  weightChart: { height: 92, position: "relative", overflow: "hidden" },
  weightChartLine: {
    position: "absolute",
    height: 3,
    borderRadius: 3,
    backgroundColor: "#16A34A",
  },
  weightChartPoint: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  weightChartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  weightChartLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "700" },
  weightChartEmpty: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  weightChartSinglePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
    marginBottom: 8,
  },
  weightChartEmptyText: {
    fontSize: 11,
    lineHeight: 17,
    color: "#6B7280",
    textAlign: "center",
  },
  habitsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  habitsTitle: { fontSize: 16, fontWeight: "900", color: "#1F2937" },
  habitsSubtitle: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  habitsCount: {
    fontSize: 13,
    fontWeight: "900",
    color: "#166534",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  habitsCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
  },
  habitRow: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  habitRowCompleted: {
    backgroundColor: "#F0FDF4",
  },
  habitCheck: { width: 30, fontSize: 20, fontWeight: "900", color: "#16A34A" },
  habitTextBox: { flex: 1 },
  habitTitle: { fontSize: 14, fontWeight: "800", color: "#1F2937" },
  habitSub: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  habitDivider: { height: 1, backgroundColor: "#F3F4F6", marginLeft: 42 },
  habitMiniButton: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  habitMiniButtonText: { color: "#166534", fontWeight: "900", fontSize: 12 },
  habitActions: {
    alignItems: "flex-end",
    gap: 6,
    marginLeft: 8,
  },
  completeHabitButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  completeHabitButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 10,
  },
  completedHabitText: {
    color: "#15803D",
    fontWeight: "900",
    fontSize: 10,
    marginLeft: 8,
  },
  reminderLink: {
    alignSelf: "flex-start",
    marginTop: 5,
    paddingVertical: 3,
  },
  reminderLinkText: {
    fontSize: 10,
    color: "#166534",
    fontWeight: "900",
  },
  lessonActionText: {
    color: "#166534",
    fontWeight: "900",
    fontSize: 12,
    marginLeft: 8,
  },
  waterButtons: { flexDirection: "row", gap: 6 },
  waterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  waterButtonText: { color: "#166534", fontWeight: "900", fontSize: 18 },

  weeklySetupCard: {
    backgroundColor: "#F0FDF4",

    borderWidth: 1,

    borderColor: "#BBF7D0",

    borderRadius: 20,

    padding: 15,

    marginBottom: 16,
  },

  weeklySetupTop: {
    flexDirection: "row",

    alignItems: "flex-start",
  },

  weeklySetupIcon: {
    width: 44,

    height: 44,

    borderRadius: 14,

    backgroundColor: "#DCFCE7",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 12,
  },

  weeklySetupIconText: {
    fontSize: 21,
  },

  weeklySetupContent: {
    flex: 1,
  },

  weeklySetupTitle: {
    color: "#14532D",

    fontSize: 16,

    fontWeight: "900",

    marginBottom: 4,
  },

  weeklySetupText: {
    color: "#6B7280",

    fontSize: 11,

    lineHeight: 17,
  },

  weeklySetupButton: {
    marginTop: 13,

    minHeight: 44,

    borderRadius: 14,

    backgroundColor: "#16A34A",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 14,
  },

  weeklySetupButtonText: {
    color: "#FFFFFF",

    fontSize: 11,

    fontWeight: "900",
  },

  dailyLessonCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
  },

  dailyLessonTag: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#15803D",
    marginBottom: 8,
  },

  dailyLessonTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 6,
  },

  dailyLessonText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
  },

  dailyLessonButton: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: "#166534",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 14,
  },

  dailyLessonButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});
