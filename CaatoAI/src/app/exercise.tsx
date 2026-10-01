import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const EXERCISE_SETTINGS_KEY = "caatoai-exercise-settings-v1";
const EXERCISE_HISTORY_KEY = "caatoai-exercise-history-v1";

type LocationType = "home" | "gym";
type LevelType = "beginner" | "intermediate";

type Workout = {
  title: string;
  description: string;
  minutes: number;
  exercises: number;
};

const WORKOUTS: Record<LocationType, Record<LevelType, Workout>> = {
  home: {
    beginner: {
      title: "Jimicsiga guriga — Bilow",
      description:
        "Jimicsi fudud oo jirka oo dhan ah. Qalab badan uma baahnid.",
      minutes: 15,
      exercises: 5,
    },
    intermediate: {
      title: "Jimicsiga guriga — Dhexdhexaad",
      description:
        "Jimicsi jirka oo dhan ah oo leh dhaqdhaqaaq iyo xoog dheeraad ah.",
      minutes: 25,
      exercises: 6,
    },
  },
  gym: {
    beginner: {
      title: "Gym-ka — Bilow",
      description:
        "Jimicsi fudud oo kaa caawinaya inaad si tartiib ah ula qabsato gym-ka.",
      minutes: 25,
      exercises: 5,
    },
    intermediate: {
      title: "Gym-ka — Dhexdhexaad",
      description:
        "Jimicsi xoog iyo dhaqdhaqaaq isku jira oo loogu talagalay heer dhexdhexaad.",
      minutes: 35,
      exercises: 6,
    },
  },
};

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date = new Date()) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

export default function ExerciseScreen() {
  const [location, setLocation] = useState<LocationType>("home");
  const [level, setLevel] = useState<LevelType>("beginner");
  const [weeklyCompleted, setWeeklyCompleted] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const workout = useMemo(() => WORKOUTS[location][level], [location, level]);

  useEffect(() => {
    const load = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(EXERCISE_SETTINGS_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed?.location === "home" || parsed?.location === "gym") {
            setLocation(parsed.location);
          }
          if (
            parsed?.level === "beginner" ||
            parsed?.level === "intermediate"
          ) {
            setLevel(parsed.level);
          }
        }

        const savedHistory = await AsyncStorage.getItem(EXERCISE_HISTORY_KEY);
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const safeHistory = Array.isArray(history) ? history : [];

        const todayKey = getDateKey();
        setTodayCompleted(
          safeHistory.some(
            (item: any) => item?.date === todayKey && item?.completed === true,
          ),
        );

        const weekStart = startOfWeek();
        const completedThisWeek = safeHistory.filter((item: any) => {
          if (!item?.date || item?.completed !== true) return false;
          const date = new Date(`${item.date}T12:00:00`);
          return date >= weekStart;
        }).length;

        setWeeklyCompleted(completedThisWeek);
      } catch (error) {
        console.log("Exercise screen load error:", error);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      EXERCISE_SETTINGS_KEY,
      JSON.stringify({ location, level }),
    ).catch((error) => console.log("Exercise settings save error:", error));
  }, [location, level, loaded]);

  const beginWorkout = () => {
    router.push({
      pathname: "/workout",
      params: {
        location,
        level,
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.replace("/meal-plan")}
        style={styles.backButton}
      >
        <Text style={styles.backText}>‹ Dib u noqo</Text>
      </Pressable>

      <Text style={styles.eyebrow}>CAATOAI • DHAQDHAQAAQ</Text>
      <Text style={styles.title}>Jimicsiga maanta 🏃</Text>
      <Text style={styles.subtitle}>
        Dooro meesha iyo heerka kugu habboon. Waxaad ku bilaabi kartaa si
        tartiib ah oo joogto ah.
      </Text>

      <View style={styles.progressCard}>
        <View>
          <Text style={styles.progressLabel}>Toddobaadkan</Text>
          <Text style={styles.progressNumber}>{weeklyCompleted}/3 jimicsi</Text>
        </View>

        <View
          style={[styles.statusPill, todayCompleted && styles.statusPillDone]}
        >
          <Text
            style={[styles.statusText, todayCompleted && styles.statusTextDone]}
          >
            {todayCompleted ? "✓ Maanta waa la dhammeeyay" : "Maanta"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Xaggee ayaad ku jimicsanaysaa?</Text>

      <View style={styles.choiceRow}>
        <Pressable
          onPress={() => setLocation("home")}
          style={[
            styles.choiceCard,
            location === "home" && styles.choiceCardSelected,
          ]}
        >
          <Text style={styles.choiceIcon}>🏠</Text>
          <Text
            style={[
              styles.choiceTitle,
              location === "home" && styles.choiceTitleSelected,
            ]}
          >
            Guriga
          </Text>
          <Text style={styles.choiceSubtitle}>Qalab yar ama qalab la'aan</Text>
        </Pressable>

        <Pressable
          onPress={() => setLocation("gym")}
          style={[
            styles.choiceCard,
            location === "gym" && styles.choiceCardSelected,
          ]}
        >
          <Text style={styles.choiceIcon}>🏋️</Text>
          <Text
            style={[
              styles.choiceTitle,
              location === "gym" && styles.choiceTitleSelected,
            ]}
          >
            Gym-ka
          </Text>
          <Text style={styles.choiceSubtitle}>Qalabka gym-ka</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Heerkaaga</Text>

      <View style={styles.levelRow}>
        <Pressable
          onPress={() => setLevel("beginner")}
          style={[
            styles.levelButton,
            level === "beginner" && styles.levelButtonSelected,
          ]}
        >
          <Text
            style={[
              styles.levelText,
              level === "beginner" && styles.levelTextSelected,
            ]}
          >
            🌱 Bilow
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setLevel("intermediate")}
          style={[
            styles.levelButton,
            level === "intermediate" && styles.levelButtonSelected,
          ]}
        >
          <Text
            style={[
              styles.levelText,
              level === "intermediate" && styles.levelTextSelected,
            ]}
          >
            💪 Dhexdhexaad
          </Text>
        </Pressable>
      </View>

      <View style={styles.workoutCard}>
        <Text style={styles.todayLabel}>QORSHAHA MAANTA</Text>
        <Text style={styles.workoutTitle}>{workout.title}</Text>
        <Text style={styles.workoutDescription}>{workout.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⏱️ {workout.minutes}</Text>
            <Text style={styles.statLabel}>daqiiqo</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>🏃 {workout.exercises}</Text>
            <Text style={styles.statLabel}>jimicsi</Text>
          </View>
        </View>

        <Pressable
          onPress={beginWorkout}
          style={[styles.startButton, todayCompleted && styles.startButtonDone]}
        >
          <Text style={styles.startButtonText}>
            {todayCompleted ? "↻ Mar kale samee" : "Bilow jimicsiga →"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.restCard}>
        <Text style={styles.restTitle}>🌿 Maalin nasasho?</Text>
        <Text style={styles.restText}>
          Nasashadu sidoo kale waa qayb ka mid ah qorshaha. Haddii jirkaagu u
          baahan yahay nasasho, dooro socod fudud ama naso maanta.
        </Text>
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>Badbaadada</Text>
        <Text style={styles.safetyText}>
          Jooji jimicsiga haddii aad dareento xanuun, wareer, neefsashada oo
          kugu adkaata ama aad si aan caadi ahayn u xanuunsato. Dooro
          dhaqdhaqaaq ku habboon awooddaada.
        </Text>
      </View>
    </ScrollView>
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
    paddingTop: 22,
    paddingBottom: 60,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingRight: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#166534",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#15803D",
    marginBottom: 7,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginTop: 7,
    marginBottom: 18,
  },
  progressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  progressNumber: {
    fontSize: 19,
    fontWeight: "900",
    color: "#166534",
    marginTop: 3,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: "#F3F4F6",
  },
  statusPillDone: {
    backgroundColor: "#DCFCE7",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6B7280",
  },
  statusTextDone: {
    color: "#166534",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 10,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  choiceCard: {
    flex: 1,
    minHeight: 125,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    padding: 15,
  },
  choiceCardSelected: {
    borderWidth: 2,
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  choiceIcon: {
    fontSize: 27,
    marginBottom: 8,
  },
  choiceTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#374151",
  },
  choiceTitleSelected: {
    color: "#166534",
  },
  choiceSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  levelRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  levelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },
  levelButtonSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
  },
  levelText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#6B7280",
  },
  levelTextSelected: {
    color: "#166534",
  },
  workoutCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    padding: 19,
    marginBottom: 14,
  },
  todayLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#16A34A",
    marginBottom: 7,
  },
  workoutTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#1F2937",
  },
  workoutDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    marginTop: 7,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 17,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 3,
  },
  startButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: "#166534",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  startButtonDone: {
    backgroundColor: "#15803D",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  restCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  restTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#166534",
    marginBottom: 5,
  },
  restText: {
    fontSize: 12,
    lineHeight: 19,
    color: "#4B5563",
  },
  safetyCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 18,
    padding: 16,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#92400E",
    marginBottom: 5,
  },
  safetyText: {
    fontSize: 11,
    lineHeight: 18,
    color: "#78350F",
  },
});
