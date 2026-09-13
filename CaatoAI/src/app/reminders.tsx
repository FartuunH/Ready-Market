import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

type ReminderSettings = {
  morningEnabled: boolean;
  morningTime: string;

  breakfastEnabled: boolean;
  breakfastTime: string;

  lunchEnabled: boolean;
  lunchTime: string;

  dinnerEnabled: boolean;
  dinnerTime: string;

  waterEnabled: boolean;
  waterTime: string;

  stepsEnabled: boolean;
  stepsTime: string;

  workoutEnabled: boolean;
  workoutTime: string;

  weighInEnabled: boolean;
  weighInTime: string;
  weighInDay: number;
};

const STORAGE_KEY = "caatoai-reminder-settings";
const IDS_KEY = "caatoai-reminder-notification-ids";
const PLAN_KEY = "caatoai-reminder-plan-signature";

const getDefaultSettings = (
  eatingStyle: string,
  workout: string,
  isBreastfeeding: boolean,
): ReminderSettings => {
  const safeEatingStyle =
    isBreastfeeding && (eatingStyle === "fasting" || eatingStyle === "omad")
      ? "regular"
      : eatingStyle;

  return {
    morningEnabled: true,
    morningTime: "08:00",

    breakfastEnabled: safeEatingStyle === "regular",
    breakfastTime: "08:30",

    lunchEnabled:
      safeEatingStyle === "regular" || safeEatingStyle === "fasting",
    lunchTime: "13:00",

    dinnerEnabled:
      safeEatingStyle === "regular" ||
      safeEatingStyle === "fasting" ||
      safeEatingStyle === "omad",
    dinnerTime: "18:30",

    waterEnabled: true,
    waterTime: "15:00",

    stepsEnabled: true,
    stepsTime: "18:00",

    workoutEnabled:
      workout === "home" || workout === "gym" || workout === "mixed",

    workoutTime: "17:00",

    weighInEnabled: true,
    weighInTime: "09:00",
    weighInDay: 2,
  };
};
const days = [
  { label: "Axad", value: 1 },
  { label: "Isniin", value: 2 },
  { label: "Talaado", value: 3 },
  { label: "Arbaco", value: 4 },
  { label: "Khamiis", value: 5 },
  { label: "Jimco", value: 6 },
  { label: "Sabti", value: 7 },
];

export default function RemindersScreen() {
  const params = useLocalSearchParams();

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

  const workout =
    typeof params.workout === "string" ? params.workout : "walking";

  const breastfeeding =
    typeof params.breastfeeding === "string"
      ? params.breastfeeding
      : "not-breastfeeding";

  const isBreastfeeding =
    breastfeeding === "partial" || breastfeeding === "exclusive";

  const planDefaults = getDefaultSettings(
    eatingStyle,
    workout,
    isBreastfeeding,
  );

  const [settings, setSettings] = useState<ReminderSettings>(planDefaults);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const savedPlanSignature = await AsyncStorage.getItem(PLAN_KEY);

      const currentPlanSignature = `${eatingStyle}|${workout}|${breastfeeding}`;

      if (saved && savedPlanSignature === currentPlanSignature) {
        const parsed = JSON.parse(saved);

        setSettings({
          ...planDefaults,
          ...parsed,
        });
      } else {
        setSettings(planDefaults);

        await AsyncStorage.setItem(PLAN_KEY, currentPlanSignature);
      }
    } catch (error) {
      console.log("Reminder settings load error:", error);
      setSettings(planDefaults);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = <K extends keyof ReminderSettings>(
    key: K,
    value: ReminderSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const parseTime = (time: string) => {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time.trim());

    if (!match) {
      return null;
    }

    return {
      hour: Number(match[1]),
      minute: Number(match[2]),
    };
  };

  const cancelCaatoReminders = async () => {
    try {
      const savedIds = await AsyncStorage.getItem(IDS_KEY);

      if (!savedIds) {
        return;
      }

      const ids: string[] = JSON.parse(savedIds);

      for (const id of ids) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }

      await AsyncStorage.removeItem(IDS_KEY);
    } catch (error) {
      console.log("Cancel reminder error:", error);
    }
  };

  const scheduleDaily = async (title: string, body: string, time: string) => {
    const parsed = parseTime(time);

    if (!parsed) {
      throw new Error(`Waqtiga "${time}" sax ma aha. Isticmaal sida 08:30.`);
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });
  };

  const scheduleWeekly = async (
    title: string,
    body: string,
    time: string,
    weekday: number,
  ) => {
    const parsed = parseTime(time);

    if (!parsed) {
      throw new Error(`Waqtiga "${time}" sax ma aha. Isticmaal sida 09:00.`);
    }

    return Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },

      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });
  };

  const saveAndSchedule = async () => {
    setSaving(true);

    try {
      const permission = await Notifications.requestPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Notifications lama oggola",
          "Fadlan oggolow notifications-ka CaatoAI si xasuusintu kuu soo gaarto.",
        );
        return;
      }

      await cancelCaatoReminders();

      const ids: string[] = [];

      if (settings.morningEnabled) {
        ids.push(
          await scheduleDaily(
            "Subax wanaagsan 💜",
            "Maanta waa maalin cusub. Aan si tartiib ah uga shaqayno hadafyadaada.",
            settings.morningTime,
          ),
        );
      }

      if (settings.breakfastEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 🍳",
            "Waa waqtigii quraacda. Xasuuso inaad ku darto protein iyo cunto ku filan.",
            settings.breakfastTime,
          ),
        );
      }

      if (settings.lunchEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 🥗",
            "Qadadu way dhowdahay. Dooro cunto ku taageerta qorshahaaga adigoon is gaajaysiin.",
            settings.lunchTime,
          ),
        );
      }

      if (settings.dinnerEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 🍽️",
            "Waa waqtigii cashada. Cunto dheellitiran cun oo si deggan u raaxayso.",
            settings.dinnerTime,
          ),
        );
      }

      if (settings.waterEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 💧",
            "Sidee biyahaagu maanta yihiin? Haddii aad ka dambayso, koob biyo ah hadda cab.",
            settings.waterTime,
          ),
        );
      }

      if (settings.stepsEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 🚶",
            "Haddii aad awooddo, socod yar ayaa kaa caawin kara inaad ku dhowaato hadafka tallaabooyinka maanta.",
            settings.stepsTime,
          ),
        );
      }

      if (settings.workoutEnabled) {
        ids.push(
          await scheduleDaily(
            "CaatoAI 💪",
            "Jimicsiga maanta ma sameysay? Xitaa dhaqdhaqaaq gaaban waa horumar.",
            settings.workoutTime,
          ),
        );
      }

      if (settings.weighInEnabled) {
        ids.push(
          await scheduleWeekly(
            "CaatoAI ⚖️",
            "Waa waqtigii miisaanka toddobaadlaha ahaa. Hal cabbir kaliya ma qeexayo horumarkaaga.",
            settings.weighInTime,
            settings.weighInDay,
          ),
        );
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

      await AsyncStorage.setItem(IDS_KEY, JSON.stringify(ids));

      Alert.alert(
        "Xasuusinta waa la kaydiyay 💜",
        `${ids.length} CaatoAI reminder ayaa la qorsheeyay.`,
      );
    } catch (error) {
      console.log("Reminder scheduling error:", error);

      Alert.alert(
        "Waxbaa khaldamay",
        error instanceof Error ? error.message : "Xasuusinta lama kaydin.",
      );
    } finally {
      setSaving(false);
    }
  };

  const turnEverythingOff = async () => {
    await cancelCaatoReminders();

    const updated: ReminderSettings = {
      ...settings,
      morningEnabled: false,
      breakfastEnabled: false,
      lunchEnabled: false,
      dinnerEnabled: false,
      waterEnabled: false,
      stepsEnabled: false,
      workoutEnabled: false,
      weighInEnabled: false,
    };

    setSettings(updated);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    Alert.alert(
      "Xasuusinta waa la damiyay",
      "CaatoAI hadda wax reminder ah ma soo diri doono.",
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Xasuusinta waa la soo gelinayaa...
        </Text>
      </View>
    );
  }

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
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Dib u noqo</Text>
        </Pressable>

        <Text style={styles.title}>Xasuusinta CaatoAI 🔔</Text>

        <Text style={styles.subtitle}>
          Dooro waxa CaatoAI kuu xasuusinayo iyo waqtiga aad rabto.
        </Text>

        <View style={styles.coachCard}>
          <Text style={styles.coachEmoji}>💜</Text>

          <View style={styles.coachTextArea}>
            <Text style={styles.coachTitle}>CaatoAI Coach</Text>

            <Text style={styles.coachText}>
              Xasuusintu waxay ku taageeraysaa qorshahaaga. Ma isticmaali doono
              cabsi, ceebayn, ama fariimo kugu dhiirrigeliya gaajo.
            </Text>
          </View>
        </View>

        <ReminderRow
          icon="🌅"
          title="Subax wanaagsan"
          subtitle="Dhiirrigelin iyo hadafka maalinta"
          enabled={settings.morningEnabled}
          time={settings.morningTime}
          onToggle={(value) => updateSetting("morningEnabled", value)}
          onTimeChange={(value) => updateSetting("morningTime", value)}
        />

        <Text style={styles.sectionTitle}>Cuntada</Text>

        {eatingStyle === "omad" && !isBreastfeeding ? (
          <ReminderRow
            icon="🍽️"
            title="Cuntada OMAD"
            subtitle="Xasuusin waqtiga cuntadaada OMAD"
            enabled={settings.dinnerEnabled}
            time={omadMealTime}
            onToggle={(value) => updateSetting("dinnerEnabled", value)}
            onTimeChange={() => {}}
          />
        ) : eatingStyle === "fasting" && !isBreastfeeding ? (
          <>
            <ReminderRow
              icon="🕐"
              title="Bilowga waqtiga cuntada"
              subtitle="Waqtiga aad bilaabi karto cuntada"
              enabled={settings.lunchEnabled}
              time={fastingStartTime}
              onToggle={(value) => updateSetting("lunchEnabled", value)}
              onTimeChange={() => {}}
            />

            <ReminderRow
              icon="🌙"
              title="Dhammaadka waqtiga cuntada"
              subtitle="Waqtiga eating window-kaagu dhammaanayo"
              enabled={settings.dinnerEnabled}
              time={fastingEndTime}
              onToggle={(value) => updateSetting("dinnerEnabled", value)}
              onTimeChange={() => {}}
            />
          </>
        ) : (
          <>
            <ReminderRow
              icon="🍳"
              title="Quraac"
              subtitle="Xasuusin quraac"
              enabled={settings.breakfastEnabled}
              time={settings.breakfastTime}
              onToggle={(value) => updateSetting("breakfastEnabled", value)}
              onTimeChange={(value) => updateSetting("breakfastTime", value)}
            />

            <ReminderRow
              icon="🥗"
              title="Qado"
              subtitle="Xasuusin qado"
              enabled={settings.lunchEnabled}
              time={settings.lunchTime}
              onToggle={(value) => updateSetting("lunchEnabled", value)}
              onTimeChange={(value) => updateSetting("lunchTime", value)}
            />

            <ReminderRow
              icon="🍽️"
              title="Casho"
              subtitle="Xasuusin casho"
              enabled={settings.dinnerEnabled}
              time={settings.dinnerTime}
              onToggle={(value) => updateSetting("dinnerEnabled", value)}
              onTimeChange={(value) => updateSetting("dinnerTime", value)}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>Caadooyinka caafimaadka</Text>

        <ReminderRow
          icon="💧"
          title="Biyaha"
          subtitle="Xasuusin inaad biyo cabto"
          enabled={settings.waterEnabled}
          time={settings.waterTime}
          onToggle={(value) => updateSetting("waterEnabled", value)}
          onTimeChange={(value) => updateSetting("waterTime", value)}
        />

        <ReminderRow
          icon="🚶"
          title="Tallaabooyinka"
          subtitle="Socod iyo dhaqdhaqaaq"
          enabled={settings.stepsEnabled}
          time={settings.stepsTime}
          onToggle={(value) => updateSetting("stepsEnabled", value)}
          onTimeChange={(value) => updateSetting("stepsTime", value)}
        />

        <ReminderRow
          icon="💪"
          title="Jimicsiga"
          subtitle="Jimicsigaaga la qorsheeyay"
          enabled={settings.workoutEnabled}
          time={settings.workoutTime}
          onToggle={(value) => updateSetting("workoutEnabled", value)}
          onTimeChange={(value) => updateSetting("workoutTime", value)}
        />

        <View style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowIconText}>⚖️</Text>
            </View>

            <View style={styles.rowTextArea}>
              <Text style={styles.rowTitle}>Miisaanka toddobaadlaha</Text>

              <Text style={styles.rowSubtitle}>Hal mar toddobaadkii</Text>
            </View>

            <Switch
              value={settings.weighInEnabled}
              onValueChange={(value) => updateSetting("weighInEnabled", value)}
              trackColor={{
                false: "#E5E7EB",
                true: "#D8B4FE",
              }}
              thumbColor={settings.weighInEnabled ? "#7C3AED" : "#FFFFFF"}
            />
          </View>

          {settings.weighInEnabled ? (
            <>
              <Text style={styles.smallLabel}>Maalinta</Text>

              <View style={styles.daysWrap}>
                {days.map((day) => (
                  <Pressable
                    key={day.value}
                    onPress={() => updateSetting("weighInDay", day.value)}
                    style={[
                      styles.dayButton,
                      settings.weighInDay === day.value &&
                        styles.dayButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        settings.weighInDay === day.value &&
                          styles.dayButtonTextSelected,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.smallLabel}>Waqtiga</Text>

              <TextInput
                value={settings.weighInTime}
                onChangeText={(value) => updateSetting("weighInTime", value)}
                placeholder="09:00"
                placeholderTextColor="#A78BFA"
                style={styles.weeklyTimeInput}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
            </>
          ) : null}
        </View>

        <View style={styles.timeHelpCard}>
          <Text style={styles.timeHelpTitle}>⏰ Sida waqtiga loo qoro</Text>

          <Text style={styles.timeHelpText}>
            Isticmaal 24-saac format. Tusaale: 08:00 = 8:00 AM, 13:00 = 1:00 PM,
            18:30 = 6:30 PM.
          </Text>
        </View>

        <Pressable
          onPress={saveAndSchedule}
          disabled={saving}
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>
            {saving ? "Waa la kaydinayaa..." : "Kaydi xasuusinta 🔔"}
          </Text>
        </Pressable>

        <Pressable onPress={turnEverythingOff} style={styles.disableButton}>
          <Text style={styles.disableButtonText}>Dami dhammaan xasuusinta</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type ReminderRowProps = {
  icon: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  time: string;
  onToggle: (value: boolean) => void;
  onTimeChange: (value: string) => void;
};

function ReminderRow({
  icon,
  title,
  subtitle,
  enabled,
  time,
  onToggle,
  onTimeChange,
}: ReminderRowProps) {
  return (
    <View style={styles.reminderCard}>
      <View style={styles.reminderTop}>
        <View style={styles.rowIcon}>
          <Text style={styles.rowIconText}>{icon}</Text>
        </View>

        <View style={styles.rowTextArea}>
          <Text style={styles.rowTitle}>{title}</Text>

          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>

        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{
            false: "#E5E7EB",
            true: "#D8B4FE",
          }}
          thumbColor={enabled ? "#7C3AED" : "#FFFFFF"}
        />
      </View>

      {enabled ? (
        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Waqtiga</Text>

          <TextInput
            value={time}
            onChangeText={onTimeChange}
            placeholder="08:00"
            placeholderTextColor="#A78BFA"
            style={styles.timeInput}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FC",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFF7FC",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#7C3AED",
    fontWeight: "800",
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
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 6,
  },

  subtitle: {
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  coachCard: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    marginBottom: 20,
  },

  coachEmoji: {
    fontSize: 27,
    marginRight: 12,
  },

  coachTextArea: {
    flex: 1,
  },

  coachTitle: {
    color: "#6D28D9",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 4,
  },

  coachText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
  },

  sectionTitle: {
    color: "#3B0764",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 10,
  },

  reminderCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
  },

  reminderTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#FFF1F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  rowIconText: {
    fontSize: 21,
  },

  rowTextArea: {
    flex: 1,
  },

  rowTitle: {
    color: "#3B0764",
    fontSize: 15,
    fontWeight: "900",
  },

  rowSubtitle: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 2,
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3E8FF",
  },

  timeLabel: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "800",
  },

  timeInput: {
    width: 90,
    backgroundColor: "#FFF7FC",
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    color: "#3B0764",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  weeklyCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 18,
    padding: 15,
    marginTop: 4,
    marginBottom: 12,
  },

  weeklyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  smallLabel: {
    color: "#7C3AED",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 8,
  },

  daysWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 8,
  },

  dayButton: {
    backgroundColor: "#FFF7FC",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 11,
  },

  dayButtonSelected: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },

  dayButtonText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "800",
  },

  dayButtonTextSelected: {
    color: "#FFFFFF",
  },

  weeklyTimeInput: {
    width: 105,
    backgroundColor: "#FFF7FC",
    borderWidth: 1,
    borderColor: "#D8B4FE",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#3B0764",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  timeHelpCard: {
    backgroundColor: "#FFF1F7",
    borderRadius: 16,
    padding: 14,
    marginVertical: 14,
  },

  timeHelpTitle: {
    color: "#BE185D",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  timeHelpText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
  },

  saveButton: {
    backgroundColor: "#EC4899",
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    marginTop: 4,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  disableButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  disableButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "800",
  },
});
