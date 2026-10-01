import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useCallback, useMemo, useState } from "react";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Range = "1W" | "1M" | "3M" | "ALL";

type WeightEntry = {
  id: string;

  weight: number;

  date: string;
};

type DailyRecord = {
  date: string;

  meal: boolean;

  activity: boolean;

  water: boolean;

  lesson: boolean;

  waterCups: number;

  steps: number;
};

type ExerciseEntry = {
  date?: string;

  completed?: boolean;
};

type FastingEntry = {
  id?: string;

  plan?: string;

  startedAt?: string;

  endedAt?: string;

  plannedHours?: number;

  actualMinutes?: number;

  completedGoal?: boolean;
};

const EXERCISE_HISTORY_KEY = "caatoai-exercise-history-v1";

const FASTING_HISTORY_KEY = "caatoai-fasting-history-v1";

const DAILY_PREFIX = "caatoai-daily-checks-";

const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: "1W", label: "1W" },

  { key: "1M", label: "1M" },

  { key: "3M", label: "3M" },

  { key: "ALL", label: "Dhammaan" },
];

function daysForRange(range: Range) {
  if (range === "1W") return 7;

  if (range === "1M") return 30;

  if (range === "3M") return 90;

  return null;
}

function dateOnly(value: string | Date) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  const year = d.getFullYear();

  const month = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function inRange(dateString: string, range: Range) {
  const days = daysForRange(range);

  if (!days) return true;

  const target = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(target.getTime())) return false;

  const cutoff = new Date();

  cutoff.setDate(cutoff.getDate() - days + 1);

  cutoff.setHours(0, 0, 0, 0);

  return target.getTime() >= cutoff.getTime();
}

function formatShortDate(value: string) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function percent(done: number, total: number) {
  if (total <= 0) return 0;

  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View style={styles.smallTrack}>
      <View style={[styles.smallFill, { width: `${value}%` }]} />
    </View>
  );
}

export default function ProgressScreen() {
  const params = useLocalSearchParams();

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

  const [range, setRange] = useState<Range>("1W");

  const [loading, setLoading] = useState(true);

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);

  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);

  const [exerciseHistory, setExerciseHistory] = useState<ExerciseEntry[]>([]);

  const [fastingHistory, setFastingHistory] = useState<FastingEntry[]>([]);

  const loadAllProgress = useCallback(async () => {
    try {
      setLoading(true);

      const allKeys = await AsyncStorage.getAllKeys();

      // Use the exact weight key when route params are present.

      // If Progress was opened without those params, find the already-saved

      // weight history so this screen reads the same data as weight-progress.

      const weightHistoryKeys = allKeys.filter((key) =>
        key.startsWith("caatoai-weight-history-"),
      );

      let resolvedWeightKey = weightStorageKey;

      if (!allKeys.includes(resolvedWeightKey)) {
        const sameUnitKey = weightHistoryKeys.find((key) =>
          key.startsWith(`caatoai-weight-history-${weightUnit}-`),
        );

        if (sameUnitKey) {
          resolvedWeightKey = sameUnitKey;
        }
      }

      const [weightRaw, exerciseRaw, fastingRaw] = await Promise.all([
        AsyncStorage.getItem(resolvedWeightKey),

        AsyncStorage.getItem(EXERCISE_HISTORY_KEY),

        AsyncStorage.getItem(FASTING_HISTORY_KEY),
      ]);

      const weights = weightRaw ? JSON.parse(weightRaw) : [];

      setWeightEntries(
        Array.isArray(weights) && weights.length
          ? weights
          : [
              {
                id: "starting-weight",

                weight: startingWeight,

                date: new Date().toISOString(),
              },
            ],
      );

      const exercises = exerciseRaw ? JSON.parse(exerciseRaw) : [];

      setExerciseHistory(Array.isArray(exercises) ? exercises : []);

      const fasts = fastingRaw ? JSON.parse(fastingRaw) : [];

      setFastingHistory(Array.isArray(fasts) ? fasts : []);

      const dailyKeys = allKeys.filter((key) => key.startsWith(DAILY_PREFIX));

      const pairs = dailyKeys.length
        ? await AsyncStorage.multiGet(dailyKeys)
        : [];

      const records: DailyRecord[] = pairs

        .map(([key, raw]) => {
          try {
            const parsed = raw ? JSON.parse(raw) : {};

            const keyDate = key.replace(DAILY_PREFIX, "");

            return {
              date: keyDate,

              meal: parsed.checks?.meal ?? false,

              activity: parsed.checks?.activity ?? false,

              water: parsed.checks?.water ?? false,

              lesson: parsed.checks?.lesson ?? false,

              waterCups: Number(parsed.waterCups ?? 0),

              steps: Number(parsed.steps ?? 0),
            };
          } catch {
            return null;
          }
        })

        .filter(Boolean) as DailyRecord[];

      records.sort((a, b) => a.date.localeCompare(b.date));

      setDailyRecords(records);
    } catch (error) {
      console.log("Progress load error:", error);
    } finally {
      setLoading(false);
    }
  }, [weightStorageKey, startingWeight]);

  useFocusEffect(
    useCallback(() => {
      loadAllProgress();
    }, [loadAllProgress]),
  );

  const sortedWeights = useMemo(
    () =>
      [...weightEntries].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),

    [weightEntries],
  );

  const visibleWeights = useMemo(
    () => sortedWeights.filter((entry) => inRange(dateOnly(entry.date), range)),

    [sortedWeights, range],
  );

  const visibleDaily = useMemo(
    () => dailyRecords.filter((item) => inRange(item.date, range)),

    [dailyRecords, range],
  );

  const visibleExercises = useMemo(
    () =>
      exerciseHistory.filter(
        (item) =>
          item?.completed === true &&
          typeof item?.date === "string" &&
          inRange(item.date, range),
      ),

    [exerciseHistory, range],
  );

  const visibleFasts = useMemo(
    () =>
      fastingHistory.filter((item) => {
        const actualMinutes = Number(item.actualMinutes ?? 0);

        return (
          typeof item.endedAt === "string" &&
          item.endedAt.length > 0 &&
          Number.isFinite(actualMinutes) &&
          actualMinutes > 0 &&
          inRange(dateOnly(item.endedAt), range)
        );
      }),
    [fastingHistory, range],
  );

  const currentWeight =
    sortedWeights.length > 0
      ? Number(sortedWeights[sortedWeights.length - 1].weight)
      : startingWeight;

  const change = Number((currentWeight - startingWeight).toFixed(1));

  const remaining = Math.max(
    0,

    Number(Math.abs(currentWeight - goalWeight).toFixed(1)),
  );

  const weightGoalDistance = Math.abs(startingWeight - goalWeight);

  const weightMoved = Math.abs(startingWeight - currentWeight);

  const weightPercent =
    weightGoalDistance === 0
      ? 100
      : Math.max(
          0,

          Math.min(100, Math.round((weightMoved / weightGoalDistance) * 100)),
        );

  const mealDays = visibleDaily.filter((item) => item.meal).length;

  const waterDays = visibleDaily.filter(
    (item) => item.water || item.waterCups >= 8,
  ).length;

  const stepDays = visibleDaily.filter((item) => item.steps >= 5000).length;

  const dailyTotal = visibleDaily.length;

  const mealPercent = percent(mealDays, dailyTotal);

  const waterPercent = percent(waterDays, dailyTotal);

  const stepPercent = percent(stepDays, dailyTotal);

  const totalSteps = visibleDaily.reduce((sum, item) => sum + item.steps, 0);

  const averageSteps = dailyTotal > 0 ? Math.round(totalSteps / dailyTotal) : 0;

  const totalWater = visibleDaily.reduce(
    (sum, item) => sum + item.waterCups,

    0,
  );

  const averageWater =
    dailyTotal > 0 ? Number((totalWater / dailyTotal).toFixed(1)) : 0;

  const workoutDates = new Set(
    visibleExercises

      .map((item) => item.date)

      .filter((value): value is string => typeof value === "string"),
  );

  const fastGoalCount = visibleFasts.filter(
    (item) => item.completedGoal === true,
  ).length;

  const fastMinutes = visibleFasts.reduce(
    (sum, item) => sum + Number(item.actualMinutes ?? 0),

    0,
  );

  const latestFast = visibleFasts.length
    ? [...visibleFasts].sort(
        (a, b) =>
          new Date(b.endedAt ?? b.startedAt ?? 0).getTime() -
          new Date(a.endedAt ?? a.startedAt ?? 0).getTime(),
      )[0]
    : null;

  const openWeight = () =>
    router.push({ pathname: "/weight-progress", params });

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
              router.replace({
                pathname: "/meal-plan",
                params,
              });
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.eyebrow}>CAATOAI • HORUMARKA</Text>

        <Text style={styles.title}>Horumarkaaga 📊</Text>

        <Text style={styles.subtitle}>
          Eeg miisaanka, cuntada, biyaha, tallaabooyinka, jimicsiga iyo soonka.
        </Text>

        <View style={styles.rangeRow}>
          {RANGE_OPTIONS.map((item) => {
            const selected = range === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() => setRange(item.key)}
                style={[
                  styles.rangeButton,

                  selected && styles.rangeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.rangeText,

                    selected && styles.rangeTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.weightCard}>
          <View style={styles.weightTop}>
            <View>
              <Text style={styles.weightLabel}>Miisaanka hadda</Text>

              <Text style={styles.weightValue}>
                {loading ? "—" : currentWeight}{" "}
                <Text style={styles.weightUnit}>{weightUnit}</Text>
              </Text>
            </View>

            <Text style={styles.bigEmoji}>⚖️</Text>
          </View>

          <View style={styles.weightStats}>
            <View style={styles.weightStat}>
              <Text style={styles.darkLabel}>Bilowga</Text>

              <Text style={styles.darkValue}>
                {startingWeight} {weightUnit}
              </Text>
            </View>

            <View style={styles.weightStat}>
              <Text style={styles.darkLabel}>Hadafka</Text>

              <Text style={styles.darkValue}>
                {goalWeight} {weightUnit}
              </Text>
            </View>

            <View style={styles.weightStat}>
              <Text style={styles.darkLabel}>Isbeddel</Text>

              <Text style={styles.darkValue}>
                {change > 0 ? "+" : ""}
                {change} {weightUnit}
              </Text>
            </View>
          </View>

          <View style={styles.darkTrack}>
            <View style={[styles.darkFill, { width: `${weightPercent}%` }]} />
          </View>

          <Text style={styles.remaining}>
            {remaining === 0
              ? "🎉 Waxaad gaartay hadafkaaga."
              : `${remaining} ${weightUnit} ayaa kuu haray hadafkaaga.`}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>📈 Horumarka miisaanka</Text>

              <Text style={styles.cardSub}>
                {visibleWeights.length} gelin muddadan
              </Text>
            </View>

            <Pressable onPress={openWeight}>
              <Text style={styles.manage}>Maamul →</Text>
            </Pressable>
          </View>

          {visibleWeights.length === 0 ? (
            <Text style={styles.empty}>Miisaan lama gelin muddadan.</Text>
          ) : (
            <View style={styles.historyList}>
              {visibleWeights

                .slice(-4)

                .reverse()

                .map((entry, index) => (
                  <View key={`${entry.id}-${index}`} style={styles.historyRow}>
                    <Text style={styles.historyDate}>
                      {formatShortDate(entry.date)}
                    </Text>

                    <Text style={styles.historyValue}>
                      {entry.weight} {weightUnit}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          <Pressable onPress={openWeight} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              + Geli miisaanka maanta
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Caadooyinkaaga</Text>

        <Text style={styles.sectionSub}>
          Natiijooyinka hoose waxay isticmaalaan xogta CaatoAI ee hore loo
          kaydiyay.
        </Text>

        <View style={styles.card}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <Text style={styles.metricEmoji}>🥗</Text>
            </View>

            <View style={styles.metricText}>
              <Text style={styles.cardTitle}>Qorshaha cuntada</Text>

              <Text style={styles.cardSub}>
                {mealDays}/{dailyTotal || 0} maalmood la dhammeeyay
              </Text>
            </View>

            <Text style={styles.metricPercent}>{mealPercent}%</Text>
          </View>

          <ProgressBar value={mealPercent} />

          <Pressable
            onPress={() => router.push({ pathname: "/meal-plan", params })}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>🍽️ Fur qorshaha cuntada →</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <Text style={styles.metricEmoji}>💧</Text>
            </View>

            <View style={styles.metricText}>
              <Text style={styles.cardTitle}>Biyaha</Text>

              <Text style={styles.cardSub}>
                {waterDays}/{dailyTotal || 0} maalmood hadafka la gaaray
              </Text>
            </View>

            <Text style={styles.metricPercent}>{waterPercent}%</Text>
          </View>

          <ProgressBar value={waterPercent} />

          <View style={styles.miniStats}>
            <Text style={styles.miniStat}>
              Celcelis: {averageWater} koob/maalin
            </Text>

            <Text style={styles.miniStat}>Wadar: {totalWater} koob</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <Text style={styles.metricEmoji}>🚶</Text>
            </View>

            <View style={styles.metricText}>
              <Text style={styles.cardTitle}>Tallaabooyinka</Text>

              <Text style={styles.cardSub}>
                {stepDays}/{dailyTotal || 0} maalmood hadafka la gaaray
              </Text>
            </View>

            <Text style={styles.metricPercent}>{stepPercent}%</Text>
          </View>

          <ProgressBar value={stepPercent} />

          <View style={styles.miniStats}>
            <Text style={styles.miniStat}>
              Celcelis: {averageSteps.toLocaleString()} tallaabo
            </Text>

            <Text style={styles.miniStat}>
              Wadar: {totalSteps.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <Text style={styles.metricEmoji}>🏃</Text>
            </View>

            <View style={styles.metricText}>
              <Text style={styles.cardTitle}>Jimicsiga</Text>

              <Text style={styles.cardSub}>
                {workoutDates.size} jimicsi la dhammeeyay muddadan
              </Text>
            </View>

            <Text style={styles.metricNumber}>{workoutDates.size}</Text>
          </View>

          {workoutDates.size === 0 ? (
            <Text style={styles.empty}>
              Weli jimicsi lama dhammeystirin muddadan.
            </Text>
          ) : (
            <View style={styles.tagRow}>
              {[...workoutDates]

                .slice(-5)

                .reverse()

                .map((date) => (
                  <View key={date} style={styles.tag}>
                    <Text style={styles.tagText}>
                      ✓ {formatShortDate(date)}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          <Pressable
            onPress={() => router.push({ pathname: "/exercise", params })}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>🏃 Fur jimicsiga →</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <Text style={styles.metricEmoji}>⏱️</Text>
            </View>

            <View style={styles.metricText}>
              <Text style={styles.cardTitle}>Soonka</Text>

              <Text style={styles.cardSub}>
                {visibleFasts.length} soon la dhammeeyay muddadan
              </Text>
            </View>

            <Text style={styles.metricNumber}>{fastGoalCount} ✓</Text>
          </View>

          <View style={styles.miniStats}>
            <Text style={styles.miniStat}>
              Wadar: {Math.floor(fastMinutes / 60)}h {fastMinutes % 60}m
            </Text>

            <Text style={styles.miniStat}>
              Hadaf la gaaray: {fastGoalCount}
            </Text>
          </View>

          {latestFast ? (
            <View style={styles.latestBox}>
              <Text style={styles.latestLabel}>Soonkii ugu dambeeyay</Text>

              <Text style={styles.latestValue}>
                {latestFast.plan ?? "Soon"} •{" "}
                {Math.floor(Number(latestFast.actualMinutes ?? 0) / 60)}h{" "}
                {Number(latestFast.actualMinutes ?? 0) % 60}m
              </Text>
            </View>
          ) : (
            <Text style={styles.empty}>
              Weli soon dhammeystiran ma jiro muddadan.
            </Text>
          )}

          <Pressable
            onPress={() => router.push("/fasting")}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>⏱️ Maamul soonka →</Text>
          </Pressable>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>🌿 Xusuusnow</Text>

          <Text style={styles.noteText}>
            Horumarku ma aha miisaanka oo keliya. Cunto joogto ah, biyo,
            dhaqdhaqaaq, jimicsi iyo nasasho dhammaantood waa qayb ka mid ah
            safarka.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },

  scrollContent: { flexGrow: 1, paddingBottom: 70 },

  content: {
    width: "100%",

    maxWidth: 700,

    alignSelf: "center",

    paddingHorizontal: 22,

    paddingTop: 22,
  },

  eyebrow: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1.1,

    color: "#16A34A",

    marginBottom: 5,
  },

  title: { fontSize: 28, lineHeight: 35, fontWeight: "900", color: "#1F2937" },

  subtitle: {
    marginTop: 6,

    fontSize: 13,

    lineHeight: 20,

    color: "#6B7280",

    marginBottom: 18,
  },

  rangeRow: { flexDirection: "row", gap: 7, marginBottom: 16 },

  rangeButton: {
    flex: 1,

    minHeight: 40,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: "#DDE8DE",

    backgroundColor: "#FFFFFF",

    alignItems: "center",

    justifyContent: "center",
  },

  rangeButtonSelected: { backgroundColor: "#14532D", borderColor: "#14532D" },

  rangeText: { fontSize: 11, fontWeight: "900", color: "#6B7280" },

  rangeTextSelected: { color: "#FFFFFF" },

  weightCard: {
    backgroundColor: "#14532D",

    borderRadius: 24,

    padding: 20,

    marginBottom: 14,
  },

  weightTop: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  weightLabel: { fontSize: 11, fontWeight: "800", color: "#BBF7D0" },

  weightValue: {
    marginTop: 3,

    fontSize: 34,

    fontWeight: "900",

    color: "#FFFFFF",
  },

  weightUnit: { fontSize: 15, color: "#BBF7D0" },

  bigEmoji: { fontSize: 30 },

  weightStats: { flexDirection: "row", marginTop: 18 },

  weightStat: { flex: 1 },

  darkLabel: { fontSize: 9, fontWeight: "800", color: "#BBF7D0" },

  darkValue: {
    marginTop: 3,

    fontSize: 13,

    fontWeight: "900",

    color: "#FFFFFF",
  },

  darkTrack: {
    height: 8,

    borderRadius: 999,

    backgroundColor: "#2B6B43",

    overflow: "hidden",

    marginTop: 18,
  },

  darkFill: { height: "100%", borderRadius: 999, backgroundColor: "#86EFAC" },

  remaining: {
    marginTop: 8,

    fontSize: 10,

    lineHeight: 16,

    fontWeight: "700",

    color: "#DCFCE7",
  },

  sectionTitle: {
    marginTop: 8,

    fontSize: 19,

    fontWeight: "900",

    color: "#1F2937",
  },

  sectionSub: {
    marginTop: 4,

    marginBottom: 12,

    fontSize: 11,

    lineHeight: 17,

    color: "#6B7280",
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#DDE8DE",

    borderRadius: 20,

    padding: 16,

    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",
  },

  cardTitle: { fontSize: 15, fontWeight: "900", color: "#1F2937" },

  cardSub: { marginTop: 3, fontSize: 10, lineHeight: 15, color: "#6B7280" },

  manage: { fontSize: 11, fontWeight: "900", color: "#16A34A" },

  historyList: { marginTop: 12 },

  historyRow: {
    minHeight: 38,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    borderTopWidth: 1,

    borderTopColor: "#F1F5F1",
  },

  historyDate: { fontSize: 10, fontWeight: "700", color: "#6B7280" },

  historyValue: { fontSize: 12, fontWeight: "900", color: "#166534" },

  primaryButton: {
    minHeight: 48,

    borderRadius: 14,

    backgroundColor: "#16A34A",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 12,
  },

  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

  metricHeader: { flexDirection: "row", alignItems: "center" },

  metricIcon: {
    width: 42,

    height: 42,

    borderRadius: 14,

    backgroundColor: "#F0FDF4",

    alignItems: "center",

    justifyContent: "center",

    marginRight: 11,
  },

  metricEmoji: { fontSize: 21 },

  metricText: { flex: 1 },

  metricPercent: { fontSize: 18, fontWeight: "900", color: "#16A34A" },

  metricNumber: { fontSize: 18, fontWeight: "900", color: "#166534" },

  smallTrack: {
    height: 7,

    borderRadius: 999,

    backgroundColor: "#E5E7EB",

    overflow: "hidden",

    marginTop: 14,
  },

  smallFill: { height: "100%", borderRadius: 999, backgroundColor: "#16A34A" },

  miniStats: {
    flexDirection: "row",

    justifyContent: "space-between",

    gap: 10,

    marginTop: 12,
  },

  miniStat: { flex: 1, fontSize: 10, fontWeight: "700", color: "#6B7280" },

  linkButton: {
    minHeight: 38,

    borderRadius: 12,

    backgroundColor: "#F0FDF4",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 13,
  },

  linkText: { fontSize: 11, fontWeight: "900", color: "#166534" },

  empty: {
    marginTop: 12,

    fontSize: 10,

    lineHeight: 16,

    color: "#9CA3AF",
  },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },

  tag: {
    backgroundColor: "#F0FDF4",

    borderRadius: 999,

    paddingHorizontal: 9,

    paddingVertical: 6,
  },

  tagText: { fontSize: 9, fontWeight: "800", color: "#15803D" },

  latestBox: {
    marginTop: 12,

    backgroundColor: "#F8FBF8",

    borderRadius: 13,

    padding: 11,
  },

  latestLabel: { fontSize: 9, fontWeight: "800", color: "#6B7280" },

  latestValue: {
    marginTop: 3,

    fontSize: 12,

    fontWeight: "900",

    color: "#166534",
  },

  noteCard: {
    backgroundColor: "#F0FDF4",

    borderRadius: 18,

    padding: 16,

    marginTop: 3,
  },

  noteTitle: { fontSize: 13, fontWeight: "900", color: "#166534" },

  noteText: {
    marginTop: 5,

    fontSize: 10,

    lineHeight: 17,

    color: "#4B5563",
  },

  backButton: {
    alignSelf: "flex-start",

    paddingVertical: 8,

    paddingRight: 20,

    marginBottom: 8,
  },

  backText: {
    fontSize: 16,

    fontWeight: "800",

    color: "#166534",
  },
});
