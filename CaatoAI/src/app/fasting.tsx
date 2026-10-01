import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

const FASTING_SETTINGS_KEY = "caatoai-fasting-settings-v1";

const ACTIVE_FAST_KEY = "caatoai-active-fast-v1";

const FASTING_HISTORY_KEY = "caatoai-fasting-history-v1";

type FastingPlan = "normal" | "14:10" | "16:8" | "OMAD";

type Period = "AM" | "PM";

const PLAN_INFO: Record<
  FastingPlan,
  { fastHours: number; eatingHours: number; description: string }
> = {
  normal: {
    fastHours: 0,
    eatingHours: 24,
    description: "3 cunto + 1 cunto fudud • Soon ma jiro",
  },

  "14:10": {
    fastHours: 14,

    eatingHours: 10,

    description: "Bilow fudud • 14 saac soon • 10 saac cunto",
  },

  "16:8": {
    fastHours: 16,

    eatingHours: 8,

    description: "16 saac soon • 8 saac cunto",
  },

  OMAD: {
    fastHours: 23,

    eatingHours: 1,

    description: "Hal waqti cunto maalintii • Qorshe adag",
  },
};

function to24Hour(hour: number, minute: number, period: Period) {
  let h = hour % 12;

  if (period === "PM") h += 12;

  return h * 60 + minute;
}

function fromMinutes(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;

  const hour24 = Math.floor(normalized / 60);

  const minute = normalized % 60;

  const period: Period = hour24 >= 12 ? "PM" : "AM";

  const hour12 = hour24 % 12 || 12;

  return {
    hour: hour12,

    minute,

    period,

    label: `${hour12}:${String(minute).padStart(2, "0")} ${period}`,
  };
}

function TimeAdjuster({
  hour,

  minute,

  period,

  onChange,
}: {
  hour: number;

  minute: number;

  period: Period;

  onChange: (hour: number, minute: number, period: Period) => void;
}) {
  const adjustHour = (amount: number) => {
    let next = hour + amount;

    if (next > 12) next = 1;

    if (next < 1) next = 12;

    onChange(next, minute, period);
  };

  const adjustMinute = () => {
    const nextMinute = minute === 0 ? 30 : 0;

    onChange(hour, nextMinute, period);
  };

  return (
    <View style={styles.timeAdjuster}>
      <View style={styles.timeColumn}>
        <Pressable onPress={() => adjustHour(1)} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>+</Text>
        </Pressable>

        <Text style={styles.timeNumber}>{hour}</Text>

        <Pressable onPress={() => adjustHour(-1)} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>−</Text>
        </Pressable>
      </View>

      <Text style={styles.colon}>:</Text>

      <Pressable onPress={adjustMinute} style={styles.minuteButton}>
        <Text style={styles.timeNumber}>{String(minute).padStart(2, "0")}</Text>

        <Text style={styles.tapHint}>taabo</Text>
      </Pressable>

      <View style={styles.periodWrap}>
        {(["AM", "PM"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => onChange(hour, minute, item)}
            style={[
              styles.periodButton,

              period === item && styles.periodButtonOn,
            ]}
          >
            <Text
              style={[
                styles.periodText,

                period === item && styles.periodTextOn,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function FastingScreen() {
  const [plan, setPlan] = useState<FastingPlan>("normal");

  const [startHour, setStartHour] = useState(8);

  const [startMinute, setStartMinute] = useState(0);

  const [startPeriod, setStartPeriod] = useState<Period>("PM");

  const [activeFast, setActiveFast] = useState<any>(null);

  const [history, setHistory] = useState<any[]>([]);

  const [now, setNow] = useState(Date.now());

  const [loaded, setLoaded] = useState(false);

  const info = PLAN_INFO[plan] ?? PLAN_INFO.normal;

  useEffect(() => {
    const load = async () => {
      try {
        const settingsRaw = await AsyncStorage.getItem(FASTING_SETTINGS_KEY);

        if (settingsRaw) {
          const saved = JSON.parse(settingsRaw);

          if (saved?.plan && PLAN_INFO[saved.plan as FastingPlan]) {
            setPlan(saved.plan);
          }

          if (Number.isFinite(saved?.startHour)) setStartHour(saved.startHour);

          if (Number.isFinite(saved?.startMinute))
            setStartMinute(saved.startMinute);

          if (saved?.startPeriod === "AM" || saved?.startPeriod === "PM") {
            setStartPeriod(saved.startPeriod);
          }
        }

        const activeRaw = await AsyncStorage.getItem(ACTIVE_FAST_KEY);

        if (activeRaw) setActiveFast(JSON.parse(activeRaw));

        const historyRaw = await AsyncStorage.getItem(FASTING_HISTORY_KEY);

        if (historyRaw) {
          const parsedHistory = JSON.parse(historyRaw);

          setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
        }
      } catch (error) {
        console.log("Fasting load error:", error);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      FASTING_SETTINGS_KEY,

      JSON.stringify({
        plan,

        startHour,

        startMinute,

        startPeriod,
      }),
    ).catch((error) => console.log("Fasting settings save error:", error));
  }, [plan, startHour, startMinute, startPeriod, loaded]);

  useEffect(() => {
    if (!activeFast) return;

    setNow(Date.now());

    const timer = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(timer);
  }, [activeFast]);

  const activeStats = useMemo(() => {
    if (!activeFast?.startedAt || !activeFast?.endsAt) return null;

    const started = new Date(activeFast.startedAt).getTime();

    const ends = new Date(activeFast.endsAt).getTime();

    const total = Math.max(1, ends - started);

    const elapsed = Math.max(0, Math.min(now - started, total));

    const remaining = Math.max(0, ends - now);

    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

    const formatDuration = (ms: number) => {
      const totalSeconds = Math.floor(ms / 1000);

      const hours = Math.floor(totalSeconds / 3600);

      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const seconds = totalSeconds % 60;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,

        "0",
      )}:${String(seconds).padStart(2, "0")}`;
    };

    const formatClock = (iso: string) =>
      new Date(iso).toLocaleTimeString([], {
        hour: "numeric",

        minute: "2-digit",
      });

    return {
      elapsed,

      remaining,

      progress,

      remainingLabel: formatDuration(remaining),

      elapsedLabel: formatDuration(elapsed),

      startLabel: formatClock(activeFast.startedAt),

      endLabel: formatClock(activeFast.endsAt),

      goalReached: remaining === 0,
    };
  }, [activeFast, now]);

  const schedule = useMemo(() => {
    const start = to24Hour(startHour, startMinute, startPeriod);

    const end = fromMinutes(start + info.fastHours * 60);

    return {
      startLabel: `${startHour}:${String(startMinute).padStart(
        2,

        "0",
      )} ${startPeriod}`,

      endLabel: end.label,
    };
  }, [startHour, startMinute, startPeriod, info.fastHours]);

  const selectPlan = async (nextPlan: FastingPlan) => {
    if (nextPlan === "normal" && activeFast) {
      Alert.alert(
        "Soon ayaa socda",
        "Marka hore dhammee soonka socda ka hor intaadan u beddelin Cunto Caadi ah.",
      );
      return;
    }

    setPlan(nextPlan);

    try {
      await AsyncStorage.setItem(
        FASTING_SETTINGS_KEY,
        JSON.stringify({ plan: nextPlan, startHour, startMinute, startPeriod }),
      );
    } catch (error) {
      console.log("Eating style save error:", error);
    }
  };

  const startFast = async () => {
    if (plan === "normal") return;

    if (activeFast) {
      Alert.alert(
        "Soon ayaa socda",

        "Waxaad hore u bilowday soon. Tallaabada xigta waxaan ku dari doonaa timer-ka iyo dhammeystirka soonka.",
      );

      return;
    }

    const startedAt = new Date();

    const endsAt = new Date(
      startedAt.getTime() + info.fastHours * 60 * 60 * 1000,
    );

    const nextFast = {
      plan,

      fastHours: info.fastHours,

      eatingHours: info.eatingHours,

      startedAt: startedAt.toISOString(),

      endsAt: endsAt.toISOString(),
    };

    try {
      await AsyncStorage.setItem(ACTIVE_FAST_KEY, JSON.stringify(nextFast));

      setActiveFast(nextFast);

      Alert.alert(
        "Soonka waa la bilaabay ✓",

        `${plan} ayaa bilaabmay. Step 2 waxaan ku dari doonaa timer-ka nool iyo badhanka Dhammee soonka.`,
      );
    } catch (error) {
      console.log("Start fast error:", error);

      Alert.alert("Waxbaa qaldamay", "Soonka lama bilaabi karin.");
    }
  };

  const finishFast = async () => {
    if (!activeFast?.startedAt) return;

    const endedAt = new Date();

    const startedAt = new Date(activeFast.startedAt);

    const actualMinutes = Math.max(
      0,

      Math.round((endedAt.getTime() - startedAt.getTime()) / 60000),
    );

    const entry = {
      id: `${Date.now()}`,

      plan: activeFast.plan,

      startedAt: activeFast.startedAt,

      endedAt: endedAt.toISOString(),

      plannedHours: activeFast.fastHours,

      actualMinutes,

      completedGoal: activeStats?.goalReached ?? false,
    };

    try {
      const nextHistory = [entry, ...history].slice(0, 30);

      await AsyncStorage.setItem(
        FASTING_HISTORY_KEY,

        JSON.stringify(nextHistory),
      );

      await AsyncStorage.removeItem(ACTIVE_FAST_KEY);

      setHistory(nextHistory);

      setActiveFast(null);

      Alert.alert(
        "Soonka waa la dhammeeyay ✓",

        `Waxaad soontay ${Math.floor(actualMinutes / 60)} saac iyo ${
          actualMinutes % 60
        } daqiiqo.`,
      );
    } catch (error) {
      console.log("Finish fast error:", error);

      Alert.alert("Waxbaa qaldamay", "Soonka lama dhammeystiri karin.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Dib u noqo</Text>
      </Pressable>

      <Text style={styles.eyebrow}>CAATOAI • QAABKA CUNTADA</Text>

      <Text style={styles.title}>Qaabka cuntada 🍽️</Text>

      <Text style={styles.subtitle}>
        Dooro Cunto Caadi ah ama qorshaha soonka ee aad rabto. CaatoAI wuxuu
        qorshaha maanta iyo toddobaadka ula jaanqaadayaa doorashadaada.
      </Text>

      {activeFast && activeStats ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeLabel}>
            {activeStats.goalReached ? "HADAFKA WAA LA GAARAY" : "SOON SOCDA"}
          </Text>

          <Text style={styles.activeTitle}>{activeFast.plan}</Text>

          <Text style={styles.timerLabel}>
            {activeStats.goalReached
              ? "Waqtiga hadafka waa dhammaaday"
              : "Waqtiga kuu haray"}
          </Text>

          <Text style={styles.timerValue}>
            {activeStats.goalReached ? "00:00:00" : activeStats.remainingLabel}
          </Text>

          <View style={styles.fastProgressTrack}>
            <View
              style={[
                styles.fastProgressFill,

                { width: `${activeStats.progress}%` },
              ]}
            />
          </View>

          <Text style={styles.elapsedText}>
            {activeStats.elapsedLabel} ayaa dhammaatay
          </Text>

          <View style={styles.activeTimes}>
            <View style={styles.activeTimeBox}>
              <Text style={styles.activeTimeLabel}>Bilowday</Text>

              <Text style={styles.activeTimeValue}>
                {activeStats.startLabel}
              </Text>
            </View>

            <View style={styles.activeTimeBox}>
              <Text style={styles.activeTimeLabel}>Dhammaanaya</Text>

              <Text style={styles.activeTimeValue}>{activeStats.endLabel}</Text>
            </View>
          </View>

          <Pressable onPress={finishFast} style={styles.endFastButton}>
            <Text style={styles.endFastButtonText}>■ Dhammee soonka</Text>
          </Pressable>
        </View>
      ) : null}

      {!activeFast ? (
        <>
          <Text style={styles.sectionTitle}>Dooro qorshahaaga</Text>

          <View style={styles.planList}>
            {(Object.keys(PLAN_INFO) as FastingPlan[]).map((item) => {
              const selected = plan === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => selectPlan(item)}
                  style={[styles.planCard, selected && styles.planCardSelected]}
                >
                  <View style={styles.planTop}>
                    <Text
                      style={[
                        styles.planTitle,

                        selected && styles.planTitleSelected,
                      ]}
                    >
                      {item === "normal"
                        ? "🍽️ Cunto Caadi ah"
                        : item === "OMAD"
                          ? "🍽️ OMAD"
                          : `⏱️ ${item}`}
                    </Text>

                    <View
                      style={[styles.radio, selected && styles.radioSelected]}
                    >
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                  </View>

                  <Text style={styles.planDescription}>
                    {PLAN_INFO[item].description}
                  </Text>

                  {item === "14:10" ? (
                    <Text style={styles.recommended}>Bilow wanaagsan</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {plan === "normal" ? (
            <View style={styles.normalCard}>
              <Text style={styles.normalTitle}>🍽️ Cunto Caadi ah</Text>
              <Text style={styles.normalText}>
                CaatoAI wuxuu kuu diyaarinayaa Quraac, Qado, Casho iyo Cunto
                fudud. Qorshaha maanta iyo toddobaadka waxay si otomaatig ah ugu
                noqonayaan qaabka caadiga ah.
              </Text>
              <View style={styles.normalMealRow}>
                <Text style={styles.normalMeal}>🌅 Quraac</Text>
                <Text style={styles.normalMeal}>☀️ Qado</Text>
                <Text style={styles.normalMeal}>🌙 Casho</Text>
                <Text style={styles.normalMeal}>🍎 Cunto fudud</Text>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.scheduleCard}>
                <Text style={styles.scheduleTitle}>
                  Goorma ayuu soonku bilaabmaa?
                </Text>

                <Text style={styles.scheduleHelp}>
                  Waqtigaaga ku dooro AM ama PM. Daqiiqadaha taabo si aad ugu
                  beddesho :00 ama :30.
                </Text>

                <TimeAdjuster
                  hour={startHour}
                  minute={startMinute}
                  period={startPeriod}
                  onChange={(hour, minute, period) => {
                    setStartHour(hour);

                    setStartMinute(minute);

                    setStartPeriod(period);
                  }}
                />

                <View style={styles.windowCard}>
                  <View style={styles.windowRow}>
                    <Text style={styles.windowLabel}>🌙 Soonka bilaabma</Text>

                    <Text style={styles.windowValue}>
                      {schedule.startLabel}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.windowRow}>
                    <Text style={styles.windowLabel}>☀️ Soonka dhammaada</Text>

                    <Text style={styles.windowValue}>{schedule.endLabel}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.windowRow}>
                    <Text style={styles.windowLabel}>🍽️ Waqtiga cuntada</Text>

                    <Text style={styles.windowValue}>
                      {info.eatingHours} saac
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                disabled={!!activeFast}
                onPress={startFast}
                style={[
                  styles.startButton,

                  !!activeFast && styles.startButtonDisabled,
                ]}
              >
                <Text style={styles.startButtonText}>
                  {activeFast ? "✓ Soon ayaa socda" : "Bilow soonka →"}
                </Text>
              </Pressable>
            </>
          )}
        </>
      ) : null}

      {plan !== "normal" || activeFast ? (
        <>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>💧 Inta lagu jiro soonka</Text>

            <Text style={styles.noteText}>
              Biyo cab oo la soco sida aad dareemayso. Soonku ma beddelayo
              baahida jirkaaga ee nafaqo ku filan marka aad wax cunayso.
            </Text>
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>⚠️ Badbaadada soonka</Text>

            <Text style={styles.safetyText}>
              Soonku qof walba kuma habboona. Ha isticmaalin qorshe adag haddii
              aad uur leedahay ama naas nuujinayso, aad leedahay xaalad
              caafimaad ama daawo saameyn karta sonkorta dhiigga, ama aad
              leedahay taariikh dhibaato cunto. La tasho xirfadle caafimaad
              haddii aadan hubin. Jooji soonka haddii aad si xun u dareento.
            </Text>
          </View>
        </>
      ) : null}

      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>📊 Taariikhda soonka</Text>

        {history.length === 0 ? (
          <Text style={styles.historyEmpty}>
            Weli ma lihid soon dhammeystiran.
          </Text>
        ) : (
          history.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View>
                <Text style={styles.historyPlan}>{item.plan}</Text>

                <Text style={styles.historyDate}>
                  {new Date(item.endedAt).toLocaleDateString()}
                </Text>
              </View>

              <Text style={styles.historyDuration}>
                {Math.floor(item.actualMinutes / 60)}h {item.actualMinutes % 60}
                m
              </Text>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={styles.todayPlanButton}
        onPress={() => router.replace("/meal-plan")}
      >
        <Text style={styles.todayPlanButtonText}>
          🍽️ Ku noqo qorshaha maanta
        </Text>
      </Pressable>

      <Text style={styles.nextNote}>Cunto Caadi ah • 14:10 • 16:8 • OMAD</Text>
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

    marginBottom: 20,
  },

  activeCard: {
    backgroundColor: "#ECFDF5",

    borderWidth: 1,

    borderColor: "#86EFAC",

    borderRadius: 18,

    padding: 16,

    marginBottom: 20,
  },

  activeLabel: {
    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1,

    color: "#15803D",
  },

  activeTitle: {
    fontSize: 23,

    fontWeight: "900",

    color: "#166534",

    marginTop: 4,
  },

  activeText: {
    fontSize: 12,

    lineHeight: 19,

    color: "#4B5563",

    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 16,

    fontWeight: "900",

    color: "#1F2937",

    marginBottom: 10,
  },

  planList: {
    gap: 10,

    marginBottom: 18,
  },

  planCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 18,

    padding: 16,
  },

  planCardSelected: {
    borderWidth: 2,

    borderColor: "#16A34A",

    backgroundColor: "#F0FDF4",
  },

  planTop: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  planTitle: {
    fontSize: 18,

    fontWeight: "900",

    color: "#374151",
  },

  planTitleSelected: {
    color: "#166534",
  },

  planDescription: {
    fontSize: 12,

    lineHeight: 18,

    color: "#6B7280",

    marginTop: 5,
  },

  recommended: {
    alignSelf: "flex-start",

    marginTop: 9,

    borderRadius: 999,

    paddingHorizontal: 10,

    paddingVertical: 5,

    backgroundColor: "#DCFCE7",

    color: "#166534",

    fontSize: 10,

    fontWeight: "900",
  },

  radio: {
    width: 22,

    height: 22,

    borderRadius: 11,

    borderWidth: 2,

    borderColor: "#D1D5DB",

    alignItems: "center",

    justifyContent: "center",
  },

  radioSelected: {
    borderColor: "#16A34A",
  },

  radioDot: {
    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: "#16A34A",
  },

  normalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  normalTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#166534",
  },
  normalText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 19,
    color: "#4B5563",
  },
  normalMealRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 13,
  },
  normalMeal: {
    backgroundColor: "#F0FDF4",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
  },
  scheduleCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 20,

    padding: 18,

    marginBottom: 16,
  },

  scheduleTitle: {
    fontSize: 16,

    fontWeight: "900",

    color: "#1F2937",
  },

  scheduleHelp: {
    fontSize: 11,

    lineHeight: 17,

    color: "#6B7280",

    marginTop: 5,

    marginBottom: 16,
  },

  timeAdjuster: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,

    marginBottom: 18,
  },

  timeColumn: {
    alignItems: "center",

    gap: 5,
  },

  smallButton: {
    width: 38,

    height: 30,

    borderRadius: 10,

    backgroundColor: "#F3F4F6",

    alignItems: "center",

    justifyContent: "center",
  },

  smallButtonText: {
    fontSize: 19,

    fontWeight: "900",

    color: "#166534",
  },

  timeNumber: {
    fontSize: 28,

    fontWeight: "900",

    color: "#1F2937",
  },

  colon: {
    fontSize: 28,

    fontWeight: "900",

    color: "#1F2937",
  },

  minuteButton: {
    minWidth: 58,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 12,

    paddingVertical: 8,

    backgroundColor: "#F9FAFB",
  },

  tapHint: {
    fontSize: 8,

    fontWeight: "800",

    color: "#9CA3AF",
  },

  periodWrap: {
    flexDirection: "row",

    borderWidth: 1,

    borderColor: "#D1D5DB",

    borderRadius: 12,

    overflow: "hidden",
  },

  periodButton: {
    minWidth: 45,

    minHeight: 44,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "#FFFFFF",
  },

  periodButtonOn: {
    backgroundColor: "#DCFCE7",
  },

  periodText: {
    fontSize: 11,

    fontWeight: "900",

    color: "#6B7280",
  },

  periodTextOn: {
    color: "#166534",
  },

  windowCard: {
    backgroundColor: "#F9FAFB",

    borderRadius: 15,

    paddingHorizontal: 14,
  },

  windowRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    gap: 12,

    paddingVertical: 13,
  },

  windowLabel: {
    flex: 1,

    fontSize: 12,

    fontWeight: "800",

    color: "#4B5563",
  },

  windowValue: {
    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },

  divider: {
    height: 1,

    backgroundColor: "#E5E7EB",
  },

  startButton: {
    minHeight: 54,

    borderRadius: 16,

    backgroundColor: "#166534",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 14,
  },

  startButtonDisabled: {
    backgroundColor: "#86A990",
  },

  startButtonText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "900",
  },

  timerLabel: {
    marginTop: 14,

    fontSize: 11,

    fontWeight: "800",

    color: "#6B7280",
  },

  timerValue: {
    marginTop: 3,

    fontSize: 34,

    fontWeight: "900",

    color: "#166534",

    letterSpacing: 1,
  },

  fastProgressTrack: {
    height: 10,

    borderRadius: 999,

    backgroundColor: "#D1FAE5",

    overflow: "hidden",

    marginTop: 14,
  },

  fastProgressFill: {
    height: "100%",

    borderRadius: 999,

    backgroundColor: "#16A34A",
  },

  elapsedText: {
    marginTop: 7,

    fontSize: 10,

    fontWeight: "800",

    color: "#6B7280",
  },

  activeTimes: {
    flexDirection: "row",

    gap: 10,

    marginTop: 14,
  },

  activeTimeBox: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    borderRadius: 13,

    padding: 11,
  },

  activeTimeLabel: {
    fontSize: 9,

    fontWeight: "800",

    color: "#6B7280",
  },

  activeTimeValue: {
    marginTop: 3,

    fontSize: 14,

    fontWeight: "900",

    color: "#166534",
  },

  endFastButton: {
    minHeight: 50,

    borderRadius: 14,

    backgroundColor: "#166534",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 15,
  },

  endFastButtonText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "900",
  },

  historyCard: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#E5E7EB",

    borderRadius: 18,

    padding: 16,

    marginTop: 12,
  },

  historyTitle: {
    fontSize: 15,

    fontWeight: "900",

    color: "#1F2937",

    marginBottom: 9,
  },

  historyEmpty: {
    fontSize: 11,

    color: "#6B7280",
  },

  historyRow: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    paddingVertical: 9,

    borderTopWidth: 1,

    borderTopColor: "#F3F4F6",
  },

  historyPlan: {
    fontSize: 13,

    fontWeight: "900",

    color: "#166534",
  },

  historyDate: {
    marginTop: 2,

    fontSize: 10,

    color: "#6B7280",
  },

  historyDuration: {
    fontSize: 12,

    fontWeight: "900",

    color: "#374151",
  },

  noteCard: {
    backgroundColor: "#EFF6FF",

    borderWidth: 1,

    borderColor: "#BFDBFE",

    borderRadius: 17,

    padding: 15,

    marginBottom: 12,
  },

  noteTitle: {
    fontSize: 13,

    fontWeight: "900",

    color: "#1E40AF",

    marginBottom: 5,
  },

  noteText: {
    fontSize: 11,

    lineHeight: 18,

    color: "#374151",
  },

  safetyCard: {
    backgroundColor: "#FFFBEB",

    borderWidth: 1,

    borderColor: "#FDE68A",

    borderRadius: 17,

    padding: 15,
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

  nextNote: {
    marginTop: 14,

    textAlign: "center",

    fontSize: 10,

    fontWeight: "800",

    color: "#9CA3AF",
  },

  todayPlanButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 18,
  },

  todayPlanButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
