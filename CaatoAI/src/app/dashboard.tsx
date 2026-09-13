import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CelebrationModal from "../components/CelebrationModal";

export default function DashboardScreen() {
  const FASTING_STATE_KEY = "caatoai-fasting-state";
  const DAILY_GOALS_KEY = "caatoai-daily-goals";
  const WATER_TRACKER_KEY = "caatoai-water-tracker";

  type FastingState = {
    date: string;
    active: boolean;
    startedAt: string | null;
    finishedAt: string | null;
    notificationId: string | null;
  };

  const params = useLocalSearchParams();

  const name =
    typeof params.name === "string" && params.name.trim()
      ? params.name
      : "Saaxiib";

  const calorieTarget =
    typeof params.calorieTarget === "string"
      ? Number(params.calorieTarget)
      : 1400;

  const proteinTarget =
    typeof params.proteinTarget === "string"
      ? Number(params.proteinTarget)
      : 100;

  const stepTarget =
    typeof params.stepTarget === "string" ? Number(params.stepTarget) : 5000;

  const waterTarget =
    typeof params.waterTarget === "string" ? Number(params.waterTarget) : 2.5;

  const [eatingWindowActive, setEatingWindowActive] = useState(false);
  const [eatingStartedAt, setEatingStartedAt] = useState<string | null>(null);
  const [eatingFinishedAt, setEatingFinishedAt] = useState<string | null>(null);

  const [fastingNotificationId, setFastingNotificationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadFastingState = async () => {
      try {
        const saved = await AsyncStorage.getItem(FASTING_STATE_KEY);

        if (!saved) return;

        const parsed: FastingState = JSON.parse(saved);
        const today = new Date().toDateString();

        if (parsed.date === today) {
          setEatingWindowActive(parsed.active);
          setEatingStartedAt(parsed.startedAt);
          setEatingFinishedAt(parsed.finishedAt);
          setFastingNotificationId(parsed.notificationId ?? null);
        } else {
          await AsyncStorage.removeItem(FASTING_STATE_KEY);
        }
      } catch (error) {
        console.log("Fasting state load error:", error);
      }
    };

    loadFastingState();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        if (notification.request.identifier !== fastingNotificationId) {
          return;
        }

        const finishedAt = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setEatingWindowActive(false);
        setEatingFinishedAt(finishedAt);
        setFastingNotificationId(null);

        const state: FastingState = {
          date: new Date().toDateString(),
          active: false,
          startedAt: eatingStartedAt,
          finishedAt,
          notificationId: null,
        };

        await AsyncStorage.setItem(FASTING_STATE_KEY, JSON.stringify(state));
      },
    );

    return () => {
      subscription.remove();
    };
  }, [fastingNotificationId, eatingStartedAt]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNextFastingEndDate = () => {
    const fastingEndTime =
      typeof params.fastingEndTime === "string"
        ? params.fastingEndTime
        : "20:00";

    const [hour, minute] = fastingEndTime.split(":").map(Number);

    const now = new Date();
    const endDate = new Date();

    endDate.setHours(hour, minute, 0, 0);

    if (endDate <= now) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return endDate;
  };

  const startEating = async () => {
    const startedAt = getCurrentTime();

    setEatingWindowActive(true);
    setEatingStartedAt(startedAt);
    setEatingFinishedAt(null);

    let notificationId: string | null = null;

    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status === "granted") {
        const endDate = getNextFastingEndDate();

        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "CaatoAI 💚",
            body: "Eating window-kaaga wuu dhammaaday. Si tartiib ah ugu noqo fasting-kaaga.",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: endDate,
          },
        });

        setFastingNotificationId(notificationId);
      }
    } catch (error) {
      console.log("Fasting notification error:", error);
    }

    const state: FastingState = {
      date: new Date().toDateString(),
      active: true,
      startedAt,
      finishedAt: null,
      notificationId,
    };

    await AsyncStorage.setItem(FASTING_STATE_KEY, JSON.stringify(state));
  };
  const finishEating = async () => {
    const finishedAt = getCurrentTime();

    if (fastingNotificationId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(
          fastingNotificationId,
        );
      } catch (error) {
        console.log("Cancel fasting notification error:", error);
      }
    }

    setEatingWindowActive(false);
    setEatingFinishedAt(finishedAt);
    setFastingNotificationId(null);

    const state: FastingState = {
      date: new Date().toDateString(),
      active: false,
      startedAt: eatingStartedAt,
      finishedAt,
      notificationId: null,
    };

    await AsyncStorage.setItem(FASTING_STATE_KEY, JSON.stringify(state));
  };

  const [dailyGoals, setDailyGoals] = useState({
    water: false,
    steps: false,
    workout: false,
    nutrition: false,
  });

  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationTitle, setCelebrationTitle] = useState("");
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [celebrationEmoji, setCelebrationEmoji] = useState("🎉");

  useEffect(() => {
    const loadDailyGoals = async () => {
      try {
        const saved = await AsyncStorage.getItem(DAILY_GOALS_KEY);

        if (!saved) return;

        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();

        if (parsed.date === today) {
          setDailyGoals(parsed.goals);
        } else {
          await AsyncStorage.removeItem(DAILY_GOALS_KEY);
        }
      } catch (error) {
        console.log("Daily goals load error:", error);
      }
    };

    loadDailyGoals();
  }, []);

  const saveDailyGoals = async (goals: typeof dailyGoals) => {
    try {
      const data = {
        date: new Date().toDateString(),
        goals,
      };

      await AsyncStorage.setItem(DAILY_GOALS_KEY, JSON.stringify(data));
      setDailyGoals(goals);
    } catch (error) {
      console.log("Daily goals save error:", error);
    }
  };

  const completeDailyGoal = async (
    goal: keyof typeof dailyGoals,
    title: string,
    message: string,
    emoji: string,
  ) => {
    // Don't celebrate the same goal twice today.
    if (dailyGoals[goal]) return;

    const updatedGoals = {
      ...dailyGoals,
      [goal]: true,
    };

    await saveDailyGoals(updatedGoals);

    const allGoalsCompleted = Object.values(updatedGoals).every(Boolean);

    if (allGoalsCompleted) {
      setCelebrationTitle("Maalintaadii waad dhamaystirtay!");
      setCelebrationMessage(
        "Waxaad maanta dhamaystirtay hadafyadaada caafimaadka. Joogtayntaadu waa guusha dhabta ah.",
      );
      setCelebrationEmoji("🌟");
    } else {
      setCelebrationTitle(title);
      setCelebrationMessage(message);
      setCelebrationEmoji(emoji);
    }

    setCelebrationVisible(true);
  };
  // Temporary demo values.
  // Later these will come from real tracking.
  const caloriesConsumed = 0;
  const proteinConsumed = 0;
  const stepsCompleted = 0;
  const [waterConsumed, setWaterConsumed] = useState(0);

  useEffect(() => {
    const loadWater = async () => {
      try {
        const saved = await AsyncStorage.getItem(WATER_TRACKER_KEY);

        if (!saved) return;

        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();

        if (parsed.date === today) {
          setWaterConsumed(parsed.amount);
        } else {
          await AsyncStorage.removeItem(WATER_TRACKER_KEY);
          setWaterConsumed(0);
        }
      } catch (error) {
        console.log("Water tracker load error:", error);
      }
    };

    loadWater();
  }, []);
  const addWater = async (amount: number) => {
    const previousAmount = waterConsumed;

    const newAmount = Number(
      Math.min(previousAmount + amount, waterTarget).toFixed(2),
    );

    try {
      const data = {
        date: new Date().toDateString(),
        amount: newAmount,
      };

      await AsyncStorage.setItem(WATER_TRACKER_KEY, JSON.stringify(data));

      setWaterConsumed(newAmount);

      // Celebrate only when the user crosses the target.
      if (
        previousAmount < waterTarget &&
        newAmount >= waterTarget &&
        !dailyGoals.water
      ) {
        await completeDailyGoal(
          "water",
          "Biyaha maanta waa dhammaadeen! 💧",
          "Waxaad gaartay hadafkaaga biyaha maanta. Sii wad daryeelka caafimaadkaaga.",
          "💧",
        );
      }
    } catch (error) {
      console.log("Water tracker save error:", error);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Brand + profile */}
        <View style={styles.brandRow}>
          <View style={styles.brandWrap}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>🌿</Text>
            </View>

            <View>
              <Text style={styles.brandName}>CaatoAI</Text>
              <Text style={styles.brandTag}>Qorshahaaga maanta</Text>
            </View>
          </View>

          <Pressable style={styles.profileButton}>
            <Text style={styles.profileText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.greetingArea}>
          <Text style={styles.greeting}>Subax wanaagsan, {name} 💚</Text>
          <Text style={styles.subtitle}>
            Maanta hal tallaabo oo yar ayaa ku filan.
          </Text>
        </View>

        {/* Coach card */}
        <View style={styles.coachCard}>
          <View style={styles.coachTopRow}>
            <View style={styles.coachBadge}>
              <Text style={styles.coachBadgeText}>AI</Text>
            </View>

            <Text style={styles.coachEyebrow}>CAATOAI MAANTA</Text>
          </View>

          <Text style={styles.coachTitle}>
            Joogtayntu waa guusha dhabta ah.
          </Text>

          <Text style={styles.coachMessage}>
            Hal tallaabo oo yar maanta ayaa kaa caawinaysa inaad sii waddo
            qorshahaaga adigoon isku cadaadin.
          </Text>
        </View>

        {/* Daily goals */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>MAALIN KASTA</Text>
            <Text style={styles.sectionTitle}>Hadafyada maanta</Text>
          </View>

          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>Maanta</Text>
          </View>
        </View>

        <View style={styles.goalsCard}>
          <View style={styles.goalGrid}>
            <View style={styles.goalTile}>
              <View style={styles.goalIconCircle}>
                <Text style={styles.goalIcon}>🔥</Text>
              </View>
              <Text style={styles.goalLabel}>Calories</Text>
              <Text style={styles.goalValue}>
                {caloriesConsumed}
                <Text style={styles.goalTarget}> / {calorieTarget}</Text>
              </Text>
            </View>

            <View style={styles.goalTile}>
              <View style={styles.goalIconCircle}>
                <Text style={styles.goalIcon}>💪</Text>
              </View>
              <Text style={styles.goalLabel}>Protein</Text>
              <Text style={styles.goalValue}>
                {proteinConsumed}g
                <Text style={styles.goalTarget}> / {proteinTarget}g</Text>
              </Text>
            </View>

            <View style={styles.goalTile}>
              <View style={styles.goalIconCircle}>
                <Text style={styles.goalIcon}>🚶</Text>
              </View>
              <Text style={styles.goalLabel}>Tallaabo</Text>
              <Text style={styles.goalValue}>
                {stepsCompleted.toLocaleString()}
                <Text style={styles.goalTarget}>
                  {" "}
                  / {stepTarget.toLocaleString()}
                </Text>
              </Text>
            </View>

            <View
              style={[
                styles.goalTile,
                styles.waterTile,
                dailyGoals.water && styles.goalTileComplete,
              ]}
            >
              <View style={styles.goalTileTop}>
                <View
                  style={[
                    styles.goalIconCircle,
                    dailyGoals.water && styles.goalIconCircleComplete,
                  ]}
                >
                  <Text style={styles.goalIcon}>
                    {dailyGoals.water ? "✓" : "💧"}
                  </Text>
                </View>

                {dailyGoals.water && (
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneBadgeText}>La gaaray</Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.goalLabel,
                  dailyGoals.water && styles.completeText,
                ]}
              >
                Biyo
              </Text>

              <Text
                style={[
                  styles.goalValue,
                  dailyGoals.water && styles.completeText,
                ]}
              >
                {waterConsumed}L
                <Text style={styles.goalTarget}> / {waterTarget}L</Text>
              </Text>

              {!dailyGoals.water && (
                <View style={styles.waterButtons}>
                  <Pressable
                    onPress={() => addWater(0.25)}
                    style={({ pressed }) => [
                      styles.waterButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.waterButtonText}>+250ml</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => addWater(0.5)}
                    style={({ pressed }) => [
                      styles.waterButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.waterButtonText}>+500ml</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitleStandalone}>Qorshahaaga</Text>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/weight-progress",
              params,
            })
          }
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>⚖️</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Miisaankayga</Text>
              <Text style={styles.actionSubtitle}>
                Eeg miisaankaaga iyo horumarka hadafkaaga
              </Text>
            </View>
          </View>

          <Text style={styles.actionArrow}>›</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/meal-plan",
              params,
            })
          }
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🍽️</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Qorshaha cuntada</Text>
              <Text style={styles.actionSubtitle}>
                Eeg cuntada maanta iyo qorshahaaga
              </Text>
            </View>
          </View>

          <Text style={styles.actionArrow}>›</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/reminders",
              params,
            })
          }
          style={({ pressed }) => [
            styles.actionCard,
            pressed && styles.cardPressed,
          ]}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🔔</Text>
            </View>

            <View style={styles.actionTextWrap}>
              <Text style={styles.actionTitle}>Xasuusinta CaatoAI</Text>
              <Text style={styles.actionSubtitle}>
                Maamul cuntada, biyaha, socodka iyo miisaanka
              </Text>
            </View>
          </View>

          <Text style={styles.actionArrow}>›</Text>
        </Pressable>

        {/* Eating style */}
        <View style={styles.sectionHeaderFood}>
          <View>
            <Text style={styles.sectionEyebrow}>CUNTADA MAANTA</Text>
            <Text style={styles.sectionTitle}>Qaabka cuntadaada</Text>
          </View>
        </View>

        {params.eatingStyle === "omad" ? (
          <View style={styles.foodCard}>
            <View style={styles.foodIconWrap}>
              <Text style={styles.foodIcon}>🍽️</Text>
            </View>

            <View style={styles.foodInfo}>
              <Text style={styles.foodTitle}>Cuntada OMAD</Text>
              <Text style={styles.foodSubtitle}>
                Hal cunto oo weyn waqtigaaga OMAD
              </Text>
            </View>

            <View style={styles.smallAddButton}>
              <Text style={styles.smallAddButtonText}>+ Ku dar</Text>
            </View>
          </View>
        ) : params.eatingStyle === "fasting" ? (
          <View style={styles.fastingCard}>
            <View style={styles.fastingTimes}>
              <View style={styles.fastingTimeBox}>
                <Text style={styles.fastingTimeIcon}>🕐</Text>
                <Text style={styles.fastingTimeLabel}>Bilow</Text>
                <Text style={styles.fastingTimeValue}>
                  {typeof params.fastingStartTime === "string"
                    ? params.fastingStartTime
                    : "12:00"}
                </Text>
              </View>

              <View style={styles.fastingDivider} />

              <View style={styles.fastingTimeBox}>
                <Text style={styles.fastingTimeIcon}>🌙</Text>
                <Text style={styles.fastingTimeLabel}>Dhammaad</Text>
                <Text style={styles.fastingTimeValue}>
                  {typeof params.fastingEndTime === "string"
                    ? params.fastingEndTime
                    : "20:00"}
                </Text>
              </View>
            </View>

            {eatingWindowActive ? (
              <Pressable
                onPress={finishEating}
                style={({ pressed }) => [
                  styles.fastingSecondaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.fastingSecondaryButtonText}>
                  ⏹️ Jooji Cunista
                </Text>
              </Pressable>
            ) : eatingFinishedAt ? (
              <View style={styles.fastingCompleteBox}>
                <Text style={styles.fastingCompleteText}>
                  ✅ Eating window-ka maanta waa dhammaaday
                </Text>
              </View>
            ) : (
              <Pressable
                onPress={startEating}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.primaryButtonText}>▶️ Bilow Cunista</Text>
              </Pressable>
            )}

            {(eatingStartedAt || eatingFinishedAt) && (
              <View style={styles.timeStatusRow}>
                {eatingStartedAt && (
                  <Text style={styles.timeStatusText}>
                    Bilowday: {eatingStartedAt}
                  </Text>
                )}

                {eatingFinishedAt && (
                  <Text style={styles.timeStatusComplete}>
                    Dhammaatay: {eatingFinishedAt}
                  </Text>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.foodList}>
            <View style={styles.foodCard}>
              <View style={styles.foodIconWrap}>
                <Text style={styles.foodIcon}>🌅</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>Quraac</Text>
                <Text style={styles.foodSubtitle}>Qorshahaaga quraacda</Text>
              </View>
              <View style={styles.smallAddButton}>
                <Text style={styles.smallAddButtonText}>+ Ku dar</Text>
              </View>
            </View>

            <View style={styles.foodCard}>
              <View style={styles.foodIconWrap}>
                <Text style={styles.foodIcon}>☀️</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>Qado</Text>
                <Text style={styles.foodSubtitle}>Qorshahaaga qadada</Text>
              </View>
              <View style={styles.smallAddButton}>
                <Text style={styles.smallAddButtonText}>+ Ku dar</Text>
              </View>
            </View>

            <View style={styles.foodCard}>
              <View style={styles.foodIconWrap}>
                <Text style={styles.foodIcon}>🌙</Text>
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>Casho</Text>
                <Text style={styles.foodSubtitle}>Qorshahaaga cashada</Text>
              </View>
              <View style={styles.smallAddButton}>
                <Text style={styles.smallAddButtonText}>+ Ku dar</Text>
              </View>
            </View>
          </View>
        )}

        {/* Workout */}
        <View style={styles.sectionHeaderFood}>
          <View>
            <Text style={styles.sectionEyebrow}>DHAQDHAQAAQ</Text>
            <Text style={styles.sectionTitle}>Jimicsiga maanta</Text>
          </View>
        </View>

        <View
          style={[
            styles.workoutCard,
            dailyGoals.workout && styles.workoutCardComplete,
          ]}
        >
          <View
            style={[
              styles.workoutIconWrap,
              dailyGoals.workout && styles.workoutIconWrapComplete,
            ]}
          >
            <Text style={styles.workoutIcon}>
              {dailyGoals.workout ? "✓" : "🚶"}
            </Text>
          </View>

          <View style={styles.workoutInfo}>
            <Text
              style={[
                styles.workoutTitle,
                dailyGoals.workout && styles.completeText,
              ]}
            >
              {dailyGoals.workout ? "Jimicsiga maanta" : "Socodka maanta"}
            </Text>

            <Text
              style={[
                styles.workoutSubtitle,
                dailyGoals.workout && styles.workoutSubtitleComplete,
              ]}
            >
              {dailyGoals.workout
                ? "Waa dhammaatay 🎉"
                : "Dhammee dhaqdhaqaaqaaga maanta."}
            </Text>

            {dailyGoals.workout && (
              <View style={styles.completedPill}>
                <Text style={styles.completedPillText}>✨ +1 hadaf maanta</Text>
              </View>
            )}
          </View>

          {!dailyGoals.workout && (
            <Pressable
              onPress={() =>
                completeDailyGoal(
                  "workout",
                  "Hambalyo! 💪",
                  "Waxaad dhamaystirtay jimicsigaaga maanta. Joogtayntaadu waa horumar.",
                  "💪",
                )
              }
              style={({ pressed }) => [
                styles.completeButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.completeButtonText}>Dhammee</Text>
            </Pressable>
          )}
        </View>

        {/* Privacy */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={styles.privacyTextWrap}>
            <Text style={styles.privacyTitle}>Qorshahaagu waa kuu gaar</Text>
            <Text style={styles.privacyText}>
              Miisaankaaga, cuntadaada iyo horumarkaaga si otomaatig ah qof kale
              looma tusayo.
            </Text>
          </View>
        </View>

        {/* AI CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.aiButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.aiButtonIcon}>🎤</Text>
          <View style={styles.aiButtonTextWrap}>
            <Text style={styles.aiButtonTitle}>La hadal CaatoAI</Text>
            <Text style={styles.aiButtonSubtitle}>
              Weydii cunto, caadooyin ama dhiirigelin
            </Text>
          </View>
          <Text style={styles.aiButtonArrow}>›</Text>
        </Pressable>

        <Text style={styles.footerText}>
          💚 Maanta perfection looma baahna — joogteyn yar ayaa ku filan.
        </Text>

        <CelebrationModal
          visible={celebrationVisible}
          title={celebrationTitle}
          message={celebrationMessage}
          emoji={celebrationEmoji}
          onClose={() => setCelebrationVisible(false)}
        />
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
    paddingBottom: 44,
  },

  content: {
    width: "100%",
    maxWidth: 650,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  brandWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  brandIconText: {
    fontSize: 22,
  },

  brandName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#14532D",
  },

  brandTag: {
    marginTop: 1,
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#14532D",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  greetingArea: {
    marginBottom: 18,
  },

  greeting: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    fontWeight: "600",
  },

  coachCard: {
    backgroundColor: "#14532D",
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
  },

  coachTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  coachBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  coachBadgeText: {
    color: "#14532D",
    fontSize: 11,
    fontWeight: "900",
  },

  coachEyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "900",
    color: "#BBF7D0",
  },

  coachTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
    marginBottom: 8,
  },

  coachMessage: {
    color: "#DCFCE7",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },

  sectionHeaderFood: {
    marginTop: 28,
    marginBottom: 12,
  },

  sectionEyebrow: {
    color: "#16A34A",
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: "900",
    marginBottom: 4,
  },

  sectionTitle: {
    color: "#1F2937",
    fontSize: 21,
    fontWeight: "900",
  },

  sectionTitleStandalone: {
    color: "#1F2937",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 2,
  },

  todayBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  todayBadgeText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "900",
  },

  goalsCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 24,
    padding: 12,
    marginBottom: 28,
  },

  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  goalTile: {
    width: "48%",
    minHeight: 132,
    backgroundColor: "#F8FBF8",
    borderWidth: 1,
    borderColor: "#E5EFE6",
    borderRadius: 18,
    padding: 14,
  },

  waterTile: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  goalTileComplete: {
    backgroundColor: "#ECFDF3",
    borderColor: "#86EFAC",
  },

  goalTileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  goalIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  goalIconCircleComplete: {
    backgroundColor: "#16A34A",
  },

  goalIcon: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  goalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
    marginBottom: 5,
  },

  goalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#14532D",
  },

  goalTarget: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  doneBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  doneBadgeText: {
    color: "#15803D",
    fontSize: 8,
    fontWeight: "900",
  },

  completeText: {
    color: "#15803D",
  },

  waterButtons: {
    flexDirection: "row",
    gap: 6,
    marginTop: 11,
  },

  waterButton: {
    flex: 1,
    backgroundColor: "#DCFCE7",
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: "center",
  },

  waterButtonText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "900",
  },

  actionCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  actionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  actionIconText: {
    fontSize: 21,
  },

  actionTextWrap: {
    flex: 1,
    paddingRight: 8,
  },

  actionTitle: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  actionSubtitle: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  actionArrow: {
    color: "#16A34A",
    fontSize: 27,
    fontWeight: "700",
  },

  foodList: {
    gap: 10,
  },

  foodCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  foodIconWrap: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  foodIcon: {
    fontSize: 20,
  },

  foodInfo: {
    flex: 1,
    paddingRight: 8,
  },

  foodTitle: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 3,
  },

  foodSubtitle: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "600",
  },

  smallAddButton: {
    backgroundColor: "#DCFCE7",
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  smallAddButtonText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "900",
  },

  fastingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 22,
    padding: 16,
  },

  fastingTimes: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  fastingTimeBox: {
    flex: 1,
    alignItems: "center",
  },

  fastingDivider: {
    width: 1,
    height: 54,
    backgroundColor: "#DDE8DE",
  },

  fastingTimeIcon: {
    fontSize: 21,
    marginBottom: 5,
  },

  fastingTimeLabel: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 2,
  },

  fastingTimeValue: {
    color: "#14532D",
    fontSize: 17,
    fontWeight: "900",
  },

  primaryButton: {
    backgroundColor: "#14532D",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  fastingSecondaryButton: {
    backgroundColor: "#ECFDF3",
    borderWidth: 1,
    borderColor: "#86EFAC",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  fastingSecondaryButtonText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "900",
  },

  fastingCompleteBox: {
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  fastingCompleteText: {
    color: "#166534",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "900",
  },

  timeStatusRow: {
    marginTop: 10,
    alignItems: "center",
  },

  timeStatusText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "700",
  },

  timeStatusComplete: {
    marginTop: 3,
    color: "#15803D",
    fontSize: 11,
    fontWeight: "800",
  },

  workoutCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE8DE",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  workoutCardComplete: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },

  workoutIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  workoutIconWrapComplete: {
    backgroundColor: "#16A34A",
  },

  workoutIcon: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "900",
  },

  workoutInfo: {
    flex: 1,
    paddingRight: 8,
  },

  workoutTitle: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  workoutSubtitle: {
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  workoutSubtitleComplete: {
    color: "#15803D",
    fontWeight: "700",
  },

  completedPill: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  completedPillText: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
  },

  completeButton: {
    backgroundColor: "#14532D",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  privacyCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  privacyIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  privacyTextWrap: {
    flex: 1,
  },

  privacyTitle: {
    color: "#14532D",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 3,
  },

  privacyText: {
    color: "#4B5563",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "600",
  },

  aiButton: {
    backgroundColor: "#14532D",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },

  aiButtonIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  aiButtonTextWrap: {
    flex: 1,
  },

  aiButtonTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 2,
  },

  aiButtonSubtitle: {
    color: "#BBF7D0",
    fontSize: 10,
    fontWeight: "600",
  },

  aiButtonArrow: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "700",
  },

  footerText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "600",
    marginTop: 16,
    paddingHorizontal: 20,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  cardPressed: {
    opacity: 0.78,
  },
});
