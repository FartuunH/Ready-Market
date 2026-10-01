import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const WEEKLY_PLAN_KEY = "caatoai-weekly-meal-plan-v1";
const FASTING_SETTINGS_KEY = "caatoai-fasting-settings-v1";

type FastingPlan = "normal" | "14:10" | "16:8" | "OMAD";

const SOMALI_DAYS = [
  "Axad",
  "Isniin",
  "Talaado",
  "Arbaco",
  "Khamiis",
  "Jimco",
  "Sabti",
];

function getSomaliDayName(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  return SOMALI_DAYS[date.getDay()] ?? "";
}

function MealSection({
  icon,
  title,
  meal,
}: {
  icon: string;
  title: string;
  meal: any;
}) {
  if (!meal) return null;

  return (
    <View style={styles.mealSection}>
      <Text style={styles.mealLabel}>
        {icon} {title}
      </Text>

      <Text style={styles.mealName}>{meal.name}</Text>

      <Text style={styles.macros}>
        {meal.calories ?? 0} calories • {meal.protein ?? 0}g protein
      </Text>

      {meal.time ? <Text style={styles.time}>⏰ {meal.time}</Text> : null}

      {Array.isArray(meal.items)
        ? meal.items.map((item: string, index: number) => (
            <Text key={`${title}-${index}`} style={styles.ingredient}>
              • {item}
            </Text>
          ))
        : null}
    </View>
  );
}

export default function WeeklyMealPlanScreen() {
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<any>(null);
  const [fastingPlan, setFastingPlan] = useState<FastingPlan>("normal");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadWeeklyPlan = async () => {
        setLoading(true);

        try {
          const [savedPlan, savedFasting] = await Promise.all([
            AsyncStorage.getItem(WEEKLY_PLAN_KEY),
            AsyncStorage.getItem(FASTING_SETTINGS_KEY),
          ]);

          if (!active) return;

          if (savedPlan) {
            const parsed = JSON.parse(savedPlan);
            setWeeklyMealPlan(parsed.weekly_plan);
          } else {
            setWeeklyMealPlan(null);
          }

          if (savedFasting) {
            const parsedFasting = JSON.parse(savedFasting);
            const selected = parsedFasting?.plan;

            if (
              selected === "14:10" ||
              selected === "16:8" ||
              selected === "OMAD"
            ) {
              setFastingPlan(selected);
            } else {
              setFastingPlan("normal");
            }
          } else {
            setFastingPlan("normal");
          }
        } catch (error) {
          console.log("Weekly screen load error:", error);
        } finally {
          if (active) setLoading(false);
        }
      };

      loadWeeklyPlan();

      return () => {
        active = false;
      };
    }, []),
  );

  const days = Array.isArray(weeklyMealPlan?.days) ? weeklyMealPlan.days : [];

  const fastingDescription =
    fastingPlan === "OMAD"
      ? "Hal cunto weyn maalintii"
      : fastingPlan === "16:8"
        ? "2 cunto waaweyn + 1 cunto fudud gudaha eating window-ka"
        : fastingPlan === "14:10"
          ? "Cuntooyinka waxaa lagu habeeyaa 10-ka saac ee eating window-ka"
          : "3 cunto + 1 cunto fudud";

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

        <Text style={styles.title}>Qorshaha 7 Maalmood 🍽️</Text>

        <Text style={styles.subtitle}>
          Qorshaha cuntada ee CaatoAI kuu diyaariyay toddobaadkan.
        </Text>

        <View style={styles.fastingCard}>
          <View style={styles.fastingTop}>
            <Text style={styles.fastingEyebrow}>⏱️ QAABKA CUNTADA</Text>
            <Pressable onPress={() => router.push("/fasting")}>
              <Text style={styles.manageText}>Maamul →</Text>
            </Pressable>
          </View>

          <Text style={styles.fastingTitle}>
            {fastingPlan === "normal" ? "Caadi" : fastingPlan}
          </Text>
          <Text style={styles.fastingText}>{fastingDescription}</Text>
        </View>

        {loading ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              Qorshaha toddobaadka waa la soo furayaa...
            </Text>
          </View>
        ) : days.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>
              Qorshaha toddobaadka lama helin.
            </Text>
          </View>
        ) : (
          <>
            {days.map((day: any, dayIndex: number) => {
              const snack =
                day?.snack ??
                (Array.isArray(day?.snacks) ? day.snacks[0] : day?.snacks);

              /*
               * The AI-generated weekly plan is the source of the food itself.
               * This screen changes how that food is presented for the selected
               * fasting mode. The meal generator can later generate fasting-
               * specific weekly data using the same fasting setting.
               */
              const firstMainMeal =
                day?.omad ??
                day?.main_meal ??
                day?.lunch ??
                day?.dinner ??
                day?.breakfast;

              return (
                <View
                  key={day?.date ?? `day-${dayIndex}`}
                  style={styles.dayCard}
                >
                  <Text style={styles.dayTitle}>
                    {day?.date
                      ? getSomaliDayName(day.date)
                      : `Maalin ${dayIndex + 1}`}

                    {day?.date ? ` • ${day.date}` : ""}
                  </Text>

                  {fastingPlan === "OMAD" ? (
                    <MealSection
                      icon="🍽️"
                      title="Cuntada OMAD"
                      meal={firstMainMeal}
                    />
                  ) : fastingPlan === "16:8" ? (
                    <>
                      <MealSection
                        icon="☀️"
                        title="Cuntada 1"
                        meal={day?.lunch ?? day?.breakfast}
                      />
                      <MealSection icon="🍎" title="Cunto fudud" meal={snack} />
                      <MealSection
                        icon="🌙"
                        title="Cuntada 2"
                        meal={day?.dinner}
                      />
                    </>
                  ) : fastingPlan === "14:10" ? (
                    <>
                      <MealSection
                        icon="☀️"
                        title="Cuntada 1"
                        meal={day?.breakfast ?? day?.lunch}
                      />
                      <MealSection
                        icon="🍽️"
                        title="Cuntada 2"
                        meal={day?.lunch}
                      />
                      <MealSection
                        icon="🌙"
                        title="Cuntada 3"
                        meal={day?.dinner}
                      />
                      <MealSection icon="🍎" title="Cunto fudud" meal={snack} />
                    </>
                  ) : (
                    <>
                      <MealSection
                        icon="🌅"
                        title="Quraac"
                        meal={day?.breakfast}
                      />
                      <MealSection icon="☀️" title="Qado" meal={day?.lunch} />
                      <MealSection icon="🌙" title="Casho" meal={day?.dinner} />
                      <MealSection icon="🍎" title="Cunto fudud" meal={snack} />
                    </>
                  )}

                  {day?.daily_totals ? (
                    <View style={styles.totalBox}>
                      <Text style={styles.totalTitle}>Wadarta maalinta</Text>

                      <Text style={styles.totalText}>
                        🔥 {day.daily_totals.calories ?? 0} calories
                      </Text>

                      <Text style={styles.totalText}>
                        💪 {day.daily_totals.protein ?? 0}g protein
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </>
        )}

        <Pressable
          style={styles.todayButton}
          onPress={() => router.replace("/meal-plan")}
        >
          <Text style={styles.todayButtonText}>🍽️ Ku noqo qorshaha maanta</Text>
        </Pressable>
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
    paddingBottom: 60,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    maxWidth: 700,
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
    marginBottom: 14,
  },
  fastingCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
  },
  fastingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fastingEyebrow: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#15803D",
  },
  manageText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#166534",
  },
  fastingTitle: {
    marginTop: 6,
    fontSize: 21,
    fontWeight: "900",
    color: "#166534",
  },
  fastingText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: "#4B5563",
  },
  dayCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#166534",
    marginBottom: 4,
  },
  mealSection: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 14,
    marginTop: 14,
  },
  mealLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6B7280",
    marginBottom: 4,
  },
  mealName: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  macros: {
    fontSize: 13,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 3,
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 7,
  },
  ingredient: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 2,
  },
  totalBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 13,
    marginTop: 16,
  },
  totalTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#166534",
    marginBottom: 5,
  },
  totalText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginTop: 2,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },
  todayButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 6,
    marginBottom: 30,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
