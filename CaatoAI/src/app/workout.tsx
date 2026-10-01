import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import { useMemo, useState } from "react";

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const EXERCISE_HISTORY_KEY = "caatoai-exercise-history-v1";

type LocationType = "home" | "gym";

type LevelType = "beginner" | "intermediate";

type ExerciseItem = {
  name: string;
  target: string;
  instruction: string;
  visualEmoji?: string;
  visualLabel?: string;
  videoUrl?: string;
};

const WORKOUTS: Record<
  LocationType,
  Record<LevelType, { title: string; minutes: number; items: ExerciseItem[] }>
> = {
  home: {
    beginner: {
      title: "Jimicsiga guriga — Bilow",

      minutes: 15,

      items: [
        {
          name: "Socod meel taagan",

          visualEmoji: "🚶",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 daqiiqo",

          instruction:
            "Si tartiib ah meel taagan ugu soco. Gacmaha si dabiici ah u dhaqaaji, neefsashadana ha celin.",
        },

        {
          name: "Kursi ka kac oo fariiso",

          visualEmoji: "🪑",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 wareeg • 8 jeer",

          instruction:
            "Kursi adag isticmaal. Si tartiib ah u fariiso dabadeed istaag. Haddii loo baahdo, gacmaha ku taageer kursiga.",
        },

        {
          name: "Wall push-up",

          visualEmoji: "🤲",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 wareeg • 8 jeer",

          instruction:
            "Gacmaha derbiga saar, jirka toosi, kadib xusullada laab oo si tartiib ah derbiga ugu soo dhowaaw.",
        },

        {
          name: "Lug dhinac u qaad",

          visualEmoji: "🦵",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "8 jeer dhinac kasta",

          instruction:
            "Kursi ama derbi ku taageer haddii loo baahdo. Hal lug si tartiib ah dhinaca ugu qaad, kadib soo celi.",
        },

        {
          name: "Kala bixid fudud",

          visualEmoji: "🧘",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 daqiiqo",

          instruction:
            "Garbahaa, lugaha iyo dhabarka si deggan u kala bixi. Ha ku qasbin jirka meel xanuun leh.",
        },
      ],
    },

    intermediate: {
      title: "Jimicsiga guriga — Dhexdhexaad",

      minutes: 25,

      items: [
        {
          name: "Socod degdeg ah meel taagan",

          visualEmoji: "🚶",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 daqiiqo",

          instruction:
            "Xawaare dhexdhexaad ah ku soco meel taagan si jirku u kululaado.",
        },

        {
          name: "Squat kursi leh",

          visualEmoji: "🏋️",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 10 jeer",

          instruction:
            "Miskaha gadaal u dir adigoo kursiga u dhowaanaya, kadib dib u istaag. Jilbaha iyo cagaha isku jiho ha ahaadaan.",
        },

        {
          name: "Incline push-up",

          visualEmoji: "💪",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 8 jeer",

          instruction:
            "Gacmaha saar meel adag oo kor u kacda sida miis adag. Jirka toosi oo push-up si xakameysan u samee.",
        },

        {
          name: "Glute bridge",

          visualEmoji: "🌉",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 12 jeer",

          instruction:
            "Dhabarka u jiifso, jilbaha laab, cagaha dhulka saar. Miskaha kor u qaad kadib si tartiib ah hoos ugu soo celi.",
        },

        {
          name: "Bird dog",

          visualEmoji: "🐦",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "8 jeer dhinac kasta",

          instruction:
            "Gacmaha iyo jilbaha saar dhulka. Gacan iyo lugta ka soo horjeeda si tartiib ah u fidso, kadib beddel.",
        },

        {
          name: "Kala bixid",

          visualEmoji: "🧘",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "4 daqiiqo",

          instruction:
            "Jirka si deggan u qabooji oo muruqyada waaweyn kala bixi.",
        },
      ],
    },
  },

  gym: {
    beginner: {
      title: "Gym-ka — Bilow",

      minutes: 25,

      items: [
        {
          name: "Treadmill socod",

          visualEmoji: "🏃",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "5 daqiiqo",

          instruction:
            "Ku bilow xawaare raaxo leh. Isticmaal biraha taageerada haddii aad u baahan tahay.",
        },

        {
          name: "Leg press",

          visualEmoji: "🦵",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 wareeg • 10 jeer",

          instruction:
            "Dooro culays fudud. Cagaha si siman u dhig oo lugaha si xakameysan u riix; jilbaha ha qufulin.",
        },

        {
          name: "Seated row",

          visualEmoji: "🚣",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 wareeg • 10 jeer",

          instruction:
            "Dhabarka toosi. Gacanta mashiinka dhinaca jirka u soo jiid adigoon garbaha kor u qaadin.",
        },

        {
          name: "Chest press",

          visualEmoji: "💪",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "2 wareeg • 10 jeer",

          instruction:
            "Dooro culays fudud. Gacmaha hore u riix si tartiib ah, kadib si xakameysan ugu soo celi.",
        },

        {
          name: "Treadmill qaboojin",

          visualEmoji: "🏃",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "5 daqiiqo",

          instruction:
            "Xawaaraha hoos u dhig oo si deggan u soco ilaa neefsashadu caadi ugu soo noqoto.",
        },
      ],
    },

    intermediate: {
      title: "Gym-ka — Dhexdhexaad",

      minutes: 35,

      items: [
        {
          name: "Treadmill ama elliptical",

          visualEmoji: "🏃",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "7 daqiiqo",

          instruction:
            "Ku kululee xawaare dhexdhexaad ah oo aad weli hadli karto.",
        },

        {
          name: "Leg press",

          visualEmoji: "🦵",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 10 jeer",

          instruction:
            "Isticmaal culays aad si xakameysan ugu dhammeeyn karto dhammaan reps-ka.",
        },

        {
          name: "Lat pulldown",

          visualEmoji: "🏋️",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 10 jeer",

          instruction:
            "Bar-ka xagga laabta sare u soo jiid adigoo dhabarka toosinaya. Ha jiidin qoorta gadaasheeda.",
        },

        {
          name: "Chest press",

          visualEmoji: "💪",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 10 jeer",

          instruction:
            "Gacmaha hore u riix, kadib si tartiib ah ugu soo celi bilowga.",
        },

        {
          name: "Seated leg curl",

          visualEmoji: "🦵",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "3 wareeg • 10 jeer",

          instruction:
            "Mashiinka si sax ah u hagaaji. Lugaha si xakameysan u laab oo dib u celi.",
        },

        {
          name: "Qaboojin iyo kala bixid",

          visualEmoji: "🧘",

          visualLabel: "Sawir ama fiidiyow jimicsigan",

          target: "5 daqiiqo",

          instruction:
            "Socod fudud samee kadib muruqyada lugaha, garbaha iyo dhabarka si deggan u kala bixi.",
        },
      ],
    },
  },
};

function one(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function WorkoutScreen() {
  const params = useLocalSearchParams();

  const location: LocationType =
    one(params.location) === "gym" ? "gym" : "home";

  const level: LevelType =
    one(params.level) === "intermediate" ? "intermediate" : "beginner";

  const workout = useMemo(() => WORKOUTS[location][level], [location, level]);

  const [index, setIndex] = useState(0);

  const [finished, setFinished] = useState(false);

  const current = workout.items[index];

  const isLast = index === workout.items.length - 1;

  const finishWorkout = async () => {
    try {
      const raw = await AsyncStorage.getItem(EXERCISE_HISTORY_KEY);

      const history = raw ? JSON.parse(raw) : [];

      const safeHistory = Array.isArray(history) ? history : [];

      const today = getDateKey();

      const withoutToday = safeHistory.filter(
        (item: any) => item?.date !== today,
      );

      withoutToday.push({
        date: today,

        completed: true,

        location,

        level,

        title: workout.title,

        minutes: workout.minutes,

        completedAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem(
        EXERCISE_HISTORY_KEY,

        JSON.stringify(withoutToday),
      );

      setFinished(true);
    } catch (error) {
      console.log("Workout completion save error:", error);

      Alert.alert("Waxbaa qaldamay", "Jimicsiga lama kaydin karin.");
    }
  };

  if (finished) {
    return (
      <View style={styles.finishedPage}>
        <View style={styles.finishedCard}>
          <Text style={styles.finishedEmoji}>🎉</Text>

          <Text style={styles.finishedTitle}>Waa la dhammeeyay!</Text>

          <Text style={styles.finishedText}>
            Waxaad dhammeeysay jimicsiga maanta. Horumarkaaga waa la kaydiyay.
          </Text>

          <View style={styles.finishedStat}>
            <Text style={styles.finishedStatText}>
              ✓ {workout.minutes} daqiiqo • {workout.items.length} jimicsi
            </Text>
          </View>

          <Pressable
            onPress={() => router.replace("/exercise")}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Ku noqo jimicsiga →</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/meal-plan")}
            style={styles.dashboardButton}
          >
            <Text style={styles.dashboardButtonText}>
              Ku noqo qorshaha maanta
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Dib u noqo</Text>
      </Pressable>

      <Text style={styles.eyebrow}>CAATOAI • JIMICSI</Text>

      <Text style={styles.title}>{workout.title}</Text>

      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Jimicsi {index + 1}/{workout.items.length}
        </Text>

        <Text style={styles.minutesText}>⏱️ {workout.minutes} daqiiqo</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,

            { width: `${((index + 1) / workout.items.length) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.exerciseCard}>
        <View style={styles.numberCircle}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>

        <Text style={styles.exerciseName}>{current.name}</Text>

        <View style={styles.visualCard}>
          <Text style={styles.visualEmoji}>{current.visualEmoji ?? "🏃"}</Text>
          <Text style={styles.visualTitle}>Muuqaalka jimicsiga</Text>
          <Text style={styles.visualText}>
            {current.visualLabel ??
              "Sawirka ama fiidiyowga jimicsigan halkan ayuu ka muuqan doonaa."}
          </Text>

          <View style={styles.visualActions}>
            <View style={styles.visualBadge}>
              <Text style={styles.visualBadgeText}>🖼️ Sawir</Text>
            </View>
            <View style={styles.visualBadge}>
              <Text style={styles.visualBadgeText}>▶ Fiidiyow — dhowaan</Text>
            </View>
          </View>
        </View>

        <Text style={styles.target}>{current.target}</Text>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionLabel}>Sida loo sameeyo</Text>

          <Text style={styles.instruction}>{current.instruction}</Text>
        </View>

        <Text style={styles.paceNote}>
          Samee si tartiib ah. Naso haddii aad u baahan tahay.
        </Text>
      </View>

      <View style={styles.navigationRow}>
        <Pressable
          disabled={index === 0}
          onPress={() => setIndex((old) => Math.max(0, old - 1))}
          style={[styles.previousButton, index === 0 && styles.disabledButton]}
        >
          <Text style={styles.previousText}>← Hore</Text>
        </Pressable>

        {!isLast ? (
          <Pressable
            onPress={() =>
              setIndex((old) => Math.min(workout.items.length - 1, old + 1))
            }
            style={styles.nextButton}
          >
            <Text style={styles.nextText}>Xiga →</Text>
          </Pressable>
        ) : (
          <Pressable onPress={finishWorkout} style={styles.finishButton}>
            <Text style={styles.finishText}>✓ Dhammee jimicsiga</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.safetyCard}>
        <Text style={styles.safetyText}>
          ⚠️ Jooji haddii aad dareento xanuun, wareer, neefsashada oo kugu
          adkaata ama calaamad aan caadi ahayn.
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

    maxWidth: 680,

    alignSelf: "center",

    paddingHorizontal: 22,

    paddingTop: 22,

    paddingBottom: 60,
  },

  backButton: {
    alignSelf: "flex-start",

    paddingVertical: 8,

    paddingRight: 20,

    marginBottom: 12,
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
    fontSize: 25,

    lineHeight: 32,

    fontWeight: "900",

    color: "#1F2937",
  },

  progressHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 18,
  },

  progressText: {
    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },

  minutesText: {
    fontSize: 12,

    fontWeight: "800",

    color: "#6B7280",
  },

  progressTrack: {
    height: 8,

    backgroundColor: "#E5E7EB",

    borderRadius: 999,

    overflow: "hidden",

    marginTop: 9,

    marginBottom: 20,
  },

  progressFill: {
    height: "100%",

    backgroundColor: "#16A34A",

    borderRadius: 999,
  },

  exerciseCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 22,

    padding: 20,
  },

  numberCircle: {
    width: 42,

    height: 42,

    borderRadius: 21,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#DCFCE7",

    marginBottom: 14,
  },

  numberText: {
    fontSize: 16,

    fontWeight: "900",

    color: "#166534",
  },

  exerciseName: {
    fontSize: 24,

    lineHeight: 31,

    fontWeight: "900",

    color: "#1F2937",
  },

  visualCard: {
    width: "100%",
    minHeight: 190,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 18,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  visualEmoji: {
    fontSize: 58,
    marginBottom: 8,
  },
  visualTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#166534",
  },
  visualText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#6B7280",
  },
  visualActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 7,
    marginTop: 13,
  },
  visualBadge: {
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  visualBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  target: {
    alignSelf: "flex-start",

    marginTop: 9,

    backgroundColor: "#F0FDF4",

    borderRadius: 999,

    paddingHorizontal: 12,

    paddingVertical: 7,

    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },

  instructionBox: {
    backgroundColor: "#F9FAFB",

    borderRadius: 16,

    padding: 15,

    marginTop: 18,
  },

  instructionLabel: {
    fontSize: 12,

    fontWeight: "900",

    color: "#374151",

    marginBottom: 6,
  },

  instruction: {
    fontSize: 14,

    lineHeight: 22,

    color: "#4B5563",
  },

  paceNote: {
    fontSize: 12,

    lineHeight: 19,

    color: "#6B7280",

    marginTop: 15,
  },

  navigationRow: {
    flexDirection: "row",

    gap: 10,

    marginTop: 16,
  },

  previousButton: {
    minHeight: 52,

    paddingHorizontal: 18,

    borderRadius: 15,

    borderWidth: 1,

    borderColor: "#D1D5DB",

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  disabledButton: {
    opacity: 0.35,
  },

  previousText: {
    fontSize: 13,

    fontWeight: "900",

    color: "#4B5563",
  },

  nextButton: {
    flex: 1,

    minHeight: 52,

    borderRadius: 15,

    backgroundColor: "#166534",

    alignItems: "center",

    justifyContent: "center",
  },

  nextText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "900",
  },

  finishButton: {
    flex: 1,

    minHeight: 52,

    borderRadius: 15,

    backgroundColor: "#16A34A",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 12,
  },

  finishText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "900",
  },

  safetyCard: {
    backgroundColor: "#FFFBEB",

    borderWidth: 1,

    borderColor: "#FDE68A",

    borderRadius: 16,

    padding: 14,

    marginTop: 15,
  },

  safetyText: {
    fontSize: 11,

    lineHeight: 18,

    color: "#78350F",
  },

  finishedPage: {
    flex: 1,

    backgroundColor: "#FFFBF5",

    alignItems: "center",

    justifyContent: "center",

    padding: 22,
  },

  finishedCard: {
    width: "100%",

    maxWidth: 520,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#DCFCE7",

    borderRadius: 24,

    padding: 24,

    alignItems: "center",
  },

  finishedEmoji: {
    fontSize: 44,
  },

  finishedTitle: {
    fontSize: 27,

    fontWeight: "900",

    color: "#166534",

    marginTop: 10,
  },

  finishedText: {
    textAlign: "center",

    fontSize: 14,

    lineHeight: 22,

    color: "#6B7280",

    marginTop: 8,
  },

  finishedStat: {
    backgroundColor: "#F0FDF4",

    borderRadius: 14,

    paddingHorizontal: 14,

    paddingVertical: 10,

    marginTop: 17,
  },

  finishedStatText: {
    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },

  doneButton: {
    width: "100%",

    minHeight: 52,

    borderRadius: 15,

    backgroundColor: "#166534",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 20,
  },

  doneButtonText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "900",
  },

  dashboardButton: {
    width: "100%",

    minHeight: 48,

    borderRadius: 15,

    borderWidth: 1,

    borderColor: "#D1D5DB",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 10,
  },

  dashboardButtonText: {
    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },
});
