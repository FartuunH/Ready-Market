import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useLocalSearchParams } from "expo-router";

import { useEffect, useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import CelebrationModal from "../components/CelebrationModal";

type WeightEntry = {
  id: string;

  weight: number;

  date: string;
};

export default function WeightProgressScreen() {
  const params = useLocalSearchParams();

  const weightUnit = params.weightUnit === "kg" ? "kg" : "lb";

  const startingWeightParam =
    typeof params.currentWeight === "string"
      ? Number(params.currentWeight)
      : 185;

  const goalWeightParam =
    typeof params.goalWeight === "string" ? Number(params.goalWeight) : 160;

  const startingWeight = startingWeightParam > 0 ? startingWeightParam : 185;

  const goalWeight = goalWeightParam > 0 ? goalWeightParam : 160;

  const storageKey = `caatoai-weight-history-${weightUnit}-${startingWeight}-${goalWeight}`;

  const [entries, setEntries] = useState<WeightEntry[]>([]);

  const [loading, setLoading] = useState(true);

  const [showEntryForm, setShowEntryForm] = useState(false);

  const [newWeight, setNewWeight] = useState("");

  const [error, setError] = useState("");

  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const [celebrationTitle, setCelebrationTitle] = useState("");

  const [celebrationMessage, setCelebrationMessage] = useState("");

  const [celebrationEmoji, setCelebrationEmoji] = useState("🎉");
  const [waterCups, setWaterCups] = useState(0);
  const [steps, setSteps] = useState(0);
  const [mealDone, setMealDone] = useState(true);
  const [lessonDone, setLessonDone] = useState(false);
  const [range, setRange] = useState<"1W" | "1M" | "3M" | "ALL">("1W");
  const [showWeeklyFoodCheck, setShowWeeklyFoodCheck] = useState(false);

  const dailyKey = `caatoai-daily-checks-${new Date().toISOString().slice(0, 10)}`;

  const saveDailyChecks = async (
    nextWater = waterCups,
    nextSteps = steps,
    nextMeal = mealDone,
    nextLesson = lessonDone,
  ) => {
    try {
      await AsyncStorage.setItem(
        dailyKey,
        JSON.stringify({
          waterCups: nextWater,
          steps: nextSteps,
          checks: { meal: nextMeal, lesson: nextLesson },
        }),
      );
    } catch (err) {
      console.log("Daily checks save error:", err);
    }
  };

  const changeWater = async (amount: number) => {
    const next = Math.max(0, Math.min(8, waterCups + amount));
    setWaterCups(next);
    await saveDailyChecks(next, steps, mealDone, lessonDone);
  };

  const addSteps = async () => {
    const next = steps + 500;
    setSteps(next);
    await saveDailyChecks(waterCups, next, mealDone, lessonDone);
  };
  function getCurrentWeekId() {
    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);

    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);

    return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }
  const usePreviousWeekFoods = async () => {
    try {
      setShowWeeklyFoodCheck(false);

      router.push({
        pathname: "/meal-plan",
        params: {
          ...params,
          generateWeeklyPlan: "true",
          reuseWeeklyFoods: "true",
        },
      });
    } catch (err) {
      console.log("Reuse weekly foods error:", err);
    }
  };

  const editWeeklyFoods = () => {
    setShowWeeklyFoodCheck(false);

    router.push({
      pathname: "/weekly-food-setup",
      params: {
        ...params,
        newWeek: "true",
      },
    });
  };

  const checkForNewWeek = async () => {
    try {
      const lastPlannedWeek = await AsyncStorage.getItem(
        "caatoai-last-planned-week",
      );

      const currentWeek = getCurrentWeekId();

      // Only show this for an existing user who has planned before.
      if (lastPlannedWeek && lastPlannedWeek !== currentWeek) {
        setShowWeeklyFoodCheck(true);
      }
    } catch (err) {
      console.log("Weekly food check error:", err);
    }
  };

  const loadWeightHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        const parsed: WeightEntry[] = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const startingEntry = parsed.find(
            (entry) => entry.id === "starting-weight",
          );

          const latestByDay = new Map<string, WeightEntry>();

          parsed
            .filter((entry) => entry.id !== "starting-weight")
            .forEach((entry) => {
              const day = entry.date.slice(0, 10);
              const existing = latestByDay.get(day);

              if (
                !existing ||
                new Date(entry.date).getTime() >
                  new Date(existing.date).getTime()
              ) {
                latestByDay.set(day, entry);
              }
            });

          const cleanedEntries = [
            ...(startingEntry ? [startingEntry] : []),
            ...Array.from(latestByDay.values()),
          ];

          setEntries(cleanedEntries);
          await saveEntries(cleanedEntries);
        } else {
          createStartingEntry();
        }
      } else {
        createStartingEntry();
      }
    } catch (err) {
      console.log("Weight history load error:", err);

      createStartingEntry();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeightHistory();
    checkForNewWeek();
  }, []);

  const createStartingEntry = () => {
    const startingEntry: WeightEntry = {
      id: "starting-weight",

      weight: startingWeight,

      date: new Date().toISOString(),
    };

    setEntries([startingEntry]);
  };

  const saveEntries = async (updatedEntries: WeightEntry[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    } catch (err) {
      console.log("Weight history save error:", err);
    }
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [entries]);

  const currentWeight =
    sortedEntries.length > 0
      ? sortedEntries[sortedEntries.length - 1].weight
      : startingWeight;

  const weightChange = startingWeight - currentWeight;

  const totalGoal = startingWeight - goalWeight;

  const celebrationStorageKey = `${storageKey}-celebrated-milestones`;

  const getProgressForWeight = (weight: number) => {
    if (totalGoal <= 0) {
      return 0;
    }

    return Math.max(
      0,

      Math.min(((startingWeight - weight) / totalGoal) * 100, 100),
    );
  };

  const progress = getProgressForWeight(currentWeight);

  const remainingWeight = Math.max(currentWeight - goalWeight, 0);

  const checkWeightMilestone = async (
    previousWeight: number,

    updatedWeight: number,
  ) => {
    const previousProgress = getProgressForWeight(previousWeight);

    const updatedProgress = getProgressForWeight(updatedWeight);

    if (updatedProgress <= previousProgress) {
      return;
    }

    const milestones = [25, 50, 75, 100];

    const savedMilestones = await AsyncStorage.getItem(celebrationStorageKey);

    const celebrated: number[] = savedMilestones
      ? JSON.parse(savedMilestones)
      : [];

    const newlyCrossed = milestones.filter(
      (milestone) =>
        previousProgress < milestone &&
        updatedProgress >= milestone &&
        !celebrated.includes(milestone),
    );

    if (newlyCrossed.length === 0) {
      return;
    }

    const milestone = Math.max(...newlyCrossed);

    const updatedCelebrated = Array.from(
      new Set([...celebrated, ...newlyCrossed]),
    );

    await AsyncStorage.setItem(
      celebrationStorageKey,

      JSON.stringify(updatedCelebrated),
    );

    if (milestone === 100) {
      setCelebrationEmoji("🏆");

      setCelebrationTitle("Hambalyo! Hadafkaagii waad gaartay!");

      setCelebrationMessage(
        "Waxaad gaartay hadafkii miisaankaaga. Joogteyntaada iyo dadaalkaaga ayaa ku keenay heerkan. Aad ayaan kuugu faraxsanahay! 💜",
      );
    } else if (milestone === 75) {
      setCelebrationEmoji("🌟");

      setCelebrationTitle("75% ayaad gaartay!");

      setCelebrationMessage(
        "Waxaad aad ugu dhowdahay hadafkaaga. Sii wad daryeelka naftaada iyo tallaabooyinka caafimaadka leh. 💜",
      );
    } else if (milestone === 50) {
      setCelebrationEmoji("🎊");

      setCelebrationTitle("Kala bar ayaad gaartay!");

      setCelebrationMessage(
        "Waxaad gaartay 50% safarkaaga miisaanka. Tani waa horumar weyn — sii wad sida joogtada ah. 💜",
      );
    } else {
      setCelebrationEmoji("🎉");

      setCelebrationTitle("25% ayaad gaartay!");

      setCelebrationMessage(
        "Waxaad gaartay heerkaaga ugu horreeya ee weyn. Tallaabooyinka yar-yar ayaa isu beddelaya horumar dhab ah. 💜",
      );
    }

    setCelebrationVisible(true);
  };

  const saveWeight = async () => {
    setError("");

    const parsedWeight = Number(newWeight);

    if (!newWeight.trim() || !Number.isFinite(parsedWeight)) {
      setError("Fadlan geli miisaan sax ah.");

      return;
    }

    if (parsedWeight <= 0) {
      setError("Miisaanku waa inuu ka weyn yahay 0.");

      return;
    }

    if (
      (weightUnit === "lb" && parsedWeight < 50) ||
      (weightUnit === "kg" && parsedWeight < 20)
    ) {
      setError("Fadlan hubi miisaanka aad gelisay.");

      return;
    }

    if (
      (weightUnit === "lb" && parsedWeight > 700) ||
      (weightUnit === "kg" && parsedWeight > 320)
    ) {
      setError("Fadlan hubi miisaanka aad gelisay.");

      return;
    }

    const entry: WeightEntry = {
      id: `${Date.now()}`,

      weight: Math.round(parsedWeight * 10) / 10,

      date: new Date().toISOString(),
    };

    const today = new Date().toISOString().slice(0, 10);

    const updated = [
      ...entries.filter(
        (item) =>
          item.id === "starting-weight" || item.date.slice(0, 10) !== today,
      ),
      entry,
    ];

    setEntries(updated);

    await saveEntries(updated);

    await checkWeightMilestone(currentWeight, entry.weight);

    setNewWeight("");

    setShowEntryForm(false);
  };

  const deleteEntry = async (id: string) => {
    if (id === "starting-weight") {
      return;
    }

    const updated = entries.filter((entry) => entry.id !== id);

    setEntries(updated);

    await saveEntries(updated);
  };

  const formatDate = (date: string) => {
    const value = new Date(date);

    return value.toLocaleDateString(undefined, {
      month: "short",

      day: "numeric",

      year: "numeric",
    });
  };

  const rangeDays =
    range === "1W" ? 7 : range === "1M" ? 30 : range === "3M" ? 90 : 99999;
  const cutoff = Date.now() - rangeDays * 86400000;
  const graphEntries =
    range === "ALL"
      ? sortedEntries
      : sortedEntries.filter((e) => new Date(e.date).getTime() >= cutoff);

  const graphWeights = graphEntries.map((entry) => entry.weight);

  const maxGraphWeight =
    graphWeights.length > 0 ? Math.max(...graphWeights) : startingWeight;

  const minGraphWeight =
    graphWeights.length > 0 ? Math.min(...graphWeights) : startingWeight;

  const graphRange = Math.max(maxGraphWeight - minGraphWeight, 1);

  const getBarHeight = (weight: number) => {
    const normalized = (weight - minGraphWeight) / graphRange;

    return 45 + normalized * 85;
  };

  const getProgressMessage = () => {
    if (currentWeight <= goalWeight) {
      return "Waxaad gaartay hadafkaaga 🎉";
    }

    if (weightChange > 0) {
      return `Waxaad lumisay ${Math.round(weightChange * 10) / 10} ${weightUnit} 🎉`;
    }

    if (weightChange < 0) {
      return `Miisaankaagu wuxuu ka beddelmay bilowgii ${Math.abs(
        Math.round(weightChange * 10) / 10,
      )} ${weightUnit}.`;
    }

    return "Tani waa meesha aad ka bilaabayso 💜";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {showWeeklyFoodCheck && (
        <View style={styles.newWeekCard}>
          <View style={styles.newWeekIcon}>
            <Text style={styles.newWeekIconText}>🌿</Text>
          </View>

          <View style={styles.newWeekContent}>
            <Text style={styles.newWeekLabel}>CAATO • TODDOBAAD CUSUB</Text>

            <Text style={styles.newWeekTitle}>
              Aan qorshayno toddobaadkaaga
            </Text>

            <Text style={styles.newWeekText}>
              Cuntooyinkii toddobaadkii hore weli ma haysataa, mise waxaad
              rabtaa inaad wax ka beddesho?
            </Text>

            <View style={styles.newWeekButtons}>
              <Pressable
                style={styles.reuseWeekButton}
                onPress={usePreviousWeekFoods}
              >
                <Text style={styles.reuseWeekButtonText}>
                  ✓ Isticmaal kuwii hore
                </Text>
              </Pressable>

              <Pressable
                style={styles.editWeekButton}
                onPress={editWeeklyFoods}
              >
                <Text style={styles.editWeekButtonText}>✏️ Wax ka beddel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
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
        <Text style={styles.eyebrow}>CAATOAI • SAFARKAAGA</Text>
        <Text style={styles.title}>Maanta 🌿</Text>

        <Text style={styles.subtitle}>
          La soco horumarkaaga si tartiib ah oo joogto ah.
        </Text>

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>
              Horumarka waa la soo gelinayaa...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.mainCard}>
              <Text style={styles.cardLabel}>Miisaanka hadda</Text>

              <View style={styles.weightRow}>
                <Text style={styles.currentWeight}>{currentWeight}</Text>

                <Text style={styles.unit}>{weightUnit}</Text>
              </View>

              <Text style={styles.progressText}>{getProgressMessage()}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Bilowga</Text>

                <Text style={styles.statValue}>
                  {startingWeight} {weightUnit}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Hadafka</Text>

                <Text style={styles.statValue}>
                  {goalWeight} {weightUnit}
                </Text>
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Horumarka hadafka</Text>

                <Text style={styles.percent}>{Math.round(progress)}%</Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,

                    {
                      width: `${progress}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.remainingText}>
                {remainingWeight > 0
                  ? `${Math.round(remainingWeight * 10) / 10} ${weightUnit} ayaa kuu haray`
                  : "Hadafkaaga waad gaartay 🎉"}
              </Text>
            </View>

            {!showEntryForm ? (
              <Pressable
                onPress={() => {
                  setShowEntryForm(true);

                  setError("");
                }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>
                  + Geli miisaanka maanta
                </Text>
              </Pressable>
            ) : (
              <View style={styles.entryCard}>
                <Text style={styles.entryTitle}>Miisaanka maanta</Text>

                <Text style={styles.entrySubtitle}>
                  Geli miisaankaaga cusub.
                </Text>

                <View style={styles.inputRow}>
                  <TextInput
                    value={newWeight}
                    onChangeText={setNewWeight}
                    placeholder={
                      weightUnit === "lb" ? "Tusaale: 180" : "Tusaale: 82"
                    }
                    placeholderTextColor="#A78BFA"
                    keyboardType="decimal-pad"
                    style={styles.weightInput}
                    autoFocus
                  />

                  <Text style={styles.inputUnit}>{weightUnit}</Text>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <View style={styles.entryButtons}>
                  <Pressable
                    onPress={() => {
                      setShowEntryForm(false);

                      setNewWeight("");

                      setError("");
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Jooji</Text>
                  </Pressable>

                  <Pressable onPress={saveWeight} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Kaydi</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.dailyCard}>
              <View style={styles.dailyHeader}>
                <View>
                  <Text style={styles.dailyTitle}>Hadafyada maanta</Text>
                  <Text style={styles.dailySub}>
                    Caadooyinkaaga maalinlaha ah
                  </Text>
                </View>
                <Text style={styles.dailyCount}>
                  {
                    [
                      mealDone,
                      steps >= 5000,
                      waterCups >= 8,
                      lessonDone,
                    ].filter(Boolean).length
                  }
                  /4
                </Text>
              </View>

              <Pressable
                style={styles.taskRow}
                onPress={async () => {
                  const n = !mealDone;
                  setMealDone(n);
                  await saveDailyChecks(waterCups, steps, n, lessonDone);
                }}
              >
                <Text style={styles.taskIcon}>{mealDone ? "✓" : "○"}</Text>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>🥗 Raac qorshaha cuntada</Text>
                  <Text style={styles.taskSub}>Cun qorshahaaga maanta</Text>
                </View>
              </Pressable>

              <View style={styles.taskRow}>
                <Text style={styles.taskIcon}>{steps >= 5000 ? "✓" : "○"}</Text>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>🚶 Dhaqdhaqaaq</Text>
                  <Text style={styles.taskSub}>
                    {steps.toLocaleString()} / 5,000 tallaabo
                  </Text>
                </View>
                <View style={styles.stepButtons}>
                  <Pressable onPress={addSteps} style={styles.miniButton}>
                    <Text style={styles.miniButtonText}>+500</Text>
                  </Pressable>

                  <Pressable
                    onPress={async () => {
                      const next = 5000;
                      setSteps(next);

                      await saveDailyChecks(
                        waterCups,
                        next,
                        mealDone,
                        lessonDone,
                      );
                    }}
                    style={styles.doneButton}
                  >
                    <Text style={styles.doneButtonText}>✓ Waan dhammeeyay</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.taskRow}>
                <Text style={styles.taskIcon}>
                  {waterCups >= 8 ? "✓" : "○"}
                </Text>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>💧 Biyo</Text>
                  <Text style={styles.taskSub}>{waterCups}/8 koob</Text>
                </View>
                <View style={styles.waterButtons}>
                  <View style={styles.counter}>
                    <Pressable
                      onPress={() => changeWater(-1)}
                      style={styles.counterBtn}
                    >
                      <Text style={styles.counterText}>−</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => changeWater(1)}
                      style={styles.counterBtn}
                    >
                      <Text style={styles.counterText}>+</Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={async () => {
                      const next = 8;
                      setWaterCups(next);

                      await saveDailyChecks(next, steps, mealDone, lessonDone);
                    }}
                    style={styles.doneButton}
                  >
                    <Text style={styles.doneButtonText}>✓ Waan dhammeeyay</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={styles.taskRow}
                onPress={() => router.push("/daily-lesson")}
              >
                <Text style={styles.taskIcon}>{lessonDone ? "✓" : "○"}</Text>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>📖 Casharka maanta</Text>
                  <Text style={styles.taskSub}>
                    3–5 daqiiqo • Baro caado yar maanta
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>

            <View style={styles.lessonCard}>
              <Text style={styles.lessonTag}>
                CASHARKA MAANTA • 3–5 DAQIIQO
              </Text>
              <Text style={styles.lessonTitle}>Hal caado yar maanta 🌿</Text>
              <Text style={styles.lessonText}>
                Baro gaajada, rabitaanka cuntada iyo caadooyinka si tartiib ah.
              </Text>
              <Pressable
                onPress={() => router.push("/daily-lesson")}
                style={styles.lessonButton}
              >
                <Text style={styles.lessonButtonText}>
                  {lessonDone ? "✓ Eeg casharka maanta" : "Bilow casharka →"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>📈 Horumarka miisaanka</Text>

              <Text style={styles.chartSubtitle}>
                Dooro muddada aad rabto inaad aragto
              </Text>

              <View style={styles.rangeRow}>
                {(["1W", "1M", "3M", "ALL"] as const).map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setRange(item)}
                    style={[
                      styles.rangeButton,
                      range === item && styles.rangeButtonOn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.rangeText,
                        range === item && styles.rangeTextOn,
                      ]}
                    >
                      {item === "ALL" ? "Dhammaan" : item}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {graphEntries.length > 1 ? (
                <View style={styles.chartArea}>
                  {graphEntries.map((entry) => (
                    <View key={entry.id} style={styles.chartColumn}>
                      <Text style={styles.chartWeight}>{entry.weight}</Text>

                      <View
                        style={[
                          styles.chartBar,

                          {
                            height: getBarHeight(entry.weight),
                          },
                        ]}
                      />

                      <Text style={styles.chartDate}>
                        {new Date(entry.date).toLocaleDateString(undefined, {
                          month: "numeric",

                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={styles.emptyChartText}>
                    Marka aad geliso miisaankaaga xiga, graph-ka horumarka ayaa
                    halkan kasoo muuqan doona.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>🗓️ Taariikhda miisaanka</Text>

              {[...sortedEntries].reverse().map((entry, index) => (
                <View key={entry.id} style={styles.historyRow}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyWeight}>
                      {entry.weight} {weightUnit}
                    </Text>

                    <Text style={styles.historyDate}>
                      {entry.id === "starting-weight"
                        ? "Miisaanka bilowga"
                        : formatDate(entry.date)}
                    </Text>
                  </View>

                  {index === 0 && entry.id !== "starting-weight" ? (
                    <View style={styles.latestBadge}>
                      <Text style={styles.latestBadgeText}>Hadda</Text>
                    </View>
                  ) : null}

                  {entry.id !== "starting-weight" ? (
                    <Pressable
                      onPress={() => deleteEntry(entry.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>Tirtir</Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </View>

            <View style={styles.weekCard}>
              <Text style={styles.historyTitle}>✨ Toddobaadkan</Text>
              <View style={styles.weekRow}>
                <View style={styles.weekStat}>
                  <Text style={styles.weekBig}>
                    {weightChange > 0 ? "↓ " : ""}
                    {Math.abs(Math.round(weightChange * 10) / 10)}
                  </Text>
                  <Text style={styles.weekLabel}>{weightUnit} isbeddel</Text>
                </View>
                <View style={styles.weekStat}>
                  <Text style={styles.weekBig}>
                    {
                      [
                        mealDone,
                        steps >= 5000,
                        waterCups >= 8,
                        lessonDone,
                      ].filter(Boolean).length
                    }
                    /4
                  </Text>
                  <Text style={styles.weekLabel}>maanta</Text>
                </View>
                <View style={styles.weekStat}>
                  <Text style={styles.weekBig}>{waterCups}</Text>
                  <Text style={styles.weekLabel}>koob biyo</Text>
                </View>
              </View>
            </View>

            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementEmoji}>🌷</Text>

              <View style={styles.encouragementContent}>
                <Text style={styles.encouragementTitle}>CaatoAI</Text>

                <Text style={styles.encouragementText}>
                  Isbeddel yar oo joogto ah ayaa muhiim ah. Miisaanku maalinba
                  maalinta ka dambaysa wuu is beddeli karaa. Waxaan diiradda
                  saaraynaa jihada guud ee horumarkaaga, ma aha hal maalin oo
                  keliya.
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <CelebrationModal
        visible={celebrationVisible}
        title={celebrationTitle}
        message={celebrationMessage}
        emoji={celebrationEmoji}
        onClose={() => setCelebrationVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFBF5",
  },

  content: {
    flexGrow: 1,

    paddingHorizontal: 22,

    paddingTop: 22,

    paddingBottom: 50,

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
    color: "#166534",

    fontSize: 16,

    fontWeight: "700",
  },

  title: {
    color: "#166534",

    fontSize: 28,

    fontWeight: "900",

    marginBottom: 6,
  },

  subtitle: {
    color: "#6B7280",

    fontSize: 15,

    lineHeight: 22,

    marginBottom: 24,
  },

  loadingCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 18,

    padding: 20,
  },

  loadingText: {
    color: "#166534",

    fontWeight: "700",
  },

  mainCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 22,

    padding: 22,

    marginBottom: 14,
  },

  cardLabel: {
    color: "#6B7280",

    fontSize: 14,

    fontWeight: "700",
  },

  weightRow: {
    flexDirection: "row",

    alignItems: "flex-end",

    marginTop: 5,
  },

  currentWeight: {
    color: "#166534",

    fontSize: 44,

    fontWeight: "900",
  },

  unit: {
    color: "#166534",

    fontSize: 18,

    fontWeight: "800",

    marginLeft: 6,

    marginBottom: 7,
  },

  progressText: {
    color: "#166534",

    fontSize: 14,

    fontWeight: "800",

    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 14,
  },

  statCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E7E5E4",

    borderRadius: 18,

    padding: 17,
  },

  statLabel: {
    color: "#6B7280",

    fontSize: 13,

    marginBottom: 5,
  },

  statValue: {
    color: "#1F2937",

    fontSize: 19,

    fontWeight: "900",
  },

  goalCard: {
    backgroundColor: "#E7E5E4",

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,
  },

  goalHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginBottom: 12,
  },

  goalTitle: {
    color: "#1F2937",

    fontSize: 15,

    fontWeight: "800",
  },

  percent: {
    color: "#166534",

    fontSize: 15,

    fontWeight: "900",
  },

  progressBackground: {
    height: 11,

    backgroundColor: "#D1FAE5",

    borderRadius: 20,

    overflow: "hidden",
  },

  progressFill: {
    height: "100%",

    backgroundColor: "#166534",

    borderRadius: 20,
  },

  remainingText: {
    color: "#166534",

    fontSize: 13,

    fontWeight: "700",

    marginTop: 10,
  },

  addButton: {
    backgroundColor: "#166534",

    borderRadius: 18,

    paddingVertical: 17,

    alignItems: "center",

    marginBottom: 18,
  },

  addButtonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "900",
  },

  entryCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,
  },

  entryTitle: {
    color: "#1F2937",

    fontSize: 18,

    fontWeight: "900",

    marginBottom: 4,
  },

  entrySubtitle: {
    color: "#6B7280",

    fontSize: 13,

    marginBottom: 14,
  },

  inputRow: {
    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#86EFAC",

    backgroundColor: "#F0FDF4",

    borderRadius: 14,
  },

  weightInput: {
    flex: 1,

    paddingHorizontal: 14,

    paddingVertical: 14,

    fontSize: 18,

    color: "#1F2937",
  },

  inputUnit: {
    paddingRight: 16,

    color: "#166534",

    fontWeight: "900",
  },

  errorText: {
    color: "#166534",

    marginTop: 8,

    fontSize: 13,

    fontWeight: "700",
  },

  entryButtons: {
    flexDirection: "row",

    gap: 10,

    marginTop: 14,
  },

  cancelButton: {
    flex: 1,

    backgroundColor: "#E7E5E4",

    borderRadius: 14,

    paddingVertical: 13,

    alignItems: "center",
  },

  cancelButtonText: {
    color: "#166534",

    fontWeight: "800",
  },

  saveButton: {
    flex: 1,

    backgroundColor: "#166534",

    borderRadius: 14,

    paddingVertical: 13,

    alignItems: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",

    fontWeight: "900",
  },

  chartCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,
  },

  chartTitle: {
    color: "#1F2937",

    fontSize: 17,

    fontWeight: "900",
  },

  chartSubtitle: {
    color: "#6B7280",

    fontSize: 12,

    marginTop: 3,

    marginBottom: 20,
  },

  chartArea: {
    height: 180,

    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-around",
  },

  chartColumn: {
    flex: 1,

    alignItems: "center",

    justifyContent: "flex-end",
  },

  chartWeight: {
    color: "#166534",

    fontSize: 11,

    fontWeight: "800",

    marginBottom: 5,
  },

  chartBar: {
    width: 20,

    backgroundColor: "#166534",

    borderRadius: 10,
  },

  chartDate: {
    color: "#9CA3AF",

    fontSize: 10,

    marginTop: 6,
  },

  emptyChart: {
    backgroundColor: "#F0FDF4",

    borderRadius: 14,

    padding: 16,
  },

  emptyChartText: {
    color: "#6B7280",

    fontSize: 13,

    lineHeight: 19,
  },

  historyCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 20,

    padding: 18,

    marginBottom: 18,
  },

  historyTitle: {
    color: "#1F2937",

    fontSize: 17,

    fontWeight: "900",

    marginBottom: 12,
  },

  historyRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor: "#E7E5E4",
  },

  historyLeft: {
    flex: 1,
  },

  historyWeight: {
    color: "#1F2937",

    fontSize: 16,

    fontWeight: "900",
  },

  historyDate: {
    color: "#9CA3AF",

    fontSize: 12,

    marginTop: 3,
  },

  latestBadge: {
    backgroundColor: "#DCFCE7",

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 10,

    marginRight: 8,
  },

  latestBadgeText: {
    color: "#166534",

    fontSize: 11,

    fontWeight: "900",
  },

  deleteButton: {
    paddingHorizontal: 8,

    paddingVertical: 7,
  },

  deleteButtonText: {
    color: "#9CA3AF",

    fontSize: 12,

    fontWeight: "700",
  },

  encouragementCard: {
    flexDirection: "row",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D1FAE5",

    borderRadius: 18,

    padding: 16,
  },

  encouragementEmoji: {
    fontSize: 25,

    marginRight: 12,
  },

  encouragementContent: {
    flex: 1,
  },

  encouragementTitle: {
    color: "#166534",

    fontSize: 14,

    fontWeight: "900",

    marginBottom: 4,
  },

  encouragementText: {
    color: "#6B7280",

    fontSize: 14,

    lineHeight: 20,
  },

  dailyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  dailyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dailyTitle: { fontSize: 18, fontWeight: "900", color: "#1F2937" },
  dailySub: { fontSize: 11, color: "#6B7280", marginTop: 3 },
  dailyCount: { fontSize: 20, fontWeight: "900", color: "#166534" },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  taskIcon: { width: 32, fontSize: 20, fontWeight: "900", color: "#166534" },
  taskText: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: "900", color: "#1F2937" },
  taskSub: { fontSize: 11, color: "#6B7280", marginTop: 3 },
  miniButton: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },
  miniButtonText: { color: "#166534", fontSize: 11, fontWeight: "900" },
  counter: { flexDirection: "row", gap: 6 },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: { fontSize: 19, fontWeight: "900", color: "#166534" },
  chevron: { fontSize: 26, color: "#166534", fontWeight: "800" },
  lessonCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  lessonTag: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#15803D",
  },
  lessonTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#1F2937",
    marginTop: 7,
  },
  lessonText: { fontSize: 13, lineHeight: 19, color: "#4B5563", marginTop: 6 },
  lessonButton: {
    backgroundColor: "#166534",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 14,
  },
  lessonButtonText: { color: "#FFFFFF", fontWeight: "900" },
  rangeRow: { flexDirection: "row", gap: 7, marginBottom: 12 },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#F5F5F4",
  },
  rangeButtonOn: { backgroundColor: "#166534" },
  rangeText: { fontSize: 11, fontWeight: "800", color: "#57534E" },
  rangeTextOn: { color: "#FFFFFF" },
  weekCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5E4",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  weekRow: { flexDirection: "row" },
  weekStat: { flex: 1, alignItems: "center" },
  weekBig: { fontSize: 20, fontWeight: "900", color: "#166534" },
  weekLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    color: "#15803D",
    marginBottom: 7,
  },
  stepButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  doneButton: {
    backgroundColor: "#166534",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  waterButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  newWeekCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  newWeekIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  newWeekIconText: {
    fontSize: 22,
  },

  newWeekContent: {
    flex: 1,
  },

  newWeekLabel: {
    color: "#15803D",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 5,
  },

  newWeekTitle: {
    color: "#14532D",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  newWeekText: {
    color: "#4B5563",
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 13,
  },

  newWeekButtons: {
    gap: 8,
  },

  reuseWeekButton: {
    minHeight: 42,
    borderRadius: 13,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  reuseWeekButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },

  editWeekButton: {
    minHeight: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  editWeekButtonText: {
    color: "#15803D",
    fontSize: 11,
    fontWeight: "900",
  },
});
