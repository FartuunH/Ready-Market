import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
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

  useEffect(() => {
    loadWeightHistory();
  }, []);

  const loadWeightHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        const parsed: WeightEntry[] = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
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

    const updated = [...entries, entry];

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

  const graphEntries = sortedEntries.slice(-7);

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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Miisaankayga 💜</Text>

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

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>📈 Horumarka miisaanka</Text>

              <Text style={styles.chartSubtitle}>
                7-da diiwaan ee ugu dambeeyay
              </Text>

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
    backgroundColor: "#FFF7FC",
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
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    color: "#6D28D9",
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
    borderColor: "#E9D5FF",
    borderRadius: 18,
    padding: 20,
  },

  loadingText: {
    color: "#7C3AED",
    fontWeight: "700",
  },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
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
    color: "#6D28D9",
    fontSize: 44,
    fontWeight: "900",
  },

  unit: {
    color: "#7C3AED",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 6,
    marginBottom: 7,
  },

  progressText: {
    color: "#EC4899",
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
    borderColor: "#F3E8FF",
    borderRadius: 18,
    padding: 17,
  },

  statLabel: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 5,
  },

  statValue: {
    color: "#3B0764",
    fontSize: 19,
    fontWeight: "900",
  },

  goalCard: {
    backgroundColor: "#F3E8FF",
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
    color: "#3B0764",
    fontSize: 15,
    fontWeight: "800",
  },

  percent: {
    color: "#EC4899",
    fontSize: 15,
    fontWeight: "900",
  },

  progressBackground: {
    height: 11,
    backgroundColor: "#E9D5FF",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#EC4899",
    borderRadius: 20,
  },

  remainingText: {
    color: "#6D28D9",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },

  addButton: {
    backgroundColor: "#EC4899",
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
    borderColor: "#E9D5FF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  entryTitle: {
    color: "#3B0764",
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
    borderColor: "#D8B4FE",
    backgroundColor: "#FFF7FC",
    borderRadius: 14,
  },

  weightInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: "#3B0764",
  },

  inputUnit: {
    paddingRight: 16,
    color: "#7C3AED",
    fontWeight: "900",
  },

  errorText: {
    color: "#BE185D",
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
    backgroundColor: "#F3E8FF",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#7C3AED",
    fontWeight: "800",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#EC4899",
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
    borderColor: "#E9D5FF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  chartTitle: {
    color: "#3B0764",
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
    color: "#6D28D9",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 5,
  },

  chartBar: {
    width: 20,
    backgroundColor: "#EC4899",
    borderRadius: 10,
  },

  chartDate: {
    color: "#9CA3AF",
    fontSize: 10,
    marginTop: 6,
  },

  emptyChart: {
    backgroundColor: "#FFF7FC",
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
    borderColor: "#E9D5FF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },

  historyTitle: {
    color: "#3B0764",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E8FF",
  },

  historyLeft: {
    flex: 1,
  },

  historyWeight: {
    color: "#3B0764",
    fontSize: 16,
    fontWeight: "900",
  },

  historyDate: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 3,
  },

  latestBadge: {
    backgroundColor: "#FCE7F3",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 8,
  },

  latestBadgeText: {
    color: "#BE185D",
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
    borderColor: "#E9D5FF",
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
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  encouragementText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
});
